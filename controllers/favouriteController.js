import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";

// ADD PRODUCT TO FAVOURITES
export const addFavouriteController = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyFavourite = user.favourites?.some(
      (id) => id.toString() === productId
    );

    if (alreadyFavourite) {
      return res.status(400).json({
        success: false,
        message: "Product is already in favourites",
      });
    }

    user.favourites.push(productId);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to favourites",
      favourites: user.favourites,
    });
  } catch (error) {
    console.log("ADD FAVOURITE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while adding favourite",
      error: error.message,
    });
  }
};

// REMOVE PRODUCT FROM FAVOURITES
export const removeFavouriteController = async (req, res) => {
  try {
    const { productId } = req.params;

    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.favourites = user.favourites.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Product removed from favourites",
      favourites: user.favourites,
    });
  } catch (error) {
    console.log("REMOVE FAVOURITE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while removing favourite",
      error: error.message,
    });
  }
};

// GET USER FAVOURITES
export const getFavouriteController = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("favourites", "-photo");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Favourites fetched successfully",
      favourites: user.favourites || [],
    });
  } catch (error) {
    console.log("GET FAVOURITES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while fetching favourites",
      error: error.message,
    });
  }
};

