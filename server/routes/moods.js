import { Router } from "express";
import { ListMoodsQueryParams, UpsertTodayMoodBody } from "../utils/api-zod/index.js";
import { requireAuth } from "../middleware/auth.js";
import { listMoods, upsertTodayMood } from "../models/mindwell.js";
const router = Router();
router.use("/moods", requireAuth);
router.get("/moods", async (req, res) => {
    const parsed = ListMoodsQueryParams.safeParse(req.query);
    if (!parsed.success || !req.userId) {
        res.status(400).json({ error: "Invalid mood range." });
        return;
    }
    res.json(await listMoods(req.userId, parsed.data.range));
});
router.put("/moods", async (req, res) => {
    const parsed = UpsertTodayMoodBody.safeParse(req.body);
    if (!parsed.success || !req.userId) {
        res.status(400).json({ error: "Please choose a mood, energy level, and emotion." });
        return;
    }
    res.json(await upsertTodayMood(req.userId, parsed.data));
});
export default router;
