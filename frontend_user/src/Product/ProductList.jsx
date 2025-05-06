import React, { useState, useEffect } from "react"; // Thêm useEffect
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios'; // Import axios
// import cartIcon from '../Images/cart.png'; // Đổi tên biến cart để tránh trùng lặp nếu cần
import defaultProductImage from '../Images/product.png'; // Ảnh mặc định nếu sản phẩm không có ảnh
import ImageSlider from "../Layout/IntroPic"; // Giả sử component này tồn tại
import ProductInfo from "./ProductInfo";   // Import component chi tiết

// Định nghĩa BASE URL (Nên dùng biến môi trường)
const API_BASE_URL = "http://localhost/backend/public";
const IMAGE_BASE_URL = "http://localhost/backend/public"; // Hoặc http://localhost

// Dữ liệu bộ lọc (giữ nguyên)
const categories = ["Tất cả", "Áo sơ mi", "Áo thun", "Đồng hồ", "Giày"];
const colors = ["Tất cả", "Trắng", "Đen", "Xanh", "Đỏ"];
const priceRanges = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 200K", min: 0, max: 200000 },
  { label: "200K - 500K", min: 200000, max: 500000 },
  { label: "Trên 500K", min: 500000, max: Infinity },
];
const itemsPerPage = 8;

const ProductList = () => {
  // --- State ---
  const [allProducts, setAllProducts] = useState([]); // State lưu danh sách gốc từ API
  const [isLoading, setIsLoading] = useState(true);   // State loading khi fetch API
  const [error, setError] = useState(null);           // State lưu lỗi fetch API

  // State cho bộ lọc và phân trang (giữ nguyên logic)
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedColor, setSelectedColor] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [currentPage, setCurrentPage] = useState(1);

  // State cho modal ProductInfo
  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null); // <<< Lưu ID thay vì cả object

  // --- Fetch dữ liệu sản phẩm từ API ---
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        console.log("Fetched products:", response.data);
        setAllProducts(response.data || []); // Lưu danh sách sản phẩm vào state
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []); // Chỉ fetch 1 lần khi component mount

  // --- Logic lọc và phân trang (Áp dụng trên state allProducts) ---
  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch = selectedCategory === "Tất cả" || product.category === selectedCategory;
    // Lưu ý: API GET /products hiện không trả về màu sắc, nên lọc màu tạm thời bỏ qua hoặc sửa API
    // const colorMatch = selectedColor === "Tất cả"; // || product.color === selectedColor;
    const priceMatch = product.price >= selectedPrice.min && parseFloat(product.price) < selectedPrice.max; // Sửa lại điều kiện max price
    // return categoryMatch && colorMatch && priceMatch;
    return categoryMatch && priceMatch; // Bỏ colorMatch nếu API không có
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1); // Reset về trang 1 khi đổi bộ lọc
  };

  // --- Hàm mở modal chi tiết sản phẩm ---
  const openProductInfoModal = (productId) => {
    console.log("Opening info for productId:", productId);
    setSelectedProductId(productId); // <<< Set ID sản phẩm được chọn
    setIsOpenInfo(true);
  };

  // --- Hàm đóng modal chi tiết sản phẩm ---
  const closeProductInfoModal = () => {
    setIsOpenInfo(false);
    setSelectedProductId(null); // Reset ID khi đóng
  };

  // --- JSX ---
  return (
    <div className="container mx-auto p-4 min-h-screen"> {/* Thêm min-h-screen */}
      <ImageSlider /> {/* Giả sử component này tồn tại */}

      {/* Bộ lọc */}
      <div className="flex flex-wrap flex-row items-center justify-center max-sm:flex-col max-sm:items-start gap-4 my-6 bg-gray-50 p-4 rounded-lg shadow"> {/* Thêm style cho bộ lọc */}
        {/* Lọc theo danh mục */}
        <div className="flex flex-row items-center">
          <label htmlFor="category-select" className="mr-2 font-medium text-gray-700">Danh mục:</label>
          <select
            id="category-select"
            className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedCategory}
            onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
          >
            {categories.map((category) => (<option key={category} value={category}>{category}</option>))}
          </select>
        </div>
        {/* Tạm thời ẩn lọc màu vì API GET /products không trả về màu
                 <div className="flex flex-row items-center">
                     <label htmlFor="color-select" className="mr-2 font-medium text-gray-700">Màu sắc:</label>
                     <select id="color-select" className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={selectedColor} onChange={(e) => handleFilterChange(setSelectedColor, e.target.value)} >
                         {colors.map((color) => ( <option key={color} value={color}>{color}</option> ))}
                     </select>
                 </div>
                 */}
        {/* Lọc theo giá */}
        <div className="flex flex-row items-center">
          <label htmlFor="price-select" className="mr-2 font-medium text-gray-700">Mức giá:</label>
          <select id="price-select" className="p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500" value={selectedPrice.label} onChange={(e) => handleFilterChange(setSelectedPrice, priceRanges.find((range) => range.label === e.target.value))}>
            {priceRanges.map((range) => (<option key={range.label} value={range.label}>{range.label}</option>))}
          </select>
        </div>
      </div>

      {/* Hiển thị loading hoặc lỗi */}
      {isLoading && <p className="text-center my-8 text-lg font-semibold text-indigo-600">Đang tải sản phẩm...</p>}
      {error && <p className="text-center my-8 text-red-600 font-semibold">{error}</p>}

      {/* Danh sách sản phẩm */}
      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"> {/* Điều chỉnh grid và gap */}
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product.productId} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg hover:border-indigo-300 hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col"> {/* Thêm flex flex-col */}
                  <img
                    // *** Sửa src ảnh ***
                    src={product.image ? `${IMAGE_BASE_URL}/uploads/products/${product.image}` : defaultProductImage}
                    alt={product.name}
                    onClick={() => openProductInfoModal(product.productId)} // <<< Gọi hàm mở modal với ID
                    className="cursor-pointer w-full h-48 object-cover mb-4 rounded" // Set chiều cao cố định cho ảnh
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultProductImage }} // Fallback nếu ảnh lỗi
                  />
                  <div className="flex flex-col items-center justify-between flex-grow"> {/* Thêm flex-grow */}
                    <div className="mb-2"> {/* Gom text lại */}
                      <h3 className="font-semibold text-md text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-indigo-600 font-bold text-lg">{parseInt(product.price).toLocaleString()} VND</p>
                      {/* Hiển thị số lượng tồn kho nếu cần */}
                      {/* <p className="text-xs text-gray-500 mt-1">Còn lại: {product.stock_quantity}</p> */}
                    </div>
                    {/* Nút giỏ hàng này hiện chưa có chức năng */}
                    {/* <img src={cartIcon} alt="Add to cart" className='w-7 h-7 cursor-pointer mt-auto' /> */}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center my-8 col-span-full text-gray-500 text-lg">Không có sản phẩm phù hợp.</p>
                        )}
          </div>

          {/* Modal ProductInfo */}
          <AnimatePresence>
            {isOpenInfo && selectedProductId && ( // <<< Truyền productId và hàm đóng
              <ProductInfo
                productId={selectedProductId}
                onClose={closeProductInfoModal}
              />
            )}
          </AnimatePresence>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 pt-4 border-t border-gray-200 space-x-2">
              {/* Nút Previous (Tùy chọn) */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                &lt; Trước
              </button>
              {/* Hiển thị các nút số trang */}
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 border rounded-md text-sm transition-colors duration-200 ${currentPage === index + 1 ? "bg-indigo-600 text-white font-bold border-indigo-600" : "bg-white text-gray-700 border-gray-300 hover:bg-indigo-50"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              {/* Nút Next (Tùy chọn) */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded-md text-sm bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >
                Sau &gt;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;