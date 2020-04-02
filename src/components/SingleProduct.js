import React, { Component } from 'react';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import util from '../util';
import {
    Magnifier,
    GlassMagnifier,
    SideBySideMagnifier,
    PictureInPictureMagnifier,
    MOUSE_ACTIVATION,
    TOUCH_ACTIVATION
} from "react-image-magnifiers";
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        val === "form-control" && (valid = false)
    })

    return valid;
}

export default class SingleProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 0,
            formErrors: {
                quantity: '',
            },
            qtyErr: '',
            productData: [],
            cartItems: [],
            buyNowItem: []
        }
        this.onChange = this.onChange.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
    }
    componentDidMount() {
        const productSlug = this.props.match.params.slug;
        const token = localStorage.getItem('user_access_token');
        fetch('http://localhost:5000/user/product-data/' + productSlug, {
            method: "GET",
            contentType: "application/json; charset=utf-8",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.success == 'true') {
                    this.setState({
                        productData: responseJson.productData[0]
                    })
                } else {
                    this.setState({
                        errorMsg: responseJson.message
                    })
                }
            });

        if (localStorage.getItem('cartItems')) {
            this.setState({
                cartItems: JSON.parse(localStorage.getItem('cartItems'))
            })
        }
    }

    createNotification = (type) => {
        return () => {
            switch (type) {
                case 'info':
                    NotificationManager.info('Info message');
                    break;
                case 'success':
                    NotificationManager.success('Product added to your cart.', 'Success');
                    break;
                case 'warning':
                    NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
                    break;
                case 'error':
                    NotificationManager.error('Error message', 'Click me!', 5000, () => {
                        alert('callback');
                    });
                    break;
            }
        };
    };

    onChange = e => {
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;

        switch (name) {
            case 'quantity':
                formErrors.quantity = value <= 0 || value == "" || value > 30 ? 'Quantity should be minimum 1 and maximum 30.' : "";
                break;
            default:
                break;
        }

        this.setState({ formErrors, [name]: value })
    }

    handleAddToCart = (e) => {
        e.preventDefault();
        const { quantity } = this.state;
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;

        if (quantity == "") {
            formErrors.quantity = "This is required.";
            this.setState({
                qtyErr: ""
            });
        }
        this.setState({ formErrors, [name]: value });
        if (formValid(this.state)) {
            const { productData } = this.state;
            this.setState(state => {
                const cartItems = state.cartItems;
                let itemAlreadyInCart = false;
                cartItems.forEach(item => {
                    if (item._id === productData._id) {
                        itemAlreadyInCart = true;
                        item.count = parseInt(item.count) + parseInt(quantity);
                    }
                });
                if (!itemAlreadyInCart) {
                    cartItems.push({ ...productData, count: quantity })
                }
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                return cartItems;
            })
            document.getElementById("create-course-form").reset();
            this.createNotification('success');
        }
    }

    handleBuyNow = (e) => {
        const { quantity, productData } = this.state;
        let formErrors = this.state.formErrors;
        if (quantity == "") {
            this.setState({
                qtyErr: "This is required."
            });
        } else {
            this.props.history.push('/checkout/'+productData.slug+'/'+quantity);
        }
    }

    render() {
        const { formErrors } = this.state;
        const { productData } = this.state;
        return (
            <div className="">
                <div className="header">
                    <Header handleLogout={this.handleLogout} />
                </div>
                <div className="container single-product-section">
                    <div className="row">
                        <div className="col-md-4">
                            <img src={productData.image} alt={productData.name} className="single-product-image" />
                        </div>
                        <div className="col-md-5">
                            <h2>{productData.name}</h2>
                            <p className="single-price-label">Price: <span className="single-product-price text-danger">{util.formatCurrency(productData.price)}</span></p>
                            <hr />
                            <p>{productData.description}</p>
                        </div>
                        <div className="col-md-3 single-product-buy-section">
                            <div className="buy-sec-input-div">
                                <form onSubmit={this.handleAddToCart} id="create-course-form">
                                    <input
                                        type="number"
                                        className="form-control single-quantity-input"
                                        placeholder="Quantity"
                                        name="quantity"
                                        noValidate
                                        min="1"
                                        max="30"
                                        title="Qty"
                                        ref="quantity"
                                        onChange={this.onChange}
                                    />
                                    {formErrors.quantity.length > 0 && (
                                        <span className="text-danger">{formErrors.quantity}</span>
                                    )}
                                    {
                                        this.state.qtyErr.length > 0 && (
                                            <span className="text-danger">{this.state.qtyErr}</span>
                                        )
                                    }
                                    <input type="submit" value="Add To Cart" className="btn btn-primary btn-block single-cart-btn" />
                                </form>
                                <button className="btn btn-warning btn-block" onClick={this.handleBuyNow}>Buy Now</button>
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
