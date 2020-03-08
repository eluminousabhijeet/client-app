import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Header from '../layouts/Header';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';

export default class Admin extends Component {
    constructor(props) {
        super(props);
    }
    logoutFunction = () => {
        localStorage.setItem('admin_access_token', "");
        this.props.history.push('/admin');
    }
    render() {
        let userToken = localStorage.getItem('admin_access_token');
        if (userToken == "") {
            return <Redirect to="/admin" />
        }
        return (
            <div className="main-container">
                <div className="">
                    <Navbar />
                </div>
                <div className="">
                    <p>Welcome to dashboard</p>
                    <button className="btn btn-primary" onClick={this.logoutFunction}>Logout</button>
                </div>
                <div className="">
                <Footer />
                </div>
            </div>
        )
    }
}
