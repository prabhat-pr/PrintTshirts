// src/api/admin.api.js

import { apiRequest } from "./apiClient.js";

export function getDashboardStats() {
  return apiRequest("/admin/dashboard");
}

export function getCustomers() {
  return apiRequest("/admin/customers");
}

export function updateCustomerStatus(id, isActive) {
  return apiRequest(`/admin/customers/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}
