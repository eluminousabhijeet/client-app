import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import util from '../util';

export default class MyOrders extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
        }
    }
    UNSAFE_componentWillMount() {
        const token = localStorage.getItem('user_access_token');
        const userId = localStorage.getItem('current_user_id');
        fetch('http://localhost:5000/user/order-listing/' + userId, {
            method: "GET",
            contentType: "application/json; charset=utf-8",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson.orders);
                if (responseJson.success == 'true') {
                    this.setState({
                        orders: responseJson.orders
                    })
                } else {
                    this.setState({
                        errorMsg: responseJson.message
                    })
                }
            });
    }
    render() {
        return (
            <div>
                <div className="">
                    <div className="header">
                        <Header handleLogout={this.handleLogout} />
                    </div>
                    <div className="container">
                        <h1>My Orders</h1>
                        <hr />
                        <div className="order-count-msg">
                            {
                                this.state.orders.length === 0 ?
                                    <div>
                                        <div className="alert alert-info">
                                            "Your have 0 orders."
                                    </div>
                                        <button className="btn btn-primary continue-shopping-btn" onClick={() => this.props.history.push('/home')}>Shop Now</button>
                                    </div> :
                                    <div>
                                        You have {this.state.orders.length} products in your order list.
                                </div>
                            }
                        </div>
                        <hr />
                        {
                            this.state.orders.map(order => {
                                return <div className="row" key={order._id}>
                                    <div className="col-md-2">
                                        <img src={order.productId["image"]} alt={order.productId["name"]} className="product-image" />
                                    </div>
                                    <div>
                                        <h4>{order.productId["name"]}</h4>
                                        <p><b>Quantity:</b> {order.quantity}</p>
                                        <h5><b>Total Price: </b>{util.formatCurrency(order.totalCost)}</h5>
                                        <p>{order.createdOn}</p>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className="">
                        <Footer />
                    </div>
                </div>
            </div>
        )
    }
}
