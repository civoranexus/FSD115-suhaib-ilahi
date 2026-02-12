import Bid from "../models/Bid.js";
import Listing from "../models/Listing.js";
import Transaction from "../models/Transaction.js";
import {
  AuthorizationError,
  NotFoundError,
  ValidationError,
} from "../utils/errorHandler.js";
import calculatePagination from "../utils/pagination.js";
import helpers from "../utils/helpers.js";
import logger from "../utils/logger.js";
import { MESSAGES } from "../constants/messages.js";
import emailConfig from "../config/email.js";

const { LISTING_NOT_FOUND, FORBIDDEN } = MESSAGES;
const { sendEmail } = emailConfig;
const { getExpiryDate } = helpers;

class BiddingService {
  async placeBid(listingId, buyerId, bidData) {
    try {
      const listing = await Listing.findById(listingId);

      if (!listing) {
        throw new NotFoundError(LISTING_NOT_FOUND);
      }

      if (listing.seller_id === buyerId) {
        throw new ValidationError("Cannot bid on your own listing");
      }

      if (listing.status !== "active") {
        throw new ValidationError("This listing is not active");
      }

      const expiryDate = getExpiryDate(7);

      const newBid = await Bid.create({
        listingId,
        buyerId,
        bidAmount: bidData.bidAmount,
        bidType: bidData.bidType,
        expiryDate,
      });

      await this.notifySellerOfNewBid(listing, newBid);

      logger.info(`Bid placed: ${newBid.id} on listing ${listingId}`);

      return {
        id: newBid.id,
        bidAmount: newBid.bid_amount,
        status: newBid.status,
      };
    } catch (error) {
      logger.error("Place bid error:", error);
      throw error;
    }
  }

  async acceptBid(bidId, sellerId) {
    try {
      const bid = await Bid.findById(bidId);

      if (!bid) {
        throw new NotFoundError("Bid not found");
      }

      const listing = await Listing.findById(bid.listing_id);

      if (listing.seller_id !== sellerId) {
        throw new AuthorizationError(FORBIDDEN);
      }

      const updatedBid = await Bid.updateStatus(bidId, "accepted");

      await Listing.updateStatus(bid.listing_id, "sold");

      logger.info(`Bid accepted: ${bidId}`);

      return {
        id: updatedBid.id,
        status: updatedBid.status,
      };
    } catch (error) {
      logger.error("Accept bid error:", error);
      throw error;
    }
  }

  async rejectBid(bidId, sellerId, reason = null) {
    try {
      const bid = await Bid.findById(bidId);

      if (!bid) {
        throw new NotFoundError("Bid not found");
      }

      const listing = await Listing.findById(bid.listing_id);

      if (listing.seller_id !== sellerId) {
        throw new AuthorizationError(FORBIDDEN);
      }

      const updatedBid = await Bid.updateStatus(bidId, "rejected");

      logger.info(`Bid rejected: ${bidId}`);

      return {
        id: updatedBid.id,
        status: updatedBid.status,
      };
    } catch (error) {
      logger.error("Reject bid error:", error);
      throw error;
    }
  }

  async getBuyerBids(buyerId, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const { data, total } = await Bid.getByBuyerId(buyerId, {
        limit,
        offset,
      });

      return {
        bids: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get buyer bids error:", error);
      throw error;
    }
  }

  async getListingBids(listingId) {
    try {
      const bids = await Bid.findByListingId(listingId);

      return {
        bids,
        total: bids.length,
      };
    } catch (error) {
      logger.error("Get listing bids error:", error);
      throw error;
    }
  }

  async notifySellerOfNewBid(listing, bid) {
    try {
      const html = `
        <h2>New Bid Received</h2>
        <p>You have received a new bid on your listing: ${listing.title}</p>
        <p><strong>Bid Amount: ₹${bid.bid_amount}</strong></p>
        <p>Please review and accept or reject the bid.</p>
        <p>Best regards,<br/>LiveStockHub Team</p>
      `;

      await sendEmail(listing.email, "New Bid Received", html);
    } catch (error) {
      logger.error("Seller notification email sending failed:", error);
    }
  }
}

export default new BiddingService();
