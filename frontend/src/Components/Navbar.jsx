import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {

  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/product/search/${searchTerm}`)
    setSearchTerm("")
  }

  return (
    <>
      <div className="nav sticky-top">
        <div className="nav_bar">
          {/* Left Section */}
          <Link to="/" className="left">
            <h3>MERN E-Commerce</h3>
          </Link>

          {/* Center Search Bar */}
          <form className="search_bar" onSubmit={submitHandler}>
            <span className="material-symbols-outlined">search</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search ...."
            />
          </form>

          {/* Right Section */}
          <div className="right">
            <button className="btn">cart</button>
            <button className="btn">profile</button>
            <Link to={'/login'} className="btn ">login</Link>
            <Link to={'/register'} className="btn ">register</Link>
            <button className="btn">logout</button>
          </div>
        </div>
        <div className="sub_bar"></div>
      </div>
    </>
  )
}

export default Navbar
