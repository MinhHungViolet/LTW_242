import { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
const AuthContext = createContext();

// Provider bọc toàn bộ ứng dụng
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Kiểm tra localStorage khi load lại trang
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Hàm đăng nhập
    const login = (userData, authToken) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        
        if (authToken) {
            setToken(authToken);
            localStorage.setItem("token", authToken);
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook dùng để truy cập AuthContext dễ dàng
export const useAuth = () => {
    return useContext(AuthContext);
};