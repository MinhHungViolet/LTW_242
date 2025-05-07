import React, { useState, useEffect } from "react";
 import { motion } from 'framer-motion';
 import { useNavigate } from 'react-router-dom';
 import { useAuth } from "../contexts/AuthContext";
 import axios from 'axios'; 
 import Cart from '../Product/Cart'; 
 import cartIcon from '../Images/cart.png';
 import defaultAvatar from '../Images/default-avt.jpg'; 
 import { X, Menu } from 'lucide-react';


 const API_BASE_URL = "http://localhost/backend/public";
 const UPLOADS_URL = "http://localhost/backend/public/uploads";

 const Navbar = () => {
     const navigate = useNavigate();
     const { token, isLoading: authLoading, user } = useAuth();

     const [isOpenNav, setIsOpenNav] = useState(false);
     const [isOpenCart, setIsOpenCart] = useState(false);
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

     const [avatarFilename, setAvatarFilename] = useState(null);
     const [isFetchingProfile, setIsFetchingProfile] = useState(false);

     useEffect(() => {
         const fetchProfileForAvatar = async () => {
             if (!authLoading && token) {
                 setIsFetchingProfile(true);
                 console.log("Navbar: Fetching profile for avatar with token:", token);
                 try {
                     const headers = { Authorization: `Bearer ${token}` };
                     const response = await axios.get(`${API_BASE_URL}/user/profile`, { headers });
                     if (response.status === 200 && response.data) {
                         console.log("Navbar: Profile data received:", response.data);
                         setAvatarFilename(response.data.avatar || null);
                     } else { setAvatarFilename(null); }
                 } catch (error) {
                     console.error("Navbar: Error fetching profile data:", error.response || error);
                     setAvatarFilename(null);
                 } finally { setIsFetchingProfile(false); }
             } else if (!authLoading && !token) {
                 setAvatarFilename(null);
             }
         };
         fetchProfileForAvatar();
     }, [authLoading, token]);

     const openCart = () => {
         setIsOpenCart(prev => !prev);
     };

     const getAvatarSrc = () => {
         if (avatarFilename) {
             return `${UPLOADS_URL}/avatars/${avatarFilename}?t=${Date.now()}`;
         }
         return defaultAvatar;
     };

     return (
         <div className='sticky top-0 z-50'>
             <div className="bg-white flex flex-row items-center justify-between p-2 shadow-md ">
                 <div className="hidden lg:flex flex-row justify-between w-auto lg:w-[36rem] ml-5 text-[#3f3f3e] text-lg font-semibold ">
                     <a href="/introduction" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Trang chủ</a>
                     <a href="/product" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Sản phẩm</a>
                     <a href="/news" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Bài viết</a>
                     <a href="/question" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Hỏi đáp</a>
                     <a href="/introduction" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Liên hệ</a>
                     <a href="/introduction" className='hover:text-[#495DE5] transition-all duration-300 p-2'>Giới thiệu</a>
                 </div>

                 <button
                     className="lg:hidden text-[#3f3f3e] mr-5 z-[60]"
                     onClick={() => setIsOpenNav(!isOpenNav)}
                 >
                     {isOpenNav ? <X size={30} className='ml-5' /> : <Menu size={30} className='ml-5' />}
                 </button>

                 {/* Icons Cart và User */}
                 <div className='flex flex-row mr-4 md:mr-6 lg:mr-8 items-center justify-end space-x-4 sm:space-x-6'>

                     <div className='relative cursor-pointer p-2' onClick={openCart}>
                         <img src={cartIcon} alt="Giỏ hàng" className='w-7 h-7' />
                         {!isCartLoading && cartCount > 0 && (
                             <span className='absolute top-0 right-0 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full transform translate-x-1/3 -translate-y-1/3'>
                                 {cartCount > 9 ? '9+' : cartCount}
                             </span>
                         )}
                          {isCartLoading && <span className='absolute top-0 right-0 w-5 h-5 flex items-center justify-center'><div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500"></div></span>}
                     </div>
                      {(authLoading || isFetchingProfile) && <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>}
                      {!authLoading && !isFetchingProfile && (
                        <img
                            src={getAvatarSrc()}
                            alt="Tài khoản"
                            className='w-8 h-8 rounded-full cursor-pointer object-cover border border-gray-200 hover:opacity-80 transition-opacity'
                            onClick={() => {
                                if (user) {
                                    navigate("/user");
                                } else {
                                     console.log("Navbar: User not logged in. Cannot navigate to /user.");
                                }
                            }}
                            title={user ? (user.name || user.email) : "Tài khoản"}
                         />
                      )}
                 </div>
                 {isOpenCart && (<Cart onClose={openCart} />)}

             </div>
              <motion.ul
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={isOpenNav ? { x: 0, opacity: 1 } : { x: "-100%", opacity: 0 }}
                  exit={{ x: "-100%", opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="lg:hidden fixed top-0 left-0 h-full w-3/4 max-w-xs origin-left flex flex-col items-start pt-20 p-5 space-y-1 bg-white text-lg font-semibold shadow-lg z-[55]"
              >
                   <li className='w-full border-b border-gray-100'><a href="/introduction" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Trang chủ</a></li>
                   <li className='w-full border-b border-gray-100'><a href="/product" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Sản phẩm</a></li>
                   <li className='w-full border-b border-gray-100'><a href="/news" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Bài viết</a></li>
                   <li className='w-full border-b border-gray-100'><a href="/question" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Hỏi đáp</a></li>
                   <li className='w-full border-b border-gray-100'><a href="/introduction" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Liên hệ</a></li>
                   <li className='w-full'><a href="/introduction" className='block p-3 rounded hover:bg-gray-100 w-full text-left text-base'>Giới thiệu</a></li>
              </motion.ul>
         </div>
     )
 }

 export default Navbar;