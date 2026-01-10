import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../config/jwt.js";
import comparePassword from "../utils/helpers.js";
import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import sendEmail from "../config/email.js";
import { MESSAGES } from "../constants/messages.js";

const { USER_ALREADY_EXISTS, INVALID_CREDENTIALS, USER_NOT_FOUND } = MESSAGES;
class AuthService {
  async register(userData) {
    try {
      const existingUser = await User.findByEmail(userData.email);

      if (existingUser) {
        throw new ConflictError(USER_ALREADY_EXISTS);
      }

      const newUser = await User.create(userData);

      const accessToken = generateAccessToken(newUser.id, newUser.role);
      const refreshToken = generateRefreshToken(newUser.id);

      await this.sendWelcomeEmail(newUser.email, newUser.first_name);

      logger.info(`New user registered: ${newUser.id} - ${newUser.email}`);

      return {
        user: {
          id: newUser.id,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error("Registration error:", error);
      throw error;
    }
  }

  async login(email, password) {
    try {
      const user = await User.findByEmail(email);

      if (!user) {
        throw new AuthenticationError(INVALID_CREDENTIALS);
      }

      const passwordMatch = await comparePassword(password, user.password);

      if (!passwordMatch) {
        throw new AuthenticationError(INVALID_CREDENTIALS);
      }

      const accessToken = generateAccessToken(user.id, user.role);
      const refreshToken = generateRefreshToken(user.id);

      logger.info(`User logged in: ${user.id}`);

      return {
        user: {
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          role: user.role,
          kycStatus: user.kyc_status,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      logger.error("Login error:", error);
      throw error;
    }
  }

  async refreshToken(refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.userId);

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      const newAccessToken = generateAccessToken(user.id, user.role);
      const newRefreshToken = generateRefreshToken(user.id);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      logger.error("Token refresh error:", error);
      throw new AuthenticationError("Invalid refresh token");
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }

      const passwordMatch = await comparePassword(
        currentPassword,
        user.password
      );

      if (!passwordMatch) {
        throw new AuthenticationError("Current password is incorrect");
      }

      const { hashPassword } = require("../utils/helpers").default;
      const hashedNewPassword = await hashPassword(newPassword);

      await User.update(userId, { password: hashedNewPassword });

      logger.info(`Password changed for user: ${userId}`);

      return true;
    } catch (error) {
      logger.error("Password change error:", error);
      throw error;
    }
  }

  async sendWelcomeEmail(email, firstName) {
    try {
      const html = `
        <h2>Welcome to LiveStockHub!</h2>
        <p>Hi ${firstName},</p>
        <p>Thank you for registering with LiveStockHub. Your account is now active.</p>
        <p>You can now browse listings, place bids, or create your own listings.</p>
        <p>Best regards,<br/>LiveStockHub Team</p>
      `;

      await sendEmail(email, "Welcome to LiveStockHub", html);
    } catch (error) {
      logger.error("Welcome email sending failed:", error);
    }
  }
}

export default new AuthService();
