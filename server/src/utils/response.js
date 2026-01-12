import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
const { OK , INTERNAL_SERVER_ERROR} = HTTP_STATUS_CODES;

const sendSuccess = (
  res,
  data = null,
  message = "Success",
  statusCode = OK
) => {
  res.status(statusCode).json({
    success: true,
    status: "success",
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

const sendError = (
  res,
  message = "Error",
  statusCode = INTERNAL_SERVER_ERROR,
  details = null
) => {
  res.status(statusCode).json({
    success: false,
    status: "error",
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  });
};

const sendPaginatedResponse = (
  res,
  data,
  total,
  page,
  limit,
  message = "Success"
) => {
  const totalPages = Math.ceil(total / limit);

  res.status(OK).json({
    success: true,
    status: "success",
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};

export  {
  sendSuccess,
  sendError,
  sendPaginatedResponse,
};
