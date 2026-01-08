import { pool } from "../../db/mysql.js";
import { v4 as uuid } from "uuid";

export const createProduct = async (data) => {
  const id = uuid();

  await pool.execute(
    `INSERT INTO products
    (id, seller_id, title, description, species, breed, age_months, gender,
     weight_kg, price, sale_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.sellerId,
      data.title,
      data.description,
      data.species,
      data.breed,
      data.ageMonths,
      data.gender,
      data.weightKg,
      data.price,
      data.saleType
    ]
  );

  return id;
};

export const getProductById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT * FROM products WHERE id = ? AND status != 'DISABLED'`,
    [id]
  );
  return rows[0];
};

export const getAllProducts = async (filters) => {
  let query = `SELECT * FROM products WHERE status = 'ACTIVE'`;
  const values = [];

  if (filters.species) {
    query += ` AND species = ?`;
    values.push(filters.species);
  }

  if (filters.minPrice) {
    query += ` AND price >= ?`;
    values.push(filters.minPrice);
  }

  if (filters.maxPrice) {
    query += ` AND price <= ?`;
    values.push(filters.maxPrice);
  }

  query += ` ORDER BY created_at DESC`;

  const [rows] = await pool.execute(query, values);
  return rows;
};

export const getProductsBySeller = async (sellerId) => {
  const [rows] = await pool.execute(
    `SELECT * FROM products WHERE seller_id = ?`,
    [sellerId]
  );
  return rows;
};

export const updateProduct = async (id, sellerId, data) => {
  await pool.execute(
    `UPDATE products
     SET title=?, description=?, price=?, status=?
     WHERE id=? AND seller_id=?`,
    [
      data.title,
      data.description,
      data.price,
      data.status,
      id,
      sellerId
    ]
  );
};

export const softDeleteProduct = async (id, sellerId) => {
  await pool.execute(
    `UPDATE products SET status='DISABLED' WHERE id=? AND seller_id=?`,
    [id, sellerId]
  );
};

export const adminDisableProduct = async (id) => {
  await pool.execute(
    `UPDATE products SET status='DISABLED' WHERE id=?`,
    [id]
  );
};
