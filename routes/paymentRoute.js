import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  brainTreePaymentController,
  braintreeTokenController,
  getTransactionHistoryController,
  // reducedQuantityController,
} from "../controllers/paymentController.js";

const router = express.Router();

//payments routes
//token  //this token will come from braintree website to varify the account we are using
router.get("/braintree/token", braintreeTokenController);
//___________________________________________________________

//payments
router.post("/braintree/payment", requireSignIn, brainTreePaymentController);
//___________________________________________________________

//reduced quantity___//it is already handled in brainTreePaymentController____
// router.post("/reduce-quantity", reducedQuantityController);
//___________________________________________________________

router.get(
  "/transaction-history",
  requireSignIn,
  isAdmin,
  getTransactionHistoryController,
);
export default router;
