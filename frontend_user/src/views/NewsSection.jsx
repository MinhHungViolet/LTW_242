import React, { useState, useEffect } from "react";
import bg from "../Images/bg-02.jpg";
import defaultNewsImage from "../Images/bg-02.jpg"; // Using bg-02.jpg as default news image, you can change this to a more appropriate image
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const NewsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // Increased from 6 to 10 to show all posts on a single page
  const { user, token } = useAuth(); // Get token from AuthContext
  const isAdmin = user?.role === 'admin';

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    fetchNews();
  }, [token]); // Re-fetch when token changes

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching posts from API...");
      
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await axios.get("http://localhost/backend/public/news", {
        headers
      });
      
      console.log("API Response:", response);
      
      if (response.data.status === "success") {
        console.log("Posts retrieved successfully:", response.data.data);
        setNewsItems(response.data.data);
      } else {
        console.error("API returned error status:", response.data);
        setError(response.data.message || 'Failed to fetch news');
      }
    } catch (error) {
      console.error("Error details:", error.response || error);
      setError(error.response?.data?.error || 'Failed to load news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id) => {
    if (!isAdmin) return;
    if (window.confirm("Are you sure you want to delete this news item?")) {
      try {
        // Show a loading indicator or message
        setLoading(true);
        
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Use axios with DELETE method to call our API endpoint
        const response = await axios({
          method: 'delete',
          url: `http://localhost/backend/public/news`,
          data: { postId: id },
          headers
        });
        
        if (response.data.status === 'success') {
          // Success message
          alert('Post deleted successfully');
          // Refresh the news list
          fetchNews();
        } else {
          // Error from API
          alert(response.data.message || 'Failed to delete post');
        }
      } catch (error) {
        console.error("Error deleting news:", error);
        alert('An error occurred while deleting the post');
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter news items by title only
  const filteredNews = newsItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    console.log("Searching for:", searchTerm);
    // The search is already applied through the filteredNews variable
  };

  // Pagination calculations
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredNews.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredNews.length / postsPerPage);

  // Get posts for main display and sidebar based on current page
  const mainPosts = currentPosts.slice(0, 4); // Increased from 2 to 4 main posts
  const sidebarPosts = currentPosts.slice(4); // The rest go to sidebar

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={fetchNews}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

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
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-bold text-3xl">Tin nổi bật ({filteredNews.length})</h2>
          {isAdmin && (
            <Link
              to="/news/create"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
            >
              Add New Post
            </Link>
          )}
        </div>

        {/* Search bar - moved to top for better visibility */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8 p-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết theo tiêu đề..."
                className="w-full border border-gray-300 rounded-md py-2 px-4 pr-20 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search by title"
              />
              <button
                type="submit"
                className="absolute inset-y-0 right-0 flex items-center px-4 font-medium text-blue-600 hover:text-blue-800"
              >
                <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <span className="ml-1">Tìm</span>
              </button>
            </div>
          </form>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              {filteredNews.length === 0 
                ? 'Không tìm thấy bài viết nào với tiêu đề này.' 
                : `Đã tìm thấy ${filteredNews.length} bài viết với tiêu đề "${searchTerm}"`}
            </div>
          )}
        </div>

        {filteredNews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {searchTerm 
                ? `Không tìm thấy bài viết nào với tiêu đề "${searchTerm}"` 
                : 'No posts available.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Xem tất cả bài viết
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Main articles */}
            <div className="lg:w-2/3">
              {mainPosts.map((item) => (
                <div key={item.postId} className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                  <img src={item.image || defaultNewsImage} alt={item.title} className="w-full h-80 object-cover" />
                  <div className="p-6">
                    <h3 className="font-bold text-2xl mb-3">{item.title}</h3>
                    <p className="text-gray-700 mb-4">{item.content.substring(0, 200)}...</p>
                    <div className="flex justify-between items-center">
                      <Link
                        to={`/news/${item.postId}`}
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                      >
                        Đọc tiếp
                      </Link>
                      {isAdmin && (
                        <div className="space-x-2">
                          <Link
                            to={`/news/edit/${item.postId}`}
                            className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteNews(item.postId)}
                            className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right column - Sidebar */}
            <div className="lg:w-1/3">
              {/* Recent posts */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <h3 className="text-xl font-bold p-4 border-b">Bài viết gần đây</h3>
                <div className="divide-y">
                  {sidebarPosts.map((item) => (
                    <div key={item.postId} className="flex p-4 hover:bg-gray-50">
                      <div className="flex-shrink-0 w-20 h-20">
                        <img src={item.image || defaultNewsImage} alt={item.title} className="w-full h-full object-cover rounded" />
                      </div>
                      <div className="ml-4">
                        <Link to={`/news/${item.postId}`} className="font-bold hover:text-blue-500 transition duration-300">
                          {item.title}
                        </Link>
                        <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                          {item.content.substring(0, 60)}...
                        </p>
                        {isAdmin && (
                          <div className="mt-2 space-x-2">
                            <Link
                              to={`/news/edit/${item.postId}`}
                              className="text-yellow-500 hover:text-yellow-600 text-sm font-semibold"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteNews(item.postId)}
                              className="text-red-500 hover:text-red-600 text-sm font-semibold"
                            >
                              Delete
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
        )}

        {/* Pagination */}
        {filteredNews.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              {/* Previous button */}
              <button 
                onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 font-medium ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'} rounded-l-md`}
              >
                &laquo;
              </button>
              
              {/* Page numbers */}
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                // Show limited page numbers with ellipsis
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      className={`px-4 py-2 font-medium ${
                        currentPage === pageNumber
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  (pageNumber === currentPage - 2 && pageNumber > 1) ||
                  (pageNumber === currentPage + 2 && pageNumber < totalPages)
                ) {
                  // Add ellipsis
                  return (
                    <button
                      key={pageNumber}
                      className="px-4 py-2 bg-white text-gray-700 font-medium"
                      disabled
                    >
                      &hellip;
                    </button>
                  );
                }
                return null;
              })}
              
              {/* Next button */}
              <button
                onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 font-medium ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'} rounded-r-md`}
              >
                &raquo;
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;