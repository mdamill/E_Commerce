import express from 'express'
import { login, register } from '../Controllers/user.controller.js';

const router = express.Router();

// register router - /api/user/register
router.post('/register', register);

// login user
router.post('/login', login)

export default router