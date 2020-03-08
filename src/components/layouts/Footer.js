import React, { Component } from 'react';
import '../auth/style.scss';

const divStyle = {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    background: '#e7e7e7',
    color: '#777',
    height: "4em",
};

export default class Footer extends Component {
    render() {
        return (
            <div className="footer" style={divStyle}>
                <p>Footer</p>
            </div>
        )
    }
}
