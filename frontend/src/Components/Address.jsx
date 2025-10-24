import React, { useContext, useState } from 'react'
import AppContext from '../Context/AppContext';
import {useNavigate} from 'react-router-dom'


function Address() {

  const [formData, setFormData] = useState({
    fullName:"",
    address:"",
    city:"",
    state:"",
    country:"",
    pincode:"",
    phoneNumber:""
  })

  const {shippingAddress, userAddress} = useContext(AppContext);
  // console.log(userAddress);
  
  
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({...formData, [name] : value})
  }

  const submitHandler = async(e) => {

    e.preventDefault();

    // console.log(formData);

    const result = await shippingAddress(formData)

    // console.log(result)

    if (result.success) {
      navigate("/checkout");
    }

    // reset form
    setFormData({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phoneNumber: "",
    });
    
  }

  return (
    <div
      className="container my-3 p-4"
      style={{ border: '2px solid yellow', borderRadius: '10px' }}
    >
      <h1 className="text-center">Shipping Address</h1>

      <form 
      className="my-3"
      onSubmit={submitHandler}
      >
        <div className="row">
          <div className="mb-3 col-md-4">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              onChange={onChangeHandler}
              type="text"
              className="form-control bg-dark text-light"
              id="fullName"
              placeholder="Enter your full name"
              name='fullName'
              value={formData.fullName}
            />
          </div>

          <div className="mb-3 col-md-4">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              onChange={onChangeHandler}
              type="text"
              className="form-control bg-dark text-light"
              id="country"
              placeholder="Enter country"
              name='country'
              value={formData.country}
            />
          </div>

          <div className="mb-3 col-md-4">
            <label htmlFor="state" className="form-label">
              State
            </label>
            <input
              onChange={onChangeHandler}
              type="text"
              className="form-control bg-dark text-light"
              id="state"
              placeholder="Enter state"
              name='state'
              value={formData.state}
            />
          </div>
        </div>

        <div className="row">
          <div className="mb-3 col-md-4">
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              onChange={onChangeHandler}
              type="text"
              className="form-control bg-dark text-light"
              id="city"
              placeholder="Enter city"
              name='city'
              value={formData.city}
            />
          </div>

          <div className="mb-3 col-md-4">
            <label htmlFor="pincode" className="form-label">
              Pincode
            </label>
            <input
              onChange={onChangeHandler}
              type="number"
              className="form-control bg-dark text-light"
              id="pincode"
              placeholder="Enter pincode"
              name='pincode'
              value={formData.pincode}
            />
          </div>

          <div className="mb-3 col-md-4">
            <label htmlFor="phoneNumber" className="form-label">
              Phone Number
            </label>
            <input
              onChange={onChangeHandler}
              type="number"
              className="form-control bg-dark text-light"
              id="phoneNumber"
              placeholder="Enter phone number"
              name='phoneNumber'
              value={formData.phoneNumber}
            />
          </div>
        </div>

        <div className="row">
          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              Address / Nearby
            </label>
            <textarea
              onChange={onChangeHandler}
              className="form-control bg-dark text-light"
              id="address"
              rows="3"
              placeholder="Enter your address"
              name='address'
              value={formData.address}
            ></textarea>
          </div>
        </div>

        <div className="d-grid col-6 mx-auto my-3">
          <button
            type="submit"
            className="btn btn-primary"
            style={{ fontWeight: 'bold' }}
          >
            Submit
          </button>
        </div>
      </form>

      {userAddress && (

      <div className="d-grid col-6 mx-auto my-3">
        <button 
        className="btn btn-warning" 
        style={{ fontWeight: 'bold' }}
        onClick={() => navigate('/checkout')}
        >
          Use Old Address
        </button>
      </div>
      )}

    </div>
  )

}

export default Address
