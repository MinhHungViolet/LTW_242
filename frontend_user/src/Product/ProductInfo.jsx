import { useState } from 'react';
import pro from '../Images/product.png'
import { motion } from 'framer-motion';

const clothesSize = ['2XL', 'XL', 'L', 'M', 'S']
const shoesSize = ['43', '42', '41', '40', '39', '38', '37', '36', '35']

const ProductInfo = ({ selectedProduct, onClose }) => {
    const [orderItems, setOrderItems] = useState([
        { item: {}, size: "", quantity: 0 }
    ])

    const [selectedClothesSize, setSelectedClothesSize] = useState('2XL')
    const [selectedShoesSize, setSelectedShoesSize] = useState('43')
    const [quantity, setQuantity] = useState(0)

    const handleChange = (setter, value) => {
        setter(value)
    }

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
                className="bg-white p-6 rounded-md shadow-lg relative max-lg:w-[60%] w-[50%] flex flex-row items-center "
                onClick={(e) => e.stopPropagation()} // Ngăn sự kiện lan lên div cha
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-black"
                    onClick={onClose} // Nút X cũng đóng modal
                >
                    ✖
                </button>
                <img src={pro} className="w-[35%] object-cover rounded-sm mr-8 max-md:hidden max-xl:w-[40%]" />
                <div className='self-start flex flex-col text-md h-full justify-between'>
                    <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                    <p className="text-gray-600">Giá: {selectedProduct.price.toLocaleString()} VND</p>
                    <p className="text-gray-500">Danh mục: {selectedProduct.category}</p>
                    <p className="text-gray-500">Màu: {selectedProduct.color}</p>
                    <p className="text-gray-500">Mô tả: Đặc điểm gì đó của sản phẩm này(Đang tạm thời hardcode, khi làm CSDL thì chỉnh lại sau) lorem </p>

                    <div className='flex flex-row max-lg:flex-col w-full my-8 max-lg:my-0 max-xl:my-4 max-lg:items-start items-center text-md '>
                        <div className='flex flex-row items-center mr-6 max-xl:mr-0 max-lg:my-2'>
                            <p className=''>Size: </p>
                            <select
                                className="p-2 border rounded-lg mx-2 self-end max-lg:w-full"
                                value={selectedProduct.category === "Giày" ? selectedShoesSize : selectedClothesSize}
                                onChange={(e) => handleChange(selectedProduct.category === "Giày" ? setSelectedShoesSize : setSelectedClothesSize, e.target.value)}
                            >
                                {(selectedProduct.category === "Giày" ? shoesSize : clothesSize).map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-row items-center max-lg:my-2'>
                            <p className=''>Số lượng: </p>
                            <input type="number" min={1} className='p-2 border rounded-lg ml-2 w-[30%] max-xl:w-[40%] max-lg:w-[30%] ' onChange={(e) => handleChange(setQuantity, e.target.value)} />
                        </div>
                    </div>
                    <button
                        className="mt-4 w-[12rem] bg-[#6877dd] text-white text-md font-bold py-2 rounded-full hover:bg-[#5564d6] hover:scale-[1.02] self-center transition-all duration-300"
                        // onClick={() => addToCart(selectedProduct, selectedProduct.category === "Giày" ? selectedShoesSize : selectedClothesSize, quantity)}
                        onClick={onClose}
                    >
                        THÊM VÀO GIỎ HÀNG
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

export default ProductInfo