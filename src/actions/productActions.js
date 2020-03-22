import { FETCH_PRODUCTS } from "./types";

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