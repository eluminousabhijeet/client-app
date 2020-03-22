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
        val === "form-control" && (valid = false)
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
            role: 'buyer',
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

    onChangeUsername = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        console.log(value);
        const token = localStorage.getItem('admin_access_token');
        fetch('http://localhost:5000/admin/check-username', {
            method: "POST",
            contentType: "application/json; charset=utf-8",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                username: value,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.success == 'false') {
                    formErrors.username = "Username is already taken";
                    this.setState({ formErrors, [name]: value })
                } else {
                    if (value.length < 3) {
                        formErrors.username = "Minimum 3 characters required.";
                    } else {
                        formErrors.username = "";
                    }
                    this.setState({ formErrors, [name]: value })
                    this.setState({
                        errorMsg: responseJson.message
                    })
                }
            });
        this.setState({ formErrors, [name]: value })
    }

    onChangeEmail = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        console.log(value);
        const token = localStorage.getItem('admin_access_token');
        fetch('http://localhost:5000/admin/check-email', {
            method: "POST",
            contentType: "application/json; charset=utf-8",
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                email: value,
            })
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson.success == 'false') {
                    formErrors.email = "Email is already taken";
                    this.setState({ formErrors, [name]: value })
                } else {
                    formErrors.email = "";
                    this.setState({ formErrors, [name]: value })
                    this.setState({
                        errorMsg: responseJson.message
                    })
                }
            });
        this.setState({ formErrors, [name]: value })
    }

    submitForm(e) {
        e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;
        const { firstname, lastname, username, email, contact, gender, password, confpassword } = this.state;
        if (firstname == "") {
            formErrors.firstname = "This is required.";
        }
        if (lastname == "") {
            formErrors.lastname = "This is required.";
        }
        if (username == "") {
            formErrors.username = "This is required.";
        }
        if (email == "") {
            formErrors.email = "This is required.";
        }
        if (contact == "") {
            formErrors.contact = "This is required.";
        }
        if (gender == "") {
            formErrors.gender = "This is required.";
        }
        if (password == "") {
            formErrors.password = "This is required.";
        }
        if (confpassword == "") {
            formErrors.confpassword = "This is required.";
        }
        this.setState({ formErrors, [name]: value });
        if (formValid(this.state)) {
            fetch('http://localhost:5000/user/signup', {
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
                        this.props.history.push('/home', { userid: responseJson.userid });
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
        let userToken = localStorage.getItem('user_access_token');
        if (userToken !== "") {
            return <Redirect to="/user-profile" />
        }
        return (
            <div className="container">
                <h1>Signup</h1>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <div className="form-div">
                            <div className="text-danger auth-err">{this.state.errorMsg}</div><br />
                            <form onSubmit={this.submitForm}>
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="firstname">First Name<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={formErrors.firstname.length > 0 ? "err-field form-control" : "form-control"}
                                            placeholder="First Name"
                                            name="firstname"
                                            noValidate
                                            onChange={this.onChange}
                                        />
                                        {formErrors.firstname.length > 0 && (
                                            <span className="text-danger">{formErrors.firstname}</span>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="lastname">Last Name<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={formErrors.lastname.length > 0 ? "err-field form-control" : "form-control"}
                                            placeholder="Last Name"
                                            name="lastname"
                                            noValidate
                                            onChange={this.onChange}
                                        />
                                        {formErrors.lastname.length > 0 && (
                                            <span className="text-danger">{formErrors.lastname}</span>
                                        )}
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="email">Choose Username<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={formErrors.username.length > 0 ? "err-field form-control" : "form-control"}
                                            placeholder="Choose Username"
                                            name="username"
                                            noValidate
                                            onChange={this.onChangeUsername}
                                        />
                                        {formErrors.username.length > 0 && (
                                            <span className="text-danger">{formErrors.username}</span>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="email">Email<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={formErrors.email.length > 0 ? "err-field form-control" : "form-control"}
                                            placeholder="Email"
                                            name="email"
                                            noValidate
                                            onChange={this.onChangeEmail}
                                        />
                                        {formErrors.email.length > 0 && (
                                            <span className="text-danger">{formErrors.email}</span>
                                        )}
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="contact">Contact Number<span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className={formErrors.contact.length > 0 ? "err-field form-control" : "form-control"}
                                            placeholder="Contact Number"
                                            name="contact"
                                            noValidate
                                            onChange={this.onChange}
                                        />
                                        {formErrors.contact.length > 0 && (
                                            <span className="text-danger">{formErrors.contact}</span>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="gender">Gender<span className="text-danger">*</span></label>
                                        <select name="gender" className={formErrors.gender.length > 0 ? "err-field form-control" : "form-control"} noValidate onChange={this.onChange}>
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        {formErrors.gender.length > 0 && (
                                            <span className="text-danger">{formErrors.gender}</span>
                                        )}
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <label htmlFor="password">Password<span className="text-danger">*</span></label>
                                        <input
                                            type="password"
                                            className={formErrors.password.length > 0 ? "err-field form-control" : "form-control"}
                                            placeholder="Password"
                                            name="password"
                                            noValidate
                                            onChange={this.onChange}
                                        />
                                        {formErrors.password.length > 0 && (
                                            <span className="text-danger">{formErrors.password}</span>
                                        )}
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="confpassword">Confirm Password<span className="text-danger">*</span></label>
                                        <input
                                            type="password"
                                            className={formErrors.confpassword.length > 0 ? "err-field form-control" : "form-control"}
                                            placeholder="Confirm Password"
                                            name="confpassword"
                                            noValidate
                                            onChange={this.onChange}
                                        />
                                        {formErrors.confpassword.length > 0 && (
                                            <span className="text-danger">{formErrors.confpassword}</span>
                                        )}
                                    </div>
                                </div><br />
                                <div className="row">
                                    <div className="col-md-6">
                                        <input type="submit" value="Signup" className="btn btn-primary" />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div><br />
                <div className="below-content">
                    <div>Already have an account?<Link to="/"><b> Signin...</b></Link></div>
                </div>
            </div>
        )
    }
}
