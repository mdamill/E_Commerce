import express from 'express'
import { addToCart } from '../Controllers/cart.controller.js';
const router = express.Router();

// add item to cart
router.post('/add', addToCart);

export default router;