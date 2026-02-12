import AuthService from "../services/authService.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";
import logger from "../utils/logger.js";

const {
  REGISTRATION_SUCCESS,
  LOGIN_SUCCESS,
  TOKEN_REFRESHED,
  PASSWORD_CHANGED,
} = MESSAGES;
const { OK, CREATED } = HTTP_STATUS_CODES;

class AuthController {
  async register(req, res, next) {
    try {
      const result = await AuthService.register(req.body);
      sendSuccess(res, result, REGISTRATION_SUCCESS, CREATED);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      sendSuccess(res, result, LOGIN_SUCCESS, OK);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refreshToken(refreshToken);
      sendSuccess(res, result, TOKEN_REFRESHED, OK);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await AuthService.changePassword(req.user.userId, currentPassword, newPassword);
      sendSuccess(res, null, PASSWORD_CHANGED, OK);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();

