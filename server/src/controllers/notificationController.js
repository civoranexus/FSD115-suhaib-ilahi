import notificationService from "../services/notificationService.js";
import { sendSuccess, sendPaginatedResponse } from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

const {getUserNotifications : _getUserNotifications,
  markNotificationAsRead : _markNotificationAsRead,
  markAllNotificationsAsRead : _markAllNotificationsAsRead,
  deleteNotification : _deleteNotification,
  deleteAllNotifications :_deleteAllNotifications,} = notificationService;
const { OK } = HTTP_STATUS_CODES;
const {
  NOTIFICATION_RETRIEVED,
  NOTIFICATION_MARKED_READ,
  NOTIFICATION_DELETED,
} = MESSAGES;

class NotificationController {
  async getUserNotifications(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await _getUserNotifications(req.user.userId, page, limit);

      sendPaginatedResponse(
        res,
        result.notifications,
        result.pagination.total,
        page,
        limit,
        NOTIFICATION_RETRIEVED
      );
    } catch (error) {
      next(error);
    }
  }

  async markNotificationAsRead(req, res, next) {
    try {
      const { notificationId } = req.params;
      await _markNotificationAsRead(notificationId, req.user.userId);
      sendSuccess(res, null, NOTIFICATION_MARKED_READ, OK);
    } catch (error) {
      next(error);
    }
  }

  async markAllNotificationsAsRead(req, res, next) {
    try {
      await _markAllNotificationsAsRead(req.user.userId);
      sendSuccess(res, null, NOTIFICATION_MARKED_READ, OK);
    } catch (error) {
      next(error);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      const { notificationId } = req.params;
      await _deleteNotification(notificationId, req.user.userId);
      sendSuccess(res, null, NOTIFICATION_DELETED, OK);
    } catch (error) {
      next(error);
    }
  }

  async deleteAllNotifications(req, res, next) {
    try {
      await _deleteAllNotifications(req.user.userId);
      sendSuccess(res, null, NOTIFICATION_DELETED, OK);
    } catch (error) {
      next(error);
    }
  }
}

export default new NotificationController();
