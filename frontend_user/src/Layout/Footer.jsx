import LogoBK from '../Images/LogoBK.png'
import Facebook from '../Images/Facebook.png'
import Instagram from '../Images/Instagram.png'
import Youtube from '../Images/Youtube.png'
import Tiktok from '../Images/Tiktok.png'
import Linkedin from '../Images/Linkedin.png'


const Footer = () => {

    return (
        <div className="bg-[#111111] text-white px-10 py-5 max-sm:p-5">
            <div className="flex flex-col lg:flex-row justify-between gap-10">
                {/* Info */}
                <div className="flex flex-col items-start gap-6">
                    {/* Logo & Tên */}
                    <div className="flex flex-row items-center gap-3">
                        <img src={LogoBK} alt="" className="size-12 max-sm:size-8" />
                        <p className="font-bold text-2xl max-sm:text-xl">TRENDY STORE</p>
                    </div>

                    {/* Kết nối với chúng tôi luôn dưới logo */}
                    <div className="flex flex-col items-start gap-2">
                        <p className="text-lg font-bold">KẾT NỐI VỚI CHÚNG TÔI</p>
                        <div className="flex flex-row gap-3 mt-1">
                            <img onClick={() => window.open("https://www.facebook.com", "_blank")} src={Facebook} alt="" className="cursor-pointer size-6" />
                            <img onClick={() => window.open("https://www.instagram.com", "_blank")} src={Instagram} alt="" className="cursor-pointer size-6" />
                            <img onClick={() => window.open("https://www.youtube.com", "_blank")} src={Youtube} alt="" className="cursor-pointer size-6" />
                            <img onClick={() => window.open("https://www.tiktok.com/vi-VN", "_blank")} src={Tiktok} alt="" className="cursor-pointer size-6" />
                            <img onClick={() => window.open("https://www.linkedin.com", "_blank")} src={Linkedin} alt="" className="cursor-pointer size-6" />
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="flex flex-col text-md gap-1">
                    <p>Về những vấn đề khác, vui lòng liên hệ: Mr Quốc Đạt</p>
                    <p>Email: <a href="https://mail.google.com/mail/u/0/?view=cm&fs=1&to=dat.nguyenquoc22itbk@hcmut.edu.vn" target="_blank" className="underline">dat.nguyenquoc22itbk@hcmut.edu.vn</a></p>
                    <p>Tel: 0393943968</p>
                    <p>Địa chỉ: Kí túc xá khu B, Đại học Quốc gia Hồ Chí Minh, phường Đông Hòa, thành phố Dĩ An, tỉnh Bình Dương</p>
                </div>
            </div>
        </div>
    );


}

export default Footer