import { Product } from "../Models/product.model.js";
import { User } from "../Models/user.model.js";
import Order from "../Models/order.model.js";

// Inside admin.controller.js
export const addProduct = async (req, res) => {
  try {
    // --- CHANGE THIS LINE ---
    // Change 'stock' to 'qty' here to match your model and frontend
    const { title, description, price, qty, category, imgSrc } = req.body;

    // --- CHANGE THIS VALIDATION ---
    // Update validation to check for 'qty' and 'imgSrc'
    if (!title || !price || !qty || !imgSrc) {
      return res.status(400).json({ message: "Title, price, qty, and imgSrc are required" });
    }
     // Optional: Add more specific validation for types if needed
    if (typeof price !== 'number' || price < 0 || typeof qty !== 'number' || qty < 0) {
       return res.status(400).json({ message: "Price and qty must be non-negative numbers." });
    }

    const product = new Product({
      title,
      description,
      price,
      qty, // --- USE qty HERE ---
      category,
      imgSrc,
    });

    await product.save();
    // It's good practice to send a consistent success response
    res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (err) {
    console.error("Error adding product:", err); // Log the full error on the server
    let errorMessage = "Server error while adding product";
    let statusCode = 500;
    if (err.name === 'ValidationError') {
        statusCode = 400; // Validation errors are client errors
        errorMessage = "Product validation failed: " + Object.values(err.errors).map(e => e.message).join(', ');
    }
    // Send consistent error response
    res.status(statusCode).json({ success: false, message: errorMessage, error: err.message });
  }
};

// Also double-check updateProduct if needed
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    // Ensure updates object uses 'qty' if frontend sends it
    const updates = req.body; // { title, description, price, qty, category, imgSrc }

     // You might want validation here too
     if (updates.price !== undefined && (typeof updates.price !== 'number' || updates.price < 0)) {
       return res.status(400).json({ message: "Price must be a non-negative number." });
     }
     if (updates.qty !== undefined && (typeof updates.qty !== 'number' || updates.qty < 0)) {
       return res.status(400).json({ message: "Qty must be a non-negative number." });
     }


    // Mongoose should handle if 'qty' exists in updates and update it correctly
    const product = await Product.findByIdAndUpdate(productId, updates, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.status(200).json({ success: true, message: "Product updated successfully", product });
  } catch (err) {
     console.error(`Error updating product ${productId}:`, err);
     let errorMessage = "Server error while updating product";
     let statusCode = 500;
     if (err.name === 'ValidationError') {
        statusCode = 400;
        errorMessage = "Product validation failed: " + Object.values(err.errors).map(e => e.message).join(', ');
     }
    res.status(statusCode).json({ success: false, message: errorMessage, error: err.message });
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

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ message: "Users fetched successfully", users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};