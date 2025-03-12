import pro from '../Images/product.png'
import { motion } from 'framer-motion';

const ProductInfo = ({ selectedProduct, onClose }) => {
    if (!selectedProduct) return null
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={onClose} // Bấm ra ngoài modal thì đóng
        >
            <div
                className="bg-white p-6 rounded-lg shadow-lg relative w-96"
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
                <img src={pro} className="w-full h-40 object-cover rounded-md" />
                <h2 className="text-xl font-bold mt-4">{selectedProduct.name}</h2>
                <p className="text-gray-600">Giá: {selectedProduct.price.toLocaleString()} VND</p>
                <p className="text-gray-500">Danh mục: {selectedProduct.category}</p>
                <p className="text-gray-500">Màu: {selectedProduct.color}</p>
                <button
                    className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    onClick={onClose} // Nút Đóng
                >
                    Đóng
                </button>
            </div>
        </div>
    );
}

export default ProductInfo