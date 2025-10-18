import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["Cash", "Card"], default: "Cash" },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Prevent OverwriteModelError
const Payment = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);

export default Payment;
