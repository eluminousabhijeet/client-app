import React, { Component } from 'react';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import util from '../util';

export default class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartItems: []
        }
    }

    componentDidMount() {
        if (localStorage.getItem('cartItems')) {
            this.setState({
                cartItems: JSON.parse(localStorage.getItem('cartItems'))
            })
        }
    }

    handleIncreaseQuantity = (e, item) => {
        this.setState(state => {
            const cartItems = state.cartItems;
            cartItems.forEach(product => {
                if (product._id === item._id) {
                    if(product.count < 30){
                        product.count++;
                    }
                }
            });
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            return cartItems;
        })
    }

    handleDecreaseQuantity = (e, item) => {
        this.setState(state => {
            const cartItems = state.cartItems;
            cartItems.forEach(product => {
                if (product._id === item._id) {
                    if (product.count > 1) {
                        product.count--;
                    }
                }
            });
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            return cartItems;
        })
    }

    handleRemoveFromCart = (e, item) => {
        if (window.confirm('Are you sure to remove this item from cart?')) {
            this.setState(state => {
                const cartItems = state.cartItems.filter(elm => elm._id !== item._id);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                return { cartItems };
            });
        }
    }

    render() {
        const { cartItems } = this.state;
        return (
            <div className="">
                <div className="header">
                    <Header handleLogout={this.handleLogout} />
                </div>

                <div className="container">
                    <div>
                        <h1>Shopping Cart</h1>
                        <hr />
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            {
                                cartItems.map(item =>
                                    <div>
                                        <div className="row">
                                            <div className="col-md-4 cart-image-section">
                                                <img src={item.image} alt={item.name} className="product-image" />
                                            </div>
                                            <div className="col-md-8">
                                                <p className="cart-product-name"><a href={"http://localhost:3000/product/"+item.slug}>{item.name}</a></p>
                                                <h3 className="cart-product-price">{util.formatCurrency(item.price * item.count)}</h3>
                                                <div className="cart-quantity-wrapper">
                                                    <button className="quantity-minus-button" onClick={(e) => this.handleDecreaseQuantity(e, item)}> - </button>
                                                    <input type="text" value={item.count} class="cart-quantity-box" />
                                                    <button className="quantity-plus-button" onClick={(e) => this.handleIncreaseQuantity(e, item)}> + </button>
                                                </div>
                                                <div className="cart-remove-btn-section">
                                                    <a href="#" className="save-for-later-btn">SAVE FOR LATER</a>
                                                    <a className="cart-remove-btn" onClick={(e) => this.handleRemoveFromCart(e, item)}>REMOVE</a>
                                                </div>
                                            </div>
                                        </div> <hr />
                                    </div>
                                )
                            }
                        </div>
                        <div className="col-md-4">
                            <div className="alert alert-info">
                                <span class="cart-price-details">Price details</span>
                                <hr />
                                {
                                    cartItems.length === 0 ? "Your cart is empty." : <div>You have {cartItems.length} products in your cart.</div>
                                } <br />
                                <ul>
                                    {
                                        cartItems.map(item =>
                                            <li key={item._id}>
                                                <b>{item.name} X {item.count}</b>
                                            </li>
                                        )
                                    }
                                </ul>
                                <hr />
                                <table width="100%">
                                    <thead></thead>
                                    <tbody>
                                        <tr>
                                            <td className="cart-total" width="40%">Total Amount </td>
                                            <td className="cart-total" width="60%">{util.formatCurrency(cartItems.reduce((a, c) => a + c.price * c.count, 0))}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <Footer />
                </div>
            </div>
        )
    }
}
