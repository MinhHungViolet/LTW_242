import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const NewsEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    // Check admin status
    if (!user || user.role !== 'admin') {
      navigate('/news');
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost/backend/public/news?postId=${id}`);
        if (response.data.status === 'success') {
          const { title, content, image } = response.data.data;
          setFormData({ title, content });
          setCurrentImage(image);
        } else {
          setError('Failed to fetch post');
        }
      } catch (err) {
        setError('Error fetching post');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({
        ...prev,
        image: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // If there's a new image, handle it with FormData
      if (formData.image) {
        // For image upload we need to use FormData and POST method
        const imageData = new FormData();
        imageData.append('image', formData.image);
        
        // Upload image first (this would need to be implemented on the backend)
        // This is a placeholder for image upload functionality
        // You would implement this based on your image storage solution
        const imageUploadResponse = await axios.post(`http://localhost/backend/public/upload`, imageData);
        
        if (imageUploadResponse.data.status === 'success') {
          // After successful image upload, update the post with new image URL
          const updateResponse = await axios({
            method: 'put',
            url: `http://localhost/backend/public/news`,
            data: {
              postId: id,
              title: formData.title,
              content: formData.content,
              image: imageUploadResponse.data.imageUrl
            }
          });
          
          if (updateResponse.data.status === 'success') {
            navigate('/news');
          } else {
            setError(updateResponse.data.message || 'Failed to update post');
          }
        } else {
          setError(imageUploadResponse.data.message || 'Failed to upload image');
        }
      } else {
        // If no new image, just update the post text content with PUT method
        const updateResponse = await axios({
          method: 'put',
          url: `http://localhost/backend/public/news`,
          data: {
            postId: id,
            title: formData.title,
            content: formData.content
          }
        });
        
        if (updateResponse.data.status === 'success') {
          navigate('/news');
        } else {
          setError(updateResponse.data.message || 'Failed to update post');
        }
      }
    } catch (err) {
      console.error("Error details:", err);
      setError(err.response?.data?.message || 'An error occurred during update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-48"
            required
          />
        </div>

        {currentImage && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Current Image
            </label>
            <img 
              src={currentImage} 
              alt="Current post" 
              className="w-64 h-64 object-cover rounded"
            />
          </div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            New Image (optional)
          </label>
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            accept="image/*"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/news')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsEdit;