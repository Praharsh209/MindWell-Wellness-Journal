import { Router } from "express";
import { UpdateProfileBody } from "../utils/api-zod/index.js";
import { requireAuth } from "../middleware/auth.js";
import { safeUser, setPremium, updateUser } from "../models/mindwell.js";
const router = Router();
router.use("/users", requireAuth);
router.patch("/users/profile", async (req, res) => {
    const parsed = UpdateProfileBody.safeParse(req.body);
    if (!parsed.success || !req.userId) {
        res.status(400).json({ error: "Invalid profile update." });
        return;
    }
    const user = await updateUser(req.userId, parsed.data);
    if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
    }
    res.json(safeUser(user));
});
router.post("/users/premium", async (req, res) => {
    if (!req.userId)
        return;
    const user = await setPremium(req.userId);
    if (!user) {
        res.status(404).json({ error: "User not found." });
        return;
    }
    res.json(safeUser(user));
});
export default router;
