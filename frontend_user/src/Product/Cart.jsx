import { motion } from 'framer-motion';
import prod from '../Images/product.png'
import { useNavigate } from 'react-router-dom';
import { getCartFromCookie, removeItemFromCart } from '../Utils/cartUtils';
import { useEffect, useState } from 'react';

const Cart = ({ onClose }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        
        setCartItems(getCartFromCookie());
    }, [])

    const handleRemoveItem = (id, size) => {
        const updatedCart = removeItemFromCart(id, size);
        setCartItems(updatedCart);
    }
    return (
        <>
            {/* Overlay để bắt sự kiện click ra ngoài */}
            <div
                className="fixed inset-0 bg-black bg-opacity-30 z-40"
                onClick={onClose} // Bấm ra ngoài thì đóng
            ></div>

            {/* Cart luôn nằm dưới Nav */}
            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}

                className="absolute top-full right-0 w-[350px]  bg-white shadow-lg p-3 border rounded-md z-50 max-h-[600px] overflow-y-auto
                            flex flex-col"
                onClick={(e) => e.stopPropagation()} // Ngăn chặn đóng khi bấm vào trong Cart
            >
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-black"
                    onClick={onClose} // Nút X cũng đóng modal
                >
                    ✖
                </button>
                <p className='text-lg font-semibold'>GIỎ HÀNG CỦA BẠN</p>
                {cartItems.length > 0 ? (

                    cartItems.map((item) => (
                        <>
                            <div key={item.id} className='my-4 text-sm flex flex-row'>
                                <img src={prod} alt="" className='w-[6rem] aspect-auto mr-4' />
                                <div className="flex flex-col items-start">

                                    <h3 className=" font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-600">Đơn giá: {item.price.toLocaleString()} VND</p>
                                    <p className="text-gray-500">Màu: {item.color}</p>
                                    <p className="text-gray-500">Size: {item.size}</p>
                                    <p className="text-gray-500">Số lượng: {item.quantity}</p>
                                </div>

                            </div>
                            <button
                                className="text-white bg-red-500 py-[0.4rem] rounded-md hover:bg-red-600 transition duration-200 text-sm font-semibold w-[30%]"
                                onClick={() => handleRemoveItem(item.id, item.size)}
                            >
                                Xóa sản phẩm
                            </button>
                        </>
                    ))
                ) : (
                    <p>Hehehe</p>
                )}
                <p className='text-lg font-semibold ml-2 mt-4'>Tổng cộng: {cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VND</p>
                <button className='px-4 py-2 my-4 self-center text-md font-semibold rounded-full text-white bg-[#333333] hover:bg-black hover:scale-[1.02] duration-300 '
                    onClick={() => { navigate("/purchase"); onClose(); }}>
                    THANH TOÁN
                </button>
            </motion.div>
        </>
    );
};


export default Cart