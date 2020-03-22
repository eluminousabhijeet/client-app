import React, { Component } from 'react';
import util from '../util';

export default class CartBox extends Component {
    render() {
        const { cartItems } = this.props;
        const { history } = this.props;
        return (
            <div className="alert alert-info">
                {
                    cartItems.length === 0 ? "Your cart is empty." : <div>You have {cartItems.length} products in your cart.</div>
                }
                {
                    cartItems.length > 0 &&
                    <div><br />
                        <table>
                            <thead>
                            </thead>
                            <tbody>
                                {
                                    cartItems.map(item =>
                                        <tr key={item._id}>
                                            <td width="90%"><b>{item.name} X {item.count}</b></td>
                                            <td width="10%"><button
                                                className="btn btn-danger"
                                                onClick={(e) => this.props.handleRemoveFromCart(e, item)}>
                                                X
                                            </button>
                                            </td>
                                            <td><hr /></td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <hr />
                        <table>
                            <tr>
                                <td className="cart-total" width="50%">Total: {util.formatCurrency(cartItems.reduce((a, c) => a + c.price * c.count, 0))}</td>
                                <td><button className="btn btn-primary" onClick={this.props.handleCheckoutButton}>Proceed To Checkout</button></td>
                            </tr>
                        </table>
                    </div>
                }
            </div>
        )
    }
}
