import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

const emailRegx = RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
const phoneRegx = RegExp(/^[0]?[789]\d{9}$/);
const passwordRegx = RegExp(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/);

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

export default class Register extends Component {
    constructor(props) {
        super(props);
        let loggedIn = false;
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            username: '',
            contact: '',
            gender: '',
            formErrors: {
                firstname: '',
                lastname: '',
                email: '',
                username: '',
                contact: '',
                gender: '',
                password: '',
                confpassword: ''
            },
            role: 'Buyer',
            password: '',
            confpassword: '',
            items: '',
            errorMsg: '',
            loggedIn
        }
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    onChange = e => {
        // e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;

        switch (name) {
            case 'firstname':
                formErrors.firstname = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'lastname':
                formErrors.lastname = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'username':
                formErrors.username = value.length < 3 ? 'minimum 3 characters required.' : "";
                break;

            case 'email':
                formErrors.email = emailRegx.test(value) ? '' : "Invalid email address.";
                break;

            case 'contact':
                formErrors.contact = phoneRegx.test(value) ? '' : "Invalid contact number.";
                break;

            case 'gender':
                formErrors.gender = value.length < 3 == "" ? '' : "Please select gender.";
                break;

            case 'password':
                formErrors.password = passwordRegx.test(value) ? '' : "Minimum 6 characters required and it should atlease one capital letter, number and special character.";
                break;

            case 'confpassword':
                formErrors.confpassword = value.length < 6 || value != this.state.password ? 'Password do not matched.' : "";
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
        const  {firstname, lastname, username, email, contact, gender, password, confpassword} = this.state;
        if(firstname == ""){
            formErrors.firstname = "This is required.";
        }
        if(lastname == ""){
            formErrors.lastname = "This is required.";
        }
        if(username == ""){
            formErrors.username = "This is required.";
        }
        if(email == ""){
            formErrors.email = "This is required.";
        }
        if(contact == ""){
            formErrors.contact = "This is required.";
        }
        if(gender == ""){
            formErrors.gender = "This is required.";
        }
        if(password == ""){
            formErrors.password = "This is required.";
        }
        if(confpassword == ""){
            formErrors.confpassword = "This is required.";
        }
        this.setState({ formErrors, [name]: value });
        if (formValid(this.state)) {
            fetch('http://localhost:5000/users/signup', {
                method: "POST",
                contentType: "application/json; charset=utf-8",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstname: this.state.firstname,
                    lastname: this.state.lastname,
                    email: this.state.email,
                    username: this.state.username,
                    contact: this.state.contact,
                    gender: this.state.gender,
                    role: this.state.role,
                    password: this.state.password
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    let token = responseJson.token;
                    console.log(responseJson);
                    if (responseJson.success == 'true') {
                        localStorage.setItem('access_token', token);
                        this.props.history.push('/user-profile', { userid: responseJson.userid });
                    } else {
                        this.setState({
                            errorMsg: responseJson.message
                        })
                    }
                });
        } else {
            console.log('error');
        }
    }

    render() {
        const { formErrors } = this.state;
        let userToken = localStorage.getItem('access_token');
        if (userToken !== "") {
            return <Redirect to="/user-profile" />
        }
        return (
            <div className="container">
                <div className="header">
                    Signup
                </div>
                <div className="content">
                    <div className="image-div">
                        <img />
                    </div>
                    <div className="form-div">
                        <div className="err-message auth-err">{this.state.errorMsg}</div>
                        <form onSubmit={this.submitForm}>
                            <div className="form-group">
                                <div className="form-row">
                                    <label htmlFor="firstname">First Name</label>
                                    <input
                                        type="text"
                                        className={formErrors.firstname.length > 0 ? "err-field" : null}
                                        placeholder="First Name"
                                        name="firstname"
                                        noValidate
                                        onChange={this.onChange}
                                    />
                                    {formErrors.firstname.length > 0 && (
                                        <span className="err-message">{formErrors.firstname}</span>
                                    )}
                                </div>
                                <div className="form-row">
                                    <label htmlFor="lastname">Last Name</label>
                                    <input
                                        type="text"
                                        className={formErrors.lastname.length > 0 ? "err-field" : null}
                                        placeholder="Last Name"
                                        name="lastname"
                                        noValidate
                                        onChange={this.onChange}
                                    />
                                    {formErrors.lastname.length > 0 && (
                                        <span className="err-message">{formErrors.lastname}</span>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-row">
                                    <label htmlFor="email">Choose Username</label>
                                    <input
                                        type="text"
                                        className={formErrors.username.length > 0 ? "err-field" : null}
                                        placeholder="Choose Username"
                                        name="username"
                                        noValidate
                                        onChange={this.onChange}
                                    />
                                    {formErrors.username.length > 0 && (
                                        <span className="err-message">{formErrors.username}</span>
                                    )}
                                </div>
                                <div className="form-row">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="text"
                                        className={formErrors.email.length > 0 ? "err-field" : null}
                                        placeholder="Email"
                                        name="email"
                                        noValidate
                                        onChange={this.onChange}
                                    />
                                    {formErrors.email.length > 0 && (
                                        <span className="err-message">{formErrors.email}</span>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-row">
                                    <label htmlFor="contact">Contact Number</label>
                                    <input
                                        type="text"
                                        className={formErrors.contact.length > 0 ? "err-field" : null}
                                        placeholder="Contact Number"
                                        name="contact"
                                        noValidate
                                        onChange={this.onChange}
                                    />
                                    {formErrors.contact.length > 0 && (
                                        <span className="err-message">{formErrors.contact}</span>
                                    )}
                                </div>
                                <div className="form-row">
                                    <label htmlFor="gender">Gender</label>
                                    <select name="gender" className={formErrors.gender.length > 0 ? "err-field" : null} noValidate onChange={this.onChange}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {formErrors.gender.length > 0 && (
                                        <span className="err-message">{formErrors.gender}</span>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-row">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className={formErrors.password.length > 0 ? "err-field" : null}
                                        placeholder="Password"
                                        name="password"
                                        noValidate
                                        onChange={this.onChange}
                                    />
                                    {formErrors.password.length > 0 && (
                                        <span className="err-message">{formErrors.password}</span>
                                    )}
                                </div>
                                <div className="form-row">
                                    <label htmlFor="confpassword">Confirm Password</label>
                                    <input
                                        type="password"
                                        className={formErrors.confpassword.length > 0 ? "err-field" : null}
                                        placeholder="Confirm Password"
                                        name="confpassword"
                                        noValidate
                                        onChange={this.onChange}
                                    />
                                    {formErrors.confpassword.length > 0 && (
                                        <span className="err-message">{formErrors.confpassword}</span>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-row">
                                    <input type="submit" value="Signup" className="signin-btn" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="below-content">
                    <div>Already have an account?<Link to="/"> Signin...</Link></div>
                </div>
            </div>
        )
    }
}
