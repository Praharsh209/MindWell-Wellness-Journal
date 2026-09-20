import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./utils/logger.js";

const app = express();
app.use(pinoHttp({ logger }));
app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
export default app;
