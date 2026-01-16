import paymentService from "../services/paymentService.js";
import { sendSuccess, sendPaginatedResponse } from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

const {
   initiatePayment : _initiatePayment,
  getPaymentDetails : _getPaymentDetails,
  refundPayment : _refundPayment,
  getBuyerPayments : _getBuyerPayments,
  getSellerPayments :_getSellerPayments,
} = paymentService;
const { CREATED, OK } = HTTP_STATUS_CODES;
const {
  PAYMENT_COMPLETED,
  AUTH_SUCCESS,
  PAYMENT_REFUNDED,
} = MESSAGES;

class PaymentController {
  async initiatePayment(req, res, next) {
    try {
      const { transactionId } = req.params;
      const result = await _initiatePayment(
        transactionId,
        req.body,
        req.user.userId
      );
      sendSuccess(res, result, PAYMENT_COMPLETED, CREATED);
    } catch (error) {
      next(error);
    }
  }

  async getPaymentDetails(req, res, next) {
    try {
      const { paymentId } = req.params;
      const result = await _getPaymentDetails(paymentId, req.user.userId);
      sendSuccess(res, result, AUTH_SUCCESS, OK);
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(req, res, next) {
    try {
      const { paymentId } = req.params;
      const { reason } = req.body;
      const result = await _refundPayment(paymentId, req.user.userId, reason);
      sendSuccess(res, result, PAYMENT_REFUNDED, OK);
    } catch (error) {
      next(error);
    }
  }

  async getBuyerPayments(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await _getBuyerPayments(req.user.userId, page, limit);

      sendPaginatedResponse(
        res,
        result.payments,
        result.pagination.total,
        page,
        limit,
        AUTH_SUCCESS
      );
    } catch (error) {
      next(error);
    }
  }

  async getSellerPayments(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await _getSellerPayments(req.user.userId, page, limit);

      sendPaginatedResponse(
        res,
        result.payments,
        result.pagination.total,
        page,
        limit,
        AUTH_SUCCESS
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
