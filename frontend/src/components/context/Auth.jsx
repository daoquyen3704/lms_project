import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Khởi tạo user từ localStorage (nếu có)
    const [user, setUser] = useState(() => {
        const data = localStorage.getItem("userInfoLms");
        return data ? JSON.parse(data) : null;
    });

    const login = (userData) => {
        localStorage.setItem("userInfoLms", JSON.stringify(userData));
        setUser(userData);  // ✅ cập nhật state ngay lập tức
    };

    const logout = () => {
        localStorage.removeItem("userInfoLms");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
