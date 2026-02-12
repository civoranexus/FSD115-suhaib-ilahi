import { getDatabase } from "../config/database.js";

class Notification {
  static async create(notificationData) {
    const sql = getDatabase();

    const { userId, type, title, description, relatedId, relatedType } =
      notificationData;

    const result = await sql.query(
      `INSERT INTO notifications (
        user_id, type, title, description, related_id, related_type, is_read
      ) VALUES ($1, $2, $3, $4, $5, $6, false)
      RETURNING *`,
      [userId, type, title, description, relatedId, relatedType],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `SELECT * FROM notifications WHERE id = $1`,
      [id],
    );

    return result.rows[0];
  }

  static async getByUserId(userId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 20, offset = 0 } = pagination;

    const result = await sql.query(
      `SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    const countResult = await sql.query(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1`,
      [userId],
    );

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].count),
    };
  }

  static async markAsRead(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `UPDATE notifications
      SET is_read = true, updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id],
    );

    return result.rows[0];
  }

  static async markAllAsRead(userId) {
    const sql = getDatabase();

    await sql.query(
      `UPDATE notifications
      SET is_read = true, updated_at = NOW()
      WHERE user_id = $1 AND is_read = false`,
      [userId],
    );

    return true;
  }

  static async deleteNotification(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `DELETE FROM notifications WHERE id = $1
      RETURNING *`,
      [id],
    );

    return result.rows[0];
  }

  static async deleteAllByUser(userId) {
    const sql = getDatabase();

    await sql.query(`DELETE FROM notifications WHERE user_id = $1`, [userId]);

    return true;
  }
}

export default Notification;
