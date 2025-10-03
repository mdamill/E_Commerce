import express from 'express'
import { addProduct, getProducts } from '../Controllers/product.controller.js';
const router = express.Router();

// add product route
router.post('/add', addProduct);

// get all products
router.get('/all', getProducts)

export default router;