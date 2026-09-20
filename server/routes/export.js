import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { exportUserData } from "../models/mindwell.js";
const router = Router();
router.get("/export", requireAuth, async (req, res) => {
    if (!req.userId)
        return;
    const data = await exportUserData(req.userId);
    if (!data) {
        res.status(404).json({ error: "User not found." });
        return;
    }
    res.setHeader("Content-Disposition", 'attachment; filename="mindwell-export.json"');
    res.json(data);
});
export default router;
