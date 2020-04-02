import { ADD_TO_CART, REMOVE_FROM_CART, INCREASE_PRODUCT_COUNT, DECREASE_PRODUCT_COUNT } from "../actions/types";

const initialState = { items: [] }
export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_TO_CART:
            return {
                items: action.payload.cartItems
            }
        
            case REMOVE_FROM_CART:
            return {
                items: action.payload.cartItems
            }

            case INCREASE_PRODUCT_COUNT:
            return {
                items: action.payload.cartItems
            }

            case DECREASE_PRODUCT_COUNT:
            return {
                items: action.payload.cartItems
            }

        default:
            return state;
    }
}