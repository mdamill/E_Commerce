import express from 'express'
import { addAddress, getAddress } from '../Controllers/address.controller.js';
import { isAuthenticated } from '../Middleware/isAuthenticated.js';

const router = express.Router();

// route to add address
router.post('/add', isAuthenticated , addAddress);

//get address route
router.get('/get', isAuthenticated, getAddress);

export default router;