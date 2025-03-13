import React, { useState } from "react";
import cart from '../Images/cart.png'
import product1 from '../Images/product.png'
import ImageSlider from "../Layout/IntroPic";
import ProductInfo from "./ProductInfo";
import { AnimatePresence } from "framer-motion";

const products = [
  { id: 1, name: "Áo sơ mi 1", price: 200000, category: "Áo sơ mi", color: "Trắng" },
  { id: 2, name: "Áo sơ mi 2", price: 300000, category: "Áo sơ mi", color: "Xanh" },
  { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen" },
  { id: 4, name: "Áo sơ mi 4", price: 280000, category: "Áo sơ mi", color: "Đỏ" },

  { id: 5, name: "Áo thun 1", price: 150000, category: "Áo thun", color: "Trắng" },
  { id: 6, name: "Áo thun 2", price: 180000, category: "Áo thun", color: "Đỏ" },
  { id: 7, name: "Áo thun 3", price: 170000, category: "Áo thun", color: "Xanh" },
  { id: 8, name: "Áo thun 4", price: 190000, category: "Áo thun", color: "Đen" },

  { id: 9, name: "Đồng hồ 1", price: 500000, category: "Đồng hồ", color: "Đen" },
  { id: 10, name: "Đồng hồ 2", price: 700000, category: "Đồng hồ", color: "Đỏ" },
  { id: 11, name: "Đồng hồ 3", price: 650000, category: "Đồng hồ", color: "Trắng" },
  { id: 12, name: "Đồng hồ 4", price: 720000, category: "Đồng hồ", color: "Xanh" },

  { id: 13, name: "Giày 1", price: 400000, category: "Giày", color: "Trắng" },
  { id: 14, name: "Giày 2", price: 450000, category: "Giày", color: "Đen" },
  { id: 15, name: "Giày 3", price: 480000, category: "Giày", color: "Xanh" },
  { id: 16, name: "Giày 4", price: 500000, category: "Giày", color: "Đỏ" },

  { id: 17, name: "Áo sơ mi 5", price: 290000, category: "Áo sơ mi", color: "Trắng" },
  { id: 18, name: "Áo sơ mi 6", price: 310000, category: "Áo sơ mi", color: "Xanh" },
  { id: 19, name: "Áo thun 5", price: 160000, category: "Áo thun", color: "Đen" },
  { id: 20, name: "Áo thun 6", price: 200000, category: "Áo thun", color: "Trắng" },

  { id: 21, name: "Đồng hồ 5", price: 600000, category: "Đồng hồ", color: "Đen" },
  { id: 22, name: "Đồng hồ 6", price: 750000, category: "Đồng hồ", color: "Xanh" },
  { id: 23, name: "Giày 5", price: 430000, category: "Giày", color: "Đỏ" },
  { id: 24, name: "Giày 6", price: 470000, category: "Giày", color: "Trắng" },

  { id: 25, name: "Áo sơ mi 7", price: 270000, category: "Áo sơ mi", color: "Đen" },
  { id: 26, name: "Áo thun 7", price: 185000, category: "Áo thun", color: "Xanh" },
  { id: 27, name: "Đồng hồ 7", price: 730000, category: "Đồng hồ", color: "Trắng" },
  { id: 28, name: "Giày 7", price: 460000, category: "Giày", color: "Xanh" },

  { id: 29, name: "Áo sơ mi 8", price: 320000, category: "Áo sơ mi", color: "Trắng" },
  { id: 30, name: "Áo thun 8", price: 190000, category: "Áo thun", color: "Đỏ" },
  { id: 31, name: "Đồng hồ 8", price: 710000, category: "Đồng hồ", color: "Đen" },
  { id: 32, name: "Giày 8", price: 490000, category: "Giày", color: "Đỏ" },

  { id: 33, name: "Áo sơ mi 9", price: 280000, category: "Áo sơ mi", color: "Xanh" },
  { id: 34, name: "Áo thun 9", price: 175000, category: "Áo thun", color: "Trắng" },
  { id: 35, name: "Đồng hồ 9", price: 740000, category: "Đồng hồ", color: "Đỏ" },
  { id: 36, name: "Giày 9", price: 520000, category: "Giày", color: "Đen" }
];


const categories = [
  "Tất cả",
  "Áo sơ mi",
  "Áo thun",
  "Đồng hồ",
  "Giày"
];

const colors = [
  "Tất cả",
  "Trắng",
  "Đen",
  "Xanh",
  "Đỏ"
];


const priceRanges = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 200K", min: 0, max: 200000 },
  { label: "200K - 500K", min: 200000, max: 500000 },
  { label: "Trên 500K", min: 500000, max: Infinity },
];

const itemsPerPage = 8;

const ProductList = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedColor, setSelectedColor] = useState("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState(priceRanges[0]);
  const [currentPage, setCurrentPage] = useState(1);

  // Lọc sản phẩm theo danh mục, màu sắc, giá
  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "Tất cả" || product.category === selectedCategory;
    const colorMatch = selectedColor === "Tất cả" || product.color === selectedColor;
    const priceMatch = product.price >= selectedPrice.min && product.price <= selectedPrice.max;
    return categoryMatch && colorMatch && priceMatch;
  });

  // Phân trang
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // Khi thay đổi bộ lọc, reset về trang 1
  const handleFilterChange = (setter, value) => {
    setter(value);
    setCurrentPage(1);
  };

  const [isOpenInfo, setIsOpenInfo] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({})

  const itemInfo = (selectedProduct) => {
    setIsOpenInfo(!isOpenInfo)
    setSelectedProduct(selectedProduct)
  }

  return (
    <div className="container mx-auto p-4">
      <ImageSlider></ImageSlider>
      {/* Bộ lọc */}
      <div className="flex flex-wrap flex-row items-center justify-center max-sm:flex-col max-sm:items-start gap-4 mb-4">

        {/* Lọc theo danh mục */}
        <div className="flex flex-row items-center">
          <p>Danh mục: </p>
          <select
            className="p-2 border rounded-lg mx-2"
            value={selectedCategory}
            onChange={(e) => handleFilterChange(setSelectedCategory, e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        {/* Lọc theo màu sắc */}
        <div className="flex flex-row items-center">
          <p>Màu sắc: </p>
          <select
            className="p-2 border rounded-lg mx-2"
            value={selectedColor}
            onChange={(e) => handleFilterChange(setSelectedColor, e.target.value)}
          >
            {colors.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        </div>

        {/* Lọc theo giá */}
        <div className="flex flex-row items-center">
          <p>Mức giá: </p>
          <select
            className="p-2 border rounded-lg mx-2"
            value={selectedPrice.label}
            onChange={(e) =>
              handleFilterChange(
                setSelectedPrice,
                priceRanges.find((range) => range.label === e.target.value)
              )
            }
          >
            {priceRanges.map((range) => (
              <option key={range.label} value={range.label}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid max-sm:grid-cols-2 max-lg:grid-cols-3 grid-cols-4 gap-8 text-md">
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <div key={product.id} className="border border-[#cccccc] rounded-md p-2 text-center">
              <img src={product1} alt="" onClick={() => itemInfo(product)} className="cursor-pointer" />
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
          <p className="text-center col-span-4 text-red-500">Không có sản phẩm nào!</p>
        )}
      </div>
      <AnimatePresence>
        {isOpenInfo && (<ProductInfo selectedProduct={selectedProduct} onClose={() => setIsOpenInfo(false)} ></ProductInfo>)}
      </AnimatePresence>
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 border ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
                } rounded-lg hover:bg-blue-400 transition`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
