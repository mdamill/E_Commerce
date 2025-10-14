import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

function ProductDetail() {

  const { id } = useParams();
  const [product, setProduct] = useState([])

  const url = import.meta.env.VITE_URL;

  useEffect(() => {

    const fetchProducts = async () => {

      const response = await axios.get(`${url}/product/${id}`, {
        headers: {
          "Content-Type": "Application/json",
        },
        withCredentials: true,
      });

      // console.log(response.data.product);
      setProduct(response.data.product);

    }
    fetchProducts()
  }, [id])

  return (

    <>
      <div className="container my-5 py-4">
        <div className="row align-items-center justify-content-center text-center text-md-start">

          {/* Left: Product Image */}
          <div className="col-12 col-md-5 mb-4 mb-md-0 d-flex justify-content-center">
            <img
              src={product?.imgSrc}
              alt={product?.title}
              className="img-fluid shadow-sm"
              style={{
                maxWidth: '100%',
                height: 'auto',
                borderRadius: '12px',
                border: '2px solid grey',
                objectFit: 'cover',
              }}
            />
          </div>

          {/* Right: Product Info */}
          <div className="col-12 col-md-6">
            <h2 className="fw-bold mb-3" style={{ fontStyle: 'oblique' }}>
              {product?.title}
            </h2>
            <p className="text-secondary mb-4">{product?.description}</p>
            <h3 className="fw-bold text-white mb-4">₹ {product?.price}</h3>

            <div className="d-flex justify-content-center justify-content-md-start gap-3 flex-wrap mt-4">
              <button className="btn btn-danger px-4 py-2 fw-bold">
                Buy Now
              </button>
              <button className="btn btn-warning px-4 py-2 fw-bold text-dark">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>


    </>
  )
}

export default ProductDetail
