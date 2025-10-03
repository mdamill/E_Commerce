import express from 'express'
import { addProduct } from '../Controllers/product.controller.js';
const router = express.Router();

// add product route
router.post('/add', addProduct);

export default router;