import express from 'express'
import { addToCart, removeProductFromCart, userCart } from '../Controllers/cart.controller.js';
const router = express.Router();

// add item to cart
router.post('/add', addToCart);

// get user's complete cart
router.get('/user', userCart);

export default router;