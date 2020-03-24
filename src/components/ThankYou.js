import React, { Component } from 'react';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import { Link, Redirect } from 'react-router-dom';

export default class ThankYou extends Component {
    render() {
        return (
            <div className="">
                <div className="header">
                    <Header handleLogout={this.handleLogout} />
                </div>
                <div className="container">
                    <h1>Thank You!</h1>
                    <hr />
                    <div className="row">
                        <div className="col-md-12">
                            <h4>Your order has been placed successfully.</h4>
                            <p className="order-link-message">You can check your oders details <a href="http://localhost:3000/my-orders"><b>here...</b></a></p>
                            <button className="btn btn-primary continue-shopping-btn" onClick={() => this.props.history.push('/home')}>Continue Shopping</button>
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
