import React, { useState } from "react";
import news1 from "../Images/news1.png";
import bg from "../Images/bg-02.jpg";
import { Link } from "react-router-dom";

const NewsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const newsItems = [
    {
      id: 1,
      image: news1,
      title: "Linh hoạt",
      content:
        "Giao diện có giãn theo từng thiết bị để đảm bảo nội dung hiển thị hoàn toàn trong thiết bị của khách hàng, nội dung có bố cục rõ ràng, giúp khách hàng trải nghiệm tốt hơn, tin tưởng hơn, dễ dàng nhấn đặt hàng hoặc liên hệ với công ty bạn.",
    },
    {
      id: 2,
      image: news1,
      title: "Tiện ích",
      content:
        "Cung cấp các tính năng tiện ích giúp khách hàng dễ dàng tìm kiếm thông tin và thực hiện các thao tác một cách nhanh chóng.",
    },
    {
      id: 3,
      image: news1,
      title: "Bảo mật",
      content:
        "Hệ thống bảo mật cao, đảm bảo an toàn thông tin cá nhân và dữ liệu của khách hàng.",
    },
    {
      id: 4,
      image: news1, 
      title: "Hỗ trợ",
      content:
        "Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ khách hàng 24/7.",
    },
    {
      id: 5,
      image: news1, 
      title: "Hỗ trợ",
      content:
        "Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ khách hàng 24/7.",
    },
    {
      id: 6,
      image: news1, 
      title: "Hỗ trợ",
      content:
        "Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ khách hàng 24/7.",
    },
  ];

  return (
    <div>
      <div
        className="relative w-full h-64 bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">BLOG</h1>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Main articles */}
          <div className="lg:w-2/3">
            <h2 className="font-bold text-3xl text-left mb-8">Tin nổi bật</h2>

            {/* Main article 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <img src={newsItems[0].image} alt={newsItems[0].title} className="w-full h-80 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-2xl mb-3">{newsItems[0].title}</h3>
                <p className="text-gray-700 mb-4">{newsItems[0].content}</p>
                <Link to={`/news/${newsItems[0].id}`} className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                  Đọc tiếp
                </Link>
              </div>
            </div>

            {/* Main article 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <img src={newsItems[1].image} alt={newsItems[1].title} className="w-full h-80 object-cover" />
              <div className="p-6">
                <h3 className="font-bold text-2xl mb-3">{newsItems[1].title}</h3>
                <p className="text-gray-700 mb-4">{newsItems[1].content}</p>
                <Link to={`/news/${newsItems[1].id}`} className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300">
                  Đọc tiếp
                </Link>
              </div>
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className="lg:w-1/3">
            {/* Search bar */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full border border-gray-300 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Recent posts */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <h3 className="text-xl font-bold p-4 border-b">Bài viết gần đây</h3>
              <div className="divide-y">
                {newsItems.slice(2, 6).map((item, index) => (
                  <div key={index} className="flex p-4 hover:bg-gray-50">
                    <div className="flex-shrink-0 w-20 h-20">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded" />
                    </div>
                    <div className="ml-4">
                      <Link to={`/news/${item.id}`} className="font-bold hover:text-blue-500 transition duration-300">
                        {item.title}
                      </Link>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {item.content.substring(0, 60)}...
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow">
            <button className="px-4 py-2 bg-blue-500 text-white font-medium rounded-l-md">1</button>
            <button className="px-4 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50">2</button>
            <button className="px-4 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50">3</button>
            <button className="px-4 py-2 bg-white text-gray-700 font-medium rounded-r-md hover:bg-gray-50">4</button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;