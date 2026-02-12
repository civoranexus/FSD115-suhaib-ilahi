import Payment from "../models/Payment.js";
import Transaction from "../models/Transaction.js";
import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from "../utils/errorHandler.js";
import calculatePagination from "../utils/pagination.js";
import helpers from "../utils/helpers.js";
import logger from "../utils/logger.js";
import { MESSAGES } from "../constants/messages.js";
import emailConfig from "../config/email.js";

const { FORBIDDEN } = MESSAGES;
const { sendEmail } = emailConfig;
const { generateUUID } = helpers;

class PaymentService {
  async initiatePayment(transactionId, paymentData, buyerId) {
    try {
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        throw new NotFoundError("Transaction not found");
      }

      if (transaction.buyer_id !== buyerId) {
        throw new AuthorizationError(FORBIDDEN);
      }

      const referenceNumber = `PAY-${Date.now()}-${generateUUID().substring(
        0,
        8,
      )}`;

      const newPayment = await Payment.create({
        transactionId,
        amount: transaction.amount,
        paymentMethod: paymentData.paymentMethod,
        status: "pending",
        referenceNumber,
      });

      const paymentResult = await this.processPayment(paymentData);

      if (paymentResult.success) {
        await Payment.update(newPayment.id, { status: "completed" });
        await Transaction.update(transactionId, { status: "confirmed" });
      } else {
        await Payment.update(newPayment.id, { status: "failed" });
        throw new ValidationError(
          paymentResult.message || "Payment processing failed",
        );
      }

      logger.info(`Payment processed: ${newPayment.id}`);

      return {
        id: newPayment.id,
        referenceNumber,
        status: "completed",
        amount: transaction.amount,
      };
    } catch (error) {
      logger.error("Initiate payment error:", error);
      throw error;
    }
  }

  async processPayment(paymentData) {
    try {
      // Simulate payment processing
      if (paymentData.paymentMethod === "wallet") {
        return { success: true };
      }

      if (paymentData.cardNumber && paymentData.cvv) {
        const lastDigits = paymentData.cardNumber.slice(-4);
        logger.info(`Payment processed with card ending in ${lastDigits}`);
        return { success: true };
      }

      if (paymentData.paymentMethod === "bank_transfer") {
        return { success: true };
      }

      return { success: false, message: "Invalid payment method" };
    } catch (error) {
      logger.error("Process payment error:", error);
      return { success: false, message: "Payment processing failed" };
    }
  }

  async getPaymentDetails(paymentId, userId) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new NotFoundError("Payment not found");
      }

      if (payment.buyer_id !== userId) {
        throw new AuthorizationError(FORBIDDEN);
      }

      return {
        id: payment.id,
        referenceNumber: payment.reference_number,
        amount: payment.amount,
        paymentMethod: payment.payment_method,
        status: payment.status,
        createdAt: payment.created_at,
      };
    } catch (error) {
      logger.error("Get payment details error:", error);
      throw error;
    }
  }

  async refundPayment(paymentId, sellerId, reason) {
    try {
      const payment = await Payment.findById(paymentId);

      if (!payment) {
        throw new NotFoundError("Payment not found");
      }

      const transaction = await Transaction.findById(payment.transaction_id);

      if (transaction.seller_id !== sellerId) {
        throw new AuthorizationError(FORBIDDEN);
      }

      await Payment.update(paymentId, { status: "refunded" });
      await Transaction.update(payment.transaction_id, { status: "cancelled" });

      logger.info(`Payment refunded: ${paymentId}`);

      return {
        id: payment.id,
        status: "refunded",
      };
    } catch (error) {
      logger.error("Refund payment error:", error);
      throw error;
    }
  }

  async getBuyerPayments(buyerId, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const { data, total } = await Payment.getByBuyerId(buyerId, {
        limit,
        offset,
      });

      return {
        payments: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get buyer payments error:", error);
      throw error;
    }
  }

  async getSellerPayments(sellerId, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const { data, total } = await Payment.getBySellerId(sellerId, {
        limit,
        offset,
      });

      return {
        payments: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get seller payments error:", error);
      throw error;
    }
  }
}

export default new PaymentService();
