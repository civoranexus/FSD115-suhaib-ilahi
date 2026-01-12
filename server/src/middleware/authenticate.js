import {verifyAccessToken} from "../config/jwt.js";
import {
  AuthenticationError,
  AuthorizationError,
} from "../utils/errorHandler.js";
import {sendError} from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import logger from "../utils/logger.js";

const {UNAUTHORIZED, FORBIDDEN} =HTTP_STATUS_CODES;

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Authorization token not provided");
    }

    const token = authHeader.substring(7);

    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Authentication error:", error.message);
    sendError(
      res,
      error.message || "Unauthorized",
      error.statusCode || UNAUTHORIZED
    );
  }
};

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AuthenticationError("User not authenticated");
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
        throw new AuthorizationError(
          "Insufficient permissions for this action"
        );
      }

      next();
    } catch (error) {
      logger.error("Authorization error:", error.message);
      sendError(res, error.message, error.statusCode || FORBIDDEN);
    }
  };
};

export  {
  authenticate,
  authorize,
};
