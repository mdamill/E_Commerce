import express from 'express'
import { addToCart, clearCart, decreaseProductQty, removeProductFromCart, userCart } from '../Controllers/cart.controller.js';
const router = express.Router();

// add item to cart
router.post('/add', addToCart);

// get user's complete cart
router.get('/user', userCart);

// remove produxt from the cart
router.delete('/remove/:productId', removeProductFromCart)

// clear cart route
router.delete('/clear', clearCart)

// decrease quantity from the cart's route
router.post('/--qty', decreaseProductQty)

export default router;