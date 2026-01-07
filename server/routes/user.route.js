import express from "express";
import * as controller from "./user.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/role.middleware.js";

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/profile", authenticate, controller.getProfile);

router.get(
  "/admin/users",
  authenticate,
  authorize("ADMIN"),
  (req, res) => res.json({ message: "Admin access granted" })
);

export default router;
