import express from "express";

import {
  trackVisitController,
  getAnalyticsController,
} from "../controllers/analyticsController.js";

import {
  requireSignIn,
  isAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


/*
|--------------------------------------------------------------------------
| PUBLIC
|--------------------------------------------------------------------------
| Anyone can generate a visit.
|
*/

router.post(
  "/visit",
  trackVisitController
);


/*
|--------------------------------------------------------------------------
| ADMIN ONLY
|--------------------------------------------------------------------------
| Analytics data is private.
|
*/

router.get(
  "/",
  requireSignIn,
  isAdmin,
  getAnalyticsController
);


export default router;