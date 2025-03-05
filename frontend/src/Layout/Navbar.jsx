import cart from '../Images/cart.png'
import heart from '../Images/heart.png'
import avatar from '../Images/avatar.png'

const Navbar = () => {
    return (
        <div className="bg-white flex flex-row items-center justify-between p-2 ">
            {/* Page */}
            <div className="flex flex-row justify-between w-[36rem] ml-5 text-[#3f3f3e] text-lg font-semibold ">
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
            {/* Icon */}
            <div className='flex flex-row mr-10 items-center justify-between w-[8rem]'>
                <img src={cart} alt="" className='w-7 h-7  ' />
                <img src={heart} alt="" className='w-7 h-7 ' />
                <img src={avatar} alt="" className='w-8 h-8 rounded-full ' />
            </div>
        </div>
    )
}

export default Navbar