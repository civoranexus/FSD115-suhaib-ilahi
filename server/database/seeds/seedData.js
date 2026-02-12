import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "../../.env");
dotenv.config({ path: envPath });

import pg from "pg";
const { Pool } = pg;
import helpers from "../../src/utils/helpers.js";
import logger from "../../src/utils/logger.js";

const seedDatabase = async () => {
  let pool;
  try {
    // Explicitly connect to 127.0.0.1 for local seeding
    pool = new Pool({
      host: "127.0.0.1",
      port: 5432,
      database: "civora-livestock",
      user: "postgres",
      password: "admin321",
    });

    await pool.connect();
    logger.info("Connected to database for seeding.");

    // Clear existing data to avoid conflicts (optional, but safer for a "seed" script)
    // Be careful with this in production!
    logger.info("Clearing existing data...");
    await pool.query('TRUNCATE TABLE notifications, messages, payments, transactions, bids, livestock_listings, users CASCADE');

    // Seed admin user
    const adminPassword = await helpers.hashPassword("Admin@123456");
    await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, phone_number, role, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO NOTHING`,
      [
        "Admin",
        "User",
        "admin@livestockhub.com",
        adminPassword,
        "+919999999999",
        "admin",
        "active",
      ],
    );

    // Seed sample sellers
    for (let i = 1; i <= 5; i++) {
      const sellerPassword = await helpers.hashPassword("Seller@123456");
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, phone_number, role, city, kyc_status, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (email) DO NOTHING`,
        [
          `Seller${i}`,
          "Farm",
          `seller${i}@livestockhub.com`,
          sellerPassword,
          `+9198765432${i}`,
          "seller",
          `City${i}`,
          "approved",
          "active",
        ],
      );
    }

    // Seed sample buyers
    for (let i = 1; i <= 5; i++) {
      const buyerPassword = await helpers.hashPassword("Buyer@123456");
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, password, phone_number, role, city, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (email) DO NOTHING`,
        [
          `Buyer${i}`,
          "User",
          `buyer${i}@livestockhub.com`,
          buyerPassword,
          `+9187654321${i}`,
          "buyer",
          `City${i}`,
          "active",
        ],
      );
    }

    // Seed sample listings
    const animals = [
      { animal_type: "cattle", breed: "Holstein", age: 3, weight: 400 },
      { animal_type: "buffalo", breed: "Murrah", age: 2, weight: 500 },
      { animal_type: "goat", breed: "Alpine", age: 1, weight: 80 },
      { animal_type: "sheep", breed: "Merino", age: 2, weight: 90 },
      { animal_type: "cattle", breed: "Jersey", age: 4, weight: 350 },
    ];

    // Get seller IDs
    const sellersResult = await pool.query(
      `SELECT id FROM users WHERE role = 'seller' LIMIT 5`,
    );
    const sellers = sellersResult.rows;

    for (let i = 0; i < Math.min(sellers.length, animals.length); i++) {
      const animal = animals[i];
      const seller = sellers[i];
      const price = Math.random() * 50000 + 10000;

      await pool.query(
        `INSERT INTO livestock_listings 
         (seller_id, title, description, animal_type, breed, age, weight, health_status, price, location, image_urls, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          seller.id,
          `Premium ${animal.animal_type}`,
          `High quality ${animal.animal_type} for sale`,
          animal.animal_type,
          animal.breed,
          animal.age,
          animal.weight,
          "healthy",
          price,
          JSON.stringify({
            city: "Mumbai",
            state: "Maharashtra",
            address: "Farm Area",
          }),
          ["https://via.placeholder.com/400x300"],
          "active",
        ],
      );
    }

    // ... [Previous code for users and listings]

    // Get all users and listings for further seeding
    const allUsersResult = await pool.query('SELECT * FROM users');
    const allUsers = allUsersResult.rows;
    const buyers = allUsers.filter(u => u.role === 'buyer');
    const allSellers = allUsers.filter(u => u.role === 'seller');

    const listingsResult = await pool.query('SELECT * FROM livestock_listings');
    const listings = listingsResult.rows;

    logger.info(`Seeded ${listings.length} listings. Seeding bids, messages, and notifications...`);

    // Seed Bids
    for (const listing of listings) {
      // 50% chance a listing has bids
      if (Math.random() > 0.5) {
        const numBids = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numBids; i++) {
          const bidder = buyers[Math.floor(Math.random() * buyers.length)];
          const bidAmount = Number(listing.price) + (i + 1) * 100;

          await pool.query(
            `INSERT INTO bids (listing_id, buyer_id, bid_amount, bid_type, status)
             VALUES ($1, $2, $3, $4, $5)`,
            [listing.id, bidder.id, bidAmount, 'standard', 'active']
          );

          // Create notification for seller
          await pool.query(
            `INSERT INTO notifications (user_id, type, title, description, related_id, related_type)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              listing.seller_id,
              'bid',
              'New Bid Received',
              `User ${bidder.first_name} placed a bid of $${bidAmount} on ${listing.title}`,
              listing.id,
              'listing'
            ]
          );
        }
      }
    }

    // Seed Messages
    for (const buyer of buyers) {
      const seller = allSellers[Math.floor(Math.random() * allSellers.length)];

      // Buyer asks a question
      await pool.query(
        `INSERT INTO messages (sender_id, recipient_id, message, status)
         VALUES ($1, $2, $3, $4)`,
        [buyer.id, seller.id, "Is this animal still available?", "sent"]
      );

      // Seller replies
      await pool.query(
        `INSERT INTO messages (sender_id, recipient_id, message, status)
         VALUES ($1, $2, $3, $4)`,
        [seller.id, buyer.id, "Yes, it is availability for immediate viewing.", "read"]
      );

      // Create notification for buyer
      await pool.query(
        `INSERT INTO notifications (user_id, type, title, description, related_id, related_type)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          buyer.id,
          'message',
          'New Message',
          `You have a new message from ${seller.first_name}`,
          seller.id,
          'user' // related to the user who sent it, for conversation linking
        ]
      );
    }

    logger.info("Database seeded successfully with Users, Listings, Bids, Messages, and Notifications");
  } catch (error) {
    logger.error("Database seeding error:", error);
    throw error;
  }
};

seedDatabase().catch((error) => {
  logger.error("Failed to seed database:", error);
  process.exit(1);
});
