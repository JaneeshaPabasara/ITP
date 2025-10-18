import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // unitPrice * quantity
});

const OrderSchema = new mongoose.Schema({
  items: [OrderItemSchema],
  total: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Hot-reload safe
const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
