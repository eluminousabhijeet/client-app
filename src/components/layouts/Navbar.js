import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

export default class Navbar extends Component {
    // logoutFunction = () => {
    //     localStorage.setItem('admin_access_token', "");
    //     return <Redirect to="/admin" />
    // }
    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/dashboard">Dashboard</a>
                        </div>
                        <ul className="nav navbar-nav">
                            <li><a href="/manage-users">Manage Users</a></li>
                            <li><a href="#">Manage Products</a></li>
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
