import
  userService
 from "../services/userService.js";
import {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
} from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

const {getUserProfile,
  updateProfile : _updateProfile,
  submitKYC :_submitKYC,
  listUsers : _listUsers,} = userService;
const { OK } = HTTP_STATUS_CODES;
const {
  AUTH_SUCCESS,
  PROFILE_UPDATED,
  KYC_SUBMITTED,
} = MESSAGES;
import logger from "../utils/logger.js";

class UserController {
  async getProfile(req, res, next) {
    try {
      const profile = await getUserProfile(req.user.userId);
      sendSuccess(res, profile, AUTH_SUCCESS, OK);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const result = await _updateProfile(req.user.userId, req.body);
      sendSuccess(res, result, PROFILE_UPDATED, OK);
    } catch (error) {
      next(error);
    }
  }

  async submitKYC(req, res, next) {
    try {
      const result = await _submitKYC(req.user.userId, req.body);
      sendSuccess(res, result, KYC_SUBMITTED, OK);
    } catch (error) {
      next(error);
    }
  }

  async listUsers(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        role,
        status,
        kycStatus,
        search,
      } = req.query;
      const filters = { role, status, kycStatus, search };
      const pagination = {
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
      };

      const result = await _listUsers(filters, pagination);
      sendPaginatedResponse(
        res,
        result.users,
        result.total,
        page,
        limit,
        AUTH_SUCCESS
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
