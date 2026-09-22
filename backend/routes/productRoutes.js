import express from "express";
import upload from "../middleware/upload.js";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadProductImageController,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", upload.single("image"), createProduct);

router.put("/:id", updateProduct);

router.post("/:id/image", upload.single("image"), uploadProductImageController);

router.delete("/:id", deleteProduct);

export default router;
