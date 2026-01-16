import { getDatabase } from "../config/database.js";

class Payment {
  static async create(paymentData) {
    const sql = getDatabase();

    const { transactionId, amount, paymentMethod, status, referenceNumber } =
      paymentData;

    const result = await sql`
      INSERT INTO payments (
        transaction_id, amount, payment_method, status, reference_number
      ) VALUES (
        ${transactionId}, ${amount}, ${paymentMethod}, ${status}, ${referenceNumber}
      )
      RETURNING *
    `;

    return result[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql`
      SELECT p.*, t.buyer_id, t.seller_id, t.listing_id
      FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      WHERE p.id = ${id}
    `;

    return result[0];
  }

  static async findByTransactionId(transactionId) {
    const sql = getDatabase();

    const result = await sql`
      SELECT * FROM payments WHERE transaction_id = ${transactionId}
      ORDER BY created_at DESC
    `;

    return result;
  }

  static async update(id, updateData) {
    const sql = getDatabase();

    const { status, metadata } = updateData;

    const result = await sql`
      UPDATE payments
      SET status = COALESCE(${status}, status),
          metadata = COALESCE(${JSON.stringify(metadata)}, metadata),
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
      SELECT p.*, t.listing_id, l.title as listing_title
      FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.buyer_id = ${buyerId}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      WHERE t.buyer_id = ${buyerId}
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
      SELECT p.*, t.buyer_id, l.title as listing_title
      FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      LEFT JOIN livestock_listings l ON t.listing_id = l.id
      WHERE t.seller_id = ${sellerId}
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) FROM payments p
      LEFT JOIN transactions t ON p.transaction_id = t.id
      WHERE t.seller_id = ${sellerId}
    `;

    return {
      data: result,
      total: parseInt(countResult[0].count),
    };
  }
}

export default Payment;
