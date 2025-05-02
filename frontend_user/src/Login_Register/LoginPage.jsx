import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = ({ onClose }) => {

    const { login } = useAuth();

    const [isClient, setIsClient] = useState(true)
    const [isLoginPage, setIsLoginPage] = useState(true)

    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [phoneNum, setPhoneNum] = useState("")
    const [role, setRole] = useState("client")

    const navigate = useNavigate();


    const [error, setError] = useState("")

    const users = {
        "quocdat1": { password: "1234", role: "client" },
        "quocdat2": { password: "4321", role: "admin" }
    }

    const changeLoginRole = () => {
        setIsClient(!isClient);
        if (role === "client") {
            setRole("admin");
        }
        else {
            setRole("client");
        }
    }

    const handleLogin = () => {
        if (!username || !password) {
            setError("Vui lòng nhập đủ thông tin!")
            return;
        }

        if (users[username] && users[username].password === password && users[username].role === role) {
            login(username, users[username].role);
        }
        else {
            setError("Thông tin đăng nhập chưa chính xác!")
            return;
        }

        setError("")
    }

    const handleRegister = () => {
        if (!username || !password || !confirmPassword || !phoneNum) {
            setError("Vui lòng nhập đủ thông tin!")
            return;
        }

        const usernameRegex = /^[A-Za-z][A-Za-z0-9]{5,}$/;
        if (!usernameRegex.test(username)) {
            setError("Tài khoản phải có ít nhất 6 ký tự và bắt đầu bằng chữ cái");
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp, vui lòng kiểm tra lại!")
            return;
        }

        const filteredPhone = phoneNum.replace(/\D/g, ""); // Loại bỏ các ký tự không phải số
        if (!/^0\d{9}$/.test(filteredPhone)) {
            setError("Số điện thoại phải có 10 chữ số, bắt đầu bằng số 0 và không chứa chữ cái");
            return;
        }


        setError("")
    }

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

                        {/* Tên đăng nhập */}
                        <input
                            className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4'
                            type="text"
                            placeholder='Nhập tài khoản'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} />

                        {/* <input className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-5' type="text" placeholder='Nhập mật khẩu' /> */}

                        {/* Mật khẩu */}
                        <div className="relative w-[90%] mb-4">
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
                                type={showPass ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                            >
                                {showPass ? "Ẩn" : "Hiển thị"}
                            </button>
                        </div>

                        {error && (
                            <p className='mb-4 self-center text-[#ff0000] font-semibold w-[90%]'>{error}</p>
                        )}

                        {/* Chuyển giữa client và admin */}
                        <div className='flex flex-row justify-between w-[90%]'>
                            <button onClick={changeLoginRole}
                                className='text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300 '>
                                {isClient ? "Đăng nhập admin" : "Đăng nhập user"}
                            </button>
                            <button onClick={() => setIsLoginPage(!isLoginPage)}
                                className='text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300'>
                                Đăng kí tài khoản
                            </button>
                        </div>
                        <button className='border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white duration-300 w-[90%] px-4 py-2 mt-5'
                            onClick={handleLogin}>
                            ĐĂNG NHẬP
                        </button>
                    </>
                ) : (
                    <>
                        <p className='text-2xl font-bold text-[#4338CA] mb-8'>CÔNG TY ABCXYZ</p>
                        <input
                            className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4'
                            type="text"
                            placeholder='Nhập tài khoản'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        {/* Nhập mật khẩu */}
                        <div className="relative w-[90%] mb-5">
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
                                type={showPass ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                            >
                                {showConfirmPass ? "Ẩn" : "Hiển thị"}
                            </button>
                        </div>

                        <input
                            className='border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-5'
                            type="text"
                            placeholder='Số điện thoại'
                            value={phoneNum}
                            onChange={(e) => setPhoneNum(e.target.value)}
                            pattern='\d{10}'
                            maxLength='10'
                            minLength='10'
                            inputMode='numeric'
                        // onInput={() => this.value = this.value.replace(/[^0-9]/g, '')}
                        />

                        {error && (
                            <p className='mb-4 self-center text-[#ff0000] font-semibold w-[90%]'>{error}</p>
                        )}

                        <div className='flex flex-row justify-end w-[90%]'>

                            <button onClick={() => setIsLoginPage(!isLoginPage)}
                                className='text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300'>
                                Đăng nhập tài khoản
                            </button>
                        </div>
                        <button
                            className='border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white duration-300 w-[90%] px-4 py-2 mt-5'
                            onClick={handleRegister}>
                            ĐĂNG KÝ
                        </button>
                    </>
                )}

            </motion.div>
        </div>
    );
}

export default LoginPage