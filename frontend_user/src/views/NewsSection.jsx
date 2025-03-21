import React from "react";
import news1 from "../Images/news1.png";
import { Link } from "react-router-dom";

const NewsSection = () => {
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
    <div className="container mx-auto p-6">
      <h2 className="font-bold text-3xl text-left mb-8">Tin nổi bật</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {newsItems.map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-4">
            <Link
                to={`/news/${item.id}`}
                className="font-bold text-xl mb-2 hover:text-blue-500"
              >
                {item.title}
              </Link>
              <p className="text-gray-700">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;