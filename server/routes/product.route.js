import Router from "express";
import * as controller from "../controllers/product.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router();

/* Seller */
router.post(
  "/",
  authenticate,
  authorize("SELLER"),
  controller.createProduct
);

router.put(
  "/:id",
  authenticate,
  authorize("SELLER"),
  controller.updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorize("SELLER"),
  controller.deleteProduct
);

router.get(
  "/my",
  authenticate,
  authorize("SELLER"),
  controller.getMyProducts
);

/* Public */
router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);

/* Admin */
router.put(
  "/admin/:id/disable",
  authenticate,
  authorize("ADMIN"),
  controller.disableProduct
);

export default router;
