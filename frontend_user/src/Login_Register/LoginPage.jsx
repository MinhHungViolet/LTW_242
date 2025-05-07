import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost/backend/public";

const LoginPage = ({ onClose }) => {
    const { login } = useAuth();
    const navigate = useNavigate();

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
        setError("");
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Email không hợp lệ!";
        }
        return "";
    };

    const handleLogin = async () => {
        if (loading) return;
        setLoading(true);
        setError("");

        if (!email || !password) { setError("Vui lòng nhập đủ email và mật khẩu!"); setLoading(false); return; }
        const emailError = validateEmail(email);
        if (emailError) { setError(emailError); setLoading(false); return; }

        try {
            console.log("Sending login request:", { email, password });
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: email,
                password: password
            });
            console.log("Login response received:", response);

            if (response.status === 200 && response.data.token && response.data.user) {
                const { token, user: userData } = response.data;

                if (userData.role !== role) {
                    setError(`Đăng nhập thành công với vai trò ${userData.role}, nhưng bạn đang chọn đăng nhập với vai trò ${role}. Vui lòng chọn đúng vai trò.`);
                    setLoading(false);
                    return;
                }
                login(token, userData);
                toast.success(`Đăng nhập thành công với vai trò ${userData.role}!`, { position: "top-right", autoClose: 1000 });
                setLoading(false);
                setEmail("");
                setPassword("");
                onClose();

                if (userData.role === 'admin') {
                    console.log("Saving admin token to localStorage and redirecting...");
                    localStorage.setItem('adminToken', token);
                    const adminHomePageUrl = '/frontend_admin/adminPage/HomePage.html';
                    window.location.replace(adminHomePageUrl);
                } else {
                    console.log("Customer logged in, closing modal and navigating to /");
                    onClose();
                    navigate('/');
                }

            } else {
                throw new Error(response.data?.message || response.data?.error || "Dữ liệu đăng nhập trả về không hợp lệ.");
            }

        } catch (err) {
            console.error("Login error:", err.response || err);
            const errorMessage = err.response?.data?.error || "Thông tin đăng nhập chưa chính xác hoặc lỗi kết nối!";
            setError(errorMessage);
            toast.error(errorMessage, { position: "top-right", autoClose: 2000 });
            setLoading(false);
        }
    };

    const handleRegister = async () => {
        if (loading) return; setLoading(true); setError("");
        if (!name || !email || !password || !confirmPassword || !phoneNum) { setError("Vui lòng nhập đủ thông tin!"); setLoading(false); return; }
        const emailError = validateEmail(email); if (emailError) { setError(emailError); setLoading(false); return; }
        if (password.length < 8) { setError("Mật khẩu phải có ít nhất 8 ký tự"); setLoading(false); return; }
        if (password !== confirmPassword) { setError("Mật khẩu không khớp, vui lòng kiểm tra lại!"); setLoading(false); return; }
        const filteredPhone = phoneNum.replace(/\D/g, ""); if (!/^0\d{9}$/.test(filteredPhone)) { setError("Số điện thoại không hợp lệ"); setLoading(false); return; }
        try {
            console.log("Sending register request:", { name, email, password: '***', phone: filteredPhone });
            const response = await axios.post(`${API_BASE_URL}/register`, { name, email, password, phone: filteredPhone });
            console.log("Register response received:", response);
            if (response.status === 201) {
                toast.success("Đăng ký thành công! Vui lòng đăng nhập.", { position: "top-right", autoClose: 2000 });
                setLoading(false); setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); setPhoneNum(""); setError("");
                setIsLoginPage(true);
            } else { throw new Error("Đăng ký không thành công."); }
        } catch (err) {
            console.error("Register error:", err.response || err);
            const errorMessage = err.response?.data?.error || "Lỗi khi đăng ký! Email có thể đã tồn tại.";
            setError(errorMessage); toast.error(errorMessage, { position: "top-right", autoClose: 2000 }); setLoading(false);
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
                <button className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl" onClick={onClose} aria-label="Đóng">✖</button>
                <p className="text-2xl font-bold text-[#4338CA] mb-8">TRENDY STORE</p>

                {/* Form Đăng Nhập */}
                {isLoginPage ? (
                    <>
                        <input className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-[90%] px-4 py-2 mb-4 transition-all" type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} autoComplete="email" />
                        <div className="relative w-[90%] mb-4">
                            <input className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-full px-4 py-2 transition-all" type={showPass ? "text" : "password"} placeholder="Nhập mật khẩu" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} autoComplete="current-password" />
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300" disabled={loading}>{showPass ? "Ẩn" : "Hiện"}</button>
                        </div>
                        {error && (<p className="mb-4 self-center text-red-600 font-semibold w-[90%] text-center text-sm">{error}</p>)}
                        <div className="flex flex-row justify-between w-[90%] text-sm">
                            <button onClick={changeLoginRole} className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300 disabled:opacity-50" disabled={loading}>{isCustomer ? "Đăng nhập admin" : "Đăng nhập user"}</button>
                            <button onClick={() => { setIsLoginPage(false); setError(""); }} className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300 disabled:opacity-50" disabled={loading}>Đăng kí tài khoản</button>
                        </div>
                        <button className="border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b56d2] disabled:opacity-50 disabled:cursor-not-allowed duration-300 w-[90%] px-4 py-2 mt-5 transition-all" onClick={handleLogin} disabled={loading}>{loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}</button>
                    </>
                ) : (
                    <>
                         <input className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-[90%] px-4 py-2 mb-4 transition-all" type="text" placeholder="Nhập họ tên" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} autoComplete="name"/>
                         <input className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-[90%] px-4 py-2 mb-4 transition-all" type="email" placeholder="Nhập email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} autoComplete="email"/>
                         <div className="relative w-[90%] mb-4">
                             <input className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-full px-4 py-2 transition-all" type={showPass ? "text" : "password"} placeholder="Nhập mật khẩu (ít nhất 8 ký tự)" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} autoComplete="new-password"/>
                             <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300" disabled={loading}>{showPass ? "Ẩn" : "Hiện"}</button>
                         </div>
                         <div className="relative w-[90%] mb-4">
                             <input className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-full px-4 py-2 transition-all" type={showConfirmPass ? "text" : "password"} placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} autoComplete="new-password"/>
                             <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300" disabled={loading}>{showConfirmPass ? "Ẩn" : "Hiện"}</button>
                         </div>
                         <input className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-[90%] px-4 py-2 mb-4 transition-all" type="tel" placeholder="Số điện thoại (10 số, bắt đầu bằng 0)" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} maxLength={10} disabled={loading} autoComplete="tel"/>
                         {error && (<p className="mb-4 self-center text-red-600 font-semibold w-[90%] text-center text-sm">{error}</p>)}
                         <div className="flex flex-row justify-end w-[90%] text-sm">
                             <button onClick={() => { setIsLoginPage(true); setError(""); }} className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300 disabled:opacity-50" disabled={loading}>Đã có tài khoản? Đăng nhập</button>
                         </div>
                         <button className="border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b56d2] disabled:opacity-50 disabled:cursor-not-allowed duration-300 w-[90%] px-4 py-2 mt-5 transition-all" onClick={handleRegister} disabled={loading}>{loading ? "Đang xử lý..." : "ĐĂNG KÝ"}</button>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default LoginPage;