## 🏗️ Backend Implementation

### 📍 1. Create Order Schema

**File:** `/Models/order.model.js`

```js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    address: {
      fullName: String,
      phoneNumber: String,
      country: String,
      state: String,
      pincode: String,
      address: String,
    },
    totalQty: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
```

### 📍 2. Create Controller Functions

**File:** `/Controllers/order.controller.js`

```js
import Order from "../Models/order.model.js";

// Create a new order
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

// Get all orders (for admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "username email");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get orders by specific user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
```

### 📍 3. Create Order Routes

**File:** `/Routes/order.routes.js`

```js
import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
} from "../Controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/user/:userId", getUserOrders);

export default router;
```

### 📍 4. Integrate Order Routes into server.js

In your existing **server.js**, import and use the route:

```js
import orderRouter from './Routes/order.routes.js';

// ...
app.use('/api/order', orderRouter);
```

✅ Now the backend can:

Save new orders: POST /api/order

Fetch all orders: GET /api/order

Fetch user-specific orders: GET /api/order/user/:userId

## 💻 Frontend Implementation

### 📍 1. Extend Context API (`AppState.jsx`)

Add a new function inside **AppState** to confirm orders and send data to the backend.

**Code to insert before `return`:**

```js
// confirm order
const confirmOrder = async (cart, userAddress, user) => {
  try {
    if (!cart?.items?.length) {
      toast.error("Your cart is empty!", {
        position: "top-right",
        autoClose: 1500,
        theme: "dark",
      });
      return null;
    }

    const orderData = {
      userId: user?._id,
      items: cart.items.map(item => ({
        productId: item.productId,
        name: item.title,
        qty: item.qty,
        price: item.price,
      })),
      address: userAddress,
      totalQty: cart.items.reduce((acc, item) => acc + item.qty, 0),
      totalPrice: cart.items.reduce((acc, item) => acc + item.price, 0),
    };

    const api = await axios.post(`${url}/order`, orderData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      withCredentials: true,
    });

    toast.success("Order Confirmed Successfully!", {
      position: "top-right",
      autoClose: 1500,
      theme: "dark",
    });

    return api.data.order;
  } catch (err) {
    console.error("Error confirming order:", err);
    toast.error("Failed to confirm order", {
      position: "top-right",
      autoClose: 1500,
      theme: "dark",
    });
    return null;
  }
};
```

### 📍 2. Update Checkout Component

**File:** `/components/Checkout.jsx`

```jsx
import React, { useContext, useEffect, useState } from "react";
import TableProduct from "./TableProduct";
import { useNavigate } from "react-router-dom";
import AppContext from "../Context/AppContext";

const Checkout = () => {
  const { cart, userAddress, clearCart, confirmOrder, user } = useContext(AppContext);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let totalQty = 0;
    let totalPrice = 0;

    if (cart?.items) {
      for (let i = 0; i < cart.items.length; i++) {
        totalQty += cart.items[i].qty;
        totalPrice += cart.items[i].price;
      }
    }

    setQty(totalQty);
    setPrice(totalPrice);
  }, [cart]);

  const handleConfirmOrder = async () => {
    const order = await confirmOrder(cart, userAddress, user);
    if (order) {
      await clearCart();
      navigate("/order-confirmation", { state: { order } });
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center fw-bold mb-4">Order Summary</h2>

      <div className="table-responsive">
        <table className="table table-bordered border-primary bg-dark text-light align-middle">
          <thead>
            <tr>
              <th className="text-center bg-dark text-light">Product Details</th>
              <th className="text-center bg-dark text-light">Shipping Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><TableProduct cart={cart} /></td>
              <td>
                {userAddress ? (
                  <ul className="list-unstyled" style={{ fontWeight: "bold" }}>
                    <li>Name : {userAddress.fullName}</li>
                    <li>Phone : {userAddress.phoneNumber}</li>
                    <li>Country : {userAddress.country}</li>
                    <li>State : {userAddress.state}</li>
                    <li>PinCode : {userAddress.pincode}</li>
                    <li>Address : {userAddress.address}</li>
                  </ul>
                ) : (
                  <p className="text-warning">No shipping address found</p>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-center my-4 d-flex flex-column flex-sm-row justify-content-center gap-3">
        <button className="btn btn-outline-light" onClick={() => navigate("/cart")}>
          🛒 Back to Cart
        </button>

        <button className="btn btn-success" onClick={handleConfirmOrder}>
          Confirm Order
        </button>

        <button className="btn btn-outline-danger" onClick={() => {
          if (window.confirm("Are you sure you want to clear the cart?")) clearCart();
        }}>
          🗑 Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Checkout;
```

### 📍 3. Create the Order Confirmation Component

**File:** `/components/OrderConfirmation.jsx`

```jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  return (
    <div className="container text-center my-5">
      <h2 className="text-success fw-bold mb-4">✅ Order Confirmed!</h2>

      {order ? (
        <div className="bg-dark text-light p-4 rounded shadow-lg">
          <h4>Thank you for your purchase!</h4>
          <hr />
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Total Quantity:</strong> {order.totalQty}</p>
          <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
        </div>
      ) : (
        <p>No order details found.</p>
      )}

      <button
        className="btn btn-primary mt-4"
        onClick={() => navigate("/")}
      >
        🛍 Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;
```

### 📍 4. Add Route in `App.js`

**File:** `/App.js`

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Checkout from "./components/Checkout";
import OrderConfirmation from "./components/OrderConfirmation";
// ...other imports

function App() {
  return (
    <Router>
      <Routes>
        {/* other routes */}
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
```

## ✅ FLOW SUMMARY

1. User clicks **“Confirm Order”** on the Checkout page.  
2. Frontend sends a **POST** request to `/api/order` with all order details.  
3. Backend saves the order into **MongoDB** (`orders` collection).  
4. Toast message shows **“Order Confirmed Successfully”**.  
5. Cart is cleared via `clearCart()` function.  
6. User is redirected to `/order-confirmation`.  
7. The confirmation page displays all order details + **“Continue Shopping”** button.
