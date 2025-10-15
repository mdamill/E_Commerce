import React from 'react'
import ShowProduct from './components/product/ShowProduct'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from './Components/product/ProductDetail'
import Navbar from './Components/Navbar';
import SearchProduct from './Components/product/SearchProduct';
import Register from './Components/user/Register'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<ShowProduct />} />
        <Route path='/product/search/:term' element={<SearchProduct />} />
        <Route path='/product/:id' element={<ProductDetail />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App
