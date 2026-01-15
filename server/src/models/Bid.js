import { getDatabase } from "../config/database.js";

class Bid {
  static async create(bidData) {
    const sql = getDatabase();

    const { listingId, buyerId, bidAmount, bidType, expiryDate } = bidData;

    const result = await sql`
      INSERT INTO bids (
        listing_id, buyer_id, bid_amount, bid_type, expiry_date, status
      ) VALUES (
        ${listingId}, ${buyerId}, ${bidAmount}, ${bidType}, ${expiryDate}, 'pending'
      )
      RETURNING *
    `;

    return result[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql`
      SELECT b.*, u.first_name, u.last_name, u.email, l.title as listing_title
      FROM bids b
      LEFT JOIN users u ON b.buyer_id = u.id
      LEFT JOIN livestock_listings l ON b.listing_id = l.id
      WHERE b.id = ${id}
    `;

    return result[0];
  }

  static async findByListingId(listingId) {
    const sql = getDatabase();

    const result = await sql`
      SELECT b.*, u.first_name, u.last_name, u.email
      FROM bids b
      LEFT JOIN users u ON b.buyer_id = u.id
      WHERE b.listing_id = ${listingId}
      ORDER BY b.bid_amount DESC, b.created_at DESC
    `;

    return result;
  }

  static async update(id, updateData) {
    const sql = getDatabase();

    const { bidAmount, status } = updateData;

    const result = await sql`
      UPDATE bids
      SET bid_amount = COALESCE(${bidAmount}, bid_amount),
          status = COALESCE(${status}, status),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async updateStatus(id, status) {
    const sql = getDatabase();

    const result = await sql`
      UPDATE bids
      SET status = ${status}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async getByBuyerId(buyerId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql`
      SELECT b.*, l.title as listing_title
      FROM bids b
      LEFT JOIN livestock_listings l ON b.listing_id = l.id
      WHERE b.buyer_id = ${buyerId}
      ORDER BY b.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) FROM bids WHERE buyer_id = ${buyerId}
    `;

    return {
      data: result,
      total: parseInt(countResult[0].count),
    };
  }

  static async getHighestBid(listingId) {
    const sql = getDatabase();

    const result = await sql`
      SELECT * FROM bids
      WHERE listing_id = ${listingId} AND status != 'rejected'
      ORDER BY bid_amount DESC
      LIMIT 1
    `;

    return result[0];
  }

  static async delete(id) {
    const sql = getDatabase();

    const result = await sql`
      DELETE FROM bids WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }
}

export default Bid;
