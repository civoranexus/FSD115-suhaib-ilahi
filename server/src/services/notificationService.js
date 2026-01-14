import Notification from "../models/Notification.js";
import calculatePagination from "../utils/pagination.js";
import logger from "../utils/logger.js";

class NotificationService {
  async createNotification(
    userId,
    type,
    title,
    description,
    relatedId = null,
    relatedType = null
  ) {
    try {
      const notification = await Notification.create({
        userId,
        type,
        title,
        description,
        relatedId,
        relatedType,
      });

      logger.info(`Notification created for user ${userId}: ${type}`);

      return notification;
    } catch (error) {
      logger.error("Create notification error:", error);
      throw error;
    }
  }

  async getUserNotifications(userId, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const { data, total } = await Notification.getByUserId(userId, {
        limit,
        offset,
      });

      return {
        notifications: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get user notifications error:", error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findById(notificationId);

      if (!notification || notification.user_id !== userId) {
        return false;
      }

      await Notification.markAsRead(notificationId);

      logger.info(`Notification marked as read: ${notificationId}`);

      return true;
    } catch (error) {
      logger.error("Mark notification as read error:", error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId) {
    try {
      await Notification.markAllAsRead(userId);

      logger.info(`All notifications marked as read for user: ${userId}`);

      return true;
    } catch (error) {
      logger.error("Mark all notifications as read error:", error);
      throw error;
    }
  }

  async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findById(notificationId);

      if (!notification || notification.user_id !== userId) {
        return false;
      }

      await Notification.deleteNotification(notificationId);

      logger.info(`Notification deleted: ${notificationId}`);

      return true;
    } catch (error) {
      logger.error("Delete notification error:", error);
      throw error;
    }
  }

  async deleteAllNotifications(userId) {
    try {
      await Notification.deleteAllByUser(userId);

      logger.info(`All notifications deleted for user: ${userId}`);

      return true;
    } catch (error) {
      logger.error("Delete all notifications error:", error);
      throw error;
    }
  }
}

export default new NotificationService();
