import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import {
  // brainTreePaymentController,
  // braintreeTokenController,
  // reducedQuantityController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFiltersController,
  productListController,
  productPhotoController,
  realtedProductController,
  searchProductController,
  updateProductController,
  getOutOfStockProductsController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
//for photo we have to install 'express-formidable' package so it will store in database
//it is used as a data parser separates the photo and other data fields in the object request
//other wise to add directly it will get the photo as a string.And we have to use 'fs module'
//with it also so that is come with node by default we don't need to install it.

const router = express.Router();

//routes
//create-product route
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController,
);

//update product route
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController,
);
//___________________________________________________________

//get all products for admin page only
router.get("/get-product", getProductController,requireSignIn,isAdmin);
//___________________________________________________________

//get single product for productDetails page
router.get("/get-productDetails/:slug", getSingleProductController);
//___________________________________________________________

//get photo
router.get("/product-photo/:pid", productPhotoController);
//___________________________________________________________

//delete product
router.delete("/delete-product/:pid", deleteProductController);
//___________________________________________________________

//filter product
router.post("/product-filters", productFiltersController);
//___________________________________________________________

//product count
router.get("/product-count", productCountController);
//___________________________________________________________

//it is for pagination because showing all products at a time will increase load on our API so we can use server side for pagination that has "Load More" button so we can view more products when we need for pagination we also can use client side search on google and you will get code.But using server API will get faster response.Question: why we add pagination in web?:-Ans:- because to distribute load if we show all products in one page then it increase load on API
//product per page
router.get("/product-list/:page", productListController);
//this will give no of products per page for pagination
//___________________________________________________________

//search product
router.get("/search/:keyword", searchProductController);
//___________________________________________________________

//similar product
router.get("/related-product/:pid/:cid", realtedProductController);
//___________________________________________________________

//category wise product
router.get("/product-category/:slug", productCategoryController);
//___________________________________________________________

router.get(
  "/out-of-stock",
  getOutOfStockProductsController
);
//___________________________________________________________

//payments routes
//token  //this token will come from braintree website to varify the account we are using
// router.get("/braintree/token", braintreeTokenController);
//___________________________________________________________

//payments
// router.post("/braintree/payment", requireSignIn, brainTreePaymentController);
//___________________________________________________________

//reduced quantity___//it is already handled in brainTreePaymentController____
// router.post("/reduce-quantity", reducedQuantityController);
//___________________________________________________________

export default router;
