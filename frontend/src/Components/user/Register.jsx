import React, { useState } from 'react'

function Register() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  })

  const onChangeHandler = (e) => {

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })

  }

  const submitHandler = (e) => {
    e.preventDefault();
    alert(`form submitted !`)
    // console.log(formData);

  }

  return (
    <>
      <div className="container my-5" style={{ width: '600px' }}>

        <h2 className='text-center'> Register User </h2>
        {/* User Name Here */}
        <form onSubmit={submitHandler} className='my-3'>
          <div className="mb-3">
            <label htmlFor="exampleInputName1" className="form-label">
              Name
            </label>
            <input
              name='name'
              value={formData.name}
              onChange={onChangeHandler}
              type="text"
              className="form-control"
              id="exampleInputName1"
            />
          </div>
          {/* User Email Here */}
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              name='email'
              value={formData.email}
              onChange={onChangeHandler}
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
            />

          </div>
          {/* User Password Here */}
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              name='password'
              value={formData.password}
              onChange={onChangeHandler}
              type="password"
              className="form-control"
              id="exampleInputPassword1"
            />
          </div>
          {/* Submit Btn Here */}
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>

      </div>
    </>
  )
}

export default Register
