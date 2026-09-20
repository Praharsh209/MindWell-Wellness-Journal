import 'dotenv/config';
import app from "./app.js";
import { logger } from "./utils/logger.js";
import { connectMindWellStore } from "./models/mindwell.js";

const port = Number(process.env.PORT || 5000);
if (!Number.isFinite(port) || port <= 0) throw new Error(`Invalid PORT value: "${process.env.PORT}"`);

await connectMindWellStore();
app.listen(port, (error) => {
  if (error) {
    logger.error({ err: error }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening");
});
