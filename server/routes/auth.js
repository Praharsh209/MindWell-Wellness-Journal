import { Router } from "express";
import { LoginBody, RegisterBody } from "../utils/api-zod/index.js";
import { findUserByEmail, findUserById, issueToken, registerUser, safeUser, verifyPassword, } from "../models/mindwell.js";
import { requireAuth } from "../middleware/auth.js";
const router = Router();
router.post("/auth/register", async (req, res) => {
    const parsed = RegisterBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Please provide a name, valid email, and password of at least 8 characters." });
        return;
    }
    try {
        const user = await registerUser(parsed.data.name, parsed.data.email, parsed.data.password);
        res.status(201).json({ user: safeUser(user), token: issueToken(user.id) });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unable to register.";
        res.status(409).json({ error: message });
    }
});
router.post("/auth/login", async (req, res) => {
    const parsed = LoginBody.safeParse(req.body);
    if (!parsed.success) {
        res.status(400).json({ error: "Please provide a valid email and password." });
        return;
    }
    const user = await findUserByEmail(parsed.data.email);
    if (!user || !(await verifyPassword(user, parsed.data.password))) {
        res.status(401).json({ error: "Email or password is incorrect." });
        return;
    }
    res.json({ user: safeUser(user), token: issueToken(user.id) });
});
router.post("/auth/logout", (_req, res) => {
    res.json({ message: "You have been logged out." });
});
router.get("/auth/me", requireAuth, async (req, res) => {
    if (!req.userId)
        return;
    const user = await findUserById(req.userId);
    if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
    }
    res.json(safeUser(user));
});
export default router;
