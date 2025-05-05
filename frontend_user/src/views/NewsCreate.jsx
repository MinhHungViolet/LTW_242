import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewsCreate = () => {
  const { user, token } = useAuth(); // Get token from AuthContext
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState('');

  // Use useEffect to handle redirection after component mounting
  useEffect(() => {
    // Redirect if not admin
    if (!user || user.role !== 'admin') {
      navigate('/news');
    }
  }, [user, navigate]);

  // If not admin, return null while the useEffect handles redirection
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setImageError('');
      if (files && files[0]) {
        const file = files[0];
        // Check file type
        if (!file.type.match('image.*')) {
          setImageError('Please select an image file (JPEG, PNG, etc.)');
          return;
        }
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setImageError('Image size should be less than 5MB');
          return;
        }
        setFormData(prev => ({
          ...prev,
          image: file
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (imageError) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('authorId', user.userId);
      
      if (formData.image) {
        data.append('image', formData.image);
      }

      console.log('Submitting post with data:', {
        title: formData.title,
        content: formData.content.substring(0, 50) + '...',
        authorId: user.userId,
        hasImage: !!formData.image,
        imageFileName: formData.image ? formData.image.name : null
      });

      // Ensure token is always included when available
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      };

      console.log('Request headers:', headers); // Debug the headers being sent

      const response = await axios.post('http://localhost/backend/public/news', data, {
        headers
      });

      console.log('Server response:', response.data);

      if (response.data.status === 'success') {
        navigate('/news');
      } else {
        setError(response.data.message || 'Failed to create post. Server returned an error.');
      }
    } catch (err) {
      console.error("Error creating post:", err);
      
      if (err.response) {
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        setError(`Error ${err.response.status}: ${err.response.data?.message || err.response.data?.error || 'Server error occurred'}`);
      } else if (err.request) {
        console.error('Request made but no response received:', err.request);
        setError('No response from server. Please check your network connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError(`Request error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

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

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Image
          </label>
          <input
            type="file"
            name="image"
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            accept="image/*"
          />
          {imageError && (
            <p className="text-red-500 text-xs italic mt-1">{imageError}</p>
          )}
          <p className="text-gray-600 text-xs mt-1">Optional. Maximum size: 5MB</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading || imageError}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Post'}
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

export default NewsCreate;