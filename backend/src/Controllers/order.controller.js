import Order from "../Models/order.model.js";

// Create a new order (called when user confirms order)
export const createOrder = async (req, res) => {
  try {
    const { userId, items, address, totalQty, totalPrice } = req.body;

    if (!items || !items.length || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({
      userId,
      items,
      address,
      totalQty,
      totalPrice,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch all orders (for admin panel)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "name email");
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch orders for a specific user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
