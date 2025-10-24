import express from "express";
import { isAuthenticated } from "../Middleware/isAuthenticated.js";
import { isAdmin } from "../Middleware/isAdmin.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  updateUserRole,
} from "../Controllers/admin.controller.js";

const router = express.Router();

// Product routes
router.post("/product/add", isAuthenticated, isAdmin, addProduct);
router.put("/product/:id", isAuthenticated, isAdmin, updateProduct);
router.delete("/product/:id", isAuthenticated, isAdmin, deleteProduct);

// User role route
router.put("/user/:id/role", isAuthenticated, isAdmin, updateUserRole);

export default router;
