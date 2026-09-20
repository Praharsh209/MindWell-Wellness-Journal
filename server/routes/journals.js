import { Router } from "express";
import { CreateJournalBody, ListJournalsQueryParams, UpdateJournalBody, } from "../utils/api-zod/index.js";
import { requireAuth } from "../middleware/auth.js";
import { createJournal, deleteJournal, getJournal, listJournals, updateJournal, } from "../models/mindwell.js";
const router = Router();
router.use("/journals", requireAuth);
router.get("/journals", async (req, res) => {
    const parsed = ListJournalsQueryParams.safeParse(req.query);
    if (!parsed.success || !req.userId) {
        res.status(400).json({ error: "Invalid journal filters." });
        return;
    }
    const entries = await listJournals(req.userId, parsed.data.search, parsed.data.tag);
    const page = parsed.data.page;
    const pageSize = parsed.data.pageSize;
    const start = (page - 1) * pageSize;
    res.json({
        items: entries.slice(start, start + pageSize),
        page,
        pageSize,
        total: entries.length,
        totalPages: Math.max(1, Math.ceil(entries.length / pageSize)),
    });
});
router.post("/journals", async (req, res) => {
    const parsed = CreateJournalBody.safeParse(req.body);
    if (!parsed.success || !req.userId) {
        res.status(400).json({ error: "Journal content and prompt are required." });
        return;
    }
    const entry = await createJournal(req.userId, parsed.data.content, parsed.data.prompt, parsed.data.tags);
    res.status(201).json(entry);
});
router.get("/journals/:id", async (req, res) => {
    if (!req.userId)
        return;
    const entry = await getJournal(req.userId, String(req.params.id));
    if (!entry) {
        res.status(404).json({ error: "Journal entry not found." });
        return;
    }
    res.json(entry);
});
router.patch("/journals/:id", async (req, res) => {
    const parsed = UpdateJournalBody.safeParse(req.body);
    if (!parsed.success || !req.userId) {
        res.status(400).json({ error: "Invalid journal update." });
        return;
    }
    const entry = await updateJournal(req.userId, String(req.params.id), parsed.data);
    if (!entry) {
        res.status(404).json({ error: "Journal entry not found." });
        return;
    }
    res.json(entry);
});
router.delete("/journals/:id", async (req, res) => {
    if (!req.userId)
        return;
    const deleted = await deleteJournal(req.userId, String(req.params.id));
    if (!deleted) {
        res.status(404).json({ error: "Journal entry not found." });
        return;
    }
    res.json({ message: "Journal entry deleted." });
});
export default router;
