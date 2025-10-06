import express from 'express'
import { addToCart, clearCart, decreaseProductQty, removeProductFromCart, userCart } from '../Controllers/cart.controller.js';
const router = express.Router();
import { isAuthenticated } from '../Middleware/isAuthenticated.js';

// add item to cart
router.post('/add', isAuthenticated ,addToCart);

// get user's complete cart
router.get('/user',isAuthenticated , userCart);

// remove produxt from the cart
router.delete('/remove/:productId',isAuthenticated , removeProductFromCart)

// clear cart route
router.delete('/clear', isAuthenticated ,clearCart)

// decrease quantity from the cart's route
router.post('/--qty', isAuthenticated ,decreaseProductQty)

export default router;