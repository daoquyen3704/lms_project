// src/common/Config.js

export const apiUrl = import.meta.env.VITE_API_URL;

// Lấy token từ localStorage
export const token = localStorage.getItem("accessToken"); // Lưu token riêng biệt

// Lấy thông tin người dùng (userInfo) từ localStorage nếu cần
export const userInfo = localStorage.getItem("userInfoLms")
    ? JSON.parse(localStorage.getItem("userInfoLms"))
    : null;
