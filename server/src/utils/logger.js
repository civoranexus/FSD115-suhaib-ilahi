import {
  createLogger,
  format as _format,
  transports as _transports,
} from "winston";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";

const logDir = process.env.LOG_DIR || "./logs";

if (!existsSync(logDir)) {
  mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: _format.combine(
    _format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    _format.errors({ stack: true }),
    _format.splat(),
    _format.json()
  ),
  defaultMeta: { service: "livestockhub-backend" },
  transports: [
    new _transports.File({
      filename: join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new _transports.File({
      filename: join(logDir, "combined.log"),
      maxsize: 5242880,
      maxFiles: 5,
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new _transports.Console({
      format: _format.combine(
        _format.colorize(),
        _format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    })
  );
}

export default logger;
