import  biddingService from "../services/biddingService.js";
import { sendSuccess, sendPaginatedResponse } from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

const { CREATED, OK } = HTTP_STATUS_CODES;
const {
  BID_PLACED,
  BID_ACCEPTED,
  BID_REJECTED,
  AUTH_SUCCESS,
} = MESSAGES;
const {placeBid : _placeBid,
  acceptBid : _acceptBid,
  rejectBid : _rejectBid,
  getBuyerBids : _getBuyerBids,
  getListingBids : _getListingBids,} = biddingService;

class BiddingController {
  async placeBid(req, res, next) {
    try {
      const { listingId } = req.params;
      const result = await _placeBid(listingId, req.user.userId, req.body);
      sendSuccess(res, result, BID_PLACED, CREATED);
    } catch (error) {
      next(error);
    }
  }

  async acceptBid(req, res, next) {
    try {
      const { bidId } = req.params;
      const result = await _acceptBid(bidId, req.user.userId);
      sendSuccess(res, result, BID_ACCEPTED, OK);
    } catch (error) {
      next(error);
    }
  }

  async rejectBid(req, res, next) {
    try {
      const { bidId } = req.params;
      const { reason } = req.body;
      const result = await _rejectBid(bidId, req.user.userId, reason);
      sendSuccess(res, result, BID_REJECTED, OK);
    } catch (error) {
      next(error);
    }
  }

  async getBuyerBids(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await _getBuyerBids(req.user.userId, page, limit);

      sendPaginatedResponse(
        res,
        result.bids,
        result.pagination.total,
        page,
        limit,
        AUTH_SUCCESS
      );
    } catch (error) {
      next(error);
    }
  }

  async getListingBids(req, res, next) {
    try {
      const { listingId } = req.params;
      const result = await _getListingBids(listingId);
      sendSuccess(res, result, AUTH_SUCCESS, OK);
    } catch (error) {
      next(error);
    }
  }
}

export default new BiddingController();
