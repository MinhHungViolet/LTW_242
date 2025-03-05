import cart from '../Images/cart.png'
import heart from '../Images/heart.png'
import avatar from '../Images/avatar.png'
import { X, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
        <div className="bg-white flex flex-row items-center justify-between p-2 ">
            {/* Page - Desktop */}
            <div className="hidden lg:flex flex-row justify-between w-[36rem] ml-5 text-[#3f3f3e] text-lg font-semibold ">
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Trang chủ</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Sản phẩm</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Bài viết</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Hỏi đáp</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Liên hệ</a>
                <a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Giới thiệu</a>
            </div>
            {/* Nút Hamburger - Hiện trên mobile */}
           <button
             className="lg:hidden text-[#3f3f3e] mr-5"
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

            <motion.ul
                initial={{ scaleY: 0, opacity: 0 }}
                animate={isOpen ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="lg:hidden origin-top flex flex-col items-center space-y-4 
                bg-white text-lg font-semibold py-4 shadow-md">

                <li><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Trang chủ</a></li>
                <li><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Sản phẩm</a></li>
                <li><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Bài viết</a></li>
                <li><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Hỏi đáp</a></li>
                <li><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Liên hệ</a></li>
                <li><a href="" className='hover:text-[#495DE5] hover:font-bold hover:scale-105 
                                        transition-all duration-600 ease-out
                                        p-2'>Giới thiệu</a></li>

            </motion.ul>
          )}
          </>
    )
}

export default Navbar

// export default function Navbar() {
//     const [isOpen, setIsOpen] = useState(false);
  
//     return (
//       <nav className="bg-white p-2 shadow-md">
//         <div className="container mx-auto flex items-center justify-between">
  
//           {/* Nút Hamburger - Hiện trên mobile */}
//           <button
//             className="lg:hidden text-[#3f3f3e] mr-5"
//             onClick={() => setIsOpen(!isOpen)}
//           >
//             {isOpen ? <div>1</div> : <div>2</div> }
//           </button>
  
//           {/* Menu Items - Desktop */}
//           <ul className="hidden sm:flex flex-row justify-between w-[36rem] text-[#3f3f3e] text-lg font-semibold">
//             {["Trang chủ", "Sản phẩm", "Bài viết", "Hỏi đáp", "Liên hệ", "Giới thiệu"].map(
//               (item, index) => (
//                 <li key={index}>
//                   <a
//                     href="#"
//                     className="hover:text-[#495DE5] hover:font-bold hover:scale-105 transition-all duration-300 ease-out p-2"
//                   >
//                     {item}
//                   </a>
//                 </li>
//               )
//             )}
//           </ul>
  
//           {/* Icon */}
//           <div className="flex flex-row mr-10 items-center justify-between w-[8rem]">
//             <img src={cart} alt="Cart" className="w-7 h-7" />
//             <img src={heart} alt="Heart" className="w-7 h-7" />
//             <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
//           </div>
//         </div>
  
//         {/* Menu Mobile */}
        // {isOpen && (
        //   <ul className="sm:hidden flex flex-col items-center space-y-4 bg-white text-[#3f3f3e] text-lg font-semibold py-4 shadow-md">
        //     {["Trang chủ", "Sản phẩm", "Bài viết", "Hỏi đáp", "Liên hệ", "Giới thiệu"].map(
        //       (item, index) => (
        //         <li key={index}>
        //           <a
        //             href="#"
        //             className="hover:text-[#495DE5] hover:font-bold hover:scale-105 transition-all duration-300 ease-out p-2"
        //           >
        //             {item}
        //           </a>
        //         </li>
        //       )
        //     )}
        //   </ul>
        // )}
//       </nav>
//     );
//   }
