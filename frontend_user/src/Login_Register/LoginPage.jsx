import { useState } from 'react';
import { motion } from 'framer-motion';

const LoginPage = ({ onClose }) => {
    const [isClient, setIsClient] = useState(true)
    const [isLoginPage, setIsLoginPage] = useState(true)

    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose} // Bấm ra ngoài modal thì đóng
        >
            <motion.div
                className="bg-white p-6 rounded-md shadow-lg relative w-[30rem] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan lên div cha
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-black"
                    onClick={onClose} // Nút X cũng đóng modal
                >
                    ✖
                </button>
                {isLoginPage ? (
                    <>
                        <p className='text-2xl font-bold text-[#4338CA] mb-8'>CÔNG TY ABCXYZ</p>
                        <input className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4' type="text" placeholder='Nhập tài khoản' />
                        <input className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-5' type="text" placeholder='Nhập mật khẩu' />
                        {/* <input className='border-2 border-gray-400 rounded-md w-[90%] px-4 py-2 mb-4' type="text" placeholder='Nhập tài khoản' /> */}

                        <div className='flex flex-row justify-between w-[90%]'>
                            <button onClick={() => setIsClient(!isClient)}
                                className='text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300 '>
                                {isClient ? "Đăng nhập admin" : "Đăng nhập user"}
                            </button>
                            <button onClick={() => setIsLoginPage(!isLoginPage)}
                                className='text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300'>
                                Đăng kí tài khoản
                            </button>
                        </div>
                        <button className='border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white duration-300 w-[90%] px-4 py-2 mt-5'>
                            ĐĂNG NHẬP
                        </button>
                    </>
                ) : (
                    <>
                        <p className='text-2xl font-bold text-[#4338CA] mb-8'>CÔNG TY ABCXYZ</p>
                        <input className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4' type="text" placeholder='Nhập tài khoản' />
                        {/* <input className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-5' type="password" placeholder='Nhập mật khẩu' /> */}
                        {/* Nhập mật khẩu */}
                        <div className="relative w-[90%] mb-5">
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
                                type={showPass ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                            >
                                {showPass ? "Ẩn" : "Hiển thị"}
                            </button>
                        </div>
                        {/* Xác nhận mật khẩu */}
                        <div className="relative w-[90%] mb-5">
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
                                type={showConfirmPass ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                            >
                                {showConfirmPass ? "Ẩn" : "Hiển thị"}
                            </button>
                        </div>
                        {/* <input className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-5' type="password" placeholder='Xác nhận mật khẩu' /> */}
                        <input className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-5' type="text" placeholder='Số điện thoại' />

                        {/* <input className='border-2 border-gray-400 rounded-md w-[90%] px-4 py-2 mb-4' type="text" placeholder='Nhập tài khoản' /> */}

                        <div className='flex flex-row justify-end w-[90%]'>

                            <button onClick={() => setIsLoginPage(!isLoginPage)}
                                className='text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300'>
                                Đăng nhập tài khoản
                            </button>
                        </div>
                        <button className='border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white duration-300 w-[90%] px-4 py-2 mt-5'>
                            ĐĂNG KÝ
                        </button>
                    </>
                )}

            </motion.div>
        </div>
    );
}

export default LoginPage