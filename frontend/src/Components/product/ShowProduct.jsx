import React, { useContext } from 'react'
import AppContext from '../../Context/AppContext'

function ShowProduct() {

  const { products } = useContext(AppContext);
  console.log(products);

  return (
    <>

      <div className="container py-5">
        <div className="row justify-content-center">
          {products?.map((product) => (
            <div
              key={product._id}
              className="col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center"
            >
              <div
                className="card bg-dark text-light text-center shadow-sm"
                style={{ width: '18rem' }}
              >
                <div className="p-3">
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
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>

                  <div className="my-3">
                    <button className="btn btn-primary mx-3">
                      {" ₹ "}{product.price}
                    </button>
                    <button className="btn btn-warning">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </>
  )
}

export default ShowProduct
