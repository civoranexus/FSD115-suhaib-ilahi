import Listing from "../models/Listing.js";

import {
  NotFoundError,
  ValidationError,
  AuthorizationError,
} from "../utils/errorHandler.js";

import calculatePagination from "../utils/pagination.js";

import logger from "../utils/logger.js";
import { MESSAGES } from "../constants/messages.js";
import emailConfig from "../config/email.js";

const { LISTING_NOT_FOUND, FORBIDDEN } = MESSAGES;
const { sendEmail } = emailConfig;

class ListingService {
  async createListing(sellerId, listingData) {
    try {
      const newListing = await Listing.create({
        sellerId,
        ...listingData,
      });

      logger.info(`Listing created: ${newListing.id} by seller ${sellerId}`);

      return {
        id: newListing.id,
        title: newListing.title,
        animalType: newListing.animal_type,
        price: newListing.price,
        status: newListing.status,
      };
    } catch (error) {
      logger.error("Create listing error:", error);
      throw error;
    }
  }

  async getListingDetails(listingId) {
    try {
      const listing = await Listing.findById(listingId);

      if (!listing) {
        throw new NotFoundError(LISTING_NOT_FOUND);
      }

      return {
        id: listing.id,
        title: listing.title,
        description: listing.description,
        animalType: listing.animal_type,
        breed: listing.breed,
        age: listing.age,
        weight: listing.weight,
        healthStatus: listing.health_status,
        vaccinations: listing.vaccinations,
        medicalHistory: listing.medical_history,
        location: listing.location,
        price: listing.price,
        auctionStartPrice: listing.auction_start_price,
        auctionEndTime: listing.auction_end_time,
        auctionType: listing.auction_type,
        isPremium: listing.is_premium,
        imageUrls: listing.image_urls,
        videoUrl: listing.video_url,
        status: listing.status,
        seller: {
          id: listing.seller_id,
          name: `${listing.first_name} ${listing.last_name}`,
          email: listing.email,
          phone: listing.phone_number,
        },
        bidCount: listing.bid_count,
        highestBid: listing.highest_bid,
      };
    } catch (error) {
      logger.error("Get listing details error:", error);
      throw error;
    }
  }

  async updateListing(listingId, sellerId, updateData) {
    try {
      const listing = await Listing.findById(listingId);

      if (!listing) {
        throw new NotFoundError(LISTING_NOT_FOUND);
      }

      if (listing.seller_id !== sellerId) {
        throw new AuthorizationError(FORBIDDEN);
      }

      const updatedListing = await Listing.update(listingId, updateData);

      logger.info(`Listing updated: ${listingId}`);

      return {
        id: updatedListing.id,
        title: updatedListing.title,
        status: updatedListing.status,
      };
    } catch (error) {
      logger.error("Update listing error:", error);
      throw error;
    }
  }

  async deleteListing(listingId, sellerId) {
    try {
      const listing = await Listing.findById(listingId);

      if (!listing) {
        throw new NotFoundError(LISTING_NOT_FOUND);
      }

      if (listing.seller_id !== sellerId) {
        throw new AuthorizationError(FORBIDDEN);
      }

      await Listing.delete(listingId);

      logger.info(`Listing deleted: ${listingId}`);

      return true;
    } catch (error) {
      logger.error("Delete listing error:", error);
      throw error;
    }
  }

  async searchListings(filters, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const { data, total } = await Listing.search(filters, { limit, offset });

      return {
        listings: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Search listings error:", error);
      throw error;
    }
  }

  async getSellerListings(sellerId, page, limit) {
    try {
      const { offset } = calculatePagination(page, limit);

      const { data, total } = await Listing.getBySellerId(sellerId, {
        limit,
        offset,
      });

      return {
        listings: data,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      logger.error("Get seller listings error:", error);
      throw error;
    }
  }

  async updateListingStatus(listingId, status, adminId = null) {
    try {
      const listing = await Listing.findById(listingId);

      if (!listing) {
        throw new NotFoundError(LISTING_NOT_FOUND);
      }

      const updatedListing = await Listing.updateStatus(listingId, status);

      logger.info(
        `Listing status updated: ${listingId} - ${status} (by admin: ${adminId})`
      );

      return {
        id: updatedListing.id,
        status: updatedListing.status,
      };
    } catch (error) {
      logger.error("Update listing status error:", error);
      throw error;
    }
  }
}

export default new ListingService();
