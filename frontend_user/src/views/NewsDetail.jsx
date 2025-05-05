import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import bg from "../Images/bg-02.jpg";
import defaultNewsImage from "../Images/bg-02.jpg";

const NewsDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth(); // Get token from AuthContext
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await axios.get(`http://localhost/backend/public/news/${id}`, {
          headers
        });
        
        if (response.data.status === "success") {
          setPost(response.data.data);
        } else {
          setError("Failed to load post");
        }
      } catch (error) {
        setError("Error loading post");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]); // Add token as a dependency

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error loading post</h2>
        <Link to="/news" className="text-blue-500 hover:text-blue-600">
          Return to News
        </Link>
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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={post.image || defaultNewsImage}
            alt={post.title}
            className="w-full h-96 object-cover"
          />
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
              {isAdmin && (
                <div className="space-x-2">
                  <Link
                    to={`/news/edit/${post.postId}`}
                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
                  >
                    Edit
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center text-gray-600 mb-8">
              <span className="mr-4">
                <i className="fas fa-user mr-2"></i>
                {post.authorName}
              </span>
              <span>
                <i className="fas fa-calendar mr-2"></i>
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>

            <div className="prose max-w-none"
                 dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-8 flex justify-between items-center">
              <Link
                to="/news"
                className="inline-block bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300"
              >
                Back to News
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;