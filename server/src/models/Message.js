import { getDatabase } from "../config/database.js";

class Message {
  static async create(messageData) {
    const sql = getDatabase();

    const { senderId, recipientId, message, attachmentUrls } = messageData;

    const result = await sql.query(
      `INSERT INTO messages (
        sender_id, recipient_id, message, attachment_urls, status
      ) VALUES ($1, $2, $3, $4, 'sent')
      RETURNING *`,
      [senderId, recipientId, message, JSON.stringify(attachmentUrls)],
    );

    return result.rows[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `SELECT m.*, us.first_name as sender_name, ur.first_name as recipient_name
      FROM messages m
      LEFT JOIN users us ON m.sender_id = us.id
      LEFT JOIN users ur ON m.recipient_id = ur.id
      WHERE m.id = $1`,
      [id],
    );

    return result.rows[0];
  }

  static async getConversation(userId, otherUserId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 20, offset = 0 } = pagination;

    const result = await sql.query(
      `SELECT m.* FROM messages m
      WHERE (m.sender_id = $1 AND m.recipient_id = $2)
        OR (m.sender_id = $2 AND m.recipient_id = $1)
      ORDER BY m.created_at DESC
      LIMIT $3 OFFSET $4`,
      [userId, otherUserId, limit, offset],
    );

    return result.rows;
  }

  static async getUserConversations(userId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql.query(
      `SELECT DISTINCT
        CASE WHEN m.sender_id = $1 THEN m.recipient_id ELSE m.sender_id END as conversation_with,
        u.first_name, u.last_name, u.email,
        (SELECT message FROM messages WHERE
          (sender_id = $1 AND recipient_id = u.id)
          OR (sender_id = u.id AND recipient_id = $1)
          ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE
          (sender_id = $1 AND recipient_id = u.id)
          OR (sender_id = u.id AND recipient_id = $1)
          ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM messages m
      LEFT JOIN users u ON CASE WHEN m.sender_id = $1 THEN m.recipient_id = u.id ELSE m.sender_id = u.id END
      WHERE m.sender_id = $1 OR m.recipient_id = $1
      ORDER BY last_message_time DESC
      LIMIT $2 OFFSET $3`,
      [userId, limit, offset],
    );

    return result.rows;
  }

  static async markAsRead(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `UPDATE messages
      SET status = 'read', updated_at = NOW()
      WHERE id = $1
      RETURNING *`,
      [id],
    );

    return result.rows[0];
  }

  static async deleteMessage(id) {
    const sql = getDatabase();

    const result = await sql.query(
      `DELETE FROM messages WHERE id = $1
      RETURNING *`,
      [id],
    );

    return result.rows[0];
  }
}

export default Message;
