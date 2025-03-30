import LoginPage from "../Login_Register/LoginPage";
import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const [isClickedLogin, setIsClickedLogin] = useState(false);

    const reverseLogin = () => {
        setIsClickedLogin(prev => !prev);
    };


    return (
        <div className="bg-[#111111] h-[10vh] flex flex-row items-center justify-between ">
            <p className="text-white text-2xl font-bold ml-10">TÊN CÔNG TY</p>
            {user ? (
                <div>
                    <p className="text-white">Xin chào, {user.username}!</p>
                    <button onClick={logout} className="ml-4 bg-red-500 px-2 py-1 rounded">Đăng xuất</button>
                </div>
            ) : (
                <div>
                    <button
                        className="text-black bg-white h-[5vh] w-[12rem] mr-[2rem] px-2 py-5 flex items-center justify-center text-md font-bold border rounded-3xl hover:bg-[#eeeeee] hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out"
                        onClick={reverseLogin}
                    >
                        Đăng nhập / Đăng ký
                    </button>

                    <AnimatePresence>
                        {isClickedLogin && (
                            <LoginPage onClose={() => setIsClickedLogin(false)} />
                        )}
                    </AnimatePresence>
                </div>
            )}

        </div>
    );
};

export default Header;
