import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";

// Tạo Context
const AuthContext = createContext(null);

// Provider bọc toàn bộ ứng dụng
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [token, setToken] = useState(() => localStorage.getItem("token")); 
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        console.log("AuthProvider Mounted. Checking token..."); 
        const storedToken = localStorage.getItem("token");
        console.log("Stored token:", storedToken);

        if (storedToken) {
            try {
                const decodedToken = jwtDecode(storedToken);
                console.log("Decoded Token:", decodedToken);

                if (decodedToken.exp * 1000 > Date.now()) {
                    console.log("Token is valid and not expired. Setting user state.");
                    setUser({
                        id: decodedToken.userId, 
                        email: decodedToken.email,
                        role: decodedToken.role,
                        name: decodedToken.name || 'User'
                    });
                } else {
                    console.log("Token expired. Removing token.");
                    localStorage.removeItem("token");
                    setToken(null);
                    setUser(null);
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("token");
                setToken(null);
                setUser(null);
            }
        } else {
             console.log("No token found in localStorage.");
        }
        setIsLoading(false);
        console.log("Initial auth loading finished.");
    }, []);

    const login = useCallback((newToken, userData) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(userData);
        console.log("AuthContext: Login successful.");
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        console.log("AuthContext: Logout successful.");
    }, []);

    const value = { user, token, login, logout, isLoading };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading ? children : <div>Loading Application...</div>}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};