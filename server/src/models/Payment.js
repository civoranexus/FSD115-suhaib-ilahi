import { getDatabase } from "../config/database.js";

class Payment {
  static async create(paymentData) {
    const sql = getDatabase();

    const { transactionId, amount, paymentMethod, status, referenceNumber } =
      paymentData;

    const result = await sql.query(
      `INSERT INTO payments (
        transaction_id, amount, payment_method, status, reference_number
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [transactionId, amount, paymentMethod, status, referenceNumber],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `SELECT p.*, t.buyer_id, t.seller_id, t.listing_id
      FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      WHERE p.id = $1`,
      [id],
    );

    return result.rows[0];
  }

  static async findByTransactionId(transactionId) {
    const sql = getDatabase();

    const result = await sql.query(
      `SELECT * FROM payments WHERE transaction_id = $1
      ORDER BY created_at DESC`,
      [transactionId],
    );

    return result.rows;
  }

  static async update(id, updateData) {
    const sql = getDatabase();

    const { status, metadata } = updateData;

    const result = await sql.query(
      `UPDATE payments
      SET status = COALESCE($2, status),
          metadata = COALESCE($3, metadata),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id, status, JSON.stringify(metadata)],
    );

    return result.rows[0];
  }

  static async getByBuyerId(buyerId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql.query(
      `SELECT p.*, t.listing_id, l.title as listing_title
      FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.buyer_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3`,
      [buyerId, limit, offset],
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as count FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      WHERE t.buyer_id = $1`,
      [buyerId],
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  static async getBySellerId(sellerId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql.query(
      `SELECT p.*, t.buyer_id, l.title as listing_title
      FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.seller_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3`,
      [sellerId, limit, offset],
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as count FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      WHERE t.seller_id = $1`,
      [sellerId],
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }
}

export default Payment;
