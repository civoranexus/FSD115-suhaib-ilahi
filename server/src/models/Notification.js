import { getDatabase } from "../config/database.js";

class Notification {
  static async create(notificationData) {
    const sql = getDatabase();

    const { userId, type, title, description, relatedId, relatedType } =
      notificationData;

    const result = await sql`
      INSERT INTO notifications (
        user_id, type, title, description, related_id, related_type, is_read
      ) VALUES (
        ${userId}, ${type}, ${title}, ${description}, ${relatedId}, ${relatedType}, false
      )
      RETURNING *
    `;

    return result[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql`
      SELECT * FROM notifications WHERE id = ${id}
    `;

    return result[0];
  }

  static async getByUserId(userId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 20, offset = 0 } = pagination;

    const result = await sql`
      SELECT * FROM notifications
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*) FROM notifications WHERE user_id = ${userId}
    `;

    return {
      data: result,
      total: parseInt(countResult[0].count),
    };
  }

  static async markAsRead(id) {
    const sql = getDatabase();

    const result = await sql`
      UPDATE notifications
      SET is_read = true, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async markAllAsRead(userId) {
    const sql = getDatabase();

    await sql`
      UPDATE notifications
      SET is_read = true, updated_at = NOW()
      WHERE user_id = ${userId} AND is_read = false
    `;

    return true;
  }

  static async deleteNotification(id) {
    const sql = getDatabase();

    const result = await sql`
      DELETE FROM notifications WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async deleteAllByUser(userId) {
    const sql = getDatabase();

    await sql`
      DELETE FROM notifications WHERE user_id = ${userId}
    `;

    return true;
  }
}

export default Notification;
