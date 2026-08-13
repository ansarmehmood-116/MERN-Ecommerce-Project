import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import JWT from "jsonwebtoken";

//REGISTER controller
export const registerController = async (req, resp) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //validation
    if (!name) {
      return resp.send({ message: "Name Is Required" });
    }
    if (!email) {
      return resp.send({ message: "Email Is Required" });
    }
    if (!password) {
      return resp.send({ message: "Password Is Required" });
    }
    if (!phone) {
      return resp.send({ message: "Phone Is Required" });
    }
    if (!address) {
      return resp.send({ message: "Address Is Required" });
    }
    if (!answer) {
      return resp.send({ message: "Answer Is Required" });
    }
    //check user on eamil base if exist
    const existingUser = await userModel.findOne({ email });

    //if existing
    if (existingUser) {
      return resp.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }

    //Register User and hashpassword
    const hashedPassword = await hashPassword(password);

    //save
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    resp.status(201).send({
      success: true,
      message: "user registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};
//_____________________________________________________________________________

//POST LOGIN
export const loginController = async (req, resp) => {
  try {
    const { email, password } = req.body;
    //validate
    if (!email || !password) {
      return resp.status(404).send({
        success: true,
        message: "Invalid email or password",
      });
    }

    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      //here we are using return because it never allow the code to execute after return so
      //if details are wrong then the code will not proceed further.
      return resp.status(404).send({
        succes: false,
        message: "Email is not regisered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return resp.status(200).send({
        succes: false,
        message: "invalid password",
      });
    }

    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    resp.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};
//_____________________________________________________________________

//forgotPasswordController
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};
//_____________________________________________________________________

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};
//_____________________________________________________________________

//update prfole
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id); //user id will exists in req
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name, //it means update the name other wise || use exsiting one
        //if not selected same for below all
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//user orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//All orders //for Admin
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 }); //it will show all latest orders
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

// delete order controller for admin
export const deleteOrderController = async (req, res) => {
  try {
    // Delete the order directly without storing it in a variable
    await orderModel.findByIdAndDelete(req.params.oid);
    res.status(200).send({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting order",
      error,
    });
  }
};

// @desc    Get all users
// @route   GET /api/v1/admin/users
// @access  Admin
export const getAllUsers = async (req, res) => {
  try {
    // for all-users include admin & users
    // const users = await userModel.find().select('-password');

    // Fetch only users with role 0 (i.e., regular users)
    // const users = await userModel.find({ role: 0 }).select("-password");

    // Fetch users with role other than 1 (i.e., exclude admins)
    const users = await userModel
      .find({ role: { $ne: 1 } })
      .select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};

// @desc    Delete a user
// @route   DELETE /api/v1/admin/user/:id
// @access  Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete user" });
  }
};

export const getAllAdmins = async (req, res) => {
  try {
    // for all-users include admin & users
    // const users = await userModel.find().select('-password');

    // Fetch users with role other than 1 (i.e., exclude admins)
    const users = await userModel
      .find({ role:1 })
      .select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
};