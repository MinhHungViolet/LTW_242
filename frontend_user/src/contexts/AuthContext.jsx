import { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
const AuthContext = createContext();

// Provider bọc toàn bộ ứng dụng
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Kiểm tra localStorage khi load lại trang
    useEffect(() => {
        const storedUser = localStorage.getItem("username");
        const storedRole = localStorage.getItem("role");
        if (storedUser) {
            setUser({ username: storedUser, role: storedRole });
        }
    }, []);

    // Hàm đăng nhập
    const login = (username, role) => {
        setUser({ username, role });
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        setTimeout(() => {
            window.location.reload();
        }, 100);
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        setUser(null);

        setTimeout(() => {
            window.location.href = "/"; // Điều hướng về trang chủ và reload trang
        }, 100); // Delay nhẹ để đảm bảo AuthContext cập nhật
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
