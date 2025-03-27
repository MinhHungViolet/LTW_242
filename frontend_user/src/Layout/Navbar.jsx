import cart from '../Images/cart.png'
import avatar from '../Images/avatar.png'
import { X, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from "react";
import Cart from '../Product/Cart';

const Navbar = () => {
  const [isOpenNav, setIsOpenNav] = useState(false);

  const [isOpenCart, setIsOpenCart] = useState(false);
  const openCart = () => {
    setIsOpenCart(!isOpenCart);
  }
  return (
    <div className='sticky top-0 z-50'>
      <div className="bg-white flex flex-row items-center justify-between p-2 shadow-md ">
        {/* Page - Desktop */}
        <div className="hidden lg:flex flex-row justify-between w-[36rem] ml-5 text-[#3f3f3e] text-lg font-semibold ">
          <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Trang chủ</a>
          <a href="/product" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Sản phẩm</a>
          <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Bài viết</a>
          <a href="/question" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Hỏi đáp</a>
          <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Liên hệ</a>
          <a href="/introduction" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-500 ease-out
                                        p-2'>Giới thiệu</a>
        </div>
        {/* Nút Hamburger - Hiện trên mobile */}
        <button
          className="lg:hidden text-[#3f3f3e] mr-5 z-50"
          onClick={() => setIsOpenNav(!isOpenNav)}
        >
          {isOpenNav ? <X size={30} className='ml-5' /> : <Menu size={30} className='ml-5' />}
        </button>
        {/* Icon */}
        <div className='flex flex-row mr-10 items-center justify-evenly w-[8rem]'>
          <img src={cart} alt="" className='w-7 h-7 cursor-pointer ' onClick={() => openCart()} />
          <img src={avatar} alt="" className='w-8 h-8 rounded-full ' />
        </div>

        {isOpenCart && (<Cart onClose={() => openCart()}></Cart>)}

      </div>
      {isOpenNav && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpenNav(!isOpenNav)}
        />
      )}
      <motion.ul
        // initial={{ scaleY: 0, opacity: 0 }}
        // animate={isOpenNav ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
        // transition={{ duration: 0.3, ease: "easeOut" }}
        initial={{ x: "-100%", opacity: 0 }}  // Bắt đầu từ ngoài màn hình (bên phải)
        animate={isOpenNav ? { x: 0, opacity: 1 } : {x: "-100%", opacity: 0}}       // Trượt vào
        exit={{ x: "-100%", opacity: 0 }}      // Trượt ra ngoài
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="lg:hidden absolute top-full left-0 w-full origin-top flex flex-col items-center 
                bg-white text-xl font-semibold shadow-lg z-50">

        <li className='w-full'><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 hover:border-[#495DE5]
                                        transition-all duration-500 ease-out
                                        p-3 border-2 border-transparent flex flex-col items-center'>Trang chủ</a></li>
        <li className='w-full'><a href="/product" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 hover:border-[#495DE5] 
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

