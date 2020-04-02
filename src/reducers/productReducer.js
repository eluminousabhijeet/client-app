import { FETCH_PRODUCTS, ORDER_PRODUCT_BY_PRICE } from "../actions/types";

const initialState = { items: [], sortedItems: [], sort: '' }
export default function (state = initialState, action) {
    switch (action.type) {
        case FETCH_PRODUCTS:
            return { ...state, items: action.payload, sortedItems: action.payload };

        case ORDER_PRODUCT_BY_PRICE:
            return { 
                ...state, sortedItems: action.payload.items,
                sort: action.payload.sort
            };

        default:
            return state;
    }
}