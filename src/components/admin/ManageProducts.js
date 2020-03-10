import React, { Component } from 'react';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { Link, Redirect, useHistory } from 'react-router-dom';

export default class ManageProducts extends Component {
    render() {
        localStorage.setItem('current_location', this.props.location.pathname);
        let userToken = localStorage.getItem('admin_access_token');
        if (userToken == "") {
            return <Redirect to="/admin" />
        }
        return (
            <div className="main-container">
                <div className="">
                    <Navbar />
                </div>
                <div className="container-fluid">
                    <div>
                        <Link className="btn btn-primary" to="/add-product">Add Product</Link>
                    </div>
                </div>
                <div className="">
                    <Footer />
                </div>
            </div>
        )
    }
}
