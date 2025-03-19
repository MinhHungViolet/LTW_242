import React from "react";
import { useParams } from "react-router-dom"; // Để lấy tham số từ URL

const NewsDetail = () => {
  const { id } = useParams();

  // danh sách tin tức đầy đủ tạm
  const newsItems = [
    {
      id: 1,
      title: "Linh hoạt",
      content: "Nội dung đầy đủ của tin tức Linh hoạt...",
    },
    {
      id: 2,
      title: "Tiện ích",
      content: "Nội dung đầy đủ của tin tức Tiện ích...",
    },
  ];

  // Tìm tin tức theo ID
  const newsItem = newsItems.find((item) => item.id === parseInt(id));
  console.log("newsItem", newsItem);

  if (!newsItem) {
    return <div>Tin tức không tồn tại</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="font-bold text-3xl mb-4">{newsItem.title}</h1>
      <p className="text-gray-700">{newsItem.content}</p>
    </div>
  );
};

export default NewsDetail;