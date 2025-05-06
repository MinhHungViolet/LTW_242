import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ImageSlider from '../Layout/IntroPic';
import { useAuth } from '../contexts/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Question = () => {
  const auth = useAuth();
  const { user } = auth || {};
  const customerId = user ? user.id : null;

  const [activeIndexFAQ, setActiveIndexFAQ] = useState(null);
  const [activeIndexMyQuestions, setActiveIndexMyQuestions] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userQuestion, setUserQuestion] = useState('');
  const [faqQuestions, setFaqQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMyQuestions, setShowMyQuestions] = useState(false);

  const API_URL = 'http://localhost/backend/public/question';

  const fetchFAQQuestions = async () => {
    try {
      const response = await axios.get(API_URL);
      if (response.data.status === 'success') {
        setFaqQuestions(response.data.data || []);
      } else {
        setError('Lỗi khi lấy FAQ: ' + response.data.message);
      }
    } catch (err) {
      setError('Lỗi khi lấy danh sách FAQ: ' + (err.response?.data?.message || err.message));
    }
  };

  const fetchMyQuestions = async () => {
    if (!customerId) return;
    try {
      const response = await axios.get(`${API_URL}?customerId=${customerId}`);
      if (response.data.status === 'success') {
        setMyQuestions(response.data.data || []);
      } else {
        setError('Lỗi khi lấy câu hỏi của tôi: ' + response.data.message);
      }
    } catch (err) {
      setError('Lỗi khi lấy câu hỏi của tôi: ' + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchFAQQuestions();
    if (showMyQuestions && customerId) {
      fetchMyQuestions();
    }
    setLoading(false);
  }, [customerId, showMyQuestions]);

  const toggleAnswerFAQ = (index) => {
    setActiveIndexFAQ(activeIndexFAQ === index ? null : index);
  };

  const toggleAnswerMyQuestions = (index) => {
    setActiveIndexMyQuestions(activeIndexMyQuestions === index ? null : index);
  };

  const openModal = () => {
    console.log('User khi mở modal:', user); // Debug user
    if (!user) {
      setError('Vui lòng đăng nhập để đặt câu hỏi');
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('User khi gửi câu hỏi:', user); // Debug user
    console.log('CustomerId:', customerId); // Debug customerId
    if (!user || !customerId || customerId <= 0) {
      setError('Vui lòng đăng nhập để đặt câu hỏi');
      return;
    }
    if (!userQuestion || !userQuestion.trim()) {
      setError('Vui lòng nhập câu hỏi');
      return;
    }
    const payload = {
      question: userQuestion.trim(),
      customerId: customerId
    };
    console.log('Dữ liệu gửi đi:', payload); // Debug dữ liệu
    try {
      const response = await axios.post(API_URL, payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      console.log('Phản hồi từ API:', response.data); // Debug phản hồi
      if (response.data.status === 'success') {
        setUserQuestion('');
        closeModal();
        fetchFAQQuestions();
        if (showMyQuestions) fetchMyQuestions();
        toast.success("Đặt câu hỏi thành công!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        setError('Lỗi khi gửi câu hỏi: ' + response.data.message);
      }
    } catch (err) {
      console.error('Lỗi chi tiết:', err); // Debug lỗi
      setError('Lỗi khi gửi câu hỏi: ' + (err.response?.data?.message || err.message));
    }
  };

  const toggleMyQuestions = () => {
    console.log('User khi toggle MyQuestions:', user); // Debug user
    if (!user) {
      setError('Vui lòng đăng nhập để xem câu hỏi của bạn');
      return;
    }
    setShowMyQuestions(!showMyQuestions);
    if (!showMyQuestions && customerId) {
      fetchMyQuestions();
    }
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <ImageSlider />
      <div className="container mx-auto p-6">
        <h2 className="font-bold text-2xl text-left mb-8">Câu hỏi thường gặp</h2>
        <div className="border-t-2 border-black mt-1 w-auto mx-auto p-1"></div>
        <div className="mt-6 space-y-4">
          {faqQuestions.length === 0 ? (
            <p>Chưa có câu hỏi nào.</p>
          ) : (
            faqQuestions.slice(0, 5).map((item, index) => (
              <div key={item.questionId} className="bg-white shadow-md rounded-lg p-6">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleAnswerFAQ(index)}
                >
                  <h3 className="text-xl">{item.question}</h3>
                  <span className="text-2xl">{activeIndexFAQ === index ? '-' : '+'}</span>
                </div>
                {activeIndexFAQ === index && (
                  <p className="text-gray-700 mt-4">{item.answer || 'Chưa có trả lời'}</p>
                )}
              </div>
            ))
          )}
        </div>

        <button
          onClick={toggleMyQuestions}
          className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          {showMyQuestions ? 'Ẩn câu hỏi của tôi' : 'Xem câu hỏi của tôi'}
        </button>

        {showMyQuestions && (
          <>
            <h2 className="font-bold text-2xl text-left mb-8 mt-12">Câu hỏi của tôi</h2>
            <div className="border-t-2 border-black mt-1 w-auto mx-auto p-1"></div>
            <div className="mt-6 space-y-4">
              {myQuestions.length === 0 ? (
                <p>Bạn chưa có câu hỏi nào.</p>
              ) : (
                myQuestions.map((item, index) => (
                  <div key={item.questionId} className="bg-white shadow-md rounded-lg p-6">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleAnswerMyQuestions(index)}
                    >
                      <h3 className="text-xl">{item.question}</h3>
                      <span className="text-2xl">{activeIndexMyQuestions === index ? '-' : '+'}</span>
                    </div>
                    {activeIndexMyQuestions === index && (
                      <p className="text-gray-700 mt-4">{item.answer || 'Chưa có trả lời'}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>

      <button
        onClick={openModal}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 z-[100]"
      >
        Đặt câu hỏi
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-md">
            <h3 className="font-bold text-xl mb-4">Đặt câu hỏi</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                placeholder="Nhập câu hỏi của bạn..."
                className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                rows="4"
                required
              />
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                  Gửi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Question;