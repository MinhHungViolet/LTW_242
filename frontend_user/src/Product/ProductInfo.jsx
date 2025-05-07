import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import defaultProductImage from '../Images/product.png';

const API_BASE_URL = "http://localhost/backend/public";
const IMAGE_BASE_URL = "http://localhost/backend/public";

const clothesSize = ['S', 'M', 'L', 'XL', '2XL'];
const shoesSize = ['35', '36', '37', '38', '39', '40', '41', '42', '43'];

const ProductInfo = ({ productId, onClose }) => {
    const { token } = useAuth();

    const [productDetails, setProductDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    const fetchProductDetails = useCallback(async () => {
        if (!productId) return;

        setIsLoading(true);
        setError(null);
        console.log(`Workspaceing details for product ID: ${productId}`);
        try {
            const response = await axios.get(`${API_BASE_URL}/products/${productId}`);
            if (response.status === 200 && response.data) {
                console.log("Product details received:", response.data);
                setProductDetails(response.data);
                if (response.data.category === "Giày" && response.data.size) {
                     setSelectedSize(shoesSize.includes(response.data.size) ? response.data.size : shoesSize[0]);
                 } else if (response.data.category !== "Giày" && response.data.size) {
                      setSelectedSize(clothesSize.includes(response.data.size) ? response.data.size : clothesSize[0]);
                 } else if(response.data.category === "Giày") {
                     setSelectedSize(shoesSize[0]);
                 } else {
                     setSelectedSize(clothesSize[0]);
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
    }, [productId]);

    useEffect(() => {
        fetchProductDetails();
    }, [fetchProductDetails]);

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
    };

    const handleQuantityChange = (e) => {
        let newQuantity = parseInt(e.target.value);
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        }
        if (productDetails && newQuantity > productDetails.stock_quantity) {
             toast.warn(`Chỉ còn ${productDetails.stock_quantity} sản phẩm tồn kho.`);
             newQuantity = productDetails.stock_quantity;
         }
        setQuantity(newQuantity);
    };

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

    const decreaseQuantity = () => {
         setQuantity(prev => Math.max(1, prev - 1));
    };

    const handleAddToCart = async () => {
        if (!token) {
            toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng!");
            return;
        }

        if (!productDetails || quantity < 1) {
            toast.error("Vui lòng chọn số lượng hợp lệ.");
            return;
        }

        if (quantity > productDetails.stock_quantity) {
             toast.error(`Số lượng yêu cầu (${quantity}) vượt quá tồn kho (${productDetails.stock_quantity}).`);
             setQuantity(productDetails.stock_quantity);
             return;
         }


        setIsAddingToCart(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const body = {
                productId: productDetails.productId,
                quantity: quantity
            };
            console.log("Sending Add to Cart request:", body);
            const response = await axios.post(`${API_BASE_URL}/cart/items`, body, { headers });

            console.log("Add to Cart response:", response.data);

            if (response.status === 200 || response.status === 201) {
                toast.success(response.data.message || "Thêm vào giỏ hàng thành công!");
                onClose();
            } else {
                 throw new Error(response.data?.message || response.data?.error || "Thêm vào giỏ hàng thất bại.");
            }

        } catch (err) {
            console.error("Add to cart error:", err.response || err);
            const errorMessage = err.response?.data?.error || "Lỗi khi thêm vào giỏ hàng.";
            toast.error(errorMessage);
             if (err.response?.data?.stock_available !== undefined) {
                 setQuantity(err.response.data.stock_available);
             }
        } finally {
             setIsAddingToCart(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                className="bg-white p-6 sm:p-8 rounded-lg shadow-xl relative w-full max-w-3xl flex flex-col md:flex-row items-start md:items-center"
                onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-2xl"
                    onClick={onClose}
                    aria-label="Đóng"
                >
                    &times;
                </button>

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
                        <div className='w-full md:w-1/2 flex flex-col justify-between self-stretch'> 
                            <div> 
                                <h2 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-800">{productDetails.name}</h2>
                                <p className="text-xl lg:text-2xl text-indigo-600 font-bold mb-4">{parseInt(productDetails.price).toLocaleString()} VND</p>
                                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Danh mục:</span> {productDetails.category}</p>
                                {productDetails.color && <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Màu:</span> {productDetails.color}</p>}
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
                            <div className='mt-auto pt-5 border-t border-gray-200'> 
                                <div className='flex flex-row items-center justify-start mb-5 text-md'>
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