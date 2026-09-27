import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },

    ip: {
      type: String,
      default: null,
    },

    user: {
      type: mongoose.ObjectId,
      ref: "users",
      default: null,
      index: true,
    },

    userAgent: {
      type: String,
      default: null,
    },

    path: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
visitSchema.index({ createdAt: -1 });
visitSchema.index({ createdAt: -1 });

export default mongoose.model("Visit", visitSchema);