import { motion } from 'framer-motion';
import prod from '../Images/product.png'
import { useNavigate } from 'react-router-dom';

const itemCart = [
    { id: 1, name: "Áo sơ mi 1", price: 200000, category: "Áo sơ mi", color: "Trắng", size: '2XL', quantity: 2 },
    { id: 2, name: "Áo sơ mi 2", price: 300000, category: "Áo sơ mi", color: "Xanh", size: 'M', quantity: 1 },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
]

const Cart = ({ onClose }) => {
    const navigate = useNavigate();
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
                {itemCart.length > 0 ? (

                    itemCart.map((item) => (
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
                    ))
                ) : (
                    <p>Hehehe</p>
                )}
                <p className='text-lg font-semibold ml-2'>Tổng cộng: {itemCart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VND</p>
                <button className='px-4 py-2 my-4 self-center text-md font-semibold rounded-full text-white bg-[#333333] hover:bg-black hover:scale-[1.02] duration-300 '
                onClick={() => {navigate("/purchase"); onClose();}}>
                    THANH TOÁN
                </button>
            </motion.div>
            {/* 
            {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="border border-[#cccccc] rounded-md p-2 text-center hover:border-[#646edf] hover:scale-[1.02] duration-300">
              <img src={product1} alt="" onClick={() => itemInfo(product)} className="cursor-pointer w-full mb-4" />
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col items-start">
                  <h3 className=" font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.price.toLocaleString()} VND</p>
                  <p className="text-gray-500">Màu: {product.color}</p>
                </div>
                <img src={cart} alt="" className='w-7 h-7 cursor-pointer ' />
              </div>
            </div>
          ))
        ) : (
          <p className="text-center my-8 col-span-4 text-red-500 text-xl font-semibold">Không có sản phẩm phù hợp, bạn vui lòng chọn sản phẩm khác nhé.</p>
        )} */}
        </>
    );
};


export default Cart