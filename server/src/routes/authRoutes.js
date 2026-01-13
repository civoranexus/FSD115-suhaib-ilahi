import { Router } from "express";
import authController from "../controllers/authController.js";
import { validate }  from "../middleware/validation.js";

import {registerSchema, loginSchema, refreshTokenSchema, changePasswordSchema} from
 "../validators/authValidator.js";
import {authenticate} from
 "../middleware/authenticate.js";
import {authLimiter} from "../middleware/rateLimiter.js";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken
);
router.post(
  "/change-password",
  authenticate,
  validate(changePasswordSchema),
  authController.changePassword
);

export default router;
