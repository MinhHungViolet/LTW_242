import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserInfo = () => {
    const { user: authUser } = useAuth();
    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        avatar: 'https://via.placeholder.com/100',
        birthDate: '',
        gender: '',
        orders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authUser) {
            fetchUserData();
            fetchUserOrders();
        }
    }, [authUser]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost/backend/src/Controllers/Auth.php?action=getUserInfo&userId=${authUser.userId}`);
            if (response.data.status === 'success') {
                setUser(prevState => ({
                    ...prevState,
                    ...response.data.data
                }));
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            toast.error('Không thể tải thông tin người dùng');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserOrders = async () => {
        try {
            const response = await axios.get(`http://localhost/backend/src/Controllers/OrderController.php?userId=${authUser.userId}`);
            if (response.data.status === 'success') {
                setUser(prevState => ({
                    ...prevState,
                    orders: response.data.data || []
                }));
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Không thể tải lịch sử đơn hàng');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setUser(prevState => ({ ...prevState, avatar: event.target.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            const response = await axios.post('http://localhost/backend/src/Controllers/Auth.php', {
                action: 'updateUserInfo',
                userId: authUser.userId,
                userData: {
                    name: user.name,
                    phone: user.phone,
                    birthDate: user.birthDate,
                    gender: user.gender,
                    avatar: user.avatar
                }
            });

            if (response.data.status === 'success') {
                toast.success('Thông tin đã được cập nhật thành công!');
            } else {
                toast.error(response.data.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            console.error('Error updating user info:', error);
            toast.error('Không thể cập nhật thông tin');
        }
    };

    if (!authUser) {
        return (
            <div className="text-center mt-10 p-6">
                <p className="text-xl">Vui lòng đăng nhập để xem thông tin cá nhân</p>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center mt-10">Đang tải...</div>;
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10 mb-10"
        >
            <h2 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h2>
            
            <div className="flex items-center space-x-4 mb-6">
                <img 
                    src={user.avatar || 'https://via.placeholder.com/100'} 
                    alt="Avatar" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
                <input 
                    type="file" 
                    onChange={handleAvatarChange} 
                    className="border p-2 rounded-md" 
                    accept="image/*"
                />
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        value={user.email} 
                        disabled 
                        className="w-full border p-2 rounded-md mt-1 bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={user.name} 
                        onChange={handleChange} 
                        className="w-full border p-2 rounded-md mt-1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <input 
                        type="date" 
                        name="birthDate" 
                        value={user.birthDate || ''} 
                        onChange={handleChange} 
                        className="w-full border p-2 rounded-md mt-1"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <select 
                        name="gender" 
                        value={user.gender || ''} 
                        onChange={handleChange} 
                        className="w-full border p-2 rounded-md mt-1"
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input 
                        type="tel" 
                        name="phone" 
                        value={user.phone} 
                        onChange={handleChange} 
                        className="w-full border p-2 rounded-md mt-1"
                    />
                </div>

                <button 
                    onClick={handleSave} 
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Lưu thay đổi
                </button>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Lịch sử đơn hàng</h3>
                {user.orders.length > 0 ? (
                    <ul className="space-y-4">
                        {user.orders.map(order => (
                            <li key={order.orderId} className="border p-4 rounded-md">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Đơn hàng #{order.orderId}</span>
                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                        order.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>Tổng tiền: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalPrice)}</p>
                                    <p>Ngày đặt: {new Date(order.date).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">Chưa có đơn hàng nào</p>
                )}
            </div>
        </motion.div>
    );
};

export default UserInfo;
