import express from "express";
import upload from "../middleware/upload.js";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImageController,
} from "../controllers/productController.js";

import {
  getDashboardStats,
  getCustomers,
  updateCustomerStatus,
} from "../controllers/adminController.js";

import {
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { authenticate } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get("/dashboard", getDashboardStats);

// Products
router.post("/products", upload.single("image"), createProduct);

router.put("/products/:id", updateProduct);

router.post(
  "/products/:id/image",
  upload.single("image"),
  uploadProductImageController,
);

router.delete("/products/:id", deleteProduct);

// Orders
router.get("/orders", getAllOrders);

router.patch("/orders/:id", updateOrderStatus);

// Customers
router.get("/customers", getCustomers);

router.patch("/customers/:id", updateCustomerStatus);

export default router;
