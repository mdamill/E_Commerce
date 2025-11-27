import React from 'react'
import ShowProduct from './Components/product/ShowProduct'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from './Components/product/ProductDetail'
import Navbar from './Components/Navbar';
import SearchProduct from './Components/product/SearchProduct';
import Register from './Components/user/Register'
import Login from './Components/user/Login'
import Profile from './Components/user/Profile'
import Cart from './Components/Cart'
import { ToastContainer } from 'react-toastify';
import Address from './Components/Address';
import Checkout from './Components/Checkout';
import OrderConfirmation from './Components/OrderConfirmation';
import AdminProducts from './Components/admin/AdminProducts';
import AdminUsers from './Components/admin/AdminUsers';
import AdminAddProduct from './Components/admin/AdminAddProduct';
import AdminEditProduct from './Components/admin/AdminEditProduct';
import AdminOrders from './Components/admin/AdminOrders'


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

        {/* --- New Admin Routes (Flat Structure) --- */}
          <Route path="/admin" element={<AdminOrders />} /> 
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/products/add" element={<AdminAddProduct />} />
          <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} /> 

      </Routes>
    </Router>
  )
}

export default App
