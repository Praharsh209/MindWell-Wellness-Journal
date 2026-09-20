import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getDashboard, getMoodAnalytics } from "../models/mindwell.js";
const router = Router();
router.use("/analytics", requireAuth);
router.get("/analytics/dashboard", async (req, res) => {
    if (!req.userId)
        return;
    res.json(await getDashboard(req.userId));
});
router.get("/analytics/moods", async (req, res) => {
    if (!req.userId)
        return;
    res.json(await getMoodAnalytics(req.userId));
});
export default router;
