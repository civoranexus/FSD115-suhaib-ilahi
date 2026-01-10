import { Router } from "express";
import adminController from "../controllers/adminController.js";
import  { authenticate, authorize }  from "../middleware/authenticate.js";
import { USER_ROLES } from "../constants/enums.js";

const router = Router();

router.use(authenticate, authorize([USER_ROLES.ADMIN]));

router.put("/users/:userId/suspend", adminController.suspendUser);
router.put("/users/:userId/activate", adminController.activateUser);
router.put("/users/:userId/kyc/approve", adminController.approveKYC);
router.put("/users/:userId/kyc/reject", adminController.rejectKYC);
router.put("/listings/:listingId/suspend", adminController.suspendListing);
router.put(
  "/listings/:listingId/reactivate",
  adminController.reactivateListing
);
router.get("/reports/sales", adminController.generateSalesReport);
router.get("/metrics", adminController.getSystemMetrics);

export default router;
