import Cookies from "js-cookie";

export const saveCartToCookie = (cartItems) => {
    Cookies.set("cart", JSON.stringify(cartItems), { expires: 1 });
};

// Lấy giỏ hàng từ Cookie
export const getCartFromCookie = () => {
    const cart = Cookies.get("cart");
    return cart ? JSON.parse(cart) : [];
};

// Xóa giỏ hàng
export const clearCartCookie = () => {
    Cookies.remove("cart");
};

export const removeItemFromCart = (id, size) => {
    let cartItems = getCartFromCookie();
    cartItems = cartItems.filter(item => !(item.id === id && item.size === size))
    saveCartToCookie(cartItems);
    return cartItems;
}
