import Order from "../Models/order.model.js";

// Create a new order (called when user confirms order)
export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you get user ID from auth middleware

    // --- Make sure to extract totalQty and totalPrice from req.body ---
    const { items, address, totalQty, totalPrice } = req.body;

    // Basic validation (optional here, Mongoose does it too)
    if (!items || items.length === 0 || !address || totalQty === undefined || totalPrice === undefined) {
       return res.status(400).json({ success: false, message: "Missing required order data." });
    }


    const newOrder = new Order({
      userId,
      items,
      address,
      totalQty,    // <-- Include it here
      totalPrice,  // <-- Include it here
      // status defaults to 'Pending' based on your model
    });

    const savedOrder = await newOrder.save();

    // Optionally: Clear the user's cart after successful order creation
    // await Cart.findOneAndDelete({ userId });

    res.status(201).json({ success: true, message: "Order created successfully", order: savedOrder });

  } catch (error) {
    console.error("Error creating order:", error); // Log the full error on the server
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message // Send specific error message
    });
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
