import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//protected routes token base
export const requireSignIn = async (req, resp, next) => {
  //In this middleware we have use 3 parameters so we cannot move to next resp untill the "next" parameter is executed till we will be hanged in previous code so it is good for security
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
      //yahan dotenv.config() ko ham ne import nahi kia q k isko project ki main entry file (jaise server.js ya index.js) mai bilkul start mai load kiya jata hai. Ek baar wahan run hone ke baad poore project mai process.env.BRAINTREE_MERCHANT_ID jaise environment variables khud hi accessible ho jate hain, har controller file mai isko alag se import aur configure karne ki bilkul zaroorat nahi hoti
    );
    //as token are placed inside headers in authorization so we use req.headers not req.body here so it token will be decode from .env file where we have kept JWT_SECRET
    req.user=decode //as we pass the decode token to user here which has all user informations as we have encrypted above in decode and assign to the user containing Id and all info's, now it will use in below function as parameter i.e,findById(req.user._id) to match the info's in database which is provide. 
    next();
  } catch (error) {
    console.log(error);
    resp.status(401).send({
      success:false,
      error,
      message:'Error in Admin Middlewares'
    });
  }
};

//admin access
export const isAdmin = async (req, resp, next) => {
  try {
    const user = await userModel.findById(req.user._id);
      if (user.role !== 1) {
        //for admin
      return resp.status(403).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
