import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../../Context/AppContext";


const RelatedProduct = ({ category }) => {
  const { products } = useContext(AppContext);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (products && category) {
      setRelatedProducts(
        products.filter(
          (item) =>
            item?.category?.toLowerCase() === category?.toLowerCase()
        )
      );
    }
  }, [category, products]);

  return (
    <div className="container text-center my-5">
      <h2 className="fw-bold mb-4">Related Products</h2>

      <div className="row justify-content-center">
        {relatedProducts?.map((product) => (
          <div
            key={product._id}
            className="col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center"
          >
            <div
              className="card bg-dark text-light text-center shadow-sm"
              style={{ width: "18rem" }}
            >
              <Link
                to={`/product/${product._id}`}
                className="d-flex justify-content-center align-items-center p-3"
              >
                <img
                  src={product.imgSrc}
                  className="card-img-top"
                  alt={product.title}
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "10px",
                    border: "2px solid yellow",
                    objectFit: "cover",
                  }}
                />
              </Link>

              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <div className="my-3">
                  <button className="btn btn-primary mx-2 my-2">
                    ₹ {product.price}
                  </button>
                  <button className="btn btn-warning text-dark">
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {relatedProducts.length === 0 && (
          <p className="text-secondary mt-4">No related products found.</p>
        )}
      </div>
    </div>
  );
};

export default RelatedProduct;
