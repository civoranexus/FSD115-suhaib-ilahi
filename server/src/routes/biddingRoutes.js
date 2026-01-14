import { Router } from "express";
import biddingController from "../controllers/biddingController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import {validate} from
 "../middleware/validation.js";
import { placeBidSchema } from "../validators/biddingValidator.js";
import { USER_ROLES } from "../constants/enums.js";

const router = Router();

router.post(
  "/listings/:listingId/bid",
  authenticate,
  authorize([USER_ROLES.BUYER]),
  validate(placeBidSchema),
  biddingController.placeBid
);
router.post(
  "/:bidId/accept",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  biddingController.acceptBid
);
router.post(
  "/:bidId/reject",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  biddingController.rejectBid
);
router.get(
  "/my-bids",
  authenticate,
  authorize([USER_ROLES.BUYER]),
  biddingController.getBuyerBids
);
router.get(
  "/listings/:listingId/bids",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  biddingController.getListingBids
);

export default router;
