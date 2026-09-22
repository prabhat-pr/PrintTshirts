// src/api/order.api.js

import { apiRequest } from "./apiClient.js";

export function createOrder(data) {
  return apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getMyOrders() {
  return apiRequest("/orders");
}

export function getMyOrder(id) {
  return apiRequest(`/orders/${id}`);
}

export function getAllOrders() {
  return apiRequest("/admin/orders");
}

export function updateOrderStatus(id, data) {
  return apiRequest(`/admin/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
