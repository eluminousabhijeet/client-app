import { FETCH_PRODUCTS, ORDER_PRODUCT_BY_PRICE } from "./types";

export const fetchProducts = () => (dispatch) => {
    const token = localStorage.getItem('user_access_token');
    fetch('http://localhost:5000/user/product-listing', {
        method: "GET",
        contentType: "application/json; charset=utf-8",
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token
        },
    }).then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.success == 'true') {
                return dispatch({ type: FETCH_PRODUCTS, payload: responseJson.products });
            }
        });
}

export const sortProducts = (items, sort) => (dispatch) => {
    const products = items.slice();
    if (sort !== '') {
        products.sort((a, b) => (sort === 'lowest') ? (a.price > b.price ? 1 : -1) : (a.price < b.price ? 1 : -1))
    } else {
        products.sort((a, b) => {
            return products;
        });
    }
    return dispatch({
        type: ORDER_PRODUCT_BY_PRICE,
        payload: {
            sort: sort,
            items: products
        }
    });
}