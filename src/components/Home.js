import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import '../styles.scss';
import Products from './Products';
import Filter from './Filter';
import CartBox from './CartBox';

// import { Provider } from 'react-redux';
// import store from '../store';

import history from '../history';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            filteredProducts: [],
            cartItems: []
        }
        this.handleChangeSort = this.handleChangeSort.bind(this);
        this.handleAddToCart = this.handleAddToCart.bind(this);
        this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleCheckoutButton = this.handleCheckoutButton.bind(this);
    }
    UNSAFE_componentWillMount() {
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
                console.log(responseJson);
                if (responseJson.success == 'true') {
                    this.setState({
                        products: responseJson.products,
                        filteredProducts: responseJson.products
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

    handleChangeSort(e) {
        this.setState({ sort: e.target.value });
        this.listProducts();
    }

    listProducts() {
        this.setState(state => {
            if (state.sort !== '') {
                state.products.sort((a, b) => (state.sort === 'lowest') ? (a.price < b.price ? 1 : -1) : (a.price > b.price ? 1 : -1))
            } else {
                state.products.sort((a, b) => {
                    const diff = a.text.toLowerCase().localeCompare(b.text.toLowerCase());
                    return diff;
                });
            }
            return { filteredProducts: state.products };
        })
    }

    handleAddToCart(e, product) {
        this.setState(state => {
            const cartItems = state.cartItems;
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
            return cartItems;
        })
    }

    handleRemoveFromCart(e, item) {
        if (window.confirm('Are you sure to remove this item from cart?')) {
            this.setState(state => {
                const cartItems = state.cartItems.filter(elm => elm._id !== item._id);
                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                return { cartItems };
            });
        }
    }

    handleCheckoutButton() {
        this.props.history.push('/checkout');
    }

    handleLogout() {
        localStorage.setItem('user_access_token', "");
        this.props.history.push('/');
    }
    render() {
        let userToken = localStorage.getItem('user_access_token');
        if (userToken == "") {
            return <Redirect to="/" />
        }
        return (
            // <Provider store={store}>
            <div className="">
                <div className="header">
                    <Header handleLogout={this.handleLogout} />
                </div>
                <div className="container-fluid">
                    <h1>Ecommerce Shopping App</h1>
                    <hr />
                    <div className="row">
                        <div className="col-md-8">
                            <Filter count={this.state.filteredProducts.length} sort={this.state.sort} handleChangeSort={this.handleChangeSort} />
                            <hr />
                            <Products products={this.state.filteredProducts} handleAddToCart={this.handleAddToCart} />
                        </div>
                        <div className="col-md-4 cart-view">
                            <CartBox cartItems={this.state.cartItems} handleRemoveFromCart={this.handleRemoveFromCart} handleCheckoutButton={this.handleCheckoutButton} />
                        </div>
                    </div>
                </div>
                <div className="">
                    <Footer />
                </div>
            </div>
            // </Provider>
        )
    }
}
