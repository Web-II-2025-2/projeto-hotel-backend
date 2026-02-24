import morgan, { StreamOptions } from "morgan";
import logger from "../utils/logger";

const stream: StreamOptions = {
  write: (message) => logger.info(message.trim()),
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env === "test";
};

export const logMiddleware = morgan(
    ":remote-addr - :method :url :status :res[content-length] - :response-time ms",
    { stream, skip }
);