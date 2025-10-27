import axios from "axios";

// Centralized Axios instance
const axiosInstance = axios.create({
  // Use .env when available; fallback to common Nest port
  baseURL: import.meta?.env?.VITE_API_BASE_URL || "http://localhost:3000/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
  withCredentials: false,
});

// Helper to normalize server error messages
const extractMessage = (error) => {
  const msg = error?.response?.data?.message || error?.message || "Request error";
  return Array.isArray(msg) ? msg.join("; ") : msg;
};

export const get = async (path) => {
  try {
    const response = await axiosInstance.get(path);
    return response.data;
  } catch (error) {
    const msg = extractMessage(error);
    console.error("GET request error:", msg);
    throw new Error(msg);
  }
};

export const post = async (path, data) => {
  try {
    const response = await axiosInstance.post(path, data);
    return response.data;
  } catch (error) {
    const msg = extractMessage(error);
    console.error("POST request error:", msg);
    throw new Error(msg);
  }
};

export const del = async (path) => {
  try {
    const response = await axiosInstance.delete(path);
    return response.data;
  } catch (error) {
    const msg = extractMessage(error);
    console.error("DELETE request error:", msg);
    throw new Error(msg);
  }
};

export const edit = async (path, options) => {
  try {
    const response = await axiosInstance.patch(path, options);
    return response.data;
  } catch (error) {
    const msg = extractMessage(error);
    console.error("PATCH request error:", msg);
    throw new Error(msg);
  }
};

