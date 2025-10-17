import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';


function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { logout, isAuthenticated, setFilteredData, products } = useContext(AppContext);
  const location = useLocation()

  const submitHandler = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/product/search/${searchTerm}`);
      setSearchTerm('');
    }
  };

  // filter by category
  const filterByCategory = (category) => {
    setFilteredData(products.filter((data) => data?.category?.toLowerCase() == category?.toLowerCase()))
  }
  // filter by price
  const filterByPrice = (price) => {
    setFilteredData(products.filter((data) => data?.price >= price))
  }

  return (
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
            placeholder="Search products..."
          />
        </form>

        {/* Right Section */}
        <div className="right">
          {isAuthenticated ? (
            <>
              <button className="btn">Cart</button>
              <Link to={'/profile'} className="btn">Profile</Link>
              <button
                className="btn"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </div>
      </div>

      {location.pathname == '/' &&
        <div className="sub_bar">
          <div className="items" onClick={() => setFilteredData(products)}>All Items</div>
          <div className="items" onClick={() => { filterByCategory("mobile") }}>Phones</div>
          <div className="items" onClick={() => { filterByCategory("electronics") }}>Keyboards</div>
          <div className="items" onClick={() => filterByPrice(100)}>100</div>
          <div className="items" onClick={() => filterByPrice(200)}>200</div>
          <div className="items" onClick={() => filterByPrice(1000)}>1000</div>
        </div>
      }

    </div>
  );
}

export default Navbar;
