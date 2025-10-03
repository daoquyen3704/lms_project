import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Lấy user và token từ localStorage (nếu có)
    const [user, setUser] = useState(() => {
        const data = localStorage.getItem("userInfoLms");
        return data ? JSON.parse(data) : null;
    });

    const [token, setToken] = useState(() => {
        return localStorage.getItem("accessToken") || null;
    });

    // Đăng nhập: lưu cả user, access token và refresh token
    const login = (userData, accessToken, refreshToken) => {
        localStorage.setItem("userInfoLms", JSON.stringify(userData));
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        setUser(userData);
        setToken(accessToken);
    };

    // Đăng xuất: xoá user, access token và refresh token
    const logout = () => {
        localStorage.removeItem("userInfoLms");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
