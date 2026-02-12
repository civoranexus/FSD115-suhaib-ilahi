import { getDatabase } from "../config/database.js";

class Bid {
  static async create(bidData) {
    const sql = getDatabase();

    const { listingId, buyerId, bidAmount, bidType, expiryDate } = bidData;

    const result = await sql.query(
      `INSERT INTO bids (
        listing_id, buyer_id, bid_amount, bid_type, expiry_date, status
      ) VALUES ($1, $2, $3, $4, $5, 'pending')
      RETURNING *`,
      [listingId, buyerId, bidAmount, bidType, expiryDate],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `SELECT b.*, u.first_name, u.last_name, u.email, l.title as listing_title
      FROM bids b
      LEFT JOIN users u ON b.buyer_id = u.id
      LEFT JOIN livestock_listings l ON b.listing_id = l.id
      WHERE b.id = $1`,
      [id],
    );

    return result.rows[0];
  }

  static async findByListingId(listingId) {
    const sql = getDatabase();

    const result = await sql.query(
      `SELECT b.*, u.first_name, u.last_name, u.email
      FROM bids b
      LEFT JOIN users u ON b.buyer_id = u.id
      WHERE b.listing_id = $1
      ORDER BY b.bid_amount DESC, b.created_at DESC`,
      [listingId],
    );

    return result.rows;
  }

  static async update(id, updateData) {
    const sql = getDatabase();

    const { bidAmount, status } = updateData;

    const result = await sql.query(
      `UPDATE bids
      SET bid_amount = COALESCE($2, bid_amount),
          status = COALESCE($3, status),
          updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id, bidAmount, status],
    );

    return result.rows[0];
  }

  static async updateStatus(id, status) {
    const sql = getDatabase();

    const result = await sql.query(
      `UPDATE bids
      SET status = $2, updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id, status],
    );

    return result.rows[0];
  }

  static async getByBuyerId(buyerId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql.query(
      `SELECT b.*, l.title as listing_title
      FROM bids b
      LEFT JOIN livestock_listings l ON b.listing_id = l.id
      WHERE b.buyer_id = $1
      ORDER BY b.created_at DESC
      LIMIT $2 OFFSET $3`,
      [buyerId, limit, offset],
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as count FROM bids WHERE buyer_id = $1`,
      [buyerId],
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  static async getHighestBid(listingId) {
    const sql = getDatabase();

    const result = await sql.query(
      `SELECT * FROM bids
      WHERE listing_id = $1 AND status != 'rejected'
      ORDER BY bid_amount DESC
      LIMIT 1`,
      [listingId],
    );

    return result.rows[0];
  }

  static async delete(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `DELETE FROM bids WHERE id = $1
      RETURNING *`,
      [id],
    );

    return result.rows[0];
  }
}

export default Bid;
