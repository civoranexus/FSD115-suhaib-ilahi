import { getDatabase } from "../config/database.js";

class Transaction {
  static async create(transactionData) {
    const sql = getDatabase();

    const {
      bidId,
      buyerId,
      sellerId,
      listingId,
      amount,
      paymentMethod,
      deliveryAddress,
      additionalNotes,
    } = transactionData;

    const result = await sql.query(
      `INSERT INTO transactions (
        bid_id, buyer_id, seller_id, listing_id, amount, payment_method,
        delivery_address, additional_notes, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
      RETURNING *`,
      [
        bidId,
        buyerId,
        sellerId,
        listingId,
        amount,
        paymentMethod,
        JSON.stringify(deliveryAddress),
        additionalNotes,
      ],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `SELECT t.*, b.*, u.first_name, u.last_name, u.email, l.title as listing_title
      FROM transactions t
      LEFT JOIN bids b ON t.bid_id = b.id
      LEFT JOIN users u ON t.buyer_id = u.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.id = $1`,
      [id],
    );

    return result.rows[0];
  }

  static async update(id, updateData) {
    const sql = getDatabase();

    const { status, notes } = updateData;

    const result = await sql.query(
      `UPDATE transactions
      SET status = COALESCE($2, status),
          notes = COALESCE($3, notes),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id, status, notes],
    );

    return result.rows[0];
  }

  static async getByBuyerId(buyerId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql.query(
      `SELECT t.*, l.title as listing_title
      FROM transactions t
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.buyer_id = $1
      ORDER BY t.created_at DESC
      LIMIT $2 OFFSET $3`,
      [buyerId, limit, offset],
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as count FROM transactions WHERE buyer_id = $1`,
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
      `SELECT t.*, u.first_name, u.last_name, l.title as listing_title
      FROM transactions t
      LEFT JOIN users u ON t.buyer_id = u.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.seller_id = $1
      ORDER BY t.created_at DESC
      LIMIT $2 OFFSET $3`,
      [sellerId, limit, offset],
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as count FROM transactions WHERE seller_id = $1`,
      [sellerId],
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  static async list(pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql.query(
      `SELECT t.*, u.first_name, u.last_name, l.title as listing_title
      FROM transactions t
      LEFT JOIN users u ON t.buyer_id = u.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      ORDER BY t.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as count FROM transactions`,
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  static async delete(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `DELETE FROM transactions WHERE id = $1
      RETURNING *`,
      [id],
    );

    return result.rows[0];
  }
}

export default Transaction;
