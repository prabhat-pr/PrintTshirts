import {
  getProducts as getProductsService,
  getProductById as getProductByIdService,
  createProduct as createProductService,
  updateProduct as updateProductService,
  replaceProductImage,
  deleteProduct as deleteProductService,
} from "../services/productService.js";

export const getProducts = async (req, res, next) => {
  try {
    const result = await getProductsService({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
    });

    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, price } = req.body;

    if (!name?.trim() || price === undefined || price === "") {
      return res.status(400).json({
        error: "Name and price are required",
      });
    }

    const product = await createProductService(req.body, req.file);

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const updatedProduct = await updateProductService(product, req.body);

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const uploadProductImageController = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: "Image file is required",
      });
    }

    const updatedProduct = await replaceProductImage(product, req.file);

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    await deleteProductService(product);

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
