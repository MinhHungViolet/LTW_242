import React, { useState, useEffect } from "react";
import news1 from "../Images/news1.png";
import bg from "../Images/bg-02.jpg";
import defaultNewsImage from "../Images/bg-02.jpg"; // Using bg-02.jpg as default news image, you can change this to a more appropriate image
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext"; // Import useAuth hook

const NewsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6;
  const API_URL = "http://localhost/backend/public/blog";
  
  // Admin state variables
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);
  const { user, token } = useAuth(); // Get user and token from auth context

  // Check if user is admin
  const isAdmin = user && user.role === 'admin';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}?page=${currentPage}&limit=${postsPerPage}`);
        
        if (response.data.status === 'success') {
          setNewsItems(response.data.data || []);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setError('Không thể tải danh sách bài viết: ' + response.data.message);
        }
      } catch (err) {
        setError('Không thể tải danh sách bài viết: ' + (err.response?.data?.message || err.message));
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply search filter to news items
  const filteredNews = newsItems.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date from the API to a readable format (YYYY-MM-DD)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Create new post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!postTitle || !postContent || !postCategory) {
      setActionError("Vui lòng điền đầy đủ tiêu đề, nội dung và danh mục.");
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);

      const data = {
        title: postTitle,
        content: postContent,
        category: postCategory
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(API_URL, data, config);

      if (response.data && response.data.status === 'success') {
        // Reset form
        setPostTitle("");
        setPostContent("");
        setPostCategory("");
        setIsCreatingPost(false);
        
        // Reload news list
        const newsResponse = await axios.get(`${API_URL}?page=${currentPage}&limit=${postsPerPage}`);
        if (newsResponse.data.status === 'success') {
          setNewsItems(newsResponse.data.data || []);
          setTotalPages(newsResponse.data.totalPages || 1);
        }
      } else {
        setActionError('Không thể tạo bài viết: ' + (response.data.message || 'Đã có lỗi xảy ra'));
      }
    } catch (err) {
      setActionError('Không thể tạo bài viết: ' + (err.response?.data?.message || err.message));
      console.error("Error creating post:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Load post for editing
  const handleEditClick = async (postId) => {
    try {
      setActionLoading(true);
      const response = await axios.get(`${API_URL}/${postId}`);
      
      if (response.data && response.data.status === 'success') {
        const post = response.data.data;
        setEditingPostId(postId);
        setPostTitle(post.title || "");
        setPostContent(post.content || "");
        setPostCategory(post.category || "");
        setIsEditingPost(true);
        setIsCreatingPost(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setActionError('Không thể tải bài viết để chỉnh sửa: ' + (response.data.message || 'Đã có lỗi xảy ra'));
      }
    } catch (err) {
      setActionError('Không thể tải bài viết để chỉnh sửa: ' + (err.response?.data?.message || err.message));
      console.error("Error loading post for edit:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Update post
  const handleUpdatePost = async (e) => {
    e.preventDefault();
    
    if (!postTitle || !postContent || !postCategory) {
      setActionError("Vui lòng điền đầy đủ tiêu đề, nội dung và danh mục.");
      return;
    }

    try {
      setActionLoading(true);
      setActionError(null);

      const data = {
        title: postTitle,
        content: postContent,
        category: postCategory
      };

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.put(`${API_URL}/${editingPostId}`, data, config);

      if (response.data && response.data.status === 'success') {
        // Reset form
        setPostTitle("");
        setPostContent("");
        setPostCategory("");
        setIsEditingPost(false);
        setEditingPostId(null);
        
        // Reload news list
        const newsResponse = await axios.get(`${API_URL}?page=${currentPage}&limit=${postsPerPage}`);
        if (newsResponse.data.status === 'success') {
          setNewsItems(newsResponse.data.data || []);
        }
      } else {
        setActionError('Không thể cập nhật bài viết: ' + (response.data.message || 'Đã có lỗi xảy ra'));
      }
    } catch (err) {
      setActionError('Không thể cập nhật bài viết: ' + (err.response?.data?.message || err.message));
      console.error("Error updating post:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      return;
    }

    try {
      setActionLoading(true);
      
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.delete(`${API_URL}/${postId}`, config);

      if (response.data && response.data.status === 'success') {
        // Reload news list
        const newsResponse = await axios.get(`${API_URL}?page=${currentPage}&limit=${postsPerPage}`);
        if (newsResponse.data.status === 'success') {
          setNewsItems(newsResponse.data.data || []);
          setTotalPages(newsResponse.data.totalPages || 1);
        }
      } else {
        setActionError('Không thể xóa bài viết: ' + (response.data.message || 'Đã có lỗi xảy ra'));
      }
    } catch (err) {
      setActionError('Không thể xóa bài viết: ' + (err.response?.data?.message || err.message));
      console.error("Error deleting post:", err);
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel editing or creating
  const handleCancel = () => {
    setPostTitle("");
    setPostContent("");
    setPostCategory("");
    setIsCreatingPost(false);
    setIsEditingPost(false);
    setEditingPostId(null);
    setActionError(null);
  };

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
        {/* Admin Actions */}
        {isAdmin && (
          <div className="mb-8">
            {!isCreatingPost && !isEditingPost ? (
              <button 
                onClick={() => setIsCreatingPost(true)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tạo bài viết mới
              </button>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold mb-4">
                  {isCreatingPost ? "Tạo bài viết mới" : "Chỉnh sửa bài viết"}
                </h2>
                
                {actionError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {actionError}
                  </div>
                )}
                
                <form onSubmit={isCreatingPost ? handleCreatePost : handleUpdatePost}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                    <input 
                      type="text"
                      id="title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
                    <textarea 
                      id="content"
                      rows="10"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Danh mục *</label>
                    <input 
                      type="text"
                      id="category"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-4">
                    <button 
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                      disabled={actionLoading}
                    >
                      {actionLoading ? "Đang xử lý..." : isCreatingPost ? "Đăng bài" : "Cập nhật"}
                    </button>
                    <button 
                      type="button"
                      onClick={handleCancel}
                      className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-200"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Blog posts */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 p-4 rounded-md text-red-700">{error}</div>
            ) : filteredNews.length === 0 ? (
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <p className="text-xl text-gray-600">Không có bài viết nào.</p>
              </div>
            ) : (
              <div>
                {/* Featured posts - first 2 posts */}
                {filteredNews.slice(0, 2).map((item, index) => (
                  <div 
                    key={item.postId} 
                    className={`bg-white rounded-lg shadow-md overflow-hidden mb-8 ${index === 0 ? 'lg:flex' : ''}`}
                  >
                    <div className={index === 0 ? 'lg:w-1/2' : 'w-full'}>
                      <img 
                        src={news1} 
                        alt={item.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className={`p-6 ${index === 0 ? 'lg:w-1/2' : 'w-full'}`}>
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                          {item.category || "Tin tức"}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(item.date || item.created_at)}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold mb-3">
                        <Link to={`/news/${item.postId}`} className="hover:text-blue-600 transition duration-200">
                          {item.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {item.content.substring(0, 200)}...
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <span className="text-gray-700 font-medium">{item.author}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            <span>{item.numberComment || 0}</span>
                          </div>
                          <Link to={`/news/${item.postId}`} className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                            Đọc thêm
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                          
                          {/* Admin buttons */}
                          {isAdmin && (
                            <>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleEditClick(item.postId)}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                                  title="Chỉnh sửa"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleDeletePost(item.postId)}
                                  className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                  title="Xóa"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Grid of remaining posts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredNews.slice(2).map((item) => (
                    <div key={item.postId} className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img 
                        src={news1} 
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                            {item.category || "Tin tức"}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {formatDate(item.date || item.created_at)}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 line-clamp-2">
                          <Link to={`/news/${item.postId}`} className="hover:text-blue-600 transition duration-200">
                            {item.title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.content.substring(0, 100)}...
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center text-gray-500 text-xs">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                              </svg>
                              <span>{item.numberComment || 0}</span>
                            </div>
                            
                            {/* Admin buttons */}
                            {isAdmin && (
                              <>
                                <div className="flex items-center space-x-2">
                                  <button 
                                    onClick={() => handleEditClick(item.postId)}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                                    title="Chỉnh sửa"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                  </button>
                                  <button 
                                    onClick={() => handleDeletePost(item.postId)}
                                    className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                    title="Xóa"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                          <Link to={`/news/${item.postId}`} className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                            Đọc thêm
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !loading && (
              <div className="mt-8 flex justify-center">
                <nav className="inline-flex">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-l-md border ${currentPage === 1 ? 'bg-gray-200 text-gray-500' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                  >
                    &laquo;
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 border-t border-b ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-r-md border ${currentPage === totalPages ? 'bg-gray-200 text-gray-500' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                  >
                    &raquo;
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Search box */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-8">
              <h3 className="text-xl font-bold mb-4">Tìm kiếm</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm bài viết..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 pr-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              ))}
            </div>

            {/* Recent posts */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <h3 className="text-xl font-bold p-4 border-b">Bài viết gần đây</h3>
              <div className="divide-y">
                {filteredNews.slice(2, 6).map((item, index) => (
                  <div key={index} className="flex p-4 hover:bg-gray-50">
                    <div className="ml-0 w-full">
                      <div className="flex justify-between items-center mb-1">
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-1.5 py-0.5 rounded">
                          {item.category || "Tin tức"}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(item.date || item.created_at)}
                        </span>
                      </div>
                      <Link to={`/news/${item.postId}`} className="font-bold hover:text-blue-500 transition duration-300">
                        {item.title}
                      </Link>
                      <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                        {item.content.substring(0, 60)}...
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                          </svg>
                          <span className="text-xs">{item.numberComment || 0}</span>
                        </div>
                        
                        {/* Admin buttons */}
                        {isAdmin && (
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => handleEditClick(item.postId)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded"
                              title="Chỉnh sửa"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDeletePost(item.postId)}
                              className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                              title="Xóa"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsSection;