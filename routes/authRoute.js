import express from "express";
import {
  deleteOrderController,
  deleteUser,
  forgotPasswordController,
  getAllAdmins,
  getAllOrdersController,
  getAllUsers,
  getOrdersController,
  loginController,
  orderStatusController,
  registerController,
  testController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
//for importing function again here we used {}

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//FORGOT PASSWORD || POST
//here we donot need to pass middleware
router.post('/forgot-password',forgotPasswordController)

//TEST router
//MiddleWare "requireSignIn" added to protect the site.
//now if we test this on postman as "localhost:8080/api/v1/auth/test" it will be loading
//but not processing because it will gives JWT error in console that it must be provided.
//so in postman we will then goto headers-->Authorization-->paste token key then send API now it will work.
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth for user
//note, here we have passed callback function directly we also could create this function
//in controller and passed that here like requireSignIn but this is easy we can do it in
//both ways.
router.get('/user-auth',requireSignIn,(req,resp)=>{
  resp.status(200).send({ok:true});
  //{ok:true} if the requirements are true means ok they are filled then move next
});

//Protected route for admin
router.get('/admin-auth',requireSignIn,isAdmin,(req,resp)=>{
  resp.status(200).send({ok:true});
  //{ok:true} if the requirements are true means ok they are filled then move next
});

//update profile
router.put("/profile", requireSignIn, updateProfileController);

//orders
router.get("/orders", requireSignIn, getOrdersController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

//order delete
router.delete("/delete-order/:oid",requireSignIn,isAdmin,deleteOrderController)
export default router;

// Route to get all users (Admin only)
router.get('/users', requireSignIn,isAdmin, getAllUsers);

// Route to delete a user (Admin only)
router.delete('/user/:id', requireSignIn,isAdmin, deleteUser);

// Route to get all admins (Admin only)
router.get('/admins', requireSignIn,isAdmin, getAllAdmins);