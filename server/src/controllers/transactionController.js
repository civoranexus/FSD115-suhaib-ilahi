import transactionService from "../services/transactionService.js";
import { sendSuccess, sendPaginatedResponse } from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

const {createTransaction : _createTransaction,
  getTransactionDetails : _getTransactionDetails,
  updateTransactionStatus : _updateTransactionStatus,
  getBuyerTransactions : _getBuyerTransactions,
  getSellerTransactions :_getSellerTransactions,} = transactionService;
const { CREATED, OK } = HTTP_STATUS_CODES;
const {
  TRANSACTION_CREATED,
  AUTH_SUCCESS,
  TRANSACTION_STATUS_UPDATED,
} = MESSAGES;

class TransactionController {
  async createTransaction(req, res, next) {
    try {
      const { bidId } = req.params;
      const result = await _createTransaction(bidId, req.user.userId, req.body);
      sendSuccess(res, result, TRANSACTION_CREATED, CREATED);
    } catch (error) {
      next(error);
    }
  }

  async getTransactionDetails(req, res, next) {
    try {
      const { transactionId } = req.params;
      const result = await _getTransactionDetails(
        transactionId,
        req.user.userId
      );
      sendSuccess(res, result, AUTH_SUCCESS, OK);
    } catch (error) {
      next(error);
    }
  }

  async updateTransactionStatus(req, res, next) {
    try {
      const { transactionId } = req.params;
      const { status } = req.body;
      const result = await _updateTransactionStatus(
        transactionId,
        status,
        req.user.userId
      );
      sendSuccess(res, result, TRANSACTION_STATUS_UPDATED, OK);
    } catch (error) {
      next(error);
    }
  }

  async getBuyerTransactions(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await _getBuyerTransactions(req.user.userId, page, limit);

      sendPaginatedResponse(
        res,
        result.transactions,
        result.pagination.total,
        page,
        limit,
        AUTH_SUCCESS
      );
    } catch (error) {
      next(error);
    }
  }

  async getSellerTransactions(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await _getSellerTransactions(req.user.userId, page, limit);

      sendPaginatedResponse(
        res,
        result.transactions,
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

export default new TransactionController();
