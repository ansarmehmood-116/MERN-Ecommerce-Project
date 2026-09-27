import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.ObjectId,
      ref: "Products",
      required: true,
    },

    user: {
      type: mongoose.ObjectId,
      ref: "users",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
  }
);

// One user can review a product only once
reviewSchema.index(
  { product: 1, user: 1 },
  { unique: true }
);

// Faster product review loading
reviewSchema.index({
  product: 1,
  createdAt: -1,
});

export default mongoose.model("Review", reviewSchema);