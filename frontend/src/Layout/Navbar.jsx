import cart from '../Images/cart.png'
import heart from '../Images/heart.png'
import avatar from '../Images/avatar.png'
import { X, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from "react";
import { div } from 'framer-motion/client';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='sticky top-0 z-50'>
        <div className="bg-white flex flex-row items-center justify-between p-2 shadow-md ">
            {/* Page - Desktop */}
            <div className="hidden lg:flex flex-row justify-between w-[36rem] ml-5 text-[#3f3f3e] text-lg font-semibold ">
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Trang chủ</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Sản phẩm</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Bài viết</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Hỏi đáp</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Liên hệ</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Giới thiệu</a>
        </div>
            {/* Nút Hamburger - Hiện trên mobile */}
           <button
             className="lg:hidden text-[#3f3f3e] mr-5 z-50"
             onClick={() => setIsOpen(!isOpen)}
           >
             {isOpen ? <X size={30} className='ml-5' /> : <Menu size={30} className='ml-5' />}
           </button>
            {/* Icon */}
            <div className='flex flex-row mr-10 items-center justify-between w-[8rem]'>
                <img src={cart} alt="" className='w-7 h-7  ' />
                <img src={heart} alt="" className='w-7 h-7 ' />
                <img src={avatar} alt="" className='w-8 h-8 rounded-full ' />
            </div>
            
        </div>
        {isOpen && (
          <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsOpen(!isOpen)}
              />
          )}
        <motion.ul
                initial={{ scaleY: 0, opacity: 0 }}
                animate={isOpen ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="lg:hidden absolute top-full left-0 w-full origin-top flex flex-col items-center 
                bg-white text-xl font-semibold shadow-lg z-50">

                <li className='w-full'><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 hover:border-[#495DE5]
                                        transition-all duration-500 ease-out
                                        p-3 border-2 border-transparent flex flex-col items-center'>Trang chủ</a></li>
                <li className='w-full'><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 hover:border-[#495DE5] 
                                        transition-all duration-500 ease-out
                                        p-3 border-2 border-transparent flex flex-col items-center'>Sản phẩm</a></li>
                <li className='w-full'><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 hover:border-[#495DE5]
                                        transition-all duration-500 ease-out
                                        p-3 border-2 border-transparent flex flex-col items-center'>Bài viết</a></li>
                <li className='w-full'><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 hover:border-[#495DE5]
                                        transition-all duration-500 ease-out
                                        p-3 border-2 border-transparent flex flex-col items-center'>Hỏi đáp</a></li>
                <li className='w-full'><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 hover:border-[#495DE5]
                                        transition-all duration-500 ease-out
                                        p-3 border-2 border-transparent flex flex-col items-center'>Liên hệ</a></li>
                <li className='w-full'><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 hover:border-[#495DE5]
                                        transition-all duration-500 ease-out
                                        p-3 border-2 border-transparent flex flex-col items-center'>Giới thiệu</a></li>

            </motion.ul>
          </div>
    )
}

export default Navbar

