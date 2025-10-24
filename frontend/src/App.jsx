import React from 'react'
import ShowProduct from './components/product/ShowProduct'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from './Components/product/ProductDetail'
import Navbar from './Components/Navbar';
import SearchProduct from './Components/product/SearchProduct';
import Register from './Components/user/Register'
import Login from './Components/user/Login'
import Profile from './Components/user/Profile'
import Cart from './Components/Cart'
import { ToastContainer, toast } from 'react-toastify';
import Address from './Components/Address';
import Checkout from './Components/Checkout';
import OrderConfirmation from './Components/OrderConfirmation';

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        <Route path='/' element={<ShowProduct />} />
        <Route path='/product/search/:term' element={<SearchProduct />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/shipping' element={<Address />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
      </Routes>
    </Router>
  )
}

export default App
