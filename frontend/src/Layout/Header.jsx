const Header = () => {
    return (
        <div className="bg-[#111111] h-[10vh] flex flex-row items-center justify-between ">
            <p className="text-white text-2xl font-bold ml-10">TÊN CÔNG TY</p>
            <div className="flex flex-row justify-between w-60 mr-10">
                <button className="text-black bg-white h-[5vh] w-[7rem] px-3 py-5
                                    flex items-center justify-center text-md font-bold border rounded-3xl
                                    hover:bg-[#eeeeee] hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg
                                    transition-all duration-300 ease-out  ">
                    Đăng nhập</button>

                <button className="text-black bg-white h-[5vh] w-[7rem] px-3 py-5
                                    flex items-center justify-center text-md font-bold border rounded-3xl
                                    hover:bg-[#eeeeee] hover:-translate-y-0.5 hover:scale-105 hover:shadow-lg
                                    transition-all duration-300 ease-out  ">
                    Đăng kí</button>
            </div>
        </div>
    )
}

export default Header