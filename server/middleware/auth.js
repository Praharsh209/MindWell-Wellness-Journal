import { findUserById, safeUser, verifyToken } from "../models/mindwell.js";
export async function requireAuth(req, res, next) {
    const header = req.header("authorization");
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) {
        res.status(401).json({ error: "Please sign in to continue." });
        return;
    }
    try {
        const userId = verifyToken(token);
        const user = await findUserById(userId);
        if (!user) {
            res.status(401).json({ error: "Your session is no longer valid." });
            return;
        }
        req.userId = userId;
        req.user = safeUser(user);
        next();
    }
    catch {
        res.status(401).json({ error: "Your session is no longer valid." });
    }
}
