import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import defaultProductImage from '../Images/product.png';

const API_BASE_URL = "http://localhost/backend/public";
const IMAGE_BASE_URL = "http://localhost/backend/public"; 

const Cart = ({ onClose }) => {
    const navigate = useNavigate();
    const { user: authUser, token, isLoading: authLoading } = useAuth();

    const [cartItems, setCartItems] = useState([]);
    const [cartId, setCartId] = useState(null);
    const [subtotal, setSubtotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isRemoving, setIsRemoving] = useState(null);
    const [error, setError] = useState(null);

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCartItems([]);
            setSubtotal(0);
            setCartId(null);
            setIsLoading(false);
            console.log("No token found, cannot fetch cart.");
            return;
        }

        setIsLoading(true);
        setError(null);
        console.log("Fetching cart with token:", token);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${API_BASE_URL}/cart`, { headers });

            console.log("Cart response:", response.data);
            if (response.status === 200 && response.data) {
                setCartItems(response.data.items || []);
                setCartId(response.data.cartId);
                setSubtotal(response.data.subtotal || 0);
            } else {
                setCartItems([]);
                setSubtotal(0);
                setCartId(null);
                 throw new Error(response.data?.error || response.data?.message || "Lỗi khi tải giỏ hàng");
            }
        } catch (err) {
            console.error("Error fetching cart:", err.response || err);
            setError(err.response?.data?.error || "Không thể tải giỏ hàng.");
            setCartItems([]);
            setSubtotal(0);
            setCartId(null);
        } finally {
            setIsLoading(false);
        }
    }, [token]);
    useEffect(() => {
        if (!authLoading) {
            fetchCart();
        }
    }, [authLoading, token, fetchCart]);

    const handleRemoveItem = async (productId) => {
        if (!token || isRemoving === productId) return;

        console.log(`Attempting to remove item: ${productId}`);
        setIsRemoving(productId);
        setError(null);

        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.delete(`${API_BASE_URL}/cart/items/${productId}`, { headers });
            console.log(`Remove item ${productId} response status:`, response.status);

            if (response.status === 200 || response.status === 204) {
                toast.success(`Đã xóa sản phẩm khỏi giỏ hàng.`);
                fetchCart();
            } else {
                  throw new Error(response.data?.message || response.data?.error || "Xóa sản phẩm thất bại.");
            }
        } catch (err) {
            console.error(`Error removing item ${productId}:`, err.response || err);
            const errorMessage = err.response?.data?.error || "Lỗi khi xóa sản phẩm khỏi giỏ hàng.";
            setError(errorMessage); 
            toast.error(errorMessage);
        } finally {
             setIsRemoving(null);
        }
    };
    return (
        <>
            <div
                className="fixed inset-0 bg-black bg-opacity-30 z-40"
                onClick={onClose}
            ></div>

            {/* Cart Panel */}
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="fixed top-[10vh] right-0 w-[380px] sm:w-[400px] md:w-[450px] bg-white shadow-lg border border-gray-200 rounded-l-lg z-50 max-h-[85vh] flex flex-col" // Điều chỉnh kích thước, vị trí, style
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header của Cart */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className='text-xl font-semibold text-gray-800'>Giỏ Hàng Của Bạn</h2>
                    <button
                        className="text-gray-500 hover:text-red-600 text-2xl"
                        onClick={onClose}
                        aria-label="Đóng giỏ hàng"
                    >
                        &times;
                    </button>
                </div>

                {/* Nội dung Cart */}
                <div className="flex-grow overflow-y-auto p-4">
                    {isLoading && <p className='text-center text-gray-500 my-10'>Đang tải giỏ hàng...</p>}
                    {error && !isLoading && <p className='text-center text-red-500 my-10'>{error}</p>}
                    {!isLoading && !error && cartItems.length === 0 && (
                        <p className='text-center text-gray-500 my-10'>Giỏ hàng của bạn đang trống.</p>
                    )}
                    {!isLoading && !error && cartItems.length > 0 && (
                        <ul className="space-y-4">
                            {cartItems.map((item) => (
                                <li key={item.productId} className='text-sm flex flex-row border-b border-gray-100 pb-3'>
                                    <img
                                        src={item.image ? `${IMAGE_BASE_URL}/uploads/products/${item.image}` : defaultProductImage}
                                        alt={item.name}
                                        className='w-20 h-20 object-cover mr-4 rounded'
                                        onError={(e) => { e.target.onerror = null; e.target.src=defaultProductImage }}
                                    />
                                    <div className="flex flex-col items-start flex-grow justify-between">
                                         <div>
                                            <h3 className="font-semibold text-md mb-1 text-gray-800">{item.name}</h3>
                                            <p className="text-gray-600 text-xs mb-1">Đơn giá: {parseInt(item.price).toLocaleString()} VND</p>
                                            <p className="text-gray-600 text-xs">Số lượng: {item.quantity}</p>
                                         </div>
                                         {/* Nút xóa */}
                                         <button
                                             className="text-red-500 hover:text-red-700 hover:underline text-xs font-medium mt-1 disabled:opacity-50"
                                             onClick={() => handleRemoveItem(item.productId)}
                                             disabled={isRemoving === item.productId}
                                         >
                                             {isRemoving === item.productId ? 'Đang xóa...' : 'Xóa'}
                                         </button>
                                     </div>
                                      <div className="ml-2 text-right flex-shrink-0">
                                           <p className="font-semibold text-gray-800">
                                              {(parseInt(item.price) * item.quantity).toLocaleString()} VND
                                          </p>
                                      </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer của Cart */}
                {!isLoading && !error && cartItems.length > 0 && (
                    <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50">
                        <div className='flex justify-between items-center text-lg font-semibold mb-4'>
                            <span>Tổng cộng:</span>
                            <span>{subtotal.toLocaleString()} VND</span>
                        </div>
                        <button
                             className='w-full px-4 py-3 text-md font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300'
                            onClick={() => { navigate("/purchase"); onClose(); }}
                            disabled={cartItems.length === 0}
                         >
                             TIẾN HÀNH THANH TOÁN
                         </button>
                    </div>
                )}
            </motion.div>
        </>
    );
};

export default Cart;