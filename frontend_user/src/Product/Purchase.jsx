import { useState, useEffect } from 'react';
import prod from '../Images/product.png'
import { Plus, Minus } from "lucide-react";


const Purchase = () => {

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/").then((res) => res.json()).then((data) => setProvinces(data.sort((a, b) => a.name.localeCompare(b.name))));
    }, []);

    const handleProvinceChange = (e) => {
        const provinceCode = e.target.value;
        setSelectedProvince(provinceCode);
        setSelectedDistrict("");
        setSelectedWard("");

        fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`).then((res) => res.json()).then((data) => setDistricts(data.districts.sort((a, b) => a.name.localeCompare(b.name))));
    };

    const handleDistrictChange = (e) => {
        const districtCode = e.target.value;
        setSelectedDistrict(districtCode);
        setSelectedWard("");

        fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`).then((res) => res.json()).then((data) => setWards(data.wards.sort((a, b) => a.name.localeCompare(b.name))));
    }

    const [itemCart, setItemCart] = useState([
        { id: 1, name: "Áo sơ mi 1", price: 200000, category: "Áo sơ mi", color: "Trắng", size: '2XL', quantity: 2 },
        { id: 2, name: "Áo sơ mi 2", price: 300000, category: "Áo sơ mi", color: "Xanh", size: 'M', quantity: 1 },
        { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
        { id: 4, name: "Áo sơ mi 4", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
        // { id: 5, name: "Áo sơ mi 5", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
        // { id: 6, name: "Áo sơ mi 6", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
        // { id: 7, name: "Áo sơ mi 7", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 },
        // { id: 8, name: "Áo sơ mi 8", price: 250000, category: "Áo sơ mi", color: "Đen", size: 'XL', quantity: 1 }
    ])
    const decreaseQuantity = (itemId) => {
        setItemCart((prevCart) =>
            prevCart.map((item) => item.id === itemId && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0)
        )
    }
    const increaseQuantity = (itemId) => {
        setItemCart((prevCart) =>
            prevCart.map((item) => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)
        )
    }

    const applyDiscount = () => {

    }

    const updateCart = () => {

    }

    const totalAfterDiscount = () => {

    }
    return (
        <div className="p-10 flex flex-row max-lg:flex-col max-lg:items-center justify-around">
            <table className='w-[60%] max-lg:w-[90%]'>
                <thead>
                    <tr className='border-2'>
                        <th className='py-4 w-[30%]'>Sản phẩm</th>
                        <th className=''>Đơn giá</th>
                        <th className=''>Số lượng</th>
                        <th className=''>Tổng cộng</th>
                    </tr>
                </thead>

                <tbody>
                    {itemCart.map((item) => (
                        <tr key={item.id} className="text-center border-2">
                            <td className="flex flex-row justify-center font-semibold my-2">
                                <img src={prod} alt="" className='w-[4rem] aspect-auto mr-2' />
                                <div className="flex flex-col justify-evenly items-start text-xs font-medium ">
                                    <h3 className="text-[#555555]">{item.name}</h3>
                                    <p className="text-[#555555]">Màu: {item.color}</p>
                                    <p className="text-[#555555]">Size: {item.size}</p>
                                </div>
                            </td>
                            <td className="">{item.price.toLocaleString()} VND</td>
                            <td className="">
                                <button className="p-1 border" onClick={() => decreaseQuantity(item.id)}>
                                    <Minus />
                                </button>
                                <p className="px-3 py-1 mx-1 border inline-block -translate-y-[6px] bg-gray-200">{item.quantity}</p>
                                <button className="p-1 border" onClick={() => increaseQuantity(item.id)}>
                                    <Plus />
                                </button>
                            </td>
                            <td className="">{(item.price * item.quantity).toLocaleString()} VND</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className='border-2'>
                        <td colSpan="4" className="text-center py-4">
                            <div className="flex justify-center items-center space-x-4">
                                <input type="text" className="bg-white p-2 border border-black rounded-full px-2" placeholder="Nhập mã giảm giá" />
                                <button className="w-[12rem] p-3 bg-[#6878dd] font-semibold text-md text-white rounded-full hover:bg-[#6373e0] duration-300">CẬP NHẬT GIỎ HÀNG</button>
                            </div>
                        </td>
                    </tr>
                </tfoot>


            </table>
            <form class="w-[350px] max-lg:w-[90%] max-lg:mt-4 p-6 border rounded-lg shadow-lg">
                <h2 class="font-bold text-lg mb-4">HÓA ĐƠN CỦA BẠN</h2>

                <div class="mb-4">
                    <span class="font-semibold">Tổng tiền</span>
                    <span class="ml-2">{itemCart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString()} VND</span>
                </div>

                <div class="mb-4">
                    <span class="font-semibold">Phương thức thanh toán</span>
                    <div class="mt-2">
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="payment" value="cash" class="accent-black"/> <span>Tiền mặt</span>
                        </label>
                        <label class="flex items-center space-x-2">
                            <input type="radio" name="payment" value="transfer" class="accent-black"/> <span>Chuyển khoản</span>
                        </label>
                    </div>
                </div>

                <div class="mb-4">
                    <span class="font-semibold">Địa chỉ nhận hàng</span>
                    <select class="w-full border p-2 mt-2 rounded" onChange={handleProvinceChange}>
                        <option value="">Tỉnh / Thành phố</option>
                        {provinces.map((p) => (
                            <option value={p.code} key={p.code}>{p.name}</option>
                        ))}
                    </select>
                    <select class="w-full border p-2 mt-2 rounded" onChange={handleDistrictChange} disabled={!selectedProvince}>
                        <option value="">Quận / Huyện</option>
                        {districts.map((d) => (
                            <option value={d.code} key={d.code}>{d.name}</option>
                        ))}
                    </select>
                    <select class="w-full border p-2 mt-2 rounded" disabled={!selectedDistrict}>
                        <option value="">Phường / Xã</option>
                        {wards.map((w) => (
                            <option value={w.code} key={w.code}>{w.name}</option>
                        ))}
                    </select>
                    <input type="text" class="w-full border p-2 mt-2 rounded" placeholder="Địa chỉ cụ thể" required/>
                </div>

                <button type="submit" class="w-full bg-black text-white py-2 rounded-md font-semibold">ĐẶT HÀNG</button>
            </form>
        </div>
    );
}

export default Purchase