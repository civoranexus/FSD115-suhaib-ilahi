import { getDatabase } from '../../src/config/database';
import { hashPassword } from '../../src/utils/helpers';
import { info, error as _error } from '../../src/utils/logger';

const seedDatabase = async () => {
  try {
    const sql = getDatabase();

    // Seed admin user
    const adminPassword = await hashPassword('Admin@123456');
    await sql`
      INSERT INTO users (first_name, last_name, email, password, phone_number, role, status)
      VALUES ('Admin', 'User', 'admin@livestockhub.com', ${adminPassword}, '+919999999999', 'admin', 'active')
      ON CONFLICT (email) DO NOTHING
    `;

    // Seed sample sellers
    for (let i = 1; i <= 5; i++) {
      const sellerPassword = await hashPassword('Seller@123456');
      await sql`
        INSERT INTO users (first_name, last_name, email, password, phone_number, role, city, kyc_status, status)
        VALUES 
          (${'Seller' + i}, 'Farm', ${'seller' + i + '@livestockhub.com'}, ${sellerPassword}, ${'+9198765432' + i}, 'seller', ${'City' + i}, 'approved', 'active')
        ON CONFLICT (email) DO NOTHING
      `;
    }

    // Seed sample buyers
    for (let i = 1; i <= 5; i++) {
      const buyerPassword = await hashPassword('Buyer@123456');
      await sql`
        INSERT INTO users (first_name, last_name, email, password, phone_number, role, city, status)
        VALUES 
          (${'Buyer' + i}, 'User', ${'buyer' + i + '@livestockhub.com'}, ${buyerPassword}, ${'+9187654321' + i}, 'buyer', ${'City' + i}, 'active')
        ON CONFLICT (email) DO NOTHING
      `;
    }

    // Seed sample listings
    await sql`
      INSERT INTO livestock_listings 
        (seller_id, title, description, animal_type, breed, age, weight, health_status, price, location, image_urls, status)
      SELECT 
        id, 
        'Premium ' || animal_type,
        'High quality ' || animal_type || ' for sale',
        animal_type,
        breed,
        age,
        weight,
        'healthy',
        RANDOM() * 50000 + 10000,
        '{"city":"Mumbai","state":"Maharashtra","address":"Farm Area"}'::jsonb,
        ARRAY['https://via.placeholder.com/400x300'],
        'active'
      FROM (
        SELECT id FROM users WHERE role = 'seller' LIMIT 5
      ) as sellers,
      (VALUES 
        ('cattle', 'Holstein', 3, 400),
        ('buffalo', 'Murrah', 2, 500),
        ('goat', 'Alpine', 1, 80),
        ('sheep', 'Merino', 2, 90),
        ('cattle', 'Jersey', 4, 350)
      ) AS animals(animal_type, breed, age, weight)
    `;

    info('Database seeded successfully');
  } catch (error) {
    _error('Database seeding error:', error);
    throw error;
  }
};

seedDatabase().catch(error => {
  _error('Failed to seed database:', error);
  process.exit(1);
});
