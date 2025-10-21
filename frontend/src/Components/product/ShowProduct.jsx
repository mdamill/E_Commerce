import React, { useContext } from 'react';
import AppContext from '../../Context/AppContext';
import { Link } from 'react-router-dom';

function ShowProduct() {
  const { filteredData, addToCart } = useContext(AppContext);

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        {filteredData && filteredData.length > 0 ? (
          filteredData.map((product) => (
            <div
              key={product._id}
              className="col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center"
            >
              <div
                className="card bg-dark text-light text-center shadow-sm"
                style={{ width: '18rem' }}
              >
                <Link to={`/product/${product._id}`} className="p-3">
                  <img
                    src={product.imgSrc}
                    className="card-img-top"
                    alt={product.title}
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '10px',
                      border: '2px solid grey',
                      objectFit: 'cover',
                    }}
                  />
                </Link>
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <div className="my-3">
                    <button className="btn btn-primary mx-3 my-2">
                      {"₹ "}{product.price}
                    </button>
                    <button 
                    className="btn btn-warning"
                    onClick={() => {
                      addToCart(
                        product._id,
                        product.title,
                        product.price,
                        1,
                        product.imgSrc
                      )
                    }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h4 className="text-center text-muted">No products found</h4>
        )}
      </div>
    </div>
  );
}

export default ShowProduct;
