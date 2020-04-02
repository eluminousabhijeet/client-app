import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import '../styles.scss';
import Products from './Products';
import Filter from './Filter';
import CartBox from './CartBox';

import history from '../history';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
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
            <div className="">
                <div className="header">
                    <Header handleLogout={this.handleLogout} />
                </div>
                <div className="container-fluid">
                    <h1>Ecommerce Shopping App</h1>
                    <hr />
                    <div className="row">
                        <div className="col-md-8">
                            <Filter />
                            <hr />
                            <Products />
                        </div>
                        <div className="col-md-4 cart-view">
                            <CartBox handleCheckoutButton={() => this.props.history.push('/checkout')} />
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
