import express from 'express'
import { addProduct, deleteProductById, getProductById, getProducts, updateProduct } from '../Controllers/product.controller.js';
const router = express.Router();

// add product route
router.post('/add', addProduct);

// get all products
router.get('/all', getProducts);

// get product by ID
router.get('/:id', getProductById);

//update product
router.patch('/:id', updateProduct);

//delete product 
router.delete('/:id', deleteProductById);

export default router;