import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import defaultProductImage from '../Images/product.png';
import ImageSlider from "../Layout/IntroPic";
import ProductInfo from "./ProductInfo";
const API_BASE_URL = "http://localhost/backend/public";
const IMAGE_BASE_URL = "http://localhost/backend/public";

const categories = ["Tất cả", "Áo", "Quần", "Giày", "Đồng hồ"];
const colors = ["Tất cả", "Trắng", "Đen", "Xanh", "Đỏ"];
const priceRanges = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 200K", min: 0, max: 200000 },
  { label: "200K - 500K", min: 200000, max: 500000 },
  { label: "Trên 500K", min: 500000, max: Infinity },
];
const itemsPerPage = 8;

const ProductList = () => {
  const [allProducts, setAllProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);   
  const [error, setError] = useState(null);          

  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedColor, setSelectedColor] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [currentPage, setCurrentPage] = useState(1);


  const [isOpenInfo, setIsOpenInfo] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null); 

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        console.log("Fetched products:", response.data);
        setAllProducts(response.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []); 

  const filteredProducts = allProducts.filter((product) => {
    const categoryMatch = selectedCategory === "Tất cả" || product.category === selectedCategory;
    const priceMatch = product.price >= selectedPrice.min && parseFloat(product.price) < selectedPrice.max;
    return categoryMatch && priceMatch;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const openProductInfoModal = (productId) => {
    console.log("Opening info for productId:", productId);
    setSelectedProductId(productId);
    setIsOpenInfo(true);
  };

  const closeProductInfoModal = () => {
    setIsOpenInfo(false);
    setSelectedProductId(null);
  };
  return (
    <div className="container mx-auto p-4 min-h-screen"> 
      <ImageSlider /> 

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product.productId} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg hover:border-indigo-300 hover:scale-[1.02] transition-all duration-300 ease-in-out flex flex-col"> {/* Thêm flex flex-col */}
                  <img
                    src={product.image ? `${IMAGE_BASE_URL}/uploads/products/${product.image}` : defaultProductImage}
                    alt={product.name}
                    onClick={() => openProductInfoModal(product.productId)}
                    className="cursor-pointer w-full h-48 object-cover mb-4 rounded"
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultProductImage }}
                  />
                  <div className="flex flex-col items-center justify-between flex-grow"> 
                    <div className="mb-2">
                      <h3 className="font-semibold text-md text-gray-800 mb-1">{product.name}</h3>
                      <p className="text-indigo-600 font-bold text-lg">{parseInt(product.price).toLocaleString()} VND</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center my-8 col-span-full text-gray-500 text-lg">Không có sản phẩm phù hợp.</p>
                        )}
          </div>

          {/* Modal ProductInfo */}
          <AnimatePresence>
            {isOpenInfo && selectedProductId && (
              <ProductInfo
                productId={selectedProductId}
                onClose={closeProductInfoModal}
              />
            )}
          </AnimatePresence>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 pt-4 border-t border-gray-200 space-x-2">
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