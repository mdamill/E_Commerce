import express from 'express'
import { login, profile, register, users } from '../Controllers/user.controller.js';
import { isAuthenticated } from '../Middleware/isAuthenticated.js';

const router = express.Router();

// register router - /api/user/register
router.post('/register', register);

// login user
router.post('/login', login);

// get all users
router.get('/all', users);

// get user profile
router.get('/profile', isAuthenticated, profile);

export default router