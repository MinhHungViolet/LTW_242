import React, { useState, useEffect, useCallback } from 'react'; // Thêm React và useCallback
import { motion } from 'framer-motion'; // Giữ lại motion nếu bạn muốn dùng animation
import { Plus, Minus, Trash2 } from "lucide-react"; // Thêm icon Trash2 nếu muốn nút xóa riêng
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import axios from 'axios';                   // Import axios
import { toast } from 'react-toastify';      // Import toast
import defaultProductImage from '../Images/product.png'; // Import ảnh mặc định

// --- Định nghĩa BASE URL ---
const API_BASE_URL = "http://localhost/backend/public";
const IMAGE_BASE_URL = "http://localhost/backend/public"; // Hoặc http://localhost

const Purchase = () => {
    const navigate = useNavigate();
    const { user: authUser, token, isLoading: authLoading } = useAuth(); // Lấy token

    // --- State ---
    const [cartItems, setCartItems] = useState([]); // State cho giỏ hàng từ API
    const [isLoadingCart, setIsLoadingCart] = useState(true);
    const [isUpdatingCart, setIsUpdatingCart] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState(null);

    // State cho địa chỉ
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState({ code: "", name: "" }); // Lưu cả code và name
    const [selectedDistrict, setSelectedDistrict] = useState({ code: "", name: "" }); // Lưu cả code và name
    const [selectedWard, setSelectedWard] = useState({ code: "", name: "" });       // Lưu cả code và name
    const [specificAddress, setSpecificAddress] = useState(""); // State cho địa chỉ cụ thể

    // State cho phương thức thanh toán
    const [paymentMethod, setPaymentMethod] = useState(""); // Lưu value của radio button được chọn

    // --- Fetch Địa Chỉ Hành Chính (Giữ nguyên) ---
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/").then((res) => res.json()).then((data) => setProvinces(data.sort((a, b) => a.name.localeCompare(b.name))));
    }, []);

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        const provinceName = e.target.options[e.target.selectedIndex].text; // Lấy tên từ option
        setSelectedProvince({ code: provinceCode, name: provinceName === "Tỉnh / Thành phố" ? "" : provinceName });
        setSelectedDistrict({ code: "", name: "" });
        setSelectedWard({ code: "", name: "" });
        setWards([]); // Reset xã/phường
        if (provinceCode) {
            fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`).then((res) => res.json()).then((data) => setDistricts(data.districts.sort((a, b) => a.name.localeCompare(b.name))));
        } else {
            setDistricts([]); // Reset quận/huyện nếu không chọn tỉnh
        }
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        const districtName = e.target.options[e.target.selectedIndex].text;
        setSelectedDistrict({ code: districtCode, name: districtName === "Quận / Huyện" ? "" : districtName });
        setSelectedWard({ code: "", name: "" });
        if (districtCode) {
            fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).then((res) => res.json()).then((data) => setWards(data.wards.sort((a, b) => a.name.localeCompare(b.name))));
        } else {
            setWards([]); // Reset xã/phường nếu không chọn quận/huyện
        }
    }

    const handleWardChange = (e) => {
        const wardCode = e.target.value;
        const wardName = e.target.options[e.target.selectedIndex].text;
        setSelectedWard({ code: wardCode, name: wardName === "Phường / Xã" ? "" : wardName });
    };

    // --- Fetch Giỏ Hàng Từ API ---
    const fetchCart = useCallback(async () => {
        if (!token) { setIsLoadingCart(false); return; } // Không fetch nếu không có token
        setIsLoadingCart(true); setError(null);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`${API_BASE_URL}/cart`, { headers });
            if (response.status === 200 && response.data) {
                // Quan trọng: Chuyển đổi quantity từ API (có thể là string) thành number
                const itemsWithNumbers = response.data.items.map(item => ({
                     ...item,
                     quantity: parseInt(item.quantity, 10) || 1, // Chuyển sang số, mặc định là 1 nếu lỗi
                     price: parseFloat(item.price) || 0 // Chuyển giá sang số
                 }));
                setCartItems(itemsWithNumbers);
            } else { throw new Error("Lỗi khi tải giỏ hàng"); }
        } catch (err) {
            console.error("Error fetching cart:", err.response || err);
            setError(err.response?.data?.error || "Không thể tải giỏ hàng.");
            setCartItems([]);
        } finally { setIsLoadingCart(false); }
    }, [token]);

    // Gọi fetchCart khi component mount và có token
    useEffect(() => {
        if (!authLoading) { fetchCart(); }
    }, [authLoading, token, fetchCart]);

    // --- Xử Lý Thay Đổi Số Lượng (Cập nhật State Local) ---
    const decreaseQuantity = (productId) => {
        setCartItems((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId
                    ? { ...item, quantity: Math.max(1, item.quantity - 1) } // Giảm nhưng không dưới 1
                    : item
            )
            // Không xóa item ở đây, chỉ giảm về 1. Việc xóa sẽ do nút "Cập nhật" hoặc backend xử lý nếu quantity là 0 khi gửi đi
        );
    };

    const increaseQuantity = (productId) => {
        setCartItems((prevCart) =>
            prevCart.map((item) =>
                item.productId === productId
                    // Cần kiểm tra tồn kho ở đây nếu có thông tin tồn kho trong cartItems
                    // Hoặc dựa vào kiểm tra của backend khi nhấn "Cập nhật giỏ hàng" / "Đặt hàng"
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    // Hàm xử lý khi thay đổi trực tiếp ô input số lượng
     const handleQuantityInputChange = (productId, value) => {
         let newQuantity = parseInt(value, 10);
         if (isNaN(newQuantity) || newQuantity < 1) {
             newQuantity = 1; // Đặt lại là 1 nếu nhập không hợp lệ hoặc xóa hết
         }
          // Optional: Client-side stock check if available
         // const item = cartItems.find(i => i.productId === productId);
         // if (item && item.stock_quantity && newQuantity > item.stock_quantity) {
         //     newQuantity = item.stock_quantity;
         //     toast.warn(`Chỉ còn ${item.stock_quantity} sản phẩm tồn kho.`);
         // }
         setCartItems((prevCart) =>
             prevCart.map((item) =>
                 item.productId === productId ? { ...item, quantity: newQuantity } : item
             )
         );
     };

    // --- Hàm Gọi API Cập Nhật Giỏ Hàng ---
    const handleUpdateCart = async () => {
         if (isUpdatingCart || !token) return;
         setIsUpdatingCart(true); setError(null);
         try {
             const headers = { Authorization: `Bearer ${token}` };
             // Tạo payload chỉ chứa các item có quantity >= 1
             const itemsToUpdate = cartItems
                 .filter(item => item.quantity >= 1)
                 .map(item => ({ productId: item.productId, quantity: item.quantity }));

             console.log("Updating cart with data:", { items: itemsToUpdate });

             const response = await axios.put(`${API_BASE_URL}/cart`, { items: itemsToUpdate }, { headers });

             if (response.status === 200 && response.data) {
                 // Cập nhật lại state với giỏ hàng trả về từ server để đảm bảo đồng bộ
                  const updatedItemsWithNumbers = response.data.items.map(item => ({
                      ...item,
                      quantity: parseInt(item.quantity, 10) || 1,
                      price: parseFloat(item.price) || 0
                  }));
                 setCartItems(updatedItemsWithNumbers);
                 toast.success("Giỏ hàng đã được cập nhật!");
             } else {
                  throw new Error("Lỗi cập nhật giỏ hàng");
             }
         } catch (err) {
              console.error("Error updating cart:", err.response || err);
              setError(err.response?.data?.error || "Không thể cập nhật giỏ hàng.");
              toast.error(err.response?.data?.error || "Lỗi khi cập nhật giỏ hàng!");
              // Có thể fetch lại giỏ hàng để quay về trạng thái trước đó nếu muốn
              // fetchCart();
         } finally {
              setIsUpdatingCart(false);
         }
    };

    // --- Hàm Gọi API Đặt Hàng ---
    const handlePlaceOrder = async (event) => {
         event.preventDefault(); // Ngăn form submit mặc định
         if (isPlacingOrder || !token) return;

         // Validate thông tin trước khi đặt hàng
         if (cartItems.length === 0) {
             toast.error("Giỏ hàng đang trống, không thể đặt hàng."); return;
         }
         if (!paymentMethod) {
              toast.error("Vui lòng chọn phương thức thanh toán."); return;
         }
         if (!selectedProvince.code || !selectedDistrict.code || !selectedWard.code || !specificAddress.trim()) {
             toast.error("Vui lòng nhập đầy đủ địa chỉ nhận hàng."); return;
         }

         setIsPlacingOrder(true); setError(null);

         // Tạo địa chỉ đầy đủ
         const fullAddress = `${specificAddress.trim()}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;

         try {
              // **Tùy chọn:** Gọi handleUpdateCart() một lần nữa trước khi đặt hàng
              // để đảm bảo số lượng trên server là mới nhất (nếu người dùng sửa mà chưa nhấn Cập nhật)
              // await handleUpdateCart();
              // Nếu bước trên có lỗi thì không thực hiện tiếp

             console.log("Placing order with data:", { address: fullAddress, method: paymentMethod });
             const headers = { Authorization: `Bearer ${token}` };
             const body = {
                 address: fullAddress,
                 method: paymentMethod
             };

             const response = await axios.post(`${API_BASE_URL}/orders`, body, { headers });

             console.log("Place order response:", response.data);

             if (response.status === 201 && response.data.orderId) {
                  toast.success(`Đặt hàng thành công! Mã đơn hàng của bạn là #${response.data.orderId}`);
                  setCartItems([]); // Xóa giỏ hàng ở state local
                //   setSubtotal(0);
                  // Điều hướng đến trang cảm ơn hoặc lịch sử đơn hàng
                  navigate('/order-success', { state: { orderId: response.data.orderId } }); // Ví dụ điều hướng
                  // Hoặc navigate('/user-info'); // Về trang user info để xem lịch sử
             } else {
                   throw new Error(response.data?.message || response.data?.error || "Đặt hàng thất bại.");
             }

         } catch (err) {
              console.error("Error placing order:", err.response || err);
              // Xử lý lỗi hết hàng từ backend trả về (nếu có)
              if (err.response?.status === 409) { // Giả sử backend trả 409 khi hết hàng
                  const errorData = err.response.data;
                  toast.error(`Lỗi đặt hàng: ${errorData.error} (Sản phẩm ID: ${errorData.productId})`);
                  // Có thể cần fetch lại giỏ hàng để cập nhật số lượng tồn kho đúng
                  fetchCart();
              } else {
                   const errorMessage = err.response?.data?.error || "Đã xảy ra lỗi khi đặt hàng.";
                   setError(errorMessage);
                   toast.error(errorMessage);
              }
         } finally {
              setIsPlacingOrder(false);
         }
    };

    // Tính tổng tiền dựa trên state local cartItems
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // --- JSX ---
    return (
        <div className="p-4 md:p-10 flex flex-col lg:flex-row justify-around gap-8"> {/* Responsive layout và gap */}

            {/* Cột Giỏ Hàng */}
            <div className='w-full lg:w-[60%]'>
                 <h2 class="font-bold text-xl mb-4 text-center lg:text-left">GIỎ HÀNG CỦA BẠN</h2>
                 {isLoadingCart && <p>Đang tải giỏ hàng...</p>}
                 {error && <p className="text-red-500">{error}</p>}
                 {!isLoadingCart && cartItems.length === 0 && <p>Chưa có sản phẩm nào trong giỏ hàng.</p>}
                 {!isLoadingCart && cartItems.length > 0 && (
                    <div className="overflow-x-auto"> {/* Thêm scroll ngang nếu bảng quá rộng */}
                         <table className='w-full border-collapse'>
                             <thead>
                                 <tr className='border-b-2 border-gray-300 bg-gray-50'>
                                     <th className='p-3 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider w-[45%]'>Sản phẩm</th>
                                     <th className='p-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider w-[18%]'>Đơn giá</th>
                                     <th className='p-3 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider w-[17%]'>Số lượng</th>
                                     <th className='p-3 text-right text-sm font-semibold text-gray-600 uppercase tracking-wider w-[20%]'>Tổng cộng</th>
                                 </tr>
                             </thead>
                             <tbody>
                                 {cartItems.map((item) => (
                                     <tr key={item.productId} className="text-center border-b border-gray-200"> {/* Dùng productId làm key */}
                                         <td className="p-3 text-left">
                                             <div className="flex flex-row items-center">
                                                 <img
                                                     src={item.image ? `${IMAGE_BASE_URL}/uploads/products/${item.image}` : defaultProductImage}
                                                     alt={item.name}
                                                     className='w-16 h-16 object-cover mr-3 rounded flex-shrink-0' // Giảm kích thước ảnh, thêm flex-shrink
                                                     onError={(e) => { e.target.onerror = null; e.target.src=defaultProductImage }}
                                                 />
                                                 <div className="flex flex-col items-start text-sm font-medium">
                                                     <h3 className="text-gray-800 mb-1">{item.name}</h3>
                                                     {/* Bỏ màu và size nếu không có trong data giỏ hàng */}
                                                     {/* <p className="text-gray-500 text-xs">Màu: {item.color}</p> */}
                                                     {/* <p className="text-gray-500 text-xs">Size: {item.size}</p> */}
                                                 </div>
                                             </div>
                                         </td>
                                         <td className="p-3 text-right text-sm text-gray-700">{item.price.toLocaleString()} VND</td>
                                         <td className="p-3">
                                             <div className="flex items-center justify-center space-x-1">
                                                  <button
                                                     className="p-1 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                     onClick={() => decreaseQuantity(item.productId)}
                                                     disabled={item.quantity <= 1 || isUpdatingCart} // Disable khi đang update hoặc số lượng là 1
                                                  >
                                                     <Minus size={16} />
                                                  </button>
                                                  {/* Thay thế <p> bằng <input> */}
                                                  <input
                                                       type="number"
                                                       min="1"
                                                       value={item.quantity}
                                                       onChange={(e) => handleQuantityInputChange(item.productId, e.target.value)}
                                                       className="px-2 py-1 w-12 border text-center rounded bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                       disabled={isUpdatingCart}
                                                    />
                                                  <button
                                                       className="p-1 border rounded text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                       onClick={() => increaseQuantity(item.productId)}
                                                       disabled={isUpdatingCart} // Disable khi đang update
                                                       // Thêm disable dựa trên stock nếu có: disabled={isUpdatingCart || (item.stock_quantity && item.quantity >= item.stock_quantity)}
                                                    >
                                                       <Plus size={16} />
                                                  </button>
                                             </div>
                                         </td>
                                         <td className="p-3 text-right text-sm font-semibold text-gray-800">{(item.price * item.quantity).toLocaleString()} VND</td>
                                     </tr>
                                 ))}
                             </tbody>
                             <tfoot>
                                 {/* Loại bỏ phần Discount Code */}
                                 <tr className='border-t-2 border-gray-300'>
                                     <td colSpan="4" className="text-right py-4 pr-4">
                                         <button
                                             onClick={handleUpdateCart}
                                             disabled={isUpdatingCart || isLoadingCart}
                                             className="px-6 py-2 bg-indigo-600 font-semibold text-sm text-white rounded-md hover:bg-indigo-700 duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                         >
                                             {isUpdatingCart ? 'Đang cập nhật...' : 'CẬP NHẬT GIỎ HÀNG'}
                                         </button>
                                     </td>
                                 </tr>
                             </tfoot>
                         </table>
                     </div>
                  )}
            </div>

            {/* Cột Hóa Đơn/Thanh Toán */}
            <form onSubmit={handlePlaceOrder} className="w-full lg:w-[350px] p-6 border border-gray-200 rounded-lg shadow-lg bg-white self-start"> {/* Thêm self-start */}
                <h2 className="font-bold text-xl mb-5 text-center">HÓA ĐƠN CỦA BẠN</h2>

                <div className="mb-5 pb-4 border-b border-gray-200">
                    <div className="flex justify-between mb-1">
                         <span className="text-gray-600">Tạm tính:</span>
                         <span className="text-gray-800">{calculateTotal().toLocaleString()} VND</span>
                    </div>
                     {/* Thêm các dòng phí khác nếu có (vd: vận chuyển) */}
                     <div className="flex justify-between font-semibold text-lg mt-2">
                         <span>Tổng cộng:</span>
                         <span className="text-indigo-600">{calculateTotal().toLocaleString()} VND</span>
                     </div>
                </div>

                <div className="mb-5">
                    <span className="font-semibold block mb-2 text-gray-700">Phương thức thanh toán</span>
                    <div className="space-y-2">
                        <label className="flex items-center space-x-3 p-3 border rounded-md hover:border-indigo-500 cursor-pointer">
                            <input type="radio" name="paymentMethod" value="Cash" checked={paymentMethod === 'Cash'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-indigo-600"/>
                            <span className='text-sm'>Tiền mặt khi nhận hàng (COD)</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-md hover:border-indigo-500 cursor-pointer">
                            <input type="radio" name="paymentMethod" value="Card" checked={paymentMethod === 'Card'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-indigo-600"/>
                             <span className='text-sm'>Thẻ Tín dụng/Ghi nợ</span> {/* Sửa lại */}
                        </label>
                         <label className="flex items-center space-x-3 p-3 border rounded-md hover:border-indigo-500 cursor-pointer">
                            <input type="radio" name="paymentMethod" value="BankTransfer" checked={paymentMethod === 'BankTransfer'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-indigo-600"/>
                             <span className='text-sm'>Chuyển khoản ngân hàng</span> {/* Thêm tùy chọn */}
                         </label>
                    </div>
                </div>

                <div className="mb-6">
                    <span className="font-semibold block mb-2 text-gray-700">Địa chỉ nhận hàng</span>
                    <select className="w-full border border-gray-300 p-3 mt-1 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" onChange={handleProvinceChange} value={selectedProvince.code} required>
                        <option value="">Chọn Tỉnh / Thành phố</option>
                        {provinces.map((p) => (<option value={p.code} key={p.code}>{p.name}</option>))}
                    </select>
                    <select className="w-full border border-gray-300 p-3 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" onChange={handleDistrictChange} value={selectedDistrict.code} disabled={!selectedProvince.code} required>
                        <option value="">Chọn Quận / Huyện</option>
                        {districts.map((d) => (<option value={d.code} key={d.code}>{d.name}</option>))}
                    </select>
                    <select className="w-full border border-gray-300 p-3 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" onChange={handleWardChange} value={selectedWard.code} disabled={!selectedDistrict.code} required>
                        <option value="">Chọn Phường / Xã</option>
                        {wards.map((w) => (<option value={w.code} key={w.code}>{w.name}</option>))}
                    </select>
                    <input type="text" value={specificAddress} onChange={(e) => setSpecificAddress(e.target.value)} className="w-full border border-gray-300 p-3 mt-2 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Số nhà, tên đường, tòa nhà..." required/>
                </div>

                <button
                     type="submit" // Để kích hoạt onSubmit của form
                     disabled={isPlacingOrder || isLoadingCart || cartItems.length === 0} // Disable nếu đang xử lý hoặc giỏ hàng trống
                     className="w-full bg-red-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                 >
                     {isPlacingOrder ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}
                 </button>
            </form>
        </div>
    );
}

export default Purchase;