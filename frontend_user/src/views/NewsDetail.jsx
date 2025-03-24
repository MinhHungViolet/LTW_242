import React, { useState } from "react";
import bg from "../Images/bg-02.jpg";
import { useParams, Link } from "react-router-dom";

const NewsDetail = () => {
  const { id } = useParams();
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");

  // danh sách tin tức đầy đủ tạm
  const newsItems = [
    {
      id: 1,
      title: "Linh hoạt trong thiết kế không gian làm việc hiện đại",
      content: "Nội dung đầy đủ của tin tức Linh hoạt...",
      author: "Nguyễn Văn A",
      date: "12/05/2023",
      category: "Thiết kế",
      comments: 8,
      image: bg,
    },
    {
      id: 2,
      title: "Tiện ích trong các ứng dụng thông minh",
      content: "Nội dung đầy đủ của tin tức Tiện ích...",
      author: "Trần Thị B",
      date: "18/06/2023",
      category: "Công nghệ",
      comments: 5,
      image: bg,
    },
  ];

  // Mẫu comments
  const [comments, setComments] = useState([
    { id: 1, name: "Lê Minh", message: "Bài viết rất hay và bổ ích!", date: "10/07/2023" },
    { id: 2, name: "Hoàng Anh", message: "Tôi rất thích nội dung này, mong được đọc thêm nhiều bài viết khác.", date: "11/07/2023" },
  ]);

  // Các bài viết liên quan
  const relatedPosts = [
    { id: 3, title: "Xu hướng thiết kế nội thất 2023", image: bg },
    { id: 4, title: "5 cách tối ưu không gian làm việc tại nhà", image: bg },
    { id: 5, title: "Thiết kế bền vững cho văn phòng hiện đại", image: bg },
    { id: 6, title: "Ứng dụng công nghệ AI trong thiết kế", image: bg },
  ];

  // Tìm tin tức theo ID
  const newsItem = newsItems.find((item) => item.id === parseInt(id));

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (commentName && commentEmail && commentText) {
      const newComment = {
        id: comments.length + 1,
        name: commentName,
        message: commentText,
        date: new Date().toLocaleDateString(),
      };
      setComments([...comments, newComment]);
      setCommentName("");
      setCommentEmail("");
      setCommentText("");
    }
  };

  if (!newsItem) {
    return <div>Tin tức không tồn tại</div>;
  }

  return (
    <>
      <div className="relative w-full h-64 mb-8">
        <img src={bg} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">BLOG</h1>
        </div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-6">
        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Main content */}
          <div className="lg:w-2/3">
            {/* Breadcrumb */}
            <nav className="text-sm mb-6">
              <ol className="list-none p-0 flex text-gray-500">
                <li className="flex items-center">
                  <Link to="/" className="hover:text-blue-600">Home</Link>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li className="flex items-center">
                  <Link to="/news" className="hover:text-blue-600">Blog</Link>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </li>
                <li className="text-gray-700">{newsItem.title}</li>
              </ol>
            </nav>

            {/* Featured image */}
            <div className="mb-6">
              <img src={newsItem.image} alt={newsItem.title} className="w-full h-auto rounded-lg shadow-md" />
            </div>

            {/* Post metadata */}
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 space-x-4">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {newsItem.author}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {newsItem.date}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {newsItem.category}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {newsItem.comments} comments
              </span>
            </div>

            {/* Article title and content */}
            <h1 className="font-bold text-3xl mb-6">{newsItem.title}</h1>
            
            <div className="prose max-w-none text-gray-700 mb-10">
              <p className="mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Sed euismod, nisl vel ultricies lacinia, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.
              </p>
              <p className="mb-4">
                Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec sed odio dui. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.
              </p>
              <p className="mb-4">
                Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Nullam quis risus eget urna mollis ornare vel eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.
              </p>
              <p className="mb-4">
                {newsItem.content}
              </p>
            </div>

            {/* Comment section */}
            <div className="border-t pt-8 mb-10">
              <h3 className="text-2xl font-bold mb-6">Comments ({comments.length})</h3>
              
              {/* Comment form */}
              <form onSubmit={handleSubmitComment} className="mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                      value={commentEmail}
                      onChange={(e) => setCommentEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment *</label>
                  <textarea 
                    id="comment" 
                    rows="4" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
                  Post Comment
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold">{comment.name}</h4>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-gray-700">{comment.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className="lg:w-1/3">
            {/* Search bar */}
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-4">Search</h3>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search articles..." 
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
                />
                <button className="absolute inset-y-0 right-0 px-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Related articles */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedPosts.map((post) => (
                  <div key={post.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <img src={post.image} alt={post.title} className="w-20 h-20 object-cover rounded" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm hover:text-blue-600 transition duration-200">
                        <Link to={`/news/${post.id}`}>{post.title}</Link>
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsDetail;