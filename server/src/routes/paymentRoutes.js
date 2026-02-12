import { Router } from "express";
import paymentController from "../controllers/paymentController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import { validate } from "../middleware/validation.js";
import {
  initiatePaymentSchema,
  refundPaymentSchema,
} from "../validators/paymentValidator.js";
import { USER_ROLES } from "../constants/enums.js";

const router = Router();

router.post(
  "/transaction/:transactionId/initiate",
  authenticate,
  authorize([USER_ROLES.BUYER]),
  validate(initiatePaymentSchema),
  paymentController.initiatePayment,
);
router.get("/:paymentId", authenticate, paymentController.getPaymentDetails);
router.post(
  "/:paymentId/refund",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  validate(refundPaymentSchema),
  paymentController.refundPayment,
);
router.get(
  "/buyer/my-payments",
  authenticate,
  authorize([USER_ROLES.BUYER]),
  paymentController.getBuyerPayments,
);
router.get(
  "/seller/my-payments",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  paymentController.getSellerPayments,
);

export default router;
