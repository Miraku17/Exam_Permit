// models/payment.model.ts
import mongoose, { Schema, model, Model } from "mongoose";
import { IPayment } from "./types";

const paymentSchema = new Schema<IPayment>(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    emailAddress: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return /\S+@\S+\.\S+/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    referenceNumber: {
      type: String,
      required: [true, "Reference number is required"],
      unique: true,
      trim: true,
    },
    paymentGateway: {
      type: String,
      enum: ["GCash"],
      required: [true, "Payment gateway is required"],
    },
    amount: { type: Number, required: true },
    proofOfPaymentUrl: {
      type: String,
      required: [true, "Proof of payment URL is required"],
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Initialize model if it doesn't exist, otherwise return existing model
const Payment =
  (mongoose.models.Payment as Model<IPayment>) ||
  model<IPayment>("Payment", paymentSchema);

export default Payment;
