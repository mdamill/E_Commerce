import React from 'react'
import ShowProduct from './components/product/ShowProduct'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetail from './Components/product/ProductDetail'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ShowProduct />} />
        <Route path='/product/:id' element={<ProductDetail/>} />
      </Routes>
    </Router>
  )
}

export default App
