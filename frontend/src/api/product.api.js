// src/api/product.api.js

import { apiRequest } from "./apiClient.js";

export const getProducts = ({ page = 1, limit = 20, search = "" } = {}) => {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", String(limit));

  const searchTerm = search.trim();

  if (searchTerm) {
    params.set("search", searchTerm);
  }

  return apiRequest(`/products?${params.toString()}`);
};

export const getProduct = (id) => {
  return apiRequest(`/products/${id}`);
};

export const createProduct = (data) => {
  return apiRequest("/admin/products", {
    method: "POST",
    body: data,
  });
};

export const updateProduct = (id, data) => {
  return apiRequest(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const uploadProductImage = (id, file) => {
  const formData = new FormData();

  formData.append("image", file);

  return apiRequest(`/admin/products/${id}/image`, {
    method: "POST",
    body: formData,
  });
};

export const deleteProduct = (id) => {
  return apiRequest(`/admin/products/${id}`, {
    method: "DELETE",
  });
};
