import mongoose from "mongoose";

const paymentAttemptSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
      default: null,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    success: {
      type: Boolean,
      required: true,
      index: true,
    },

    transactionId: {
      type: String,
      default: null,
    },

    message: {
      type: String,
      default: null,
    },

    paymentGateway: {
      type: String,
      default: "braintree",
    },
  },
  {
    timestamps: true,
  },
);

paymentAttemptSchema.index({
  createdAt: -1,
});
//Querries Optimization
paymentAttemptSchema.index({ createdAt: -1 });
paymentAttemptSchema.index({ success: 1, createdAt: -1 });
export default mongoose.model("PaymentAttempt", paymentAttemptSchema);
