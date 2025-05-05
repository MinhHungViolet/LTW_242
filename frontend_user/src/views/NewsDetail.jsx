import React, { useState, useEffect } from "react";
import bg from "../Images/bg-02.jpg";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const NewsDetail = () => {
  const { id } = useParams();
  const [commentName, setCommentName] = useState("");
  const [commentEmail, setCommentEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  
  // New state variables for handling API data
  const [newsItem, setNewsItem] = useState(null);
  const [comments, setComments] = useState([]);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentError, setCommentError] = useState(null);
  
  // API Base URL
  const API_URL = "http://localhost/backend/public";

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the post details
        const response = await axios.get(`${API_URL}/blog/${id}`);
        
        if (response.data && response.data.status === 'success') {
          setNewsItem(response.data.data);
          
          // Fetch related posts based on the same category
          if (response.data.data.category) {
            try {
              const relatedResponse = await axios.get(`${API_URL}/blog?category=${response.data.data.category}&limit=4`);
              if (relatedResponse.data && relatedResponse.data.status === 'success') {
                // Filter out the current post from related posts
                const filtered = relatedResponse.data.data.filter(post => post.postId !== parseInt(id));
                setRelatedPosts(filtered.slice(0, 4));
              }
            } catch (err) {
              console.error("Error fetching related posts:", err);
            }
          }
        } else {
          setError('Không thể tải thông tin bài viết');
        }
        
        // Fetch comments for the post
        const commentsResponse = await axios.get(`${API_URL}/blog/${id}/comments`);
        
        if (commentsResponse.data && commentsResponse.data.status === 'success') {
          setComments(commentsResponse.data.data || []);
        }
      } catch (err) {
        setError('Không thể tải thông tin: ' + (err.response?.data?.message || err.message));
        console.error("Error fetching post details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPostDetails();
    }
  }, [id]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (commentName && commentEmail && commentText) {
      try {
        setCommentLoading(true);
        setCommentError(null);
        
        // Get the token from localStorage (if the user is logged in)
        const token = localStorage.getItem('token');
        
        // Create request config with headers
        const config = {
          headers: {}
        };
        
        // Add Authorization header if token exists
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await axios.post(
          `${API_URL}/blog/${id}/comments`, 
          {
            name: commentName,
            email: commentEmail,
            content: commentText
          },
          config
        );
        
        if (response.data && response.data.status === 'success') {
          // Add the new comment to the list
          const newComment = {
            commentId: response.data.commentId || Date.now(),
            name: commentName,
            message: commentText,
            date: new Date().toLocaleDateString('vi-VN')
          };
          
          setComments([...comments, newComment]);
          
          // Clear the form
          setCommentName("");
          setCommentEmail("");
          setCommentText("");
        } else {
          setCommentError('Không thể đăng bình luận: ' + (response.data.message || 'Đã có lỗi xảy ra'));
        }
      } catch (err) {
        // Check if it's an authentication error
        if (err.response && err.response.status === 401) {
          setCommentError('Vui lòng đăng nhập để đăng bình luận');
        } else {
          setCommentError('Không thể đăng bình luận: ' + (err.response?.data?.message || err.message));
        }
        console.error("Error posting comment:", err);
      } finally {
        setCommentLoading(false);
      }
    }
  };

  // Format date helper function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Không tìm thấy bài viết'}
        </div>
        <Link to="/news" className="text-blue-500 hover:text-blue-700">
          ← Quay lại danh sách tin tức
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-64 mb-8">
        <img src={newsItem.image ? `${API_URL}/uploads/blog/${newsItem.image}` : bg} alt="Background" className="w-full h-full object-cover" />
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
              <img 
                src={newsItem.image ? `${API_URL}/uploads/blog/${newsItem.image}` : bg} 
                alt={newsItem.title} 
                className="w-full h-auto rounded-lg shadow-md" 
              />
            </div>

            {/* Post metadata */}
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-6 space-x-4">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {newsItem.author || 'Admin'}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDate(newsItem.date || newsItem.created_at)}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {newsItem.category || 'Tin tức'}
              </span>
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {comments.length} comments
              </span>
            </div>

            {/* Article title and content */}
            <h1 className="font-bold text-3xl mb-6">{newsItem.title}</h1>
            
            <div className="prose max-w-none text-gray-700 mb-10">
              {/* Using dangerouslySetInnerHTML to render HTML content from the database */}
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
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
                {commentError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {commentError}
                  </div>
                )}
                <button 
                  type="submit" 
                  className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 ${commentLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  disabled={commentLoading}
                >
                  {commentLoading ? 'Đang gửi...' : 'Post Comment'}
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-6">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.commentId} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold">{comment.name}</h4>
                        <span className="text-sm text-gray-500">{formatDate(comment.date || comment.created_at)}</span>
                      </div>
                      <p className="text-gray-700">{comment.message || comment.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                )}
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
                {relatedPosts.length > 0 ? (
                  relatedPosts.map((post) => (
                    <div key={post.postId} className="flex space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={post.image ? `${API_URL}/uploads/blog/${post.image}` : bg} 
                          alt={post.title} 
                          className="w-20 h-20 object-cover rounded" 
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm hover:text-blue-600 transition duration-200">
                          <Link to={`/news/${post.postId}`}>{post.title}</Link>
                        </h4>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">Không có bài viết liên quan.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;