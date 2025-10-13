import axios from "axios";

// Centralized Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:3002/",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Sử dụng axiosInstance thay vì fetch để nhất quán
export const get = async (path) => {
  try {
    const response = await axiosInstance.get(path);
    return response.data;
  } catch (error) {
    console.error("GET request error:", error);
    throw error;
  }
};

export const post = async (path, data) => {
  try {
    const response = await axiosInstance.post(path, data);
    return response.data;
  } catch (error) {
    console.error("POST request error:", error);
    throw error;
  }
};

export const del = async (path) => {
  try {
    // Gửi yêu cầu DELETE đến API với ID của sản phẩm cần xóa
    const response = await axiosInstance.delete(path);
    return response.data;
  } catch (error) {
    console.error("DELETE request error:", error);
    throw error;
  }
};

export const edit = async (path, options) => {
  try {
    const response = await axiosInstance.patch(path, options);
    return response.data;
  } catch (error) {
    console.error("PATCH request error:", error);
    throw error;
  }
};
