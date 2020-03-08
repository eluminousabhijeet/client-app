import React, { Component } from 'react';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';

export default class ManageUsers extends Component {
    componentDidMount() {
        const token = localStorage.getItem('admin_access_token')
        fetch('http://localhost:5000/users/users-listing', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'token': token
            }

        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson);
            });

        fetch('http://localhost:5000/admin/users-listing', {
            method: "GET",
            contentType: "application/json; charset=utf-8",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',

            },
            // body: JSON.stringify({

            // })
        }).then((response) => response.json())
            .then((responseJson) => {
                // console.log(responseJson);
                // // let token = responseJson.token;
                // console.log(responseJson);
                // if (responseJson.success == 'true') {
                //     localStorage.setItem('user_access_token', token);
                //     this.props.history.push('/home', { userid: responseJson.userid });
                // } else {
                //     this.setState({
                //         errorMsg: responseJson.message
                //     })
                // }
            });
    }
    render() {
        return (
            <div className="main-container">
                <div className="">
                    <Navbar />
                </div>
                <div className="">
                    <p>Manage Users</p>
                </div>
                <div className="">
                    <Footer />
                </div>
            </div>
        )
    }
}
