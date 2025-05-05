import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPage = ({ onClose }) => {
    const { login } = useAuth();

    const [isCustomer, setIsCustomer] = useState(true);
    const [isLoginPage, setIsLoginPage] = useState(true);
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("customer");

    const [error, setError] = useState("");

    const changeLoginRole = () => {
        setIsCustomer(!isCustomer);
        setRole(isCustomer ? "admin" : "customer");
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Email không hợp lệ!";
        }
        const usernamePart = email.split('@')[0];
        if (!/^[a-zA-Z]/.test(usernamePart)) {
            return "Tài khoản phải bắt đầu bằng chữ cái!";
        }
        return "";
    };

    const handleLogin = async () => {
        if (loading) return;
        setLoading(true);
        setError("");

        if (!email || !password) {
            setError("Vui lòng nhập đủ thông tin!");
            setLoading(false);
            return;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost/backend/src/Controllers/Auth.php", {
                action: "login",
                email,
                password,
            });

            if (response.data.status === "success") {
                const userData = response.data.data;
                const authToken = response.data.token; // Extract the token from the response
                
                if (userData.role !== role) {
                    setError(`Tài khoản này có vai trò ${userData.role}, không phải ${role}!`);
                    setLoading(false);
                    return;
                }
                
                login(userData, authToken); // Pass both user data and token to the login function
                
                toast.success("Đăng nhập thành công!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setLoading(false);
                setTimeout(() => {
                    onClose();
                }, 2000); // Chỉ đóng modal, không điều hướng
            }
        } catch (err) {
            console.error("Login error:", err.response?.data || err);
            setError(err.response?.data?.message || "Thông tin đăng nhập chưa chính xác!");
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (loading) return;
        setLoading(true);
        setError("");

        if (!name || !email || !password || !confirmPassword || !phoneNum) {
            setError("Vui lòng nhập đủ thông tin!");
            setLoading(false);
            return;
        }

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Mật khẩu phải có ít nhất 6 ký tự");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Mật khẩu không khớp, vui lòng kiểm tra lại!");
            setLoading(false);
            return;
        }

        const filteredPhone = phoneNum.replace(/\D/g, "");
        if (!/^0\d{9}$/.test(filteredPhone)) {
            setError("Số điện thoại phải có 10 chữ số, bắt đầu bằng số 0 và không chứa chữ cái");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://localhost/backend/src/Controllers/Auth.php", {
                action: "register",
                name,
                email,
                password,
                phone: filteredPhone,
            });

            if (response.data.status === "success") {
                const userData = response.data.data;
                const authToken = response.data.token; // Extract the token from the response
                
                userData.role = "customer";
                login(userData, authToken); // Pass both user data and token to the login function
                
                toast.success("Đăng ký thành công!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
                setLoading(false);
                setTimeout(() => {
                    onClose();
                }, 2000); // Chỉ đóng modal, không điều hướng
            }
        } catch (err) {
            console.error("Register error:", err.response?.data || err);
            setError(err.response?.data?.message || "Lỗi khi đăng ký!");
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <motion.div
                className="bg-white p-6 rounded-md shadow-lg relative w-[30rem] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-black"
                    onClick={onClose}
                >
                    ✖
                </button>
                {isLoginPage ? (
                    <>
                        <p className="text-2xl font-bold text-[#4338CA] mb-8">CÔNG TY ABCXYZ</p>
                        <input
                            className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <div className="relative w-[90%] mb-4">
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
                                type={showPass ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                                disabled={loading}
                            >
                                {showPass ? "Ẩn" : "Hiển thị"}
                            </button>
                        </div>
                        {error && (
                            <p className="mb-4 self-center text-[#ff0000] font-semibold w-[90%]">
                                {error}
                            </p>
                        )}
                        <div className="flex flex-row justify-between w-[90%]">
                            <button
                                onClick={changeLoginRole}
                                className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300"
                                disabled={loading}
                            >
                                {isCustomer ? "Đăng nhập admin" : "Đăng nhập user"}
                            </button>
                            <button
                                onClick={() => setIsLoginPage(!isLoginPage)}
                                className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300"
                                disabled={loading}
                            >
                                Đăng kí tài khoản
                            </button>
                        </div>
                        <button
                            className="border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white duration-300 w-[90%] px-4 py-2 mt-5"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
                        </button>
                    </>
                ) : (
                    <>
                        <p className="text-2xl font-bold text-[#4338CA] mb-8">CÔNG TY ABCXYZ</p>
                        <input
                            className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4"
                            type="text"
                            placeholder="Nhập họ tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                        />
                        <input
                            className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <div className="relative w-[90%] mb-5">
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
                                type={showPass ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                                disabled={loading}
                            >
                                {showPass ? "Ẩn" : "Hiển thị"}
                            </button>
                        </div>
                        <div className="relative w-[90%] mb-5">
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
                                type={showConfirmPass ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                                disabled={loading}
                            >
                                {showConfirmPass ? "Ẩn" : "Hiển thị"}
                            </button>
                        </div>
                        <input
                            className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-5"
                            type="tel"
                            placeholder="Số điện thoại"
                            value={phoneNum}
                            onChange={(e) => setPhoneNum(e.target.value)}
                            pattern="[0-9]{10}"
                            maxLength="10"
                            inputMode="numeric"
                            disabled={loading}
                        />
                        {error && (
                            <p className="mb-4 self-center text-[#ff0000] font-semibold w-[90%]">
                                {error}
                            </p>
                        )}
                        <div className="flex flex-row justify-end w-[90%]">
                            <button
                                onClick={() => setIsLoginPage(!isLoginPage)}
                                className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300"
                                disabled={loading}
                            >
                                Đăng nhập tài khoản
                            </button>
                        </div>
                        <button
                            className="border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white duration-300 w-[90%] px-4 py-2 mt-5"
                            onClick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
                        </button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default LoginPage;