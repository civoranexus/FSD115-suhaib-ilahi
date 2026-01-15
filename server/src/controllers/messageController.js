import messageService from "../services/messageService.js";
import { sendSuccess, sendPaginatedResponse } from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

const {sendMessage : _sendMessage,
  getConversation : _getConversation,
  getUserConversations : _getUserConversations,
  markMessageAsRead : _markMessageAsRead,
  deleteMessage : _deleteMessage,} = messageService;
const { CREATED, OK } = HTTP_STATUS_CODES;
const {
  MESSAGE_SENT,
  MESSAGES_RETRIEVED,
  AUTH_SUCCESS,
} = MESSAGES;

class MessageController {
  async sendMessage(req, res, next) {
    try {
      const { recipientId } = req.params;
      const result = await _sendMessage(req.user.userId, recipientId, req.body);
      sendSuccess(res, result, MESSAGE_SENT, CREATED);
    } catch (error) {
      next(error);
    }
  }

  async getConversation(req, res, next) {
    try {
      const { otherUserId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const result = await _getConversation(
        req.user.userId,
        otherUserId,
        page,
        limit
      );

      sendPaginatedResponse(
        res,
        result.messages,
        result.total,
        page,
        limit,
        MESSAGES_RETRIEVED
      );
    } catch (error) {
      next(error);
    }
  }

  async getUserConversations(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await _getUserConversations(req.user.userId, page, limit);

      sendPaginatedResponse(
        res,
        result.conversations,
        result.total,
        page,
        limit,
        MESSAGES_RETRIEVED
      );
    } catch (error) {
      next(error);
    }
  }

  async markMessageAsRead(req, res, next) {
    try {
      const { messageId } = req.params;
      const result = await _markMessageAsRead(messageId, req.user.userId);
      sendSuccess(res, result, AUTH_SUCCESS, OK);
    } catch (error) {
      next(error);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      await _deleteMessage(messageId, req.user.userId);
      sendSuccess(res, null, "Message deleted successfully", OK);
    } catch (error) {
      next(error);
    }
  }
}

export default new MessageController();
