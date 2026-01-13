import { getDatabase } from "../config/database.js";

class Message {
  static async create(messageData) {
    const sql = getDatabase();

    const { senderId, recipientId, message, attachmentUrls } = messageData;

    const result = await sql`
      INSERT INTO messages (
        sender_id, recipient_id, message, attachment_urls, status
      ) VALUES (
        ${senderId}, ${recipientId}, ${message}, ${JSON.stringify(
      attachmentUrls
    )}, 'sent'
      )
      RETURNING *
    `;

    return result[0];
  }

  static async findById(id) {
    const sql = getDatabase();

    const result = await sql`
      SELECT m.*, us.first_name as sender_name, ur.first_name as recipient_name
      FROM messages m
      LEFT JOIN users us ON m.sender_id = us.id
      LEFT JOIN users ur ON m.recipient_id = ur.id
      WHERE m.id = ${id}
    `;

    return result[0];
  }

  static async getConversation(userId, otherUserId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 20, offset = 0 } = pagination;

    const result = await sql`
      SELECT m.* FROM messages m
      WHERE (m.sender_id = ${userId} AND m.recipient_id = ${otherUserId})
        OR (m.sender_id = ${otherUserId} AND m.recipient_id = ${userId})
      ORDER BY m.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return result;
  }

  static async getUserConversations(userId, pagination = {}) {
    const sql = getDatabase();

    const { limit = 10, offset = 0 } = pagination;

    const result = await sql`
      SELECT DISTINCT
        CASE WHEN m.sender_id = ${userId} THEN m.recipient_id ELSE m.sender_id END as conversation_with,
        u.first_name, u.last_name, u.email,
        (SELECT message FROM messages WHERE
          (sender_id = ${userId} AND recipient_id = u.id)
          OR (sender_id = u.id AND recipient_id = ${userId})
          ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE
          (sender_id = ${userId} AND recipient_id = u.id)
          OR (sender_id = u.id AND recipient_id = ${userId})
          ORDER BY created_at DESC LIMIT 1) as last_message_time
      FROM messages m
      LEFT JOIN users u ON CASE WHEN m.sender_id = ${userId} THEN m.recipient_id = u.id ELSE m.sender_id = u.id END
      WHERE m.sender_id = ${userId} OR m.recipient_id = ${userId}
      ORDER BY last_message_time DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    return result;
  }

  static async markAsRead(id) {
    const sql = getDatabase();

    const result = await sql`
      UPDATE messages
      SET status = 'read', updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }

  static async deleteMessage(id) {
    const sql = getDatabase();

    const result = await sql`
      DELETE FROM messages WHERE id = ${id}
      RETURNING *
    `;

    return result[0];
  }
}

export default Message;
