import LogoBK from '../Images/LogoBK.png'
import Facebook from '../Images/Facebook.png'
import Instagram from '../Images/Instagram.png'
import Youtube from '../Images/Youtube.png'
import Tiktok from '../Images/Tiktok.png'
import Linkedin from '../Images/Linkedin.png'


const Footer = () => {

    return (
        <div className="bg-[#111111] text-white max-sm:text-blue-400 max-lg:text-red-400 px-10 py-5 max-sm:p-5
                        flex flex-col justify-between ">
            {/* Info */}
            <div className="flex flex-row justify-between h-[20vh] mb-12 max-lg:flex-col max-lg:mb-28">
                <div className="flex flex-col justify-around items-center max-lg:flex-row max-lg:justify-between max-lg:mb-2">
                    <div className='flex flex-row items-center '>
                        <img src={LogoBK} alt="" className='size-12 max-sm:size-8' />
                        <p className="inline-block font-bold text-2xl max-sm:text-xl">CÔNG TY ABCXYZ</p>
                    </div>
                    <div className='flex flex-col items-center max-lg:translate-y-2'>
                        <p className='text-lg font-bold'>KẾT NỐI VỚI CHÚNG TÔI</p>
                        <div className='flex flex-row justify size-8 self-start ml-7 '>
                            <img onClick={() =>
                                window.open("https://www.facebook.com", "_blank")
                            } src={Facebook} alt="" className='cursor-pointer' />
                            <img onClick={() =>
                                window.open("https://www.instagram.com", "_blank")
                            } src={Instagram} alt="" className='cursor-pointer' />
                            <img onClick={() =>
                                window.open("https://www.youtube.com", "_blank")
                            } src={Youtube} alt="" className='cursor-pointer' />
                            <img onClick={() =>
                                window.open("https://www.tiktok.com/vi-VN", "_blank")
                            } src={Tiktok} alt="" className='cursor-pointer' />
                            <img onClick={() =>
                                window.open("https://www.linkedin.com", "_blank")
                            } src={Linkedin} alt="" className='cursor-pointer' />
                        </div>
                    </div>
                </div>
                <div className='flex flex-row justify-between w-[30rem] max-lg:w-full max-lg:justify-between'>
                    <div className="flex flex-col items-center justify-between mt-3 text-lg max-lg:items-start">
                        <p className='font-bold'>DANH MỤC SẢN PHẨM</p>
                        <a href="">Mục A</a>
                        <a href="">Mục B</a>
                        <a href="">Mục C</a>
                        <a href="">Mục D</a>
                        <a href="">Mục E</a>
                    </div>
                    <div className="flex flex-col items-center justify-between mt-3 text-lg max-lg:items-start max-lg:mr-16">
                        <p className='font-bold'>KHÁC(CÁI GÌ ĐÓ)</p>
                        <a href="">Mục A</a>
                        <a href="">Mục B</a>
                        <a href="">Mục C</a>
                        <a href="">Mục D</a>
                        <a href="">Mục E</a>
                    </div>
                </div>
            </div>
            <hr className='mb-4 max-lg:mb-8' />
            {/* Contact */}
            <div className="flex flex-col
                            text-md">
                <p>Về những vấn đề khác, vui lòng liên hệ: Mr Quốc Đạt</p>
                <p>Email: <a href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=dat.nguyenquoc22itbk@hcmut.edu.vn" target="_blank">dat.nguyenquoc22itbk@hcmut.edu.vn</a></p>
                <p>Tel: 0123456789</p>
                <p>Địa chỉ: Kí túc xá khu B, Đại học Quốc gia Hồ Chí Minh, phường Đông Hòa, thành phố Dĩ An, tỉnh Bình Dương</p>
            </div>

        </div>
    )
}

export default Footer