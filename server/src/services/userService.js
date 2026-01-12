import User from "../models/User.js";
import {NotFoundError, ValidationError} from
 "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import sendEmail from
 "../config/email.js";
import { MESSAGES } from "../constants/messages.js";

const { USER_NOT_FOUND } = MESSAGES;

class UserService {
  async getUserProfile(userId) {
    try {
      const user = await User.findByIdWithRelations(userId);

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      return {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phoneNumber: user.phone_number,
        role: user.role,
        address: user.address,
        city: user.city,
        state: user.state,
        zipCode: user.zip_code,
        country: user.country,
        kycStatus: user.kyc_status,
        status: user.status,
        listingCount: user.listing_count,
        bidCount: user.bid_count,
        transactionCount: user.transaction_count,
      };
    } catch (error) {
      logger.error("Get user profile error:", error);
      throw error;
    }
  }

  async updateProfile(userId, profileData) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      const updatedUser = await User.updateProfile(userId, profileData);

      logger.info(`Profile updated for user: ${userId}`);

      return {
        id: updatedUser.id,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        phoneNumber: updatedUser.phone_number,
        address: updatedUser.address,
        city: updatedUser.city,
        state: updatedUser.state,
        zipCode: updatedUser.zip_code,
        country: updatedUser.country,
      };
    } catch (error) {
      logger.error("Update profile error:", error);
      throw error;
    }
  }

  async submitKYC(userId, kycData) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      if (user.role !== "seller") {
        throw new ValidationError("Only sellers can submit KYC documents");
      }

      const updatedUser = await User.submitKYC(userId, kycData);

      await this.sendKYCNotificationEmail(
        updatedUser.email,
        updatedUser.first_name
      );

      logger.info(`KYC submitted for user: ${userId}`);

      return {
        id: updatedUser.id,
        kycStatus: updatedUser.kyc_status,
      };
    } catch (error) {
      logger.error("Submit KYC error:", error);
      throw error;
    }
  }

  async sendKYCNotificationEmail(email, firstName) {
    try {
      const html = `
        <h2>KYC Submission Received</h2>
        <p>Hi ${firstName},</p>
        <p>Your KYC documents have been received. We will review them and get back to you within 48 hours.</p>
        <p>Best regards,<br/>LiveStockHub Team</p>
      `;

      await sendEmail(email, "KYC Submission Received", html);
    } catch (error) {
      logger.error("KYC notification email sending failed:", error);
    }
  }

  async listUsers(filters, pagination) {
    try {
      const { data, total } = await User.list(filters, pagination);

      return {
        users: data.map((user) => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          kycStatus: user.kyc_status,
          status: user.status,
          createdAt: user.created_at,
        })),
        total,
      };
    } catch (error) {
      logger.error("List users error:", error);
      throw error;
    }
  }
}

export default new UserService();
