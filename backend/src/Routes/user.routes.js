import express from 'express'
import { login, register, users } from '../Controllers/user.controller.js';

const router = express.Router();

// register router - /api/user/register
router.post('/register', register);

// login user
router.post('/login', login);

// get all users
router.get('/all', users);

export default router