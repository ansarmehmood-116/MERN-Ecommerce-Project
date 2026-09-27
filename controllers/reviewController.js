import mongoose from "mongoose";//this schema tag is only imported to handle average review manually instead of depending on model internals i.e in add review function product: new mongoose.Types.ObjectId(productId),

import reviewModel from "../models/reviewModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// =====================================================
// UPDATE PRODUCT RATING
// =====================================================

const updateProductRating = async (productId) => {
  const stats = await reviewModel.aggregate([
    {
      $match: {
        product: productId,
      },
    },

    {
      $group: {
        _id: "$product",
        averageRating: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ]);

  if (stats.length === 0) {
    await productModel.findByIdAndUpdate(productId, {
      averageRating: 0,
      reviewCount: 0,
    });

    return;
  }

  await productModel.findByIdAndUpdate(productId, {
    averageRating: Number(stats[0].averageRating.toFixed(1)),
    reviewCount: stats[0].reviewCount,
  });
};

// =====================================================
// ADD REVIEW
// =====================================================
export const addReviewController = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    // -----------------------------------------------
    // Validate rating
    // -----------------------------------------------
    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    // -----------------------------------------------
    // Validate comment
    // -----------------------------------------------
    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Review must contain at least 3 characters.",
      });
    }

    // -----------------------------------------------
    // Check product
    // -----------------------------------------------
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // -----------------------------------------------
    // Check whether user purchased this product
    // -----------------------------------------------
    const purchasedOrder = await orderModel.findOne({
      buyer: req.user._id,
      "products.product": productId,
      "payment.success": true,
      status: {
        $ne: "cancel",
      },
    });

    if (!purchasedOrder) {
      return res.status(403).json({
        success: false,
        message: "You can review products only you have purchased.",
      });
    }

    // -----------------------------------------------
    // Check existing review
    // -----------------------------------------------

    const existingReview = await reviewModel.findOne({
      product: productId,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    // -----------------------------------------------
    // Create review
    // -----------------------------------------------

    const review = await reviewModel.create({
      product: productId,
      user: req.user._id,
      rating: numericRating,
      comment: comment.trim(),
    });

    // -----------------------------------------------
    // Update product rating
    // -----------------------------------------------

    await updateProductRating(product._id);

    // -----------------------------------------------
    // Populate user
    // -----------------------------------------------

    await review.populate("user", "name");

    res.status(201).json({
      success: true,
      message: "Review added successfully.",
      review,
    });
  } catch (error) {
    console.error("ADD REVIEW ERROR:", error);

    // Duplicate index protection
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error while adding review.",
      error: error.message,
    });
  }
};

// =====================================================
// GET PRODUCT REVIEWS
// =====================================================
export const getProductReviewsController = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel
      .find({
        product: productId,
      })
      .populate("user", "name")
      .sort({
        createdAt: -1,
      });
    const stats = await reviewModel.aggregate([
      {
        $match: {
        // this was handling from review model
        // product: new reviewModel.base.Types.ObjectId(productId),

        //for this we have imported mongoose in this page and handlin here
         product: new mongoose.Types.ObjectId(productId),

        //In dono mein simple farq yeh hai ke doosra tareeqa direct Mongoose library se ObjectId banata hai, jabke pehla ek specific model (reviewModel) ke zariye Mongoose ki base class tak pahunch kar ObjectId banata hai.

        //base kyun hai?
        //reviewModel.base model se judi hui Mongoose ki core class ko refer karta hai; is ki zaroorat tab parti hai jab multiple database connections chal rahe hoon taake ObjectId sahi connection ke sath link ho sake.

        },
      },

      {
        $group: {
          _id: "$product",

          averageRating: {
            $avg: "$rating",
          },

          totalReviews: {
            $sum: 1,
          },
        },
      },
    ]);

    const averageRating =
      stats.length > 0
        ? Number(stats[0].averageRating.toFixed(1))
        : 0;

    const totalReviews =
      stats.length > 0
        ? stats[0].totalReviews
        : 0;

    res.status(200).json({
      success: true,
      reviews,
      averageRating,
      totalReviews,
    });
  } catch (error) {
    console.error("GET REVIEWS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while fetching reviews.",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE REVIEW
// =====================================================

export const deleteReviewController = async (req, res) => {
  try {
    const { reviewId } = req.params;

    // -----------------------------------------------
    // Find review
    // -----------------------------------------------

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // -----------------------------------------------
    // Get current logged-in user from database
    // -----------------------------------------------

    const currentUser = await userModel
      .findById(req.user._id)
      .select("_id role");

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // -----------------------------------------------
    // Owner check
    // -----------------------------------------------

    const isOwner =
      review.user.toString() ===
      currentUser._id.toString();

    // -----------------------------------------------
    // Admin check
    // -----------------------------------------------

    const isAdmin =
      Number(currentUser.role) === 1;

    // -----------------------------------------------
    // Authorization
    // -----------------------------------------------

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete this review.",
      });
    }

    // -----------------------------------------------
    // Store product ID before deleting review
    // -----------------------------------------------

    const productId = review.product;

    // -----------------------------------------------
    // Delete review
    // -----------------------------------------------

    await reviewModel.findByIdAndDelete(reviewId);

    // -----------------------------------------------
    // Recalculate product rating
    // -----------------------------------------------

    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE REVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Error while deleting review.",
      error: error.message,
    });
  }
};