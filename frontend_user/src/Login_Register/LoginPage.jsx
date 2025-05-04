// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { useAuth } from '../contexts/AuthContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const LoginPage = ({ onClose }) => {
//     const { login } = useAuth();

//     const [isCustomer, setIsCustomer] = useState(true);
//     const [isLoginPage, setIsLoginPage] = useState(true);
//     const [showPass, setShowPass] = useState(false);
//     const [showConfirmPass, setShowConfirmPass] = useState(false);
//     const [loading, setLoading] = useState(false);

//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [phoneNum, setPhoneNum] = useState("");
//     const [name, setName] = useState("");
//     const [role, setRole] = useState("customer");

//     const [error, setError] = useState("");

//     const changeLoginRole = () => {
//         setIsCustomer(!isCustomer);
//         setRole(isCustomer ? "admin" : "customer");
//     };

//     const validateEmail = (email) => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(email)) {
//             return "Email không hợp lệ!";
//         }
//         const usernamePart = email.split('@')[0];
//         if (!/^[a-zA-Z]/.test(usernamePart)) {
//             return "Tài khoản phải bắt đầu bằng chữ cái!";
//         }
//         return "";
//     };

//     const handleLogin = async () => {
//         if (loading) return;
//         setLoading(true);
//         setError("");

//         if (!email || !password) {
//             setError("Vui lòng nhập đủ thông tin!");
//             setLoading(false);
//             return;
//         }

//         const emailError = validateEmail(email);
//         if (emailError) {
//             setError(emailError);
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.post("http://localhost/backend/src/Controllers/Auth.php", {
//                 action: "login",
//                 email,
//                 password,
//             });

//             if (response.data.status === "success") {
//                 const userData = response.data.data;
//                 if (userData.role !== role) {
//                     setError(`Tài khoản này có vai trò ${userData.role}, không phải ${role}!`);
//                     setLoading(false);
//                     return;
//                 }
//                 login(userData);
//                 toast.success("Đăng nhập thành công!", {
//                     position: "top-right",
//                     autoClose: 2000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                 });
//                 setLoading(false);
//                 setTimeout(() => {
//                     onClose();
//                 }, 2000); // Chỉ đóng modal, không điều hướng
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || "Thông tin đăng nhập chưa chính xác!");
//             setLoading(false);
//         }
//     };

//     const handleRegister = async () => {
//         if (loading) return;
//         setLoading(true);
//         setError("");

//         if (!name || !email || !password || !confirmPassword || !phoneNum) {
//             setError("Vui lòng nhập đủ thông tin!");
//             setLoading(false);
//             return;
//         }

//         const emailError = validateEmail(email);
//         if (emailError) {
//             setError(emailError);
//             setLoading(false);
//             return;
//         }

//         if (password.length < 6) {
//             setError("Mật khẩu phải có ít nhất 6 ký tự");
//             setLoading(false);
//             return;
//         }

//         if (password !== confirmPassword) {
//             setError("Mật khẩu không khớp, vui lòng kiểm tra lại!");
//             setLoading(false);
//             return;
//         }

//         const filteredPhone = phoneNum.replace(/\D/g, "");
//         if (!/^0\d{9}$/.test(filteredPhone)) {
//             setError("Số điện thoại phải có 10 chữ số, bắt đầu bằng số 0 và không chứa chữ cái");
//             setLoading(false);
//             return;
//         }

//         try {
//             const response = await axios.post("http://localhost/backend/src/Controllers/Auth.php", {
//                 action: "register",
//                 name,
//                 email,
//                 password,
//                 phone: filteredPhone,
//             });

//             if (response.data.status === "success") {
//                 const userData = response.data.data;
//                 userData.role = "customer";
//                 login(userData);
//                 toast.success("Đăng ký thành công!", {
//                     position: "top-right",
//                     autoClose: 2000,
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                 });
//                 setLoading(false);
//                 setTimeout(() => {
//                     onClose();
//                 }, 2000); // Chỉ đóng modal, không điều hướng
//             }
//         } catch (err) {
//             setError(err.response?.data?.message || "Lỗi khi đăng ký!");
//             setLoading(false);
//         }
//     };

//     return (
//         <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//             onClick={onClose}
//         >
//             <motion.div
//                 className="bg-white p-6 rounded-md shadow-lg relative w-[30rem] flex flex-col items-center"
//                 onClick={(e) => e.stopPropagation()}
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.8 }}
//                 transition={{ duration: 0.3, ease: "easeOut" }}
//             >
//                 <button
//                     className="absolute top-4 right-4 text-gray-600 hover:text-black"
//                     onClick={onClose}
//                 >
//                     ✖
//                 </button>
//                 {isLoginPage ? (
//                     <>
//                         <p className="text-2xl font-bold text-[#4338CA] mb-8">CÔNG TY ABCXYZ</p>
//                         <input
//                             className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4"
//                             type="email"
//                             placeholder="Nhập email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             disabled={loading}
//                         />
//                         <div className="relative w-[90%] mb-4">
//                             <input
//                                 className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
//                                 type={showPass ? "text" : "password"}
//                                 placeholder="Nhập mật khẩu"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 disabled={loading}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPass(!showPass)}
//                                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
//                                 disabled={loading}
//                             >
//                                 {showPass ? "Ẩn" : "Hiển thị"}
//                             </button>
//                         </div>
//                         {error && (
//                             <p className="mb-4 self-center text-[#ff0000] font-semibold w-[90%]">
//                                 {error}
//                             </p>
//                         )}
//                         <div className="flex flex-row justify-between w-[90%]">
//                             <button
//                                 onClick={changeLoginRole}
//                                 className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300"
//                                 disabled={loading}
//                             >
//                                 {isCustomer ? "Đăng nhập admin" : "Đăng nhập user"}
//                             </button>
//                             <button
//                                 onClick={() => setIsLoginPage(!isLoginPage)}
//                                 className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300"
//                                 disabled={loading}
//                             >
//                                 Đăng kí tài khoản
//                             </button>
//                         </div>
//                         <button
//                             className="border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white duration-300 w-[90%] px-4 py-2 mt-5"
//                             onClick={handleLogin}
//                             disabled={loading}
//                         >
//                             {loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
//                         </button>
//                     </>
//                 ) : (
//                     <>
//                         <p className="text-2xl font-bold text-[#4338CA] mb-8">CÔNG TY ABCXYZ</p>
//                         <input
//                             className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4"
//                             type="text"
//                             placeholder="Nhập họ tên"
//                             value={name}
//                             onChange={(e) => setName(e.target.value)}
//                             disabled={loading}
//                         />
//                         <input
//                             className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-4"
//                             type="email"
//                             placeholder="Nhập email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             disabled={loading}
//                         />
//                         <div className="relative w-[90%] mb-5">
//                             <input
//                                 className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
//                                 type={showPass ? "text" : "password"}
//                                 placeholder="Nhập mật khẩu"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 disabled={loading}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPass(!showPass)}
//                                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
//                                 disabled={loading}
//                             >
//                                 {showPass ? "Ẩn" : "Hiển thị"}
//                             </button>
//                         </div>
//                         <div className="relative w-[90%] mb-5">
//                             <input
//                                 className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-full px-4 py-2"
//                                 type={showConfirmPass ? "text" : "password"}
//                                 placeholder="Xác nhận mật khẩu"
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 disabled={loading}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowConfirmPass(!showConfirmPass)}
//                                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
//                                 disabled={loading}
//                             >
//                                 {showConfirmPass ? "Ẩn" : "Hiển thị"}
//                             </button>
//                         </div>
//                         <input
//                             className="border-2 border-[#818CF8] focus:outline-none rounded-md text-black w-[90%] px-4 py-2 mb-5"
//                             type="tel"
//                             placeholder="Số điện thoại"
//                             value={phoneNum}
//                             onChange={(e) => setPhoneNum(e.target.value)}
//                             pattern="[0-9]{10}"
//                             maxLength="10"
//                             inputMode="numeric"
//                             disabled={loading}
//                         />
//                         {error && (
//                             <p className="mb-4 self-center text-[#ff0000] font-semibold w-[90%]">
//                                 {error}
//                             </p>
//                         )}
//                         <div className="flex flex-row justify-end w-[90%]">
//                             <button
//                                 onClick={() => setIsLoginPage(!isLoginPage)}
//                                 className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300"
//                                 disabled={loading}
//                             >
//                                 Đăng nhập tài khoản
//                             </button>
//                         </div>
//                         <button
//                             className="border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white duration-300 w-[90%] px-4 py-2 mt-5"
//                             onClick={handleRegister}
//                             disabled={loading}
//                         >
//                             {loading ? "Đang xử lý..." : "ĐĂNG KÝ"}
//                         </button>
//                     </>
//                 )}
//             </motion.div>
//         </div>
//     );
// };

// export default LoginPage;

import React, { useState } from 'react'; // Thêm React nếu chưa có
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast

// *** ĐỊNH NGHĨA BASE URL CHO API ***
// Cách tốt nhất là dùng biến môi trường .env (process.env.REACT_APP_API_URL)
// Ví dụ tạm thời:
const API_BASE_URL = "http://localhost/backend/public"; // Thay bằng URL gốc API của bạn

const LoginPage = ({ onClose }) => {
    // Lấy hàm login từ context (đã được cập nhật để xử lý token)
    const { login } = useAuth();

    // Các state quản lý giao diện và form
    const [isCustomer, setIsCustomer] = useState(true); // Chỉ ảnh hưởng UI login
    const [isLoginPage, setIsLoginPage] = useState(true); // Chuyển đổi login/register
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false); // Trạng thái chờ API

    // State cho các input field
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [name, setName] = useState("");
    const [role, setRole] = useState("customer"); // State cho UI chọn role login

    // State hiển thị lỗi
    const [error, setError] = useState("");

    // Hàm chuyển đổi UI login customer/admin
    const changeLoginRole = () => {
        setIsCustomer(!isCustomer);
        setRole(isCustomer ? "admin" : "customer");
        setError(""); // Xóa lỗi khi chuyển role
    };

    // Hàm validate email (giữ nguyên)
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Email không hợp lệ!";
        }
        // Allow email starting with number based on previous behavior.
        // Remove this check if username part shouldn't start with number.
        // const usernamePart = email.split('@')[0];
        // if (!/^[a-zA-Z]/.test(usernamePart)) {
        //     return "Tài khoản phải bắt đầu bằng chữ cái!";
        // }
        return "";
    };

    // --- HÀM XỬ LÝ ĐĂNG NHẬP (ĐÃ CẬP NHẬT) ---
    const handleLogin = async () => {
        if (loading) return;
        setLoading(true);
        setError("");

        if (!email || !password) {
            setError("Vui lòng nhập đủ email và mật khẩu!");
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
            console.log("Sending login request:", { email, password }); // Log dữ liệu gửi đi
            // Gọi API /login với đúng URL và body
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email: email,
                password: password
            });
            console.log("Login response received:", response); // Log response

            // Kiểm tra thành công dựa trên status code và dữ liệu trả về
            if (response.status === 200 && response.data && response.data.token && response.data.user) {
                const { token, user: userData } = response.data;

                // (Tùy chọn) Kiểm tra role trả về có khớp với role chọn trên UI không
                if (userData.role !== role) {
                    setError(`Đăng nhập thành công với vai trò ${userData.role}, nhưng bạn đang chọn đăng nhập với vai trò ${role}. Vui lòng chọn đúng vai trò.`);
                    setLoading(false);
                    return; // Không đóng modal
                }

                // Gọi hàm login từ context để lưu token và user state
                login(token, userData);

                toast.success("Đăng nhập thành công!", { position: "top-right", autoClose: 1500 });
                setLoading(false);
                setTimeout(() => {
                    onClose(); // Đóng modal sau khi thông báo
                }, 1500);
            } else {
                // Xử lý trường hợp API trả về 200 nhưng không có token/user (ít xảy ra)
                throw new Error(response.data?.message || response.data?.error || "Dữ liệu đăng nhập trả về không hợp lệ.");
            }

        } catch (err) {
            console.error("Login error:", err.response || err); // Log lỗi chi tiết
            const errorMessage = err.response?.data?.error || "Thông tin đăng nhập chưa chính xác hoặc lỗi kết nối!";
            setError(errorMessage);
            toast.error(errorMessage, { position: "top-right", autoClose: 2000 });
            setLoading(false);
        }
    };

    // --- HÀM XỬ LÝ ĐĂNG KÝ (ĐÃ CẬP NHẬT) ---
    const handleRegister = async () => {
        if (loading) return;
        setLoading(true);
        setError("");

        // Client-side validation
        if (!name || !email || !password || !confirmPassword || !phoneNum) {
             setError("Vui lòng nhập đủ thông tin!"); setLoading(false); return;
        }
        const emailError = validateEmail(email);
        if (emailError) {
             setError(emailError); setLoading(false); return;
        }
        // Đồng bộ yêu cầu mật khẩu với backend (ví dụ: 8 ký tự)
        if (password.length < 8) {
             setError("Mật khẩu phải có ít nhất 8 ký tự"); setLoading(false); return;
        }
        if (password !== confirmPassword) {
             setError("Mật khẩu không khớp, vui lòng kiểm tra lại!"); setLoading(false); return;
        }
        const filteredPhone = phoneNum.replace(/\D/g, "");
        // Kiểm tra SĐT Việt Nam hợp lệ (10 số, bắt đầu bằng 0)
        if (!/^0\d{9}$/.test(filteredPhone)) {
             setError("Số điện thoại phải có 10 chữ số và bắt đầu bằng 0"); setLoading(false); return;
        }

        try {
            console.log("Sending register request:", { name, email, password: '***', phone: filteredPhone }); // Không log password
            // Gọi API /register với đúng URL và body
            const response = await axios.post(`${API_BASE_URL}/register`, {
                name: name,
                email: email,
                password: password, // Gửi password gốc, backend sẽ hash
                phone: filteredPhone
                // Thêm avatar nếu có: avatar: avatarState
            });
            console.log("Register response received:", response); // Log response

            // Kiểm tra thành công dựa trên status code 201
            if (response.status === 201) {
                toast.success("Đăng ký thành công! Vui lòng đăng nhập.", { position: "top-right", autoClose: 2000 });
                setLoading(false);
                // Reset form
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setPhoneNum("");
                setError("");
                // Chuyển sang tab đăng nhập
                setIsLoginPage(true);
                // Không gọi login() ở đây
                // Không cần đóng modal ngay
            } else {
                // Xử lý trường hợp response status khác 201 (ít xảy ra với axios nếu không lỗi)
                throw new Error(response.data?.message || response.data?.error || "Đăng ký không thành công.");
            }

        } catch (err) {
            console.error("Register error:", err.response || err); // Log lỗi chi tiết
            // Lấy lỗi từ response.data.error nếu có
            const errorMessage = err.response?.data?.error || "Lỗi khi đăng ký! Email có thể đã tồn tại hoặc lỗi server.";
            setError(errorMessage);
            toast.error(errorMessage, { position: "top-right", autoClose: 2000 });
            setLoading(false);
        }
    };

    // --- PHẦN JSX HIỂN THỊ GIAO DIỆN (GIỮ NGUYÊN NHƯ CODE GỐC CỦA BẠN) ---
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose} // Click ra ngoài để đóng
        >
            <motion.div
                className="bg-white p-6 rounded-md shadow-lg relative w-[30rem] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()} // Ngăn click bên trong đóng modal
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {/* Nút đóng modal */}
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl" // Tăng kích thước nút đóng
                    onClick={onClose}
                    aria-label="Đóng" // Thêm aria-label cho accessibility
                >
                    ✖
                </button>

                {/* Tiêu đề chung */}
                 <p className="text-2xl font-bold text-[#4338CA] mb-8">CÔNG TY ABCXYZ</p>

                {/* Form Đăng Nhập */}
                {isLoginPage ? (
                    <>
                        <input
                            className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-[90%] px-4 py-2 mb-4 transition-all" // Thêm focus style và transition
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            autoComplete="email" // Thêm autocomplete
                        />
                        <div className="relative w-[90%] mb-4">
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-full px-4 py-2 transition-all" // Thêm focus style và transition
                                type={showPass ? "text" : "password"}
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                autoComplete="current-password" // Thêm autocomplete
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                                disabled={loading}
                            >
                                {showPass ? "Ẩn" : "Hiện"}
                            </button>
                        </div>

                        {/* Hiển thị lỗi */}
                        {error && (
                            <p className="mb-4 self-center text-red-600 font-semibold w-[90%] text-center text-sm">
                                {error}
                            </p>
                        )}

                        {/* Các nút chức năng */}
                        <div className="flex flex-row justify-between w-[90%] text-sm"> {/* Giảm font size */}
                            <button
                                onClick={changeLoginRole}
                                className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300 disabled:opacity-50"
                                disabled={loading}
                            >
                                {isCustomer ? "Đăng nhập admin" : "Đăng nhập user"}
                            </button>
                            <button
                                onClick={() => { setIsLoginPage(false); setError(""); }} // Chuyển sang Đăng ký và xóa lỗi cũ
                                className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300 disabled:opacity-50"
                                disabled={loading}
                            >
                                Đăng kí tài khoản
                            </button>
                        </div>

                        {/* Nút Đăng Nhập chính */}
                        <button
                            className="border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b56d2] disabled:opacity-50 disabled:cursor-not-allowed duration-300 w-[90%] px-4 py-2 mt-5 transition-all"
                            onClick={handleLogin}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
                        </button>
                    </>
                ) : (
                /* Form Đăng Ký */
                    <>
                        <input
                            className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-[90%] px-4 py-2 mb-4 transition-all"
                            type="text"
                            placeholder="Nhập họ tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            autoComplete="name"
                        />
                        <input
                            className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-[90%] px-4 py-2 mb-4 transition-all"
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            autoComplete="email"
                        />
                        <div className="relative w-[90%] mb-4"> {/* Giảm mb */}
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-full px-4 py-2 transition-all"
                                type={showPass ? "text" : "password"}
                                placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass(!showPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                                disabled={loading}
                            >
                                {showPass ? "Ẩn" : "Hiện"}
                            </button>
                        </div>
                        <div className="relative w-[90%] mb-4"> {/* Giảm mb */}
                            <input
                                className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-full px-4 py-2 transition-all"
                                type={showConfirmPass ? "text" : "password"}
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPass(!showConfirmPass)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#424ecd] font-semibold hover:text-[#3744d6] transition-colors duration-300"
                                disabled={loading}
                            >
                                {showConfirmPass ? "Ẩn" : "Hiện"}
                            </button>
                        </div>
                        <input
                            className="border-2 border-[#818CF8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] rounded-md text-black w-[90%] px-4 py-2 mb-4 transition-all" // Giảm mb
                            type="tel" // Dùng type="tel" cho SĐT
                            placeholder="Số điện thoại (10 số, bắt đầu bằng 0)"
                            value={phoneNum}
                            onChange={(e) => setPhoneNum(e.target.value)}
                            maxLength={10} // Giới hạn 10 ký tự
                            disabled={loading}
                            autoComplete="tel"
                        />

                         {/* Hiển thị lỗi */}
                        {error && (
                            <p className="mb-4 self-center text-red-600 font-semibold w-[90%] text-center text-sm">
                                {error}
                            </p>
                        )}

                        {/* Nút chuyển về Đăng nhập */}
                        <div className="flex flex-row justify-end w-[90%] text-sm">
                            <button
                                onClick={() => { setIsLoginPage(true); setError(""); }} // Chuyển về Đăng nhập và xóa lỗi cũ
                                className="text-[#424ecd] font-semibold hover:text-[#3744d6] hover:duration-300 disabled:opacity-50"
                                disabled={loading}
                            >
                                Đã có tài khoản? Đăng nhập
                            </button>
                        </div>

                        {/* Nút Đăng Ký chính */}
                        <button
                            className="border-2 border-[#424ecd] rounded-md text-[#424ecd] text-lg font-bold bg-white hover:bg-[#4b56d2] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4b56d2] disabled:opacity-50 disabled:cursor-not-allowed duration-300 w-[90%] px-4 py-2 mt-5 transition-all"
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