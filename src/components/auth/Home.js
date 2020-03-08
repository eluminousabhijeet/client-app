import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Footer from '../layouts/Footer';

export default class Home extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const userId = this.props.match.userid
        console.log(userId);
    }
    logoutFunction = () => {
        localStorage.setItem('user_access_token', "");
        this.props.history.push('/');
    }
    render() {
        let userToken = localStorage.getItem('user_access_token');
        if (userToken == "") {
            return <Redirect to="/" />
        }
        return (
            <div className="container">
                <div className="header">
                </div>
                <div className="">
                    <p>Welcome to Home</p>
                    <button className="btn btn-primary" onClick={this.logoutFunction}>Logout</button>
                </div>
                <div className="">
                    <Footer />
                </div>
            </div>
        )
    }
}
