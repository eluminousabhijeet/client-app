import React, { Component } from 'react';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { Link, Redirect, useHistory } from 'react-router-dom';

export default class ManageUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: []
        }
    }
    componentDidMount() {
        const token = localStorage.getItem('admin_access_token');
        fetch('http://localhost:5000/admin/user-listing', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': token
            }

        })
            .then(response => response.json())
            .then(responseJson => {
                this.setState({
                    userData: responseJson.users
                });
            });
    }

    routeChange = () => {
        let path = '/add-user';
        let history = useHistory();
        history.push(path);
    }

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
                        <Link className="btn btn-primary" to="/add-user">Add User</Link>
                    </div>
                    <div>
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    {/* <th>Sr. No.</th> */}
                                    <th>Firstname</th>
                                    <th>Lastname</th>
                                    <th>username</th>
                                    <th>Email</th>
                                    <th>Contact</th>
                                    <th>Gender</th>
                                    <th>Role</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.userData.map((data, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{data.firstname}</td>
                                            <td>{data.lastname}</td>
                                            <td>{data.username}</td>
                                            <td>{data.email}</td>
                                            <td>{data.contact}</td>
                                            <td>{data.gender}</td>
                                            <td>{data.role}</td>
                                            <td></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="">
                    <Footer />
                </div>
            </div>
        )
    }
}
