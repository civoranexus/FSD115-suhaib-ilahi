import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "../../.env");
dotenv.config({ path: envPath });

import { connectDatabase, getDatabase } from "../../src/config/database.js";
import logger from "../../src/utils/logger.js";

const initDatabase = async () => {
  try {
    // Connect to database first
    await connectDatabase();
    const pool = getDatabase();

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        role VARCHAR(20) NOT NULL DEFAULT 'buyer',
        address VARCHAR(255),
        city VARCHAR(50),
        state VARCHAR(50),
        zip_code VARCHAR(10),
        country VARCHAR(50),
        kyc_status VARCHAR(20) DEFAULT 'pending',
        id_type VARCHAR(50),
        id_number VARCHAR(50),
        document_urls TEXT[],
        date_of_birth DATE,
        kyc_rejection_reason TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create livestock_listings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS livestock_listings (
        id SERIAL PRIMARY KEY,
        seller_id INTEGER NOT NULL REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        animal_type VARCHAR(50) NOT NULL,
        breed VARCHAR(100),
        age INTEGER,
        weight NUMERIC(10,2),
        health_status VARCHAR(50),
        vaccinations JSONB,
        medical_history TEXT,
        location JSONB,
        price NUMERIC(12,2) NOT NULL,
        auction_start_price NUMERIC(12,2),
        auction_end_time TIMESTAMP,
        auction_type VARCHAR(50),
        is_premium BOOLEAN DEFAULT FALSE,
        image_urls TEXT[],
        video_url VARCHAR(500),
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create bids table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bids (
        id SERIAL PRIMARY KEY,
        listing_id INTEGER NOT NULL REFERENCES livestock_listings(id),
        buyer_id INTEGER NOT NULL REFERENCES users(id),
        bid_amount NUMERIC(12,2) NOT NULL,
        bid_type VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        expiry_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        bid_id INTEGER NOT NULL REFERENCES bids(id),
        buyer_id INTEGER NOT NULL REFERENCES users(id),
        seller_id INTEGER NOT NULL REFERENCES users(id),
        listing_id INTEGER NOT NULL REFERENCES livestock_listings(id),
        amount NUMERIC(12,2) NOT NULL,
        payment_method VARCHAR(50),
        delivery_address JSONB,
        additional_notes TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create payments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        transaction_id INTEGER NOT NULL REFERENCES transactions(id),
        amount NUMERIC(12,2) NOT NULL,
        payment_method VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        reference_number VARCHAR(100) UNIQUE,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create messages table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id),
        recipient_id INTEGER NOT NULL REFERENCES users(id),
        message TEXT NOT NULL,
        attachment_urls TEXT[],
        status VARCHAR(20) DEFAULT 'sent',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255),
        description TEXT,
        related_id INTEGER,
        related_type VARCHAR(50),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes
    await pool.query(
      `CREATE INDEX idx_listings_seller_id ON livestock_listings(seller_id)`,
    );
    await pool.query(`CREATE INDEX idx_bids_listing_id ON bids(listing_id)`);
    await pool.query(`CREATE INDEX idx_bids_buyer_id ON bids(buyer_id)`);
    await pool.query(
      `CREATE INDEX idx_transactions_buyer_id ON transactions(buyer_id)`,
    );
    await pool.query(
      `CREATE INDEX idx_transactions_seller_id ON transactions(seller_id)`,
    );
    await pool.query(
      `CREATE INDEX idx_messages_sender_id ON messages(sender_id)`,
    );
    await pool.query(
      `CREATE INDEX idx_messages_recipient_id ON messages(recipient_id)`,
    );
    await pool.query(
      `CREATE INDEX idx_notifications_user_id ON notifications(user_id)`,
    );
    await pool.query(`CREATE INDEX idx_users_email ON users(email)`);

    logger.info("Database tables created successfully");
  } catch (error) {
    logger.error("Database initialization error:", error);
    throw error;
  }
};

initDatabase().catch((error) => {
  logger.error("Failed to initialize database:", error);
  process.exit(1);
});
