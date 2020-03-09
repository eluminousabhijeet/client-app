import React, { Component } from 'react';

export default class AddProduct extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: '',
            type: '',
            price: '',
            image: '',
            stalk: '',

        }
    }
    render() {
        localStorage.setItem('current_location', this.props.location.pathname);
        return (
            <div>
                
            </div>
        )
    }
}
