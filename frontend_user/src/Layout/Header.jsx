import LoginPage from "../Login_Register/LoginPage";
import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

const Header = () => {
    const [isClickedLogin, setIsClickedLogin] = useState(false);
    // const [isClickedRegister, setIsClickedRegister] = useState(false);

    const reverseLogin = () => {
        setIsClickedLogin(prev => !prev);
    };

    // const reverseRegister = () => {
    //     setIsClickedRegister(prev => !prev);
    // };

    // Debug: kiểm tra khi state thay đổi
    useEffect(() => {
      console.log("isClickedLogin thay đổi: ", isClickedLogin);
    }, [isClickedLogin]);

    return (
        <div className="bg-[#111111] h-[10vh] flex flex-row items-center justify-between ">
            <p className="text-white text-2xl font-bold ml-10">TÊN CÔNG TY</p>
            {/* <div className="flex flex-row justify-between w-60 mr-10"> */}
                <button
                    className="text-black bg-white h-[5vh] w-[12rem] mr-[2rem] px-2 py-5 flex items-center justify-center text-md font-bold border rounded-3xl hover:bg-[#eeeeee] hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out"
                    onClick={reverseLogin}
                >
                    Đăng nhập / Đăng ký
                </button>
{/* 
                <button
                    className="text-black bg-white h-[5vh] w-[7rem] px-3 py-5 flex items-center justify-center text-md font-bold border rounded-3xl hover:bg-[#eeeeee] hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out"
                    onClick={() => setIsClickedRegister(true)}
                >
                    Đăng kí
                </button> */}
            {/* </div> */}

            <AnimatePresence>
                {isClickedLogin && (
                    <LoginPage onClose={() => setIsClickedLogin(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Header;
