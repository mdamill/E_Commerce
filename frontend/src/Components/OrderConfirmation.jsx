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
