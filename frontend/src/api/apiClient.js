// src/api/apiClient.js

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiRequest = async (path, options = {}) => {
  const token = localStorage.getItem("printtshirts_token");

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const isFormData = options.body instanceof FormData;

  if (!isFormData && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const baseUrl = API_URL.replace(/\/+$/, "");
  const requestPath = path.startsWith("/") ? path : `/${path}`;

  let response;

  try {
    response = await fetch(`${baseUrl}${requestPath}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (!navigator.onLine) {
      throw new Error(
        "No internet connection. Please check your network and try again.",
        { cause: error },
      );
    }

    throw new Error("Unable to connect to the server. Please try again.", {
      cause: error,
    });
  }

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error("Something went wrong. Please try again.");
    }

    throw new Error(
      typeof data === "object" && data?.error
        ? data.error
        : typeof data === "string" && data
          ? data
          : "Request failed",
    );
  }

  return data;
};
