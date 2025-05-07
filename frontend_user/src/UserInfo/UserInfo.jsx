import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = "http://localhost/backend/public";
const IMAGE_BASE_URL = "http://localhost/backend/public";

const UserInfo = () => {
    const { user: authUser, token, isLoading: authLoading } = useAuth();
    const [profileData, setProfileData] = useState({
        userId: null, fullName: '', email: '', phone: '', avatar: null,
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [isFetching, setIsFetching] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [orders, setOrders] = useState([]);
    const [detailError, setDetailError] = useState('');

    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const fetchData = useCallback(async () => {
        if (!token || !authUser?.id) {
            setError("Không thể xác thực người dùng.");
            setIsFetching(false);
            return;
        }

        setIsFetching(true);
        setError('');
        console.log("Fetching data with token:", token);

        try {
            const headers = { Authorization: `Bearer ${token}` };
            const [profileResponse, ordersResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/user/profile`, { headers }),
                axios.get(`${API_BASE_URL}/orders`, { headers })
            ]);

            console.log("Profile Response:", profileResponse.data);
            console.log("Orders Response:", ordersResponse.data);
            if (profileResponse.data) {
                setProfileData({
                    userId: profileResponse.data.userId,
                    fullName: profileResponse.data.name || '',
                    email: profileResponse.data.email || '',
                    phone: profileResponse.data.phone || '',
                    avatar: profileResponse.data.avatar || null,
                });
                if (profileResponse.data.avatar) {
                    setAvatarPreview(`${IMAGE_BASE_URL}/uploads/avatars/${profileResponse.data.avatar}`);
                } else {
                    setAvatarPreview('https://via.placeholder.com/100');
                }
            }

            if (ordersResponse.data) {
                setOrders(ordersResponse.data);
            }

        } catch (err) {
            console.error("Error fetching user data:", err.response || err);
            const errorMsg = err.response?.data?.error || "Không thể tải dữ liệu người dùng hoặc đơn hàng.";
            setError(errorMsg);
            toast.error(errorMsg);
        } finally {
            setIsFetching(false);
        }
    }, [token, authUser?.id]);

    useEffect(() => {
        if (!authLoading) {
            fetchData();
        }
    }, [authLoading, fetchData]);

    const fetchOrderDetail = async (orderId) => {
        if (selectedOrderId === orderId) {
            setSelectedOrderId(null);
            setSelectedOrderDetails(null);
            return;
        }

        setSelectedOrderId(orderId);
        setSelectedOrderDetails(null);
        setIsLoadingDetails(true);
        setError('');

        try {
            if (!token) throw new Error("Chưa đăng nhập");
            const headers = { Authorization: `Bearer ${token}` };
            console.log(`Workspaceing details for order: ${orderId}`);

            const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, { headers });

            if (response.status === 200 && response.data) {
                console.log(`Order details received:`, response.data);
                setSelectedOrderDetails(response.data);
            } else {
                throw new Error("Không thể lấy chi tiết đơn hàng.");
            }
        } catch (err) {
            console.error(`Error fetching order details ${orderId}:`, err.response || err);
            const errorMsg = err.response?.data?.error || "Lỗi khi tải chi tiết đơn hàng.";
            setError(errorMsg);
            toast.error(errorMsg);
            setSelectedOrderId(null);
            setSelectedOrderDetails(null);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    // Hàm xử lý thay đổi input text
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prevState => ({ ...prevState, [name]: value }));
    };

    // Hàm xử lý khi chọn file avatar mới
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            // Tạo URL tạm thời để preview ngay lập tức
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Lưu File object để chuẩn bị upload
            setAvatarFile(file);
        } else {
            toast.error("Vui lòng chọn file ảnh hợp lệ.");
            setAvatarFile(null);
        }
    };

    const handleSave = async () => {
        if (isSaving || !token) return;
        setIsSaving(true);
        setError('');

        // 1. Tạo FormData
        const formData = new FormData();

        // 2. Thêm các trường dữ liệu text vào FormData
        formData.append('name', profileData.fullName);
        formData.append('phone', profileData.phone);

        // 3. Thêm file avatar vào FormData nếu có file mới được chọn
        if (avatarFile) {
            formData.append('avatarFile', avatarFile);
            console.log("Appending avatar file to FormData:", avatarFile);
        }

        try {
            const headers = {
                Authorization: `Bearer ${token}`,
            };

            console.log("Sending update request to /user/profile");

            // 4. Gọi API POST /user/profile với FormData
            const response = await axios.post(`${API_BASE_URL}/user/profile`, formData, {
                headers: headers
            });

            console.log("Update Profile Response:", response.data);

            // 5. Xử lý kết quả thành công (Backend trả về thông tin user mới nhất)
            if (response.status === 200 && response.data) {
                toast.success('Thông tin cá nhân đã được cập nhật!');
                setProfileData(prev => ({
                    ...prev,
                    fullName: response.data.name || prev.fullName,
                    phone: response.data.phone || '',
                    avatar: response.data.avatar || prev.avatar,
                }));

                if (response.data.avatar) {
                    setAvatarPreview(`${IMAGE_BASE_URL}/uploads/avatars/${response.data.avatar}?t=${Date.now()}`);
                } else if (avatarFile) {
                    setAvatarPreview(profileData.avatar ? `${IMAGE_BASE_URL}/uploads/avatars/${profileData.avatar}` : 'https://via.placeholder.com/100');
                }

                setAvatarFile(null);
            } else {
                throw new Error("Cập nhật thất bại hoặc dữ liệu trả về không hợp lệ.");
            }

        } catch (err) {
            console.error("Update Profile Error:", err.response || err);
            const errorMessage = err.response?.data?.error || "Lỗi khi cập nhật thông tin.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (authLoading || isFetching) {
        return <div className="text-center mt-20">Đang tải dữ liệu...</div>;
    }
    if (!authUser) {
        return <div className="text-center mt-20 text-red-600">Vui lòng đăng nhập để xem thông tin cá nhân.</div>;
    }

    if (error && !profileData.userId) {
        return <div className="text-center mt-20 text-red-600">Lỗi tải dữ liệu: {error}</div>;
    }


    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 md:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:space-x-8 max-w-7xl"
        >
            {/* === CỘT BÊN TRÁI: THÔNG TIN CÁ NHÂN === */}
            <div className="md:w-1/3 lg:w-2/5 w-full mb-8 md:mb-0">
                <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Thông Tin Cá Nhân</h2>

                    {/* Phần Avatar */}
                    <div className="flex flex-col items-center space-y-4 mb-6">
                        <img
                            src={avatarPreview || 'https://via.placeholder.com/150'}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-200 shadow-md"
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/150' }}
                        />
                        <div>
                            <label htmlFor="avatarInput" className="cursor-pointer bg-indigo-100 text-indigo-700 px-5 py-2 rounded-md hover:bg-indigo-200 text-sm font-semibold transition duration-200 ease-in-out">
                                Thay đổi ảnh
                            </label>
                            <input id="avatarInput" type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </div>
                    </div>

                    {/* Form Thông Tin */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" value={profileData.email} disabled className="w-full border border-gray-300 p-3 rounded-md bg-gray-100 cursor-not-allowed text-gray-500" />
                        </div>
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
                            <input id="fullName" type="text" name="fullName" value={profileData.fullName} onChange={handleChange} disabled={isSaving} className="w-full border border-gray-300 p-3 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                            <input id="phone" type="tel" name="phone" value={profileData.phone || ''} onChange={handleChange} disabled={isSaving} className="w-full border border-gray-300 p-3 rounded-md focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out" placeholder="Chưa cập nhật" />
                        </div>
                    </div>

                    {/* Hiển thị lỗi chung (nếu có và không phải lỗi chi tiết) */}
                    {error && !detailError && (
                        <p className="mt-4 text-center text-red-600 font-semibold text-sm">
                            {error}
                        </p>
                    )}

                    {/* Nút Lưu */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="mt-6 w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition duration-150 ease-in-out font-semibold text-lg"
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                    </button>
                </div>
            </div>

            {/* === CỘT BÊN PHẢI: LỊCH SỬ ĐƠN HÀNG === */}
            <div className="md:w-2/3 lg:w-3/5 w-full">
                <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                    <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Đơn Hàng Của Bạn</h3>
                    {orders.length > 0 ? (
                        <ul className="space-y-4">
                            {orders.map(order => (
                                <li key={order.orderId} className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden transition-shadow duration-200 hover:shadow-md">
                                    {/* Phần thông tin chính của đơn hàng */}
                                    <div
                                        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                                        onClick={() => fetchOrderDetail(order.orderId)}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-semibold text-lg text-indigo-700">Đơn hàng #{order.orderId}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : order.status === 'cancelled' ? 'bg-red-100 text-red-800' : order.status === 'shipped' ? 'bg-blue-100 text-blue-800' : order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-1">Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
                                        <p className="text-gray-800 font-medium mb-1">Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</p>
                                        <p className="text-gray-600 text-sm mb-1">Thanh toán: {order.method}</p>
                                        <p className="text-gray-600 text-sm">Địa chỉ: {order.address}</p>
                                        <div className="text-right text-xs text-indigo-500 mt-2 font-medium">
                                            {selectedOrderId === order.orderId ? 'Ẩn chi tiết ▲' : 'Xem chi tiết ▼'}
                                        </div>
                                    </div>

                                    {/* Phần hiển thị chi tiết sản phẩm (Ẩn/Hiện) */}
                                    {selectedOrderId === order.orderId && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 pt-3 bg-indigo-50 border-t border-indigo-100">
                                                {isLoadingDetails && <p className="text-center text-indigo-600 text-sm py-3 animate-pulse">Đang tải chi tiết...</p>}
                                                {/* Sử dụng state lỗi chi tiết riêng */}
                                                {detailError && !isLoadingDetails && (!selectedOrderDetails || selectedOrderDetails.orderId !== order.orderId) && (
                                                    <p className="text-center text-red-500 text-sm py-3">{detailError}</p>
                                                )}
                                                {selectedOrderDetails && selectedOrderDetails.orderId === order.orderId && !isLoadingDetails && (
                                                    <>
                                                        <h4 className="text-md font-semibold mb-3 text-gray-700 pt-1">Chi tiết sản phẩm:</h4>
                                                        <ul className="space-y-3">
                                                            {selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ?
                                                                selectedOrderDetails.items.map(item => (
                                                                    <li key={item.productId} className="flex items-center justify-between text-sm border-b border-gray-200 pb-2 last:border-b-0">
                                                                        <div className="flex items-center space-x-3 flex-grow mr-3 overflow-hidden">
                                                                            <img src={item.productImage ? `${IMAGE_BASE_URL}/uploads/products/${item.productImage}` : 'https://via.placeholder.com/40'} alt={item.productName} className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0" onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/40' }} />
                                                                            <div className='flex flex-col min-w-0'>
                                                                                <span className="font-medium text-gray-800 truncate">{item.productName}</span>
                                                                                <span className="text-gray-500 text-xs">SL: {item.quantity}</span>
                                                                            </div>
                                                                        </div>
                                                                        <span className="text-gray-700 font-semibold whitespace-nowrap">
                                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price_at_purchase)}
                                                                        </span>
                                                                    </li>
                                                                ))
                                                                :
                                                                <p className='text-gray-500 text-sm italic'>Không có thông tin sản phẩm cho đơn hàng này.</p>
                                                            }
                                                        </ul>
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center mt-6 py-4">Bạn chưa có đơn hàng nào.</p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default UserInfo;