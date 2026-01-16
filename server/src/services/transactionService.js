import Transaction from "../models/Transaction.js";
import Bid from "../models/Bid.js";
import Listing from "../models/Listing.js";
import User from "../models/User.js";

import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from "../utils/errorHandler.js";

import calculatePagination from "../utils/pagination.js";

import generateTransactionId from "../utils/helpers.js";
import logger from "../utils/logger.js";
import { MESSAGES } from "../constants/messages.js";
import emailConfig from "../config/email.js";

const { FORBIDDEN, LISTING_NOT_FOUND } = MESSAGES;
const { sendEmail } = emailConfig;

class TransactionService {
  async createTransaction(bidId, buyerId, transactionData) {
    try {
      const bid = await Bid.findById(bidId);

      if (!bid) {
        throw new NotFoundError("Bid not found");
      }

      if (bid.buyer_id !== buyerId) {
        throw new AuthorizationError(FORBIDDEN);
      }

      const listing = await Listing.findById(bid.listing_id);

      if (!listing) {
        throw new NotFoundError(LISTING_NOT_FOUND);
      }

      const newTransaction = await Transaction.create({
        bidId,
        buyerId,
        sellerId: listing.seller_id,
        listingId: bid.listing_id,
        amount: bid.bid_amount,
        paymentMethod: transactionData.paymentMethod,
        deliveryAddress: transactionData.deliveryAddress,
        additionalNotes: transactionData.additionalNotes,
      });

      await this.notifyParties(newTransaction, listing, bid);

      logger.info(`Transaction created: ${newTransaction.id}`);

      return {
        id: newTransaction.id,
        transactionId: generateTransactionId(),
        status: newTransaction.status,
      };
    } catch (error) {
      logger.error("Create transaction error:", error);
      throw error;
    }
  }

  async getTransactionDetails(transactionId, userId) {
    try {
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        throw new NotFoundError("Transaction not found");
      }

      if (transaction.buyer_id !== userId && transaction.seller_id !== userId) {
        throw new AuthorizationError(FORBIDDEN);
      }

      return {
        id: transaction.id,
        bidId: transaction.bid_id,
        listingTitle: transaction.listing_title,
        amount: transaction.amount,
        paymentMethod: transaction.payment_method,
        deliveryAddress: transaction.delivery_address,
        status: transaction.status,
        createdAt: transaction.created_at,
      };
    } catch (error) {
      logger.error("Get transaction details error:", error);
      throw error;
    }
  }

  async updateTransactionStatus(transactionId, status, userId) {
    try {
      const transaction = await Transaction.findById(transactionId);

      if (!transaction) {
        throw new NotFoundError("Transaction not found");
      }

      if (transaction.seller_id !== userId) {
        throw new AuthorizationError(
          "Only seller can update transaction status"
        );
      }

      const updatedTransaction = await Transaction.update(transactionId, {
        status,
      });

      logger.info(`Transaction status updated: ${transactionId} - ${status}`);

      return {
        id: updatedTransaction.id,
        status: updatedTransaction.status,
      };
    } catch (error) {
      logger.error("Update transaction status error:", error);
      throw error;
    }
  }

  async getBuyerTransactions(buyerId, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const { data, total } = await Transaction.getByBuyerId(buyerId, {
        limit,
        offset,
      });

      return {
        transactions: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get buyer transactions error:", error);
      throw error;
    }
  }

  async getSellerTransactions(sellerId, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const { data, total } = await Transaction.getBySellerId(sellerId, {
        limit,
        offset,
      });

      return {
        transactions: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get seller transactions error:", error);
      throw error;
    }
  }

  async notifyParties(transaction, listing, bid) {
    try {
      const buyer = await User.findById(transaction.buyer_id);
      const seller = await User.findById(transaction.seller_id);

      const buyerHtml = `
        <h2>Transaction Confirmed</h2>
        <p>Hi ${buyer.first_name},</p>
        <p>Your purchase for ${listing.title} has been confirmed.</p>
        <p><strong>Amount: ₹${transaction.amount}</strong></p>
        <p>Seller will contact you shortly with delivery details.</p>
        <p>Best regards,<br/>LiveStockHub Team</p>
      `;

      const sellerHtml = `
        <h2>New Sale</h2>
        <p>Hi ${seller.first_name},</p>
        <p>Your listing ${listing.title} has been sold!</p>
        <p><strong>Amount: ₹${transaction.amount}</strong></p>
        <p>Please arrange delivery and contact the buyer.</p>
        <p>Best regards,<br/>LiveStockHub Team</p>
      `;

      await Promise.all([
        sendEmail(buyer.email, "Transaction Confirmed", buyerHtml),
        sendEmail(seller.email, "New Sale", sellerHtml),
      ]);
    } catch (error) {
      logger.error("Notify parties email sending failed:", error);
    }
  }
}

export default new TransactionService();
