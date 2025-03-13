import { useState } from 'react';
import pro from '../Images/product.png'
import { motion } from 'framer-motion';

const sizeClothes = ['2XL', 'XL', 'L', 'M', 'S']
const sizeShoes = ['43', '42', '41', '40', '39', '38', '37', '36', '35']

const ProductInfo = ({ selectedProduct, onClose }) => {
    const [orderItems, setOrderItems] = useState([
        { item: {}, size: "", quantity: 0 }
    ])

    const addToCart = (prod, size, quantity) => {
        const isExisted = orderItems.find((i) => i.prod.name === prod.name && i.prod.name === prod.size);
        if (isExisted) orderItems.map((i) => (i.prod.name === prod.name && i.prod.name === prod.size) ? { ...i, quantity: i.quantity + prod.quantity } : i)
        else setOrderItems([...orderItems, { prod, size, quantity }])
    }
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose} // Bấm ra ngoài modal thì đóng
        >
            <motion.div
                className="bg-white p-6 rounded-md shadow-lg relative max-md:w-[80%] w-[60%] flex flex-row items-center "
                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan lên div cha
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                    onClick={onClose} // Nút X cũng đóng modal
                >
                    ✖
                </button>
                <img src={pro} className="w-[40%] object-cover rounded-sm mr-8" />
                <div className='self-start flex flex-col text-md'>
                    <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                    <p className="text-gray-600">Giá: {selectedProduct.price.toLocaleString()} VND</p>
                    <p className="text-gray-500">Danh mục: {selectedProduct.category}</p>
                    <p className="text-gray-500">Màu: {selectedProduct.color}</p>
                    <p className="text-gray-500">Mô tả: Đặc điểm gì đó của sản phẩm này(Đang tạm thời hardcode, khi làm CSDL thì chỉnh lại sau)</p>
                    <div className='flex flex-row w-[60%] '>
                        <input type="text" />
                        <input type="text" />
                    </div>
                    <button
                        className="mt-4 w-[60%] bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 self-center"
                        onClick={() => addToCart(selectedProduct)}
                    >
                        Thêm vào giỏ hàng
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default ProductInfo