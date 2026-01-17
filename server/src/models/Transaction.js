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

    const result = await sql`
      INSERT INTO transactions (
        bid_id, buyer_id, seller_id, listing_id, amount, payment_method,
        delivery_address, additional_notes, status
      ) VALUES (
        ${bidId}, ${buyerId}, ${sellerId}, ${listingId}, ${amount},
        ${paymentMethod}, ${JSON.stringify(deliveryAddress)},
        ${additionalNotes}, 'pending'
      )
      RETURNING *
    `;

    return result[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql`
      SELECT t.*, b.*, u.first_name, u.last_name, u.email, l.title as listing_title
      FROM transactions t
      LEFT JOIN bids b ON t.bid_id = b.id
      LEFT JOIN users u ON t.buyer_id = u.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.id = ${id}
    `;

    return result[0];
  }

  static async update(id, updateData) {
    const sql = getDatabase();

    const { status, notes } = updateData;

    const result = await sql`
      UPDATE transactions
      SET status = COALESCE(${status}, status),
          notes = COALESCE(${notes}, notes),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async getByBuyerId(buyerId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql`
      SELECT t.*, l.title as listing_title
      FROM transactions t
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.buyer_id = ${buyerId}
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) FROM transactions WHERE buyer_id = ${buyerId}
    `;

    return {
      data: result,
      total: parseInt(countResult[0].count),
    };
  }

  static async getBySellerId(sellerId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql`
      SELECT t.*, u.first_name, u.last_name, l.title as listing_title
      FROM transactions t
      LEFT JOIN users u ON t.buyer_id = u.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.seller_id = ${sellerId}
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) FROM transactions WHERE seller_id = ${sellerId}
    `;

    return {
      data: result,
      total: parseInt(countResult[0].count),
    };
  }

  static async list(pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql`
      SELECT t.*, u.first_name, u.last_name, l.title as listing_title
      FROM transactions t
      LEFT JOIN users u ON t.buyer_id = u.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`SELECT COUNT(*) FROM transactions`;

    return {
      data: result,
      total: parseInt(countResult[0].count),
    };
  }

  static async delete(id) {
    const sql = getDatabase();

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }
}

export default Transaction;
