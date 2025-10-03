import express from 'express'
import { register } from '../Controllers/user.controller.js';

const router = express.Router();

// register router - /api/user/register
router.post('/register', register);

export default router