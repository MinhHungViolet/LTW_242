import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const UserInfo = () => {
    const [user, setUser] = useState({
        fullName: '',
        birthDate: '',
        gender: '',
        phone: '',
        avatar: '',
        orders: []
    });

    useEffect(() => {
        // Giả lập lấy dữ liệu người dùng từ API hoặc local storage
        setUser({
            fullName: 'Nguyễn Văn A',
            birthDate: '1990-01-01',
            gender: 'Nam',
            phone: '0123456789',
            avatar: 'https://via.placeholder.com/100',
            orders: [
                { id: 1, status: 'Đang xử lý' },
                { id: 2, status: 'Hoàn thành' }
            ]
        });
    }, []);

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

    const handleSave = () => {
        // Cập nhật thông tin lên backend hoặc local storage
        console.log('Thông tin đã cập nhật:', user);
        alert('Thông tin cá nhân đã được cập nhật!');
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-10"
        >
            <h2 className="text-2xl font-semibold mb-4">Thông tin cá nhân</h2>
            <div className="flex items-center space-x-4">
                <img src={user.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                <input type="file" onChange={handleAvatarChange} className="border p-2 rounded-md" />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium">Họ tên</label>
                <input type="text" name="fullName" value={user.fullName} onChange={handleChange} className="w-full border p-2 rounded-md mt-1" />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium">Ngày sinh</label>
                <input type="date" name="birthDate" value={user.birthDate} onChange={handleChange} className="w-full border p-2 rounded-md mt-1" />
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium">Giới tính</label>
                <select name="gender" value={user.gender} onChange={handleChange} className="w-full border p-2 rounded-md mt-1">
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                </select>
            </div>
            <div className="mt-4">
                <label className="block text-sm font-medium">Số điện thoại</label>
                <input type="text" name="phone" value={user.phone} onChange={handleChange} className="w-full border p-2 rounded-md mt-1" />
            </div>
            <button onClick={handleSave} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Lưu thay đổi</button>
            <h3 className="text-xl font-semibold mt-6">Đơn hàng của bạn</h3>
            <ul className="mt-2">
                {user.orders.map(order => (
                    <li key={order.id} className="border p-2 rounded-md mt-2">Đơn hàng #{order.id} - {order.status}</li>
                ))}
            </ul>
        </motion.div>
    );
};

export default UserInfo;
