import logger from "../utils/logger.js";
import notificationService from "../services/notificationService.js";

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on("join-user", (userId) => {
      socket.join(`user-${userId}`);
      logger.info(`User ${userId} joined their room`);
    });

    socket.on("new-bid", (data) => {
      const { sellerId, listingId, bidAmount } = data;
      io.to(`user-${sellerId}`).emit("bid-notification", {
        message: `New bid of ₹${bidAmount} on your listing`,
        listingId,
        timestamp: new Date(),
      });
    });

    socket.on("message-sent", (data) => {
      const { recipientId, senderId, message } = data;
      io.to(`user-${recipientId}`).emit("new-message", {
        senderId,
        message,
        timestamp: new Date(),
      });
    });

    socket.on("transaction-update", (data) => {
      const { buyerId, status } = data;
      io.to(`user-${buyerId}`).emit("transaction-status", {
        status,
        timestamp: new Date(),
      });
    });

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });
};

export default socketHandler;
