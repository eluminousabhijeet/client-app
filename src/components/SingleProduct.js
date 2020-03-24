import React, { Component } from 'react';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import util from '../util';

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
            quantity: '',
            formErrors: {
                quantity: '',
            },
            productData: [],
            cartItems: []
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

    onChange = e => {
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;

        switch (name) {
            case 'quantity':
                formErrors.quantity = value <= 0 || value == "" ? 'Quantity should not be less than 1.' : "";
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
                        item.count = item.count + quantity;
                    }
                });
                if (!itemAlreadyInCart) {
                    cartItems.push({ ...productData, count: quantity })
                }
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
                return cartItems;
            })
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
                            <img src={productData.image} alt={productData.name} className="product-image" />
                        </div>
                        <div className="col-md-5">
                            <h2>{productData.name}</h2>
                            <p className="single-price-label">Price: <span className="single-product-price text-danger">{util.formatCurrency(productData.price)}</span></p>
                            <hr />
                            <p>{productData.description}</p>
                        </div>
                        <div className="col-md-3 single-product-buy-section">
                            <div class="buy-sec-input-div">
                                <form onSubmit={this.handleAddToCart}>
                                    <input
                                        type="number"
                                        className="form-control single-quantity-input"
                                        placeholder="Quantity"
                                        name="quantity"
                                        noValidate
                                        min="1"
                                        title="Qty"
                                        onChange={this.onChange}
                                    />
                                    {formErrors.quantity.length > 0 && (
                                        <span className="text-danger">{formErrors.quantity}</span>
                                    )}
                                    <input type="submit" value="Add To Cart" class="btn btn-primary btn-block single-cart-btn" />
                                    <button class="btn btn-warning btn-block">Buy Now</button>
                                </form>
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
