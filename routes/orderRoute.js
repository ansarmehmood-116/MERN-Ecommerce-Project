import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  // deleteOrderController,
  getOrdersController,
  getAllOrdersController,
  orderStatusController,
  correctOrderStatusController,
  getSingleOrderController,
  getUserSingleOrderController,
  getUserDashboardStatsController
} from "../controllers/orderController.js";

const router = express.Router();

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController,
);

//___order delete___
// router.delete("/delete-order/:oid",requireSignIn,isAdmin,deleteOrderController)
//Transaction History Route

// Correct Order Status Route
router.put(
  "/correct-order-status/:orderId",
  requireSignIn,
  isAdmin,
  correctOrderStatusController,
);

//Every single order invoice route for admin
router.get(
  "/singleOrder/:orderId",
  requireSignIn,
  isAdmin,
  getSingleOrderController,
);

// User ke liye separate route for buyer order invoice:
router.get(
  "/Buyer/OrderInvoice/:orderId",
  requireSignIn,
  getUserSingleOrderController
);

router.get(
  "/dashboard-stats",
  requireSignIn,
  getUserDashboardStatsController
);
export default router;
