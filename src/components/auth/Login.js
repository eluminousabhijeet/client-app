import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

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

export default class Login extends Component {
    constructor(props) {
        super(props);
        let loggedIn = false;
        this.state = {
            usernameoremail: '',
            password: '',
            formErrors: {
                usernameoremail: '',
                password: '',
            },
            loggedIn
        }
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    onChange(e) {
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;

        switch (name) {
            case 'usernameoremail':
                formErrors.usernameoremail = value.length < 0 ? 'This is required.' : "";
                break;

            case 'password':
                formErrors.password = value.length < 0 ? 'This is required.' : "";
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
        const { usernameoremail, password } = this.state;
        if (usernameoremail == "") {
            formErrors.usernameoremail = "This is required.";
        }
        if (password == "") {
            formErrors.password = "This is required.";
        }
        this.setState({ formErrors, [name]: value });
        if (formValid(this.state)) {
            fetch('http://localhost:5000/users/signin', {
                method: "POST",
                contentType: "application/json; charset=utf-8",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.usernameoremail,
                    password: this.state.password

                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    let token = responseJson.token;
                    console.log(responseJson);
                    if (responseJson.success == 'true') {
                        localStorage.setItem('user_access_token', token);
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
            return <Redirect to="/home" />
        }
        return (
            <div className="container">
                <div className="header">
                    Signin
                </div>
                <div className="content">
                    <div className="image-div">
                        <img className="signin-img" />
                    </div>
                    <div className="form-div">
                        <div className="err-message auth-err">{this.state.errorMsg}</div>
                        <form onSubmit={this.submitForm}>
                            <div className="form-group">
                                <div className="form-row">
                                    <label htmlFor="usernameoremail">Username/Email</label>
                                    <input type="text"
                                        className={formErrors.usernameoremail.length > 0 ? "err-field" : null}
                                        placeholder="Username/Email"
                                        name="usernameoremail"
                                        onChange={this.onChange}
                                    />
                                    {formErrors.usernameoremail.length > 0 && (
                                        <span className="err-message">{formErrors.usernameoremail}</span>
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
                                        onChange={this.onChange}
                                    />
                                    {formErrors.password.length > 0 && (
                                        <span className="err-message">{formErrors.password}</span>
                                    )}
                                </div>
                            </div>
                            <div className="form-group">
                                <div className="form-row">
                                    <input type="submit" value="Signin" className="signin-btn" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="below-content">
                    <div>Don't have an account?<Link to="/signup"> Signup...</Link></div>
                </div>
            </div>
        )
    }
}
