import React, { useState, useEffect, useCallback } from 'react'; // Thêm React, useCallback
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import axios from 'axios'; // Import axios
import { toast } from 'react-toastify'; // Import toast
import defaultProductImage from '../Images/product.png'; // Ảnh mặc định

// --- THÊM MỚI: Định nghĩa BASE URL ---
const API_BASE_URL = "http://localhost/backend/public";
const IMAGE_BASE_URL = "http://localhost/backend/public"; // Hoặc http://localhost

const Cart = ({ onClose }) => {
    const navigate = useNavigate();
    const { user: authUser, token, isLoading: authLoading } = useAuth(); // Lấy token và user

    // --- THÊM MỚI: State cho giỏ hàng từ API và trạng thái loading/error ---
    const [cartItems, setCartItems] = useState([]); // Danh sách items từ API
    const [cartId, setCartId] = useState(null);    // ID của giỏ hàng
    const [subtotal, setSubtotal] = useState(0);   // Tổng tiền tạm tính
    const [isLoading, setIsLoading] = useState(true); // Loading khi fetch giỏ hàng
    const [isRemoving, setIsRemoving] = useState(null); // Lưu ID sản phẩm đang bị xóa
    const [error, setError] = useState(null);
    // --- KẾT THÚC THÊM MỚI ---

    // --- THÊM MỚI: Hàm fetch giỏ hàng từ API ---
    const fetchCart = useCallback(async () => {
        if (!token) {
            // Nếu không có token, có thể hiển thị thông báo yêu cầu đăng nhập
            // Hoặc nếu giỏ hàng này chỉ hiện khi đã đăng nhập thì không cần xử lý ở đây
            setCartItems([]); // Đảm bảo giỏ hàng rỗng nếu không có token
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
                // Trường hợp API trả về lỗi hoặc data không đúng dạng
                setCartItems([]);
                setSubtotal(0);
                setCartId(null);
                 throw new Error(response.data?.error || response.data?.message || "Lỗi khi tải giỏ hàng");
            }
        } catch (err) {
            console.error("Error fetching cart:", err.response || err);
            setError(err.response?.data?.error || "Không thể tải giỏ hàng.");
            setCartItems([]); // Reset giỏ hàng nếu lỗi
            setSubtotal(0);
            setCartId(null);
            // Không cần toast ở đây, có thể hiển thị lỗi trực tiếp trên component
        } finally {
            setIsLoading(false);
        }
    }, [token]); // Phụ thuộc vào token

    // --- SỬA ĐỔI: useEffect gọi fetchCart thay vì getCartFromCookie ---
    useEffect(() => {
        // Chỉ fetch khi context đã load xong và có token
        if (!authLoading) {
            fetchCart();
        }
    }, [authLoading, token, fetchCart]); // Thêm fetchCart vào dependency array

    // --- SỬA ĐỔI: Hàm xóa sản phẩm gọi API ---
    const handleRemoveItem = async (productId) => {
        if (!token || isRemoving === productId) return; // Không xóa nếu đang xóa hoặc không có token

        console.log(`Attempting to remove item: ${productId}`);
        setIsRemoving(productId); // Đánh dấu item đang được xóa
        setError(null); // Xóa lỗi cũ

        try {
            const headers = { Authorization: `Bearer ${token}` };
            // Gọi API DELETE
            const response = await axios.delete(`${API_BASE_URL}/cart/items/${productId}`, { headers });

            console.log(`Remove item ${productId} response status:`, response.status);

            // Nếu xóa thành công (200 OK hoặc 204 No Content)
            if (response.status === 200 || response.status === 204) {
                toast.success(`Đã xóa sản phẩm khỏi giỏ hàng.`);
                // --- Cập nhật lại giỏ hàng ---
                // Cách 1: Fetch lại toàn bộ giỏ hàng (Đơn giản, đảm bảo đồng bộ)
                fetchCart();
                // Cách 2: Cập nhật state local (Nhanh hơn về UI nhưng cần cẩn thận)
                // setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
                // Cần tính lại subtotal nếu dùng cách 2
            } else {
                 // Trường hợp API trả về status khác nhưng không lỗi (ít xảy ra)
                  throw new Error(response.data?.message || response.data?.error || "Xóa sản phẩm thất bại.");
            }
        } catch (err) {
            console.error(`Error removing item ${productId}:`, err.response || err);
            const errorMessage = err.response?.data?.error || "Lỗi khi xóa sản phẩm khỏi giỏ hàng.";
            setError(errorMessage); // Hiển thị lỗi chung
            toast.error(errorMessage);
        } finally {
             setIsRemoving(null); // Kết thúc trạng thái xóa
        }
    };

    // --- JSX (Đã Cập Nhật) ---
    return (
        <>
            {/* Overlay */}
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
                <div className="flex-grow overflow-y-auto p-4"> {/* Thêm flex-grow và scroll */}
                    {isLoading && <p className='text-center text-gray-500 my-10'>Đang tải giỏ hàng...</p>}
                    {error && !isLoading && <p className='text-center text-red-500 my-10'>{error}</p>}
                    {!isLoading && !error && cartItems.length === 0 && (
                        <p className='text-center text-gray-500 my-10'>Giỏ hàng của bạn đang trống.</p>
                    )}
                    {!isLoading && !error && cartItems.length > 0 && (
                        <ul className="space-y-4">
                            {cartItems.map((item) => (
                                // *** SỬA ĐỔI KEY VÀ LOGIC HIỂN THỊ ITEM ***
                                <li key={item.productId} className='text-sm flex flex-row border-b border-gray-100 pb-3'>
                                    <img
                                        // Lấy ảnh từ API (đảm bảo API trả về trường 'image')
                                        src={item.image ? `${IMAGE_BASE_URL}/uploads/products/${item.image}` : defaultProductImage}
                                        alt={item.name} // Lấy tên từ API
                                        className='w-20 h-20 object-cover mr-4 rounded' // Kích thước cố định
                                        onError={(e) => { e.target.onerror = null; e.target.src=defaultProductImage }}
                                    />
                                    <div className="flex flex-col items-start flex-grow justify-between">
                                         <div>
                                            <h3 className="font-semibold text-md mb-1 text-gray-800">{item.name}</h3> {/* Lấy tên từ API */}
                                            {/* Bỏ Màu và Size vì không có trong API GET /cart */}
                                            {/* <p className="text-gray-500">Màu: {item.color}</p> */}
                                            {/* <p className="text-gray-500">Size: {item.size}</p> */}
                                            <p className="text-gray-600 text-xs mb-1">Đơn giá: {parseInt(item.price).toLocaleString()} VND</p> {/* Lấy giá từ API */}
                                            <p className="text-gray-600 text-xs">Số lượng: {item.quantity}</p> {/* Lấy số lượng từ API */}
                                         </div>
                                         {/* Nút xóa */}
                                         <button
                                             className="text-red-500 hover:text-red-700 hover:underline text-xs font-medium mt-1 disabled:opacity-50"
                                             // Gọi handleRemoveItem với productId
                                             onClick={() => handleRemoveItem(item.productId)}
                                             disabled={isRemoving === item.productId} // Disable nút khi đang xóa chính item này
                                         >
                                             {isRemoving === item.productId ? 'Đang xóa...' : 'Xóa'}
                                         </button>
                                     </div>
                                      <div className="ml-2 text-right flex-shrink-0"> {/* Giá tổng của item */}
                                           <p className="font-semibold text-gray-800">
                                              {(parseInt(item.price) * item.quantity).toLocaleString()} VND
                                          </p>
                                      </div>
                                </li>
                                // *** KẾT THÚC SỬA ĐỔI ITEM ***
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer của Cart */}
                {!isLoading && !error && cartItems.length > 0 && (
                    <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50"> {/* Thêm mt-auto và bg */}
                        <div className='flex justify-between items-center text-lg font-semibold mb-4'>
                            <span>Tổng cộng:</span>
                            {/* Tính tổng từ state subtotal hoặc tính lại từ cartItems */}
                            <span>{subtotal.toLocaleString()} VND</span>
                        </div>
                        <button
                             className='w-full px-4 py-3 text-md font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300'
                            onClick={() => { navigate("/purchase"); onClose(); }} // Điều hướng tới trang thanh toán
                            disabled={cartItems.length === 0} // Disable nếu giỏ hàng trống
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