import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
} from "../Controllers/order.controller.js";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";


const router = express.Router();

// POST → Create new order
router.post("/",isAuthenticated, createOrder);

// GET → Admin: Get all orders
router.get("/", getAllOrders);

// GET → Get all orders for a specific user
router.get("/user/:userId", getUserOrders);

export default router;
