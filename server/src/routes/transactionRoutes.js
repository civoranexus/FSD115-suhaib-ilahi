import { Router } from "express";
import transactionController from "../controllers/transactionController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import {validate} from
 "../middleware/validation.js";
import { createTransactionSchema, updateTransactionStatusSchema } from "../validators/transactionValidator.js";
import { USER_ROLES } from "../constants/enums.js";

const router = Router();

router.post(
  "/bid/:bidId",
  authenticate,
  authorize([USER_ROLES.BUYER]),
  validate(createTransactionSchema),
  transactionController.createTransaction
);
router.get(
  "/:transactionId",
  authenticate,
  transactionController.getTransactionDetails
);
router.put(
  "/:transactionId/status",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  validate(updateTransactionStatusSchema),
  transactionController.updateTransactionStatus
);
router.get(
  "/buyer/my-transactions",
  authenticate,
  authorize([USER_ROLES.BUYER]),
  transactionController.getBuyerTransactions
);
router.get(
  "/seller/my-transactions",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  transactionController.getSellerTransactions
);

export default router;
