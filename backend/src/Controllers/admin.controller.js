import { Product } from "../Models/product.model.js";
import { User } from "../Models/user.model.js";
import Order from "../Models/order.model.js";

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, imgSrc } = req.body;

    if (!title || !price || !stock) {
      return res.status(400).json({ message: "Title, price and stock are required" });
    }

    const product = new Product({
      title,
      description,
      price,
      stock,
      category,
      imgSrc,
    });

    await product.save();
    res.status(201).json({ message: "Product added successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body; // { title, price, stock, status, ... }

    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body; // "admin" or "user"

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'user' or 'admin'" });
    }

    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    // We populate 'userId' to get user details (like email) associated with the order
    const orders = await Order.find().populate("userId", "username email");

    if (!orders) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json({ message: "Orders fetched successfully", orders });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    // Validate the status
    const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"]; // <-- Based on your model
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};