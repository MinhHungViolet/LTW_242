import React, {useState} from "react";
import ImageSlider from "../Layout/IntroPic";

const Question = () => {
	const [activeIndex, setActiveIndex] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [userQuestion, setUserQuestion] = useState("");
	const toggleAnswer = (index) => {
		if (activeIndex === index) {
			setActiveIndex(null);
		} else {
			setActiveIndex(index);
		}
	};

	const openModal = () => {	setIsModalOpen(true) };
	const closeModal = () => { setIsModalOpen(false) };
	const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Câu hỏi của bạn: ${userQuestion}`);
    closeModal();
  };

	
	const faqItems = [
    {
      question: "Công ty của bạn chuyên cung cấp sản phẩm/dịch vụ gì?",
      answer:
        "Công ty chúng tôi chuyên cung cấp các sản phẩm và dịch vụ chất lượng cao trong lĩnh vực công nghệ, bao gồm phần mềm, phần cứng và các giải pháp tích hợp.",
    },
    {
      question: "Làm sao để đặt hàng?",
      answer:
        "Bạn có thể đặt hàng trực tiếp trên website của chúng tôi bằng cách chọn sản phẩm và thêm vào giỏ hàng, sau đó tiến hành thanh toán.",
    },
    {
      question: "Làm sao để kiểm tra tình trạng đơn hàng của tôi?",
      answer:
        "Bạn có thể kiểm tra tình trạng đơn hàng bằng cách đăng nhập vào tài khoản của mình trên website và truy cập mục 'Đơn hàng của tôi'.",
    },
		{
      question: "Làm sao để kiểm tra tình trạng đơn hàng của tôi?",
      answer:
        "Bạn có thể kiểm tra tình trạng đơn hàng bằng cách đăng nhập vào tài khoản của mình trên website và truy cập mục 'Đơn hàng của tôi'.",
    },
		{
      question: "Làm sao để kiểm tra tình trạng đơn hàng của tôi?",
      answer:
        "Bạn có thể kiểm tra tình trạng đơn hàng bằng cách đăng nhập vào tài khoản của mình trên website và truy cập mục 'Đơn hàng của tôi'.",
    },
  ];
	return (
		<>
			<ImageSlider />

			<div className="container mx-auto p-6">
				<h2 className="font-bold text-2xl text-left mb-8">Câu hỏi thường gặp</h2>
				<div className="border-t-2 border-black mt-1 w-auto mx-auto p-1"></div>
				<div className="mt-6 space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="text-xl">{item.question}</h3>
                <span className="text-2xl">
                  {activeIndex === index ? "-" : "+"}
                </span>
              </div>
              {activeIndex === index && (
                <p className="text-gray-700 mt-4">{item.answer}</p>
              )}
            </div>
          ))}
        </div>
			</div>

			<button
        onClick={openModal}
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
      >
        Đặt câu hỏi
      </button>
			{isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
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
		</>

	);
};

export default Question;
