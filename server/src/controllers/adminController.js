import {
  suspendUser as _suspendUser,
  activateUser as _activateUser,
  approvKYC,
  rejectKYC as _rejectKYC,
  suspendListing as _suspendListing,
  reactivateListing as _reactivateListing,
  generateSalesReport as _generateSalesReport,
  getSystemMetrics as _getSystemMetrics,
} from "../services/adminService.js";
import sendSuccess from "../utils/response.js";
import { OK } from "../constants/statusCodes.js";
import {
  USER_SUSPENDED,
  USER_ACTIVATED,
  KYC_APPROVED,
  KYC_REJECTED,
  LISTING_SUSPENDED,
  REPORT_GENERATED,
  AUTH_SUCCESS,
} from "../constants/messages.js";

class AdminController {
  async suspendUser(req, res, next) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      const result = await _suspendUser(userId, reason);
      sendSuccess(res, result, USER_SUSPENDED, OK);
    } catch (error) {
      next(error);
    }
  }

  async activateUser(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await _activateUser(userId);
      sendSuccess(res, result, USER_ACTIVATED, OK);
    } catch (error) {
      next(error);
    }
  }

  async approveKYC(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await approvKYC(userId);
      sendSuccess(res, result, KYC_APPROVED, OK);
    } catch (error) {
      next(error);
    }
  }

  async rejectKYC(req, res, next) {
    try {
      const { userId } = req.params;
      const { reason } = req.body;
      const result = await _rejectKYC(userId, reason);
      sendSuccess(res, result, KYC_REJECTED, OK);
    } catch (error) {
      next(error);
    }
  }

  async suspendListing(req, res, next) {
    try {
      const { listingId } = req.params;
      const { reason } = req.body;
      const result = await _suspendListing(listingId, reason);
      sendSuccess(res, result, LISTING_SUSPENDED, OK);
    } catch (error) {
      next(error);
    }
  }

  async reactivateListing(req, res, next) {
    try {
      const { listingId } = req.params;
      const result = await _reactivateListing(listingId);
      sendSuccess(res, result, "Listing reactivated successfully", OK);
    } catch (error) {
      next(error);
    }
  }

  async generateSalesReport(req, res, next) {
    try {
      const { startDate, endDate } = req.query;
      const result = await _generateSalesReport(startDate, endDate);
      sendSuccess(res, result, REPORT_GENERATED, OK);
    } catch (error) {
      next(error);
    }
  }

  async getSystemMetrics(req, res, next) {
    try {
      const result = await _getSystemMetrics();
      sendSuccess(res, result, AUTH_SUCCESS, OK);
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
