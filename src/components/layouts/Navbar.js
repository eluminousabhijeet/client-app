import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { matchPath } from 'react-router';

export default class Navbar extends Component {
    constructor(props){
        super(props);
    }
    logoutFunction = () => {
        localStorage.setItem('admin_access_token', "");
        return <Redirect to="/admin" />
    }
    render() {
        const current_location = localStorage.getItem('current_location');
        const isManageDashboardActive = !!matchPath(
            current_location, 
            '/dashboard'
          ); 
        const isManageUserActive = !!matchPath(
            current_location, 
            '/manage-users'
          );
          const isManageProductsActive = !!matchPath(
            current_location, 
            '/manage-products'
          ); 
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-headerS">
                            <a className="navbar-brand" href="/dashboard">Dashboard</a>
                        </div>
                        <ul className="nav navbar-nav">
                            <li className={(isManageUserActive == true) ? "active" : null}><a href="/manage-users">Manage Users</a></li>
                            <li className={(isManageProductsActive == true) ? "active" : null}><a href="/manage-products">Manage Products</a></li>
                            <li><a href="#">Manage Orders</a></li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li><button onClick={this.logoutFunction}><span className="glyphicon glyphicon-log-in"></span> Logout</button></li>
                        </ul>
                    </div>
                </nav>
            </div>

        )
    }
}
