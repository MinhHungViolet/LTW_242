import React from "react";
import { FaRegSmile, FaBriefcase, FaShieldAlt } from "react-icons/fa";
import NewsSection from "./NewsSection";
import ImageSlider from "../Layout/IntroPic";

const Introduction = () => {
  return (
    <div className="text-center">
      <ImageSlider />
      <div className="flex flex-col md:flex-row justify-center gap-6 p-10">
        <div className="bg-yellow-300 p-6 rounded-lg w-80 shadow-md flex items-center">
          <FaRegSmile size={100} className="mr-4 text-black" />
          <div>
            <h3 className="text-lg font-semibold">Tiêu chuẩn cao về dịch vụ</h3>
            <p className="text-sm">
              Cam kết cung cấp dịch vụ với tiêu chuẩn cao nhất, đảm bảo chất lượng, sự chuyên nghiệp
              và trải nghiệm tốt nhất cho khách hàng.
            </p>
          </div>
        </div>

        <div className="bg-gray-300 p-6 rounded-lg text-black w-80 shadow-md flex items-center">
          <FaBriefcase size={100}  className="mr-4 text-black" />
          <div>
            <h3 className="text-lg font-semibold">20 năm kinh nghiệm trong ngành</h3>
            <p className="text-sm">
              Với nhiều năm kinh nghiệm trong ngành, chúng tôi tự tin mang đến giải pháp chuyên sâu,
              hiệu quả và phù hợp nhất cho khách hàng.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg text-white w-80 shadow-md flex items-center">
          <FaShieldAlt size={100} className="mb-3 mr-4" />
          <div>
            <h3 className="text-lg font-semibold">Bảo mật cao</h3>
            <p className="text-sm">
              Áp dụng các tiêu chuẩn bảo mật cao nhất để đảm bảo an toàn tuyệt đối cho dữ liệu và
              thông tin của khách hàng.
            </p>
          </div>
          
        </div>
      </div>
      <div className="border-t-2 border-black mt-1 w-4/5 mx-auto p-1"></div>



      <NewsSection />

    </div>
  );
};

export default Introduction;
