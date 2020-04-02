import { ADD_TO_CART, REMOVE_FROM_CART, INCREASE_PRODUCT_COUNT, DECREASE_PRODUCT_COUNT } from "./types";

export const addToCart = (items, product) => (dispatch) => {
    const cartItems = items.slice();
    let itemAlreadyInCart = false;
    cartItems.forEach(item => {
        if (item._id === product._id) {
            itemAlreadyInCart = true;
            item.count++;
        }
    });
    if (!itemAlreadyInCart) {
        cartItems.push({ ...product, count: 1 })
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    return dispatch({
        type: ADD_TO_CART,
        payload: {
            cartItems: cartItems
        }
    });
}

export const removeFromCart = (items, product) => (dispatch) => {
    if (window.confirm('Are you sure to remove this item from cart?')) {
        const cartItems = items.slice().filter(elm => elm._id !== product._id);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        return dispatch({
            type: REMOVE_FROM_CART,
            payload: {
                cartItems: cartItems
            }
        });
    }
}

export const increaseCount = (items, product) => (dispatch) => {
    const cartItems = items.slice();
    cartItems.forEach(item => {
        if (item._id === product._id) {
            if (item.count < 30) {
                item.count++;
            }
        }
    });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    return dispatch({
        type: INCREASE_PRODUCT_COUNT,
        payload: {
            cartItems: cartItems
        }
    });
}

export const decreaseCount = (items, product) => (dispatch) => {
    const cartItems = items.slice();
    cartItems.forEach(item => {
        if (item._id === product._id) {
            if (item.count > 1) {
                item.count--;
            }
        }
    });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    return dispatch({
        type: DECREASE_PRODUCT_COUNT,
        payload: {
            cartItems: cartItems
        }
    });
}