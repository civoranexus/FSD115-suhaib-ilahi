import { Router } from "express";
import listingController from "../controllers/listingController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import {validate} from
 "../middleware/validation.js";
import { createListingSchema, updateListingSchema, searchListingsSchema } from "../validators/listingValidator.js";
import { USER_ROLES } from "../constants/enums.js";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  validate(createListingSchema),
  listingController.createListing
);
router.get(
  "/search",
  validate(searchListingsSchema, { source: "query" }),
  listingController.searchListings
);
router.get(
  "/seller/my-listings",
  authenticate,
  listingController.getSellerListings
);
router.get("/:listingId", listingController.getListingDetails);
router.put(
  "/:listingId",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  validate(updateListingSchema),
  listingController.updateListing
);
router.delete(
  "/:listingId",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  listingController.deleteListing
);

export default router;
