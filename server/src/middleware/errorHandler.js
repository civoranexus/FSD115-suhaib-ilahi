import logger from "../utils/logger.js";
import {sendError} from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";
import {ApplicationError} from "../utils/errorHandler.js";

const { UNPROCESSABLE_ENTITY, BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } =
  HTTP_STATUS_CODES;
const {
  VALIDATION_ERROR,
  FILE_SIZE_EXCEEDED,
  FILE_UPLOAD_ERROR,
  INVALID_FILE_TYPE,
  INTERNAL_SERVER_ERROR: INTERNAL_SERVER_ERROR_MSG,
  NOT_FOUND: NOT_FOUND_MSG,
} = MESSAGES;
const errorHandler = (error, req, res, next) => {
  logger.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  if (error instanceof ApplicationError) {
    return sendError(res, error.message, error.statusCode, error.details);
  }

  if (error.name === "ValidationError") {
    const details = error.details || error.message;
    return sendError(res, VALIDATION_ERROR, UNPROCESSABLE_ENTITY, details);
  }

  if (error.name === "MulterError") {
    if (error.code === "FILE_TOO_LARGE") {
      return sendError(res, FILE_SIZE_EXCEEDED, BAD_REQUEST);
    }
    return sendError(res, FILE_UPLOAD_ERROR, BAD_REQUEST);
  }

  if (error.message.includes("Invalid file type")) {
    return sendError(res, INVALID_FILE_TYPE, BAD_REQUEST);
  }

  return sendError(res, INTERNAL_SERVER_ERROR_MSG, INTERNAL_SERVER_ERROR);
};

const notFoundHandler = (req, res) => {
  sendError(res, NOT_FOUND_MSG, NOT_FOUND);
};

export { errorHandler, notFoundHandler };
