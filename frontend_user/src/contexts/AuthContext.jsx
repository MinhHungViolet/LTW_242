import { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
const AuthContext = createContext();

// Provider bọc toàn bộ ứng dụng
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Kiểm tra localStorage khi load lại trang
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Hàm đăng nhập
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook dùng để truy cập AuthContext dễ dàng
export const useAuth = () => {
    return useContext(AuthContext);
};