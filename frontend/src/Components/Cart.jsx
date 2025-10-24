import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, decreaseQty, addToCart, removeFromCart, clearCart } = useContext(AppContext);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let qty = 0;
    let price = 0;

    if (cart?.items) {
      for (let i = 0; i < cart.items.length; i++) {
        qty += cart.items[i].qty;
        price += cart.items[i].price;
      }
    }

    setQty(qty);
    setPrice(price);
  }, [cart]);

  return (
    <>
      {/* 🟡 Check if cart is empty using ternary operator */}

      {cart?.items?.length < 1 ? (

        <div className="text-center my-5">
          <p>Your cart is empty !</p>
          <button
            className="btn btn-primary mt-4"
            style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          {/* Total Items & Amount */}
          <div className="my-5 text-center">
            <button
              className="btn btn-info mx-3"
              style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
            >
              Total Items : {qty}
            </button>

            <button
              className="btn btn-warning mx-3"
              style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
            >
              Total Amount : ₹ {price}
            </button>
          </div>

          {/* Items : Add, Dec, Remove */}
          {cart.items.map((product) => (
            <div key={product._id} className="container p-3 bg-dark my-5 text-center">
              <div className="cart_img">
                <img
                  src={product.imgSrc}
                  style={{ width: '100px', height: '100px', borderRadius: '10px' }}
                  alt={product.title}
                />
              </div>

              <div className="cart_desc">
                <h2>{product.title}</h2>
                <h3>{product.price}</h3>
                <h3>Quantity : {product.qty}</h3>
              </div>

              <div className="cart_action">
                <button
                  className="btn btn-warning mx-3"
                  style={{ fontWeight: 'bold' }}
                  onClick={() =>
                    addToCart(
                      product?.productId,
                      product.title,
                      product.price / product.qty,
                      1,
                      product.imgSrc
                    )
                  }
                >
                  <span className="material-symbols-outlined">add_2</span>
                </button>

                <button
                  className="btn btn-info mx-3"
                  style={{ fontWeight: 'bold' }}
                  onClick={() => decreaseQty(product?.productId, 1)}
                >
                  <span className="material-symbols-outlined">remove</span>
                </button>

                <button
                  className="btn btn-danger mx-3"
                  style={{ fontWeight: 'bold' }}
                  onClick={() => {
                    if (confirm('Are you sure you want to remove from cart?')) {
                      removeFromCart(product?.productId);
                    }
                  }}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart and Check Out */}
          <div className="container text-center my-5">
            <button
              className="btn btn-danger mx-3 my-2"
              style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
              onClick={() => {
                if (confirm(`Are you sure you want to clear the cart?`)) clearCart();
              }}
            >
              Clear Cart
            </button>

            <button
              className="btn btn-warning mx-3"
              style={{ fontWeight: 'bold', fontSize: '1.2rem' }}
              onClick={() => navigate('/shipping')}
            >
              Check Out
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default Cart;
