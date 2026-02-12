import User from "../models/User.js";
import Listing from "../models/Listing.js";
import Transaction from "../models/Transaction.js";
import { AuthorizationError, NotFoundError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import { MESSAGES } from "../constants/messages.js";

const { USER_NOT_FOUND, LISTING_NOT_FOUND } = MESSAGES;

class AdminService {
  async suspendUser(userId, reason = null) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      await User.updateStatus(userId, "suspended");

      logger.warn(`User suspended: ${userId}, Reason: ${reason}`);

      return {
        id: user.id,
        status: "suspended",
      };
    } catch (error) {
      logger.error("Suspend user error:", error);
      throw error;
    }
  }

  async activateUser(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      await User.updateStatus(userId, "active");

      logger.info(`User activated: ${userId}`);

      return {
        id: user.id,
        status: "active",
      };
    } catch (error) {
      logger.error("Activate user error:", error);
      throw error;
    }
  }

  async approveKYC(userId) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      await User.updateKYCStatus(userId, "approved");

      logger.info(`KYC approved for user: ${userId}`);

      return {
        id: user.id,
        kycStatus: "approved",
      };
    } catch (error) {
      logger.error("Approve KYC error:", error);
      throw error;
    }
  }

  async rejectKYC(userId, reason) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      await User.updateKYCStatus(userId, "rejected", reason);

      logger.info(`KYC rejected for user: ${userId}, Reason: ${reason}`);

      return {
        id: user.id,
        kycStatus: "rejected",
      };
    } catch (error) {
      logger.error("Reject KYC error:", error);
      throw error;
    }
  }

  async suspendListing(listingId, reason = null) {
    try {
      const listing = await Listing.findById(listingId);

      if (!listing) {
        throw new NotFoundError(LISTING_NOT_FOUND);
      }

      await Listing.updateStatus(listingId, "suspended");

      logger.warn(`Listing suspended: ${listingId}, Reason: ${reason}`);

      return {
        id: listing.id,
        status: "suspended",
      };
    } catch (error) {
      logger.error("Suspend listing error:", error);
      throw error;
    }
  }

  async reactivateListing(listingId) {
    try {
      const listing = await Listing.findById(listingId);

      if (!listing) {
        throw new NotFoundError(LISTING_NOT_FOUND);
      }

      await Listing.updateStatus(listingId, "active");

      logger.info(`Listing reactivated: ${listingId}`);

      return {
        id: listing.id,
        status: "active",
      };
    } catch (error) {
      logger.error("Reactivate listing error:", error);
      throw error;
    }
  }

  async generateSalesReport(startDate, endDate) {
    try {
      // Generate sales report
      const report = {
        startDate,
        endDate,
        totalTransactions: 0,
        totalRevenue: 0,
        averageTransactionValue: 0,
        topSellers: [],
        topBuyers: [],
        animalTypeDistribution: {},
      };

      logger.info(`Sales report generated: ${startDate} to ${endDate}`);

      return report;
    } catch (error) {
      logger.error("Generate sales report error:", error);
      throw error;
    }
  }

  async getSystemMetrics() {
    try {
      const metrics = {
        totalUsers: 0,
        totalSellers: 0,
        totalBuyers: 0,
        totalListings: 0,
        activeListings: 0,
        totalTransactions: 0,
        totalRevenue: 0,
      };

      return metrics;
    } catch (error) {
      logger.error("Get system metrics error:", error);
      throw error;
    }
  }
}

export default new AdminService();
