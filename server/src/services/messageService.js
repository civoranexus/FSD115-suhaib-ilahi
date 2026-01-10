import Message from "../models/Message.js";
import User from "../models/User.js";

import {NotFoundError, ValidationError, AuthorizationError } from 
 "../utils/errorHandler.js";



import calculatePagination from
 "../utils/pagination.js";

import logger from "../utils/logger.js";

class MessageService {
  async sendMessage(senderId, recipientId, messageData) {
    try {
      const recipient = await User.findById(recipientId);

      if (!recipient) {
        throw new NotFoundError("Recipient not found");
      }

      const newMessage = await Message.create({
        senderId,
        recipientId,
        message: messageData.message,
        attachmentUrls: messageData.attachmentUrls || [],
      });

      logger.info(`Message sent from ${senderId} to ${recipientId}`);

      return {
        id: newMessage.id,
        message: newMessage.message,
        status: newMessage.status,
      };
    } catch (error) {
      logger.error("Send message error:", error);
      throw error;
    }
  }

  async getConversation(userId, otherUserId, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const messages = await Message.getConversation(userId, otherUserId, {
        limit,
        offset,
      });

      return {
        messages,
        total: messages.length,
      };
    } catch (error) {
      logger.error("Get conversation error:", error);
      throw error;
    }
  }

  async getUserConversations(userId, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const conversations = await Message.getUserConversations(userId, {
        limit,
        offset,
      });

      return {
        conversations,
        total: conversations.length,
      };
    } catch (error) {
      logger.error("Get user conversations error:", error);
      throw error;
    }
  }

  async markMessageAsRead(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new NotFoundError("Message not found");
      }

      if (message.recipient_id !== userId) {
        throw new AuthorizationError("Only recipient can mark message as read");
      }

      const updatedMessage = await Message.markAsRead(messageId);

      return {
        id: updatedMessage.id,
        status: updatedMessage.status,
      };
    } catch (error) {
      logger.error("Mark message as read error:", error);
      throw error;
    }
  }

  async deleteMessage(messageId, userId) {
    try {
      const message = await Message.findById(messageId);

      if (!message) {
        throw new NotFoundError("Message not found");
      }

      if (message.sender_id !== userId) {
        throw new AuthorizationError("Only sender can delete message");
      }

      await Message.deleteMessage(messageId);

      logger.info(`Message deleted: ${messageId}`);

      return true;
    } catch (error) {
      logger.error("Delete message error:", error);
      throw error;
    }
  }
}

export default new MessageService();
