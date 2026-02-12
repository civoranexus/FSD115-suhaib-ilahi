import { Router } from "express";
import userController from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/authenticate.js";
import {validate} from "../middleware/validation.js";
import {
  updateProfileSchema,
  submitKYCSchema,
} from "../validators/userValidator.js";
import { USER_ROLES } from "../constants/enums.js";

const router = Router();

router.get("/profile", authenticate, userController.getProfile);
router.put(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  userController.updateProfile
);
router.post(
  "/kyc",
  authenticate,
  authorize([USER_ROLES.SELLER]),
  validate(submitKYCSchema),
  userController.submitKYC
);
router.get(
  "/list",
  authenticate,
  authorize([USER_ROLES.ADMIN]),
  userController.listUsers
);

export default router;
