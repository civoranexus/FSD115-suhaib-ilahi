import pkg,pg from "pg";
import logger from "../utils/logger.js";

const {Pool} = pkg;

const pool = new Pool({
host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
         max: parseInt(process.env.DB_POOL_MAX) || 10,
      idle_timeout: 30,
      idle_in_transaction_session_timeout: 30000,
      connection: {
        application_name: "livestockhub_backend",
});
 
pool.on("connect" () => {
  console.log("Database connected successfully");
})

const connectDatabase = async () => {
  try {
    sql = pg({
      
   
      },
    });

    // Test connection
    await sql`SELECT 1`;
    logger.info("Database connection established successfully");
    return sql;
  } catch (error) {
    logger.error("Database connection failed:", error);
    throw error;
  }
};

const getDatabase = () => {
  if (!sql) {
    throw new Error("Database not initialized. Call connectDatabase() first.");
  }
  return sql;
};

const disconnectDatabase = async () => {
  if (sql) {
    await sql.end();
    logger.info("Database connection closed");
  }
};

export {
  connectDatabase,
  getDatabase,
  disconnectDatabase,
};
