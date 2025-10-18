// server/controllers/salesController.js
import Product from "../models/Product.js";
import Order from "../../../models/order.js";
import Payment from "../../../models/payment.js";

// List all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ productId, quantity }]
    const populatedItems = [];

    let total = 0;

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      const price = product.unitPrice * item.quantity;
      total += price;

      populatedItems.push({ product: product._id, quantity: item.quantity, price });
    }

    const order = new Order({ items: populatedItems, total });
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create payment record
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, paymentMethod } = req.body;
    const payment = new Payment({ orderId, amount, paymentMethod });
    await payment.save();
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders with optional date filters
export const getOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    const orders = await Order.find(query).populate("items.product");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order (add/remove items)
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { items } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    let total = 0;
    const updatedItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      const price = product.unitPrice * item.quantity;
      total += price;
      updatedItems.push({ product: product._id, quantity: item.quantity, price });
    }

    order.items = updatedItems;
    order.total = total;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete order
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.findByIdAndDelete(orderId);
    await Payment.deleteMany({ orderId });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
