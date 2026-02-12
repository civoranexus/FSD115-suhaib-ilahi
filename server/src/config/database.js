import pg from "pg";
import logger from "../utils/logger.js";

const { Pool } = pg;

let pool;

const connectDatabase = async () => {
  try {
    logger.info(`Connecting to DB at ${process.env.DB_HOST}:${process.env.DB_PORT} as ${process.env.DB_USER}`);
    pool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5002,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 20000,
      application_name: "livestockhub_backend",
    });

    pool.on("connect", () => {
      logger.info("Database pool connection established");
    });

    pool.on("error", (err) => {
      logger.error("Database pool error:", err);
    });

    // Test connection
    const client = await pool.connect();
    await client.query("SELECT 1");
    client.release();

    logger.info("Database connection established successfully");
    return pool;
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw error;
  }
};

const getDatabase = () => {
  if (!pool) {
    throw new Error("Database not initialized. Call connectDatabase() first.");
  }
  return pool;
};

const disconnectDatabase = async () => {
  if (pool) {
    await pool.end();
    logger.info("Database connection closed");
  }
};

export { connectDatabase, getDatabase, disconnectDatabase };
