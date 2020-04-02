import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import util from '../util';
import { connect } from 'react-redux';
import { removeFromCart, increaseCount, decreaseCount } from '../actions/cartActions';

const emailRegx = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const phoneRegx = RegExp(/^[0]?[789]\d{9}$/);

const formValid = ({ formErrors, ...rest }) => {
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false);
    });

    Object.values(rest).forEach(val => {
        val === null && (valid = false)
    })

    return valid;
}

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            contact: '',
            address1: '',
            address2: '',
            postcode: '',
            country: '',
            state: '',
            city: '',
            formErrors: {
                firstname: '',
                lastname: '',
                email: '',
                contact: '',
                address1: '',
                address2: '',
                postcode: '',
                country: '',
                state: '',
                city: '',
            },
            cartItems: [],
            userData: [],
            productData: []
        }
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount() {
        const token = localStorage.getItem('user_access_token');
        const userId = localStorage.getItem('current_user_id');
        fetch('http://localhost:5000/user/user-data/' + userId, {
            method: "GET",
            contentType: "application/json; charset=utf-8",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success == 'true') {
                    this.setState({
                        userData: responseJson.userdata[0],
                        firstname: responseJson.userdata[0].firstname,
                        lastname: responseJson.userdata[0].lastname,
                        email: responseJson.userdata[0].email,
                        contact: responseJson.userdata[0].contact,
                    });
                } else {
                    this.setState({
                        errorMsg: responseJson.message
                    })
                }
            });

        const productSlug = this.props.match.params.slug;
        fetch('http://localhost:5000/user/product-data/' + productSlug, {
            method: "GET",
            contentType: "application/json; charset=utf-8",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success == 'true') {
                    this.setState({
                        productData: responseJson.productData[0]
                    })
                } else {
                    this.setState({
                        errorMsg: responseJson.message
                    })
                }
            });

        // if (localStorage.getItem('cartItems')) {
        //     this.setState({
        //         cartItems: JSON.parse(localStorage.getItem('cartItems'))
        //     })
        // }
        // console.log(JSON.parse(localStorage.getItem('cartItems')));
    }

    onChange = e => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;

        switch (name) {
            case 'firstname':
                formErrors.firstname = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'lastname':
                formErrors.lastname = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'email':
                formErrors.email = emailRegx.test(value) ? '' : "Invalid email address.";
                break;

            case 'contact':
                formErrors.contact = phoneRegx.test(value) ? '' : "Invalid contact number.";
                break;

            case 'address1':
                formErrors.address1 = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'address2':
                formErrors.address2 = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'postcode':
                formErrors.postcode = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'country':
                formErrors.country = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'state':
                formErrors.state = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'city':
                formErrors.city = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            default:
                break;
        }

        this.setState({ formErrors, [name]: value })
    }

    submitForm(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        const { firstname, lastname, email, contact, address1, address2, postcode, country, state, city, productData } = this.state;
        if (firstname == "") {
            formErrors.firstname = "This is required.";
        }
        if (lastname == "") {
            formErrors.lastname = "This is required.";
        }
        if (email == "") {
            formErrors.email = "This is required.";
        }
        if (contact == "") {
            formErrors.contact = "This is required.";
        }
        if (address1 == "") {
            formErrors.address1 = "This is required.";
        }
        if (address2 == "") {
            formErrors.address2 = "This is required.";
        }
        if (postcode == "") {
            formErrors.postcode = "This is required.";
        }

        if (country == "") {
            formErrors.country = "This is required.";
        }

        if (state == "") {
            formErrors.state = "This is required.";
        }

        if (city == "") {
            formErrors.city = "This is required.";
        }

        this.setState({ formErrors, [name]: value });
        if (formValid(this.state)) {
            var tempDate = new Date();
            var currDate = tempDate.getFullYear() + '-' + (tempDate.getMonth() + 1) + '-' + tempDate.getDate() + ' ' + tempDate.getHours() + ':' + tempDate.getMinutes() + ':' + tempDate.getSeconds();
            const userId = localStorage.getItem('current_user_id');
            if (this.props.match.params.slug) {
                fetch('http://localhost:5000/user/place-order', {
                    method: "POST",
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        productId: productData._id,
                        quantity: this.props.match.params.qty,
                        userId: userId,
                        shippingName: this.state.firstname + ' ' + this.state.lastname,
                        shippingAddress: this.state.address1 + ', ' + this.state.address2,
                        shippingPostcode: this.state.postcode,
                        shippingCountry: this.state.country,
                        shippingState: this.state.state,
                        shippingCity: this.state.city,
                        totalCost: productData.price * this.props.match.params.qty,
                        createdOn: currDate,
                        status: 'active'
                    })
                }).then((response) => response.json())
                    .then((responseJson) => {
                        let token = responseJson.token;
                        console.log(responseJson);
                        if (responseJson.success == 'true') {
                            localStorage.setItem('cartItems', "");
                            this.props.history.push('/thank-you');
                        } else {
                            this.setState({
                                errorMsg: responseJson.message
                            })
                        }
                    });

            } else {
                this.props.cartItems.forEach(item => {
                    fetch('http://localhost:5000/user/place-order', {
                        method: "POST",
                        contentType: "application/json; charset=utf-8",
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            productId: item._id,
                            quantity: item.count,
                            userId: userId,
                            shippingName: this.state.firstname + ' ' + this.state.lastname,
                            shippingAddress: this.state.address1 + ', ' + this.state.address2,
                            shippingPostcode: this.state.postcode,
                            shippingCountry: this.state.country,
                            shippingState: this.state.state,
                            shippingCity: this.state.city,
                            totalCost: item.price * item.count,
                            createdOn: currDate,
                            status: 'active'
                        })
                    }).then((response) => response.json())
                        .then((responseJson) => {
                            let token = responseJson.token;
                            console.log(responseJson);
                            if (responseJson.success == 'true') {
                                localStorage.setItem('cartItems', "");
                                this.props.history.push('/thank-you');
                            } else {
                                this.setState({
                                    errorMsg: responseJson.message
                                })
                            }
                        });
                });
            }
        } else {
            console.log('error');
        }
    }

    handleLogout() {
        localStorage.setItem('user_access_token', "");
        this.props.history.push('/');
    }

    render() {
        let userToken = localStorage.getItem('user_access_token');
        if (userToken == "") {
            return <Redirect to="/" />
        }
        const { userData, formErrors, productData } = this.state;
        const { cartItems } = this.props;
        return (
            <div className="">
                <div className="header">
                    <Header logoutFunction={this.logoutFunction} />
                </div>
                <div className="container">
                    <h1>Checkout</h1>
                    <hr />
                    <div className="row">
                        <div className="col-md-8">
                            <form onSubmit={this.submitForm} className="checkout-form">
                                <h3>Personal Information</h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="First Name"
                                            noValidate
                                            defaultValue={userData.firstname}
                                            name="firstname"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.firstname.length > 0 && (
                                            <span className="text-danger">{formErrors.firstname}</span>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <input type="text"
                                            className="form-control"
                                            noValidate
                                            defaultValue={userData.lastname}
                                            placeholder="Last Name"
                                            name="lastname"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.lastname.length > 0 && (
                                            <span className="text-danger">{formErrors.lastname}</span>
                                        )}
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Email"
                                            noValidate
                                            defaultValue={userData.email}
                                            name="email"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.email.length > 0 && (
                                            <span className="text-danger">{formErrors.email}</span>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Contact"
                                            noValidate
                                            defaultValue={userData.contact}
                                            name="contact"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.contact.length > 0 && (
                                            <span className="text-danger">{formErrors.contact}</span>
                                        )}
                                    </div>
                                </div><br />
                                <h3>Address Information</h3>
                                <div className="row">
                                    <div className="col-md-12">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Address Line 1"
                                            name="address1"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.address1.length > 0 && (
                                            <span className="text-danger">{formErrors.address1}</span>
                                        )}
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-md-12">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Address Line 2"
                                            name="address2"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.address2.length > 0 && (
                                            <span className="text-danger">{formErrors.address2}</span>
                                        )}
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Postcode"
                                            name="postcode"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.postcode.length > 0 && (
                                            <span className="text-danger">{formErrors.postcode}</span>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="Country"
                                            name="country"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.country.length > 0 && (
                                            <span className="text-danger">{formErrors.country}</span>
                                        )}
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="State"
                                            name="state"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.state.length > 0 && (
                                            <span className="text-danger">{formErrors.state}</span>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <input type="text"
                                            className="form-control"
                                            placeholder="City"
                                            name="city"
                                            onChange={this.onChange}
                                        />
                                        {formErrors.city.length > 0 && (
                                            <span className="text-danger">{formErrors.city}</span>
                                        )}
                                    </div>
                                </div><br />
                                <input type="submit" value="Place Order" className="btn btn-primary" />
                            </form>
                        </div>
                        <div className="col-md-4">
                            {
                                this.props.match.params.slug ?
                                    <div className="alert alert-info">
                                        {
                                            !this.props.match.params.slug ? "You have no product to buy." : <div>Your product summery is as follows.</div>
                                        } <br />
                                        {
                                            <div>
                                                <table>
                                                    <thead></thead>
                                                    <tbody>
                                                        <tr>
                                                            <td><img src={productData.image} height="80px" width="80px" /></td>
                                                            <td className="checkout-product-details">
                                                                <h4>{productData.name}</h4>
                                                                <p><b>Quantity: </b>{this.props.match.params.qty}</p>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <hr />
                                                <table>
                                                    <thead></thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="cart-total" width="50%">Total Amount: {util.formatCurrency(productData.price * this.props.match.params.qty)}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        }
                                    </div>
                                    :

                                    <div className="alert alert-info">
                                        {
                                            cartItems.length === 0 ? "Your cart is empty." : <div>You have {cartItems.length} products in your cart.</div>
                                        } <br />
                                        {
                                            cartItems.length > 0 &&
                                            <div>
                                                <ul>
                                                    {
                                                        cartItems.map(item =>
                                                            <li key={item._id}>
                                                                <b>{item.name} X {item.count}</b>
                                                            </li>
                                                        )
                                                    }
                                                </ul>
                                                <hr />
                                                <table>
                                                    <thead></thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="cart-total" width="50%">Total Amount: {util.formatCurrency(cartItems.reduce((a, c) => a + c.price * c.count, 0))}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        }
                                    </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="">
                    <Footer />
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    cartItems: state.cart.items
});

export default connect(mapStateToProps)(Checkout);