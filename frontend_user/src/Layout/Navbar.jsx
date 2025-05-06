import React, { useState, useEffect } from "react"; // Giữ lại useEffect vì dùng cho cả cart và profile
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext"; // Vẫn cần để lấy token và trạng thái loading auth
import axios from 'axios';                       // Cần axios cho cả 2 API call
// import Cart from '../Product/Cart';          // Giữ lại nếu bạn vẫn mở Cart từ đây
import cartIcon from '../Images/cart.png';
import defaultAvatar from '../Images/default-avt.jpg';
import { X, Menu } from 'lucide-react';

// --- Định nghĩa URL ---
const API_BASE_URL = "http://localhost/backend/public";
// Đường dẫn web CÔNG KHAI tới thư mục chứa ảnh upload
const UPLOADS_URL = "http://localhost/backend/public/uploads";

const Navbar = () => {
    const navigate = useNavigate();
    // Lấy token và trạng thái loading auth từ context
    const { token, isLoading: authLoading, user } = useAuth(); // Lấy thêm user để biết đã đăng nhập chưa cho avatar click

    // State cho menu và cart modal (giữ nguyên)
    const [isOpenNav, setIsOpenNav] = useState(false);
    const [isOpenCart, setIsOpenCart] = useState(false);

    // --- GIỮ NGUYÊN: State và useEffect fetch cart count như bạn cung cấp ---
    const [cartCount, setCartCount] = useState(0);
    const [isCartLoading, setIsCartLoading] = useState(false);

    useEffect(() => {
        const fetchCartCount = async () => {
            if (!authLoading && token) {
                setIsCartLoading(true);
                console.log("Navbar: Fetching cart count with token:", token);
                try {
                    const headers = { Authorization: `Bearer ${token}` };
                    const response = await axios.get(`${API_BASE_URL}/cart`, { headers });
                    if (response.status === 200 && response.data && Array.isArray(response.data.items)) {
                        const totalQuantity = response.data.items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
                        setCartCount(totalQuantity);
                        console.log("Navbar: Cart count updated:", totalQuantity);
                    } else { setCartCount(0); }
                } catch (error) {
                    console.error("Navbar: Error fetching cart data:", error.response || error);
                    setCartCount(0);
                } finally { setIsCartLoading(false); }
            } else if (!authLoading && !token) {
               setCartCount(0);
               console.log("Navbar: No token, cart count set to 0.");
            }
        };
        fetchCartCount();
    }, [authLoading, token]);
    // --- KẾT THÚC GIỮ NGUYÊN CART COUNT ---

    // --- THÊM MỚI: State để lưu tên file avatar lấy từ API ---
    const [avatarFilename, setAvatarFilename] = useState(null);
    const [isFetchingProfile, setIsFetchingProfile] = useState(false); // Loading riêng cho profile fetch

    // --- THÊM MỚI: useEffect để fetch profile (chủ yếu lấy avatar) ---
    useEffect(() => {
        const fetchProfileForAvatar = async () => {
            // Chỉ fetch khi có token và chưa fetch xong auth ban đầu
            if (!authLoading && token) {
                setIsFetchingProfile(true);
                console.log("Navbar: Fetching profile for avatar with token:", token);
                try {
                    const headers = { Authorization: `Bearer ${token}` };
                    const response = await axios.get(`${API_BASE_URL}/user/profile`, { headers });
                    if (response.status === 200 && response.data) {
                        console.log("Navbar: Profile data received:", response.data);
                        setAvatarFilename(response.data.avatar || null); // Lưu tên file avatar vào state riêng
                    } else {
                        setAvatarFilename(null);
                    }
                } catch (error) {
                    console.error("Navbar: Error fetching profile data:", error.response || error);
                    setAvatarFilename(null); // Đặt là null nếu lỗi
                } finally {
                    setIsFetchingProfile(false);
                }
            } else if (!authLoading && !token) {
                // Nếu không có token, đảm bảo avatarFilename là null
                setAvatarFilename(null);
            }
        };
        fetchProfileForAvatar();
    }, [authLoading, token]); // Chạy lại khi token hoặc trạng thái auth thay đổi

    // Hàm mở/đóng Cart modal (giữ nguyên)
    const openCart = () => {
        setIsOpenCart(prev => !prev);
    };

    // --- SỬA ĐỔI: Hàm getAvatarSrc dùng state avatarFilename ---
    const getAvatarSrc = () => {
        // Ưu tiên dùng state avatarFilename đã fetch được
        if (avatarFilename) {
            return `${UPLOADS_URL}/avatars/${avatarFilename}?t=${Date.now()}`; // Thêm timestamp
        }
        // Nếu không có (chưa fetch xong, lỗi, hoặc user không có avatar) thì dùng ảnh mặc định
        return defaultAvatar;
    };
    // --- KẾT THÚC SỬA ĐỔI ---

    // --- XÓA BỎ: Hàm handleLogoutClick không còn dùng ---
    // const handleLogoutClick = () => { ... };

    // --- PHẦN JSX ---
    return (
        <div className='sticky top-0 z-50'>
            <div className="bg-white flex flex-row items-center justify-between p-2 shadow-md ">
                {/* Phần Menu Desktop (Giữ nguyên) */}
                <div className="hidden lg:flex flex-row justify-between w-auto lg:w-[36rem] ml-5 text-[#3f3f3e] text-lg font-semibold ">
                    <a href="/user_app" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Trang chủ</a>
                    <a href="/user_app/product" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Sản phẩm</a>
                    <a href="/user_app/news" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Bài viết</a>
                    <a href="/user_app/question" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Hỏi đáp</a>
                    <a href="/user_app/contact" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Liên hệ</a>
                    <a href="/user_app/introduction" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Giới thiệu</a>
                </div>

                {/* Nút Hamburger (Giữ nguyên) */}
                <button
                    className="lg:hidden text-[#3f3f3e] mr-5 z-[60]"
                    onClick={() => setIsOpenNav(!isOpenNav)}
                >
                    {isOpenNav ? <X size={30} className='ml-5' /> : <Menu size={30} className='ml-5' />}
                </button>

                {/* Icons Cart và User */}
                <div className='flex flex-row mr-4 md:mr-6 lg:mr-8 items-center justify-end space-x-4 sm:space-x-6'>
                    {/* Icon Cart với Badge (Giữ nguyên logic state cục bộ như bạn cung cấp) */}
                    <div className='relative cursor-pointer p-2' onClick={openCart}>
                        <img src={cartIcon} alt="Giỏ hàng" className='w-7 h-7' />
                        {!isCartLoading && cartCount > 0 && (
                            <span className='absolute top-0 right-0 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1/3 -translate-y-1/3'>
                                {cartCount > 9 ? '9+' : cartCount}
                            </span>
                        )}
                         {isCartLoading && <span className='absolute top-0 right-0 w-5 h-5 flex items-center justify-center'><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></div></span>}
                    </div>

                    {/* Icon User/Avatar */}
                     {(authLoading || isFetchingProfile) && <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>} {/* Loading khi đang fetch auth hoặc profile */}
                     {!authLoading && !isFetchingProfile && ( // Chỉ hiển thị ảnh khi load xong
                       <img
                           src={getAvatarSrc()} // <<< Gọi hàm lấy src đã sửa đổi
                           alt="Tài khoản"
                           className='w-8 h-8 rounded-full cursor-pointer object-cover border border-gray-200 hover:opacity-80 transition-opacity'
                           onClick={() => { if (user) { navigate("/user"); } else { console.log("User not logged in."); /* Có thể mở login */ } }}
                           title={user ? (user.name || user.email) : "Tài khoản"} // Hiển thị tooltip
                        />
                     )}
                    {/* --- XÓA BỎ: Nút Đăng nhập / Đăng xuất ở đây --- */}
                </div>

                {/* Cart Modal */}
                {/* {isOpenCart && (<Cart onClose={openCart} />)} */}

            </div>

            {/* Navigation Mobile Menu */}
             <motion.ul
                 initial={{ x: "-100%", opacity: 0 }}
                 animate={isOpenNav ? { x: 0, opacity: 1 } : { x: "-100%", opacity: 0 }}
                 exit={{ x: "-100%", opacity: 0 }}
                 transition={{ duration: 0.4, ease: "easeOut" }}
                 className="lg:hidden fixed top-0 left-0 h-full w-3/4 max-w-xs origin-left flex flex-col items-start pt-20 p-5 space-y-1 bg-white text-lg font-semibold shadow-lg z-[55]"
             >
                  <li className='w-full border-b border-gray-100'><a href="/" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Trang chủ</a></li>
                  <li className='w-full border-b border-gray-100'><a href="/product" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Sản phẩm</a></li>
                  <li className='w-full border-b border-gray-100'><a href="/news" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Bài viết</a></li>
                  <li className='w-full border-b border-gray-100'><a href="/question" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Hỏi đáp</a></li>
                  <li className='w-full border-b border-gray-100'><a href="/contact" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Liên hệ</a></li>
                  <li className='w-full'><a href="/introduction" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Giới thiệu</a></li>
                  {/* --- XÓA BỎ: li chứa nút Đăng nhập/Đăng xuất ở đây --- */}
             </motion.ul>
        </div>
    )
}

export default Navbar;