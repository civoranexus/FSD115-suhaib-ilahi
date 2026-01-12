import
  listingService
from "../services/listingService.js";
import { sendSuccess, sendPaginatedResponse } from "../utils/response.js";
import { HTTP_STATUS_CODES } from "../constants/statusCodes.js";
import { MESSAGES } from "../constants/messages.js";

const {createListing : _createListing,
  getListingDetails : _getListingDetails,
  updateListing : _updateListing,
  deleteListing : _deleteListing,
  searchListings :_searchListings,
  getSellerListings : _getSellerListings,} = listingService;
const { CREATED, OK } = HTTP_STATUS_CODES;
const {
  LISTING_CREATED,
  AUTH_SUCCESS,
  LISTING_UPDATED,
  LISTING_DELETED,
  LISTINGS_RETRIEVED,
} = MESSAGES;
import logger from "../utils/logger.js";

class ListingController {
  async createListing(req, res, next) {
    try {
      const result = await _createListing(req.user.userId, req.body);
      sendSuccess(res, result, LISTING_CREATED, CREATED);
    } catch (error) {
      next(error);
    }
  }

  async getListingDetails(req, res, next) {
    try {
      const { listingId } = req.params;
      const result = await _getListingDetails(listingId);
      sendSuccess(res, result, AUTH_SUCCESS, OK);
    } catch (error) {
      next(error);
    }
  }

  async updateListing(req, res, next) {
    try {
      const { listingId } = req.params;
      const result = await _updateListing(listingId, req.user.userId, req.body);
      sendSuccess(res, result, LISTING_UPDATED, OK);
    } catch (error) {
      next(error);
    }
  }

  async deleteListing(req, res, next) {
    try {
      const { listingId } = req.params;
      await _deleteListing(listingId, req.user.userId);
      sendSuccess(res, null, LISTING_DELETED, OK);
    } catch (error) {
      next(error);
    }
  }

  async searchListings(req, res, next) {
    try {
      const { page = 1, limit = 10, ...filters } = req.query;
      const result = await _searchListings(filters, page, limit);

      sendPaginatedResponse(
        res,
        result.listings,
        result.pagination.total,
        page,
        limit,
        LISTINGS_RETRIEVED
      );
    } catch (error) {
      next(error);
    }
  }

  async getSellerListings(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await _getSellerListings(req.user.userId, page, limit);

      sendPaginatedResponse(
        res,
        result.listings,
        result.pagination.total,
        page,
        limit,
        LISTINGS_RETRIEVED
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new ListingController();
