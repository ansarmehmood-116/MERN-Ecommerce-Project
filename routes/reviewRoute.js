import express from "express";

import {
  addReviewController,
  getProductReviewsController,
  deleteReviewController,
} from "../controllers/reviewController.js";

import {
  isAdmin,
  requireSignIn,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get all reviews of a product
router.get(
  "/product/:productId",
  getProductReviewsController
);

// Add review
router.post(
  "/product/:productId",
  requireSignIn,
  addReviewController
);

// Delete own review / admin review
router.delete(
  "/:reviewId",
  requireSignIn,
  deleteReviewController
);

export default router;