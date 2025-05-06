import React, { useState, useEffect } from "react";
import { FaRegSmile, FaBriefcase, FaShieldAlt } from "react-icons/fa";
import NewsSection from "./NewsSection";
import ImageSlider from "../Layout/IntroPic";
import axios from 'axios';

const Introduction = () => {
  const [introData, setIntroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost/backend/public/introduction';

  useEffect(() => {
    const fetchIntroduction = async () => {
      try {
        console.log('Gửi yêu cầu đến:', API_URL); // Debug URL
        const response = await axios.get(API_URL);
        console.log('Phản hồi từ API:', response.data); // Debug phản hồi
        if (response.data.status === 'success') {
          setIntroData(response.data.data);
        } else {
          setError('Lỗi khi lấy dữ liệu giới thiệu 1: ' + response.data.message);
        }
      } catch (err) {
        console.error('Lỗi chi tiết:', err); // Debug lỗi
        setError('Lỗi khi lấy dữ liệu giới thiệu 2: ' + (err.response?.data?.message || err.message || 'Không xác định'));
      } finally {
        setLoading(false);
      }
    };

    fetchIntroduction();
  }, []);

  if (loading) return <div className="text-center p-10">Đang tải...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <div className="text-center">
      <ImageSlider />
      <div className="flex flex-col md:flex-row justify-center gap-6 p-10">
        <div className="bg-yellow-300 p-6 rounded-lg w-80 shadow-md flex items-center">
          <FaRegSmile size={100} className="mr-4 text-black" />
          <div>
            <h3 className="text-lg font-semibold">{introData?.title1 || 'Tiêu chuẩn cao về dịch vụ'}</h3>
            <p className="text-sm">
              {introData?.content1 || 'Không có dữ liệu'}
            </p>
          </div>
        </div>

        <div className="bg-gray-300 p-6 rounded-lg text-black w-80 shadow-md flex items-center">
          <FaBriefcase size={100} className="mr-4 text-black" />
          <div>
            <h3 className="text-lg font-semibold">{introData?.title2 || '20 năm kinh nghiệm trong ngành'}</h3>
            <p className="text-sm">
              {introData?.content2 || 'Không có dữ liệu'}
            </p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg text-white w-80 shadow-md flex items-center">
          <FaShieldAlt size={100} className="mb-3 mr-4" />
          <div>
            <h3 className="text-lg font-semibold">{introData?.title3 || 'Bảo mật cao'}</h3>
            <p className="text-sm">
              {introData?.content3 || 'Không có dữ liệu'}
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