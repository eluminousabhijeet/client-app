import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Logout extends Component {
    render() {
        return (
            <div>
                <p>You have logged out...</p>
                <Link to="/">Login Again</Link>
            </div>
        )
    }
}
