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
              <td>
                <TableProduct cart={cart} />
              </td>
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

      <div className="d-md-none text-center my-3">
        <p className="fw-bold mb-1">Total Quantity: {qty}</p>
        <p className="fw-bold text-warning">Total Price: ₹{price}</p>
      </div>

      <div className="container text-center my-4 d-flex flex-column flex-sm-row justify-content-center gap-3">
        <button
          className="btn btn-outline-light w-100 w-sm-auto"
          onClick={() => navigate("/cart")}
        >
          🛒 Back to Cart
        </button>

        <button
          className="btn btn-success w-100 w-sm-auto"
          onClick={handleConfirmOrder}
        >
          Confirm Order
        </button>

        <button
          className="btn btn-outline-danger w-100 w-sm-auto"
          onClick={() => {
            if (window.confirm("Are you sure you want to clear the cart?")) {
              clearCart();
            }
          }}
        >
          🗑 Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Checkout;
