import React, { useContext } from "react";
import AppContext from "../Context/AppContext";

const TableProduct = ({ cart }) => {

  const { decreaseQty, addToCart, removeFromCart } = useContext(AppContext);

  return (
    <table className="table table-bordered bg-dark text-light text-center">

      <thead>
        <tr>
          <th>Img</th>
          <th>Title</th>
          <th>Price</th>
          <th>Qty</th>
          <th>+</th>
          <th>-</th>
          <th>Remove</th>
        </tr>
      </thead>
      
      <tbody>
        {cart?.items?.map((item) => (
          <tr key={item._id}>
            <td>
              <img src={item.imgSrc} width="50" height="50" alt={item.title} />
            </td>
            <td>{item.title}</td>
            <td>₹ {item.price}</td>
            <td>{item.qty}</td>
            <td>
              <button onClick={() => addToCart(item.productId, item.title, item.price/item.qty, 1, item.imgSrc)}>+</button>
            </td>
            <td>
              <button onClick={() => decreaseQty(item.productId, 1)}>-</button>
            </td>
            <td>
              <button onClick={() => removeFromCart(item.productId)}>x</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableProduct;
