import React, { useContext, useState } from 'react'
import AppContext from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';

function Login() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const navigate = useNavigate();

  // for registering data
  const {login} = useContext(AppContext);
  const {email, password} = formData;

  const onChangeHandler = (e) => {

    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value })

  }

  const submitHandler = async(e) => {
    e.preventDefault();
    
    const result = await login({email, password});

    if(result.success){
      navigate('/')
    }

    // console.log(formData);

  }

  return (
    <>
      <div className="container my-5" style={{ width: '600px' }}>

        <h2 className='text-center'> Login User </h2>

        <form onSubmit={submitHandler} className='my-3'>

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

export default Login;
