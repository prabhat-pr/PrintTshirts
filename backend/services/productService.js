import { Op } from "sequelize";
import { Product } from "../models/index.js";

import { uploadProductImage, deleteProductImage } from "./cloudinaryService.js";

export async function getProducts({ page = 1, limit = 20, search = "" } = {}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  const offset = (safePage - 1) * safeLimit;

  const where = {};

  if (search.trim()) {
    where.name = {
      [Op.like]: `%${search.trim()}%`,
    };
  }

  const { rows, count } = await Product.findAndCountAll({
    where,
    limit: safeLimit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    products: rows,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total: count,
      totalPages: Math.ceil(count / safeLimit),
    },
  };
}

export async function getProductById(productId) {
  return Product.findByPk(productId);
}

export async function createProduct(data, file = null) {
  const { name, price, category, description, rating, stock, featured } = data;

  const product = await Product.create({
    name: name.trim(),
    price,
    category: category || null,
    description: description || null,
    rating: rating ?? 4.9,
    stock: stock ?? 0,
    featured: featured === true || featured === "true",
  });

  if (file) {
    try {
      const image = await uploadProductImage(file.buffer, product.id);

      await product.update({
        imageUrl: image.url,
        imagePublicId: image.publicId,
      });
    } catch (error) {
      await product.destroy();
      throw error;
    }
  }

  return product;
}

export async function updateProduct(product, data) {
  const { name, price, category, description, rating, stock, featured } = data;

  await product.update({
    ...(name !== undefined && {
      name: name.trim(),
    }),

    ...(price !== undefined && {
      price,
    }),

    ...(category !== undefined && {
      category,
    }),

    ...(description !== undefined && {
      description,
    }),

    ...(rating !== undefined && {
      rating,
    }),

    ...(stock !== undefined && {
      stock,
    }),

    ...(featured !== undefined && {
      featured: featured === true || featured === "true",
    }),
  });

  return product;
}

export async function replaceProductImage(product, file) {
  if (!file) {
    throw new Error("Image file is required");
  }

  const oldPublicId = product.imagePublicId;

  const image = await uploadProductImage(file.buffer, product.id);

  await product.update({
    imageUrl: image.url,
    imagePublicId: image.publicId,
  });

  if (oldPublicId) {
    await deleteProductImage(oldPublicId);
  }

  return product;
}

export async function deleteProduct(product) {
  if (product.imagePublicId) {
    await deleteProductImage(product.imagePublicId);
  }

  await product.destroy();
}
