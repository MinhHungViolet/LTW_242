import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Import thư viện jwt-decode đã cài đặt
import { jwtDecode } from "jwt-decode";

// Tạo Context
const AuthContext = createContext(null);

// Provider bọc toàn bộ ứng dụng
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // State chứa object user
    const [token, setToken] = useState(() => localStorage.getItem("token")); // State chứa chuỗi token
    const [isLoading, setIsLoading] = useState(true); // State kiểm soát loading ban đầu

    // useEffect chạy 1 lần khi component mount để kiểm tra token đã lưu
    useEffect(() => {
        console.log("AuthProvider Mounted. Checking token..."); // Log khi mount
        const storedToken = localStorage.getItem("token");
        console.log("Stored token:", storedToken); // Log token lấy từ localStorage

        if (storedToken) {
            try {
                // Giải mã token
                const decodedToken = jwtDecode(storedToken);
                console.log("Decoded Token:", decodedToken);

                // Kiểm tra xem token còn hạn không
                // decodedToken.exp lưu timestamp hết hạn tính bằng giây
                // Date.now() trả về milliseconds, nên cần nhân decodedToken.exp với 1000
                if (decodedToken.exp * 1000 > Date.now()) {
                    // Token còn hạn -> Khôi phục user state
                    console.log("Token is valid and not expired. Setting user state.");
                    setUser({
                        // *** Đảm bảo các key này khớp với payload JWT của bạn ***
                        id: decodedToken.userId,    // Thường là userId hoặc sub
                        email: decodedToken.email,  // Email từ token
                        role: decodedToken.role,   // Role từ token
                        name: decodedToken.name || 'User' // Lấy name từ token nếu có
                    });
                    // setToken(storedToken); // Token đã được set ở initialState rồi, không cần set lại trừ khi muốn trigger re-render liên quan đến token
                } else {
                    // Token hết hạn
                    console.log("Token expired. Removing token.");
                    localStorage.removeItem("token");
                    setToken(null); // Reset state token
                    setUser(null);  // Reset state user
                }
            } catch (error) {
                // Token không hợp lệ (không giải mã được)
                console.error("Invalid token:", error);
                localStorage.removeItem("token");
                setToken(null); // Reset state token
                setUser(null);  // Reset state user
            }
        } else {
             console.log("No token found in localStorage.");
        }
        // Dù có token hay không, việc kiểm tra ban đầu đã xong
        setIsLoading(false);
        console.log("Initial auth loading finished.");
    }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần khi mount

    // Hàm login (không đổi so với trước)
    const login = useCallback((newToken, userData) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);
        console.log("AuthContext: Login successful.");
    }, []);

    // Hàm logout (không đổi so với trước)
    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        console.log("AuthContext: Logout successful.");
        // Có thể thêm điều hướng về trang chủ ở đây
    }, []);

    // Giá trị cung cấp cho context
    const value = { user, token, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {/* Chỉ render children khi isLoading=false */}
            {!isLoading ? children : <div>Loading Application...</div>}
        </AuthContext.Provider>
    );
};

// Hook useAuth (không đổi)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};