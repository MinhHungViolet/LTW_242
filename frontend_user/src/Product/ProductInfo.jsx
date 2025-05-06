import React, { useState, useEffect, useCallback } from 'react'; // Thêm React, useEffect, useCallback
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast
import defaultProductImage from '../Images/product.png'; // Ảnh mặc định

// Định nghĩa BASE URL
const API_BASE_URL = "http://localhost/backend/public";
const IMAGE_BASE_URL = "http://localhost/backend/public"; // Hoặc http://localhost

// Mảng size (giữ nguyên)
const clothesSize = ['S', 'M', 'L', 'XL', '2XL']; // Sắp xếp lại thứ tự
const shoesSize = ['35', '36', '37', '38', '39', '40', '41', '42', '43']; // Sắp xếp lại thứ tự

// Component nhận productId và hàm onClose
const ProductInfo = ({ productId, onClose }) => {
    const { token } = useAuth(); // Lấy token để gọi API giỏ hàng

    // State lưu chi tiết sản phẩm fetch từ API
    const [productDetails, setProductDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // State cho lựa chọn của người dùng
    const [selectedSize, setSelectedSize] = useState(''); // Khởi tạo rỗng, sẽ set sau khi fetch data
    const [quantity, setQuantity] = useState(1); // Mặc định số lượng là 1

    // State loading cho nút thêm vào giỏ
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    // Hàm fetch chi tiết sản phẩm dựa trên productId
    const fetchProductDetails = useCallback(async () => {
        if (!productId) return; // Không fetch nếu không có ID

        setIsLoading(true);
        setError(null);
        console.log(`Workspaceing details for product ID: ${productId}`);
        try {
            const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
            if (response.status === 200 && response.data) {
                console.log("Product details received:", response.data);
                setProductDetails(response.data);
                // Set size mặc định ban đầu nếu có
                if (response.data.category === "Giày" && response.data.size) {
                     setSelectedSize(shoesSize.includes(response.data.size) ? response.data.size : shoesSize[0]);
                 } else if (response.data.category !== "Giày" && response.data.size) {
                      setSelectedSize(clothesSize.includes(response.data.size) ? response.data.size : clothesSize[0]);
                 } else if(response.data.category === "Giày") {
                     setSelectedSize(shoesSize[0]); // Mặc định nếu giày ko có size
                 } else {
                     setSelectedSize(clothesSize[0]); // Mặc định nếu áo/khác ko có size
                 }

            } else {
                throw new Error("Không tìm thấy thông tin sản phẩm.");
            }
        } catch (err) {
            console.error("Error fetching product details:", err.response || err);
            const errorMsg = err.response?.data?.error || "Không thể tải chi tiết sản phẩm.";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    }, [productId]); // Phụ thuộc vào productId

    // Gọi fetchProductDetails khi productId thay đổi
    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    // Hàm xử lý thay đổi size
    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
    };

    // Hàm xử lý thay đổi số lượng
    const handleQuantityChange = (e) => {
        let newQuantity = parseInt(e.target.value);
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1; // Số lượng nhỏ nhất là 1
        }
        // (Tùy chọn) Kiểm tra với số lượng tồn kho phía client
        if (productDetails && newQuantity > productDetails.stock_quantity) {
             toast.warn(`Chỉ còn ${productDetails.stock_quantity} sản phẩm tồn kho.`);
             newQuantity = productDetails.stock_quantity; // Giới hạn bằng số lượng tồn
         }
        setQuantity(newQuantity);
    };

    // Hàm tăng số lượng
    const increaseQuantity = () => {
         setQuantity(prev => {
            const newQuantity = prev + 1;
            if (productDetails && newQuantity > productDetails.stock_quantity) {
                toast.warn(`Chỉ còn ${productDetails.stock_quantity} sản phẩm tồn kho.`);
                return productDetails.stock_quantity;
            }
            return newQuantity;
         });
    };

    // Hàm giảm số lượng
    const decreaseQuantity = () => {
         setQuantity(prev => Math.max(1, prev - 1)); // Giảm nhưng không dưới 1
    };


    // --- HÀM THÊM VÀO GIỎ HÀNG (ĐÃ SỬA ĐỂ GỌI API) ---
    const handleAddToCart = async () => {
        // Kiểm tra đăng nhập
        if (!token) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            // Có thể mở modal đăng nhập ở đây
            // onClose(); // Đóng modal info lại
            // Mở modal login?
            return;
        }

        // Kiểm tra xem có sản phẩm và số lượng hợp lệ không
        if (!productDetails || quantity < 1) {
            toast.error("Vui lòng chọn số lượng hợp lệ.");
            return;
        }

        // Kiểm tra tồn kho lần cuối trước khi gửi (dù đã kiểm tra khi tăng/giảm)
        if (quantity > productDetails.stock_quantity) {
             toast.error(`Số lượng yêu cầu (${quantity}) vượt quá tồn kho (${productDetails.stock_quantity}).`);
             setQuantity(productDetails.stock_quantity); // Reset về số lượng max
             return;
         }


        setIsAddingToCart(true); // Bật loading nút Thêm
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const body = {
                productId: productDetails.productId, // Lấy ID từ productDetails
                quantity: quantity
                // *** KHÔNG GỬI SIZE (Trừ khi bạn đã sửa backend) ***
                // size: selectedSize
            };
            console.log("Sending Add to Cart request:", body);

            // Gọi API POST /cart/items
            const response = await axios.post(`${API_BASE_URL}/cart/items`, body, { headers });

            console.log("Add to Cart response:", response.data);

            if (response.status === 200 || response.status === 201) { // Backend có thể trả về 200 (update) hoặc 201 (create)
                toast.success(response.data.message || "Thêm vào giỏ hàng thành công!");
                onClose(); // Đóng modal sau khi thành công
            } else {
                 throw new Error(response.data?.message || response.data?.error || "Thêm vào giỏ hàng thất bại.");
            }

        } catch (err) {
            console.error("Add to cart error:", err.response || err);
            const errorMessage = err.response?.data?.error || "Lỗi khi thêm vào giỏ hàng.";
            toast.error(errorMessage);
             // Nếu lỗi do hết hàng, cập nhật lại số lượng về max
             if (err.response?.data?.stock_available !== undefined) {
                 setQuantity(err.response.data.stock_available);
             }
        } finally {
             setIsAddingToCart(false); // Tắt loading nút Thêm
        }
    };

    // --- JSX ---
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" // Tăng opacity, thêm padding
            onClick={onClose}
        >
            <motion.div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-xl relative w-full max-w-3xl flex flex-col md:flex-row items-start md:items-center" // Responsive width, flex layout
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 50 }} // Slide từ dưới lên
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl" // Style lại nút X
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    &times; {/* Dùng ký tự 'x' đẹp hơn */}
                </button>

                {/* Hiển thị loading hoặc lỗi khi fetch chi tiết */}
                {isLoading && <div className="w-full text-center py-20">Đang tải thông tin sản phẩm...</div>}
                {error && !isLoading && <div className="w-full text-center py-20 text-red-500">{error}</div>}

                {/* Hiển thị nội dung khi có productDetails */}
                {!isLoading && !error && productDetails && (
                    <>
                        {/* Cột ảnh */}
                        <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-8">
                            <img
                                src={productDetails.image ? `${IMAGE_BASE_URL}/uploads/products/${productDetails.image}` : defaultProductImage}
                                alt={productDetails.name}
                                className="w-full h-auto object-cover rounded-md shadow-md"
                                onError={(e) => { e.target.onerror = null; e.target.src=defaultProductImage }}
                            />
                        </div>

                        {/* Cột thông tin và hành động */}
                        <div className='w-full md:w-1/2 flex flex-col justify-between self-stretch'> {/* Thêm self-stretch */}
                            <div> {/* Bao bọc thông tin trên */}
                                <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-800">{productDetails.name}</h2>
                                <p className="text-xl lg:text-2xl text-indigo-600 font-bold mb-4">{parseInt(productDetails.price).toLocaleString()} VND</p>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Danh mục:</span> {productDetails.category}</p>
                                {productDetails.color && <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Màu:</span> {productDetails.color}</p>}
                                {/* Hiển thị size nếu sản phẩm có size (và category không phải đồng hồ?) */}
                                {(productDetails.category === "Giày" || productDetails.category === "Áo sơ mi" || productDetails.category === "Áo thun") && (
                                     <div className='flex flex-row items-center my-3 text-sm'>
                                         <label htmlFor="size-select-info" className='font-medium text-gray-700 mr-2'>Size:</label>
                                         <select
                                             id="size-select-info"
                                             className="p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                             value={selectedSize}
                                             onChange={handleSizeChange}
                                         >
                                             {(productDetails.category === "Giày" ? shoesSize : clothesSize).map((sizeOption) => (
                                                 <option key={sizeOption} value={sizeOption}>{sizeOption}</option>
                                             ))}
                                         </select>
                                     </div>
                                )}
                                <p className="text-sm text-gray-500 mb-4"><span className="font-medium">Còn lại:</span> {productDetails.stock_quantity || 0} sản phẩm</p>
                                <h4 className="font-semibold text-gray-700 mb-1">Mô tả:</h4>
                                <p className="text-gray-600 text-sm mb-5">{productDetails.description || "Chưa có mô tả cho sản phẩm này."}</p>
                            </div>

                            {/* Phần chọn số lượng và nút thêm */}
                            <div className='mt-auto pt-5 border-t border-gray-200'> {/* Đẩy xuống dưới */}
                                <div className='flex flex-row items-center justify-start mb-5 text-md'> {/* Căn trái */}
                                    <label htmlFor="quantity-input" className='font-medium text-gray-700 mr-3'>Số lượng:</label>
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                          <button onClick={decreaseQuantity} className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-100 rounded-l-md" disabled={isAddingToCart || quantity <= 1}>-</button>
                                          <input
                                               id="quantity-input"
                                              type="number"
                                              min="1"
                                              max={productDetails.stock_quantity || 1} // Giới hạn max bằng tồn kho
                                              value={quantity}
                                              onChange={handleQuantityChange}
                                              className='p-2 border-l border-r border-gray-300 text-center w-16 focus:outline-none focus:ring-1 focus:ring-indigo-500'
                                              disabled={isAddingToCart}
                                           />
                                          <button onClick={increaseQuantity} className="px-3 py-1 text-lg font-bold text-gray-700 hover:bg-gray-100 rounded-r-md" disabled={isAddingToCart || quantity >= productDetails.stock_quantity}>+</button>
                                    </div>
                                </div>
                                <button
                                    className="w-full bg-indigo-600 text-white text-md font-bold py-3 rounded-md hover:bg-indigo-700 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300"
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart || productDetails.stock_quantity < 1} // Disable nếu hết hàng
                                >
                                    {isAddingToCart ? "Đang thêm..." : (productDetails.stock_quantity < 1 ? "Hết hàng" : "THÊM VÀO GIỎ HÀNG")}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}

export default ProductInfo;