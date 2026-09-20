import crypto from "node:crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.js";
const isProduction = process.env.NODE_ENV === "production";
const jwtSecret = process.env.JWT_SECRET ?? "mindwell-development-jwt-secret";
if (isProduction && !process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET must be configured in production.");
}
const encryptionKey = crypto
    .createHash("sha256")
    .update(process.env.ENCRYPTION_KEY ?? "mindwell-development-encryption-key")
    .digest();
if (isProduction && !process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY must be configured in production.");
}
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    isPremium: { type: Boolean, default: false },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
}, { timestamps: { createdAt: true, updatedAt: false } });
const journalSchema = new mongoose.Schema({
    ownerId: { type: String, required: true, index: true },
    ciphertext: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
    prompt: { type: String, required: true },
    tags: { type: [String], default: [] },
}, { timestamps: true });
const moodSchema = new mongoose.Schema({
    ownerId: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    mood: { type: Number, required: true, min: 1, max: 10 },
    energy: { type: Number, required: true, min: 1, max: 10 },
    emotion: {
        type: String,
        enum: ["Happy", "Calm", "Neutral", "Sad", "Anxious", "Stressed"],
        required: true,
    },
}, { timestamps: true });
moodSchema.index({ ownerId: 1, date: 1 }, { unique: true });
const UserModel = (mongoose.models.MindWellUser ??
    mongoose.model("MindWellUser", userSchema));
const JournalModel = (mongoose.models.MindWellJournal ??
    mongoose.model("MindWellJournal", journalSchema));
const MoodModel = (mongoose.models.MindWellMood ??
    mongoose.model("MindWellMood", moodSchema));
const users = new Map();
const usersByEmail = new Map();
const journals = new Map();
const moods = new Map();
let mongoReady = false;
let mongoConnectionAttempted = false;
export async function connectMindWellStore() {
    if (mongoConnectionAttempted)
        return;
    mongoConnectionAttempted = true;
    if (!process.env.MONGO_URI) {
        logger.warn("MONGO_URI is not configured; using encrypted in-memory preview storage.");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        mongoReady = true;
        logger.info("MindWell connected to MongoDB.");
    }
    catch (error) {
        logger.error({ err: error }, "MongoDB connection failed; using encrypted in-memory storage.");
    }
}
function encryptContent(content) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey, iv);
    const ciphertext = Buffer.concat([cipher.update(content, "utf8"), cipher.final()]);
    return {
        ciphertext: ciphertext.toString("base64"),
        iv: iv.toString("base64"),
        authTag: cipher.getAuthTag().toString("base64"),
    };
}
function decryptContent(entry) {
    const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey, Buffer.from(entry.iv, "base64"));
    decipher.setAuthTag(Buffer.from(entry.authTag, "base64"));
    return Buffer.concat([
        decipher.update(Buffer.from(entry.ciphertext, "base64")),
        decipher.final(),
    ]).toString("utf8");
}
function toSafeUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        theme: user.theme,
        createdAt: user.createdAt,
    };
}
function normalizeDoc(doc) {
    const object = typeof doc.toObject === "function" ? doc.toObject() : doc;
    return object;
}
function toUser(doc) {
    return {
        id: String(doc._id ?? doc.id),
        name: String(doc.name),
        email: String(doc.email),
        passwordHash: String(doc.passwordHash),
        isPremium: Boolean(doc.isPremium),
        theme: doc.theme === "dark" ? "dark" : "light",
        createdAt: new Date(String(doc.createdAt)),
    };
}
function toEncryptedJournal(doc) {
    return {
        id: String(doc._id ?? doc.id),
        ownerId: String(doc.ownerId),
        ciphertext: String(doc.ciphertext),
        iv: String(doc.iv),
        authTag: String(doc.authTag),
        prompt: String(doc.prompt),
        tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
        createdAt: new Date(String(doc.createdAt)),
        updatedAt: new Date(String(doc.updatedAt)),
    };
}
function toMood(doc) {
    return {
        id: String(doc._id ?? doc.id),
        ownerId: String(doc.ownerId),
        date: new Date(String(doc.date)),
        mood: Number(doc.mood),
        energy: Number(doc.energy),
        emotion: doc.emotion,
    };
}
function publicJournal(entry) {
    return {
        id: entry.id,
        ownerId: entry.ownerId,
        content: decryptContent(entry),
        prompt: entry.prompt,
        tags: entry.tags,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
    };
}
export async function registerUser(name, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await findUserByEmail(normalizedEmail);
    if (existing)
        throw new Error("An account with this email already exists.");
    const userData = {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, 12),
        isPremium: false,
        theme: "light",
    };
    if (mongoReady) {
        const created = await UserModel.create(userData);
        return toUser(normalizeDoc(created));
    }
    const user = { id: crypto.randomUUID(), createdAt: new Date(), ...userData };
    users.set(user.id, user);
    usersByEmail.set(user.email, user.id);
    return user;
}
export async function findUserByEmail(email) {
    const normalizedEmail = email.trim().toLowerCase();
    if (mongoReady) {
        const found = await UserModel.findOne({ email: normalizedEmail }).lean();
        return found ? toUser(found) : null;
    }
    const id = usersByEmail.get(normalizedEmail);
    return id ? users.get(id) ?? null : null;
}
export async function findUserById(id) {
    if (mongoReady) {
        const found = await UserModel.findById(id).lean();
        return found ? toUser(found) : null;
    }
    return users.get(id) ?? null;
}
export async function verifyPassword(user, password) {
    return bcrypt.compare(password, user.passwordHash);
}
export function issueToken(userId) {
    return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "7d" });
}
export function verifyToken(token) {
    const payload = jwt.verify(token, jwtSecret);
    if (!payload || typeof payload !== "object" || typeof payload.sub !== "string") {
        throw new Error("Invalid token.");
    }
    return payload.sub;
}
export function safeUser(user) {
    return toSafeUser(user);
}
export async function updateUser(userId, input) {
    if (mongoReady) {
        const updated = await UserModel.findByIdAndUpdate(userId, input, { new: true }).lean();
        return updated ? toUser(updated) : null;
    }
    const user = users.get(userId);
    if (!user)
        return null;
    if (input.name)
        user.name = input.name.trim();
    if (input.theme)
        user.theme = input.theme;
    users.set(user.id, user);
    return user;
}
export async function setPremium(userId) {
    return updateUser(userId, { name: (await findUserById(userId))?.name ?? "" }).then(async (user) => {
        if (mongoReady) {
            const updated = await UserModel.findByIdAndUpdate(userId, { isPremium: true }, { new: true }).lean();
            return updated ? toUser(updated) : null;
        }
        if (!user)
            return null;
        user.isPremium = true;
        users.set(user.id, user);
        return user;
    });
}
export async function createJournal(ownerId, content, prompt, tags = []) {
    const encrypted = encryptContent(content);
    if (mongoReady) {
        const created = await JournalModel.create({ ownerId, prompt, tags, ...encrypted });
        return publicJournal(toEncryptedJournal(normalizeDoc(created)));
    }
    const now = new Date();
    const stored = {
        id: crypto.randomUUID(),
        ownerId,
        prompt,
        tags,
        ...encrypted,
        createdAt: now,
        updatedAt: now,
    };
    journals.set(stored.id, stored);
    return publicJournal(stored);
}
export async function listJournals(ownerId, search, tag) {
    let entries;
    if (mongoReady) {
        const found = await JournalModel.find({ ownerId }).sort({ createdAt: -1 }).lean();
        entries = found.map((doc) => toEncryptedJournal(doc));
    }
    else {
        entries = [...journals.values()]
            .filter((entry) => entry.ownerId === ownerId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    const query = search?.trim().toLowerCase();
    return entries
        .map(publicJournal)
        .filter((entry) => (!query ? true : `${entry.content} ${entry.prompt}`.toLowerCase().includes(query)))
        .filter((entry) => (!tag ? true : entry.tags.includes(tag)));
}
export async function getJournal(ownerId, id) {
    let entry;
    if (mongoReady) {
        const found = await JournalModel.findOne({ _id: id, ownerId }).lean();
        entry = found ? toEncryptedJournal(found) : undefined;
    }
    else {
        const found = journals.get(id);
        entry = found?.ownerId === ownerId ? found : undefined;
    }
    return entry ? publicJournal(entry) : null;
}
export async function updateJournal(ownerId, id, input) {
    const existing = await getEncryptedJournal(ownerId, id);
    if (!existing)
        return null;
    const encrypted = input.content === undefined ? {} : encryptContent(input.content);
    const next = {
        ...existing,
        ...encrypted,
        prompt: input.prompt ?? existing.prompt,
        tags: input.tags ?? existing.tags,
        updatedAt: new Date(),
    };
    if (mongoReady) {
        const updated = await JournalModel.findOneAndUpdate({ _id: id, ownerId }, { $set: { ...encrypted, prompt: next.prompt, tags: next.tags } }, { new: true }).lean();
        return updated ? publicJournal(toEncryptedJournal(updated)) : null;
    }
    journals.set(id, next);
    return publicJournal(next);
}
async function getEncryptedJournal(ownerId, id) {
    if (mongoReady) {
        const found = await JournalModel.findOne({ _id: id, ownerId }).lean();
        return found ? toEncryptedJournal(found) : null;
    }
    const found = journals.get(id);
    return found?.ownerId === ownerId ? found : null;
}
export async function deleteJournal(ownerId, id) {
    if (mongoReady) {
        const deleted = await JournalModel.findOneAndDelete({ _id: id, ownerId });
        return Boolean(deleted);
    }
    const found = journals.get(id);
    if (!found || found.ownerId !== ownerId)
        return false;
    journals.delete(id);
    return true;
}
function startOfDay(date = new Date()) {
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
}
export async function listMoods(ownerId, range) {
    const start = startOfDay(new Date());
    start.setDate(start.getDate() - (range === "month" ? 30 : 7));
    if (mongoReady) {
        const found = await MoodModel.find({ ownerId, date: { $gte: start } }).sort({ date: 1 }).lean();
        return found.map((doc) => toMood(doc));
    }
    return [...moods.values()]
        .filter((item) => item.ownerId === ownerId && item.date >= start)
        .sort((a, b) => a.date.getTime() - b.date.getTime());
}
export async function upsertTodayMood(ownerId, input) {
    const date = startOfDay();
    if (mongoReady) {
        const updated = await MoodModel.findOneAndUpdate({ ownerId, date }, { $set: input, $setOnInsert: { ownerId, date } }, { upsert: true, new: true }).lean();
        return toMood(updated);
    }
    const existing = [...moods.values()].find((item) => item.ownerId === ownerId && startOfDay(item.date).getTime() === date.getTime());
    const mood = { id: existing?.id ?? crypto.randomUUID(), ownerId, date, ...input };
    moods.set(mood.id, mood);
    return mood;
}
export async function getDashboard(ownerId) {
    const [journalEntries, moodEntries] = await Promise.all([
        listJournals(ownerId),
        listMoods(ownerId, "month"),
    ]);
    const today = startOfDay();
    const todayMood = moodEntries.find((item) => startOfDay(item.date).getTime() === today.getTime()) ?? null;
    const averageMood = moodEntries.length
        ? Number((moodEntries.reduce((sum, item) => sum + item.mood, 0) / moodEntries.length).toFixed(1))
        : 0;
    const dates = new Set(moodEntries.map((item) => startOfDay(item.date).getTime()));
    let streak = 0;
    const cursor = new Date(today);
    while (dates.has(cursor.getTime())) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return {
        todayMood,
        streak,
        totalEntries: journalEntries.length,
        averageMood,
        latestPrompt: "What made you smile today?",
    };
}
export async function getMoodAnalytics(ownerId) {
    const moodsForMonth = await listMoods(ownerId, "month");
    const byDate = new Map();
    const emotionCounts = new Map();
    for (const item of moodsForMonth) {
        const day = item.date.toISOString().slice(0, 10);
        byDate.set(day, [...(byDate.get(day) ?? []), item.mood]);
        emotionCounts.set(item.emotion, (emotionCounts.get(item.emotion) ?? 0) + 1);
    }
    return {
        trend: [...byDate.entries()].map(([date, values]) => ({
            date,
            average: Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)),
        })),
        emotions: [...emotionCounts.entries()].map(([emotion, count]) => ({ emotion, count })),
    };
}
export async function exportUserData(ownerId) {
    const user = await findUserById(ownerId);
    if (!user)
        return null;
    const [journalEntries, moodEntries] = await Promise.all([
        listJournals(ownerId),
        listMoods(ownerId, "month"),
    ]);
    return {
        exportedAt: new Date(),
        profile: safeUser(user),
        journals: journalEntries,
        moods: moodEntries,
    };
}
