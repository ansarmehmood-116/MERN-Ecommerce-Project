import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
    carouselPhotoController,
  createCarouselController,
  deleteCarouselController,
  getCarouselController,
  updateCarouselController,
} from "../controllers/carouselController.js";

import formidable from "express-formidable";
const router = express.Router();


router.post(
  "/create-carousel",
  requireSignIn,
  formidable(),
  isAdmin,
  createCarouselController
);
router.put(
  "/update-carousel/:Cid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateCarouselController
);
router.get("/get-carousel",getCarouselController);
router.get("/carousel-photo/:Cid",carouselPhotoController);
router.delete(
  "/delete-carousel/:carouselId",
  requireSignIn,
  isAdmin,
  deleteCarouselController
);

export default router;
