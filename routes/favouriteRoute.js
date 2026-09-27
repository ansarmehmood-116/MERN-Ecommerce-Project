import express from "express";

import {
  addFavouriteController,
  removeFavouriteController,
  getFavouriteController,
} from "../controllers/favouriteController.js";

import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET USER FAVOURITES
router.get(
  "/favourites",
  requireSignIn,
  getFavouriteController
);

// ADD FAVOURITE
router.post(
  "/favourites/:productId",
  requireSignIn,
  addFavouriteController
);

// REMOVE FAVOURITE
router.delete(
  "/favourites/:productId",
  requireSignIn,
  removeFavouriteController
);

export default router;

