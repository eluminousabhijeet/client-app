import React, { Component } from 'react';
import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';
import { Link, Redirect } from 'react-router-dom';

const stalkRegx = RegExp(/^[0-9]?[0-9]*$/);

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

export default class AddProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            type: '',
            price: '',
            image: '',
            stalk: '',
            description: '',
            formErrors: {
                name: '',
                type: '',
                price: '',
                image: '',
                stalk: '',
                description: '',
            },
        }
        this.onChange = this.onChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    onChange = e => {
        // e.preventDefault();
        const { name, value } = e.target;
        let formErrors = this.state.formErrors;

        switch (name) {
            case 'type':
                formErrors.type = value.length < 3 == "" ? '' : "Please select type.";
                break;

            case 'name':
                formErrors.name = value.length < 2 ? 'Minimum 2 characters required.' : "";
                break;

            case 'price':
                formErrors.price = stalkRegx.test(value) ? '' : "Invalid price.";
                break;

            case 'image':
                formErrors.image = value.length < 3 ? 'Please upload the image.' : "";
                break;

            case 'stalk':
                formErrors.stalk = stalkRegx.test(value) ? '' : "Invalid stalk.";
                break;

            case 'description':
                formErrors.description = value.length < 3 ? 'Minimum 3 characters required.' : "";
                break;

            default:
                break;
        }

        this.setState({ formErrors, [name]: value })
    }

    imageHandler(e) {
        const { namefrm, value } = e.target;
        let formErrors = this.state.formErrors;
        let files = e.target.files;
        const { image } = this.state;
        let reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload=(e)=>{
            this.setState({
                image: e.target.result
            });
            formErrors.image = "";
            this.setState({ formErrors, [namefrm]: value });
        }
    }

    submitForm(e) {
        e.preventDefault();
        const { namefrm, value } = e.target;
        let formErrors = this.state.formErrors;
        const { type, name, price, image, stalk, description } = this.state;
        if (type == "") {
            formErrors.type = "This is required.";
        }
        if (name == "") {
            formErrors.name = "This is required.";
        }
        if (price == "") {
            formErrors.price = "This is required.";
        }
        if (image == "") {
            formErrors.image = "This is required.";
        }
        if (stalk == "") {
            formErrors.stalk = "This is required.";
        }
        if (description == "") {
            formErrors.description = "This is required.";
        }
        this.setState({ formErrors, [namefrm]: value });
        if (formValid(this.state)) {
            const token = localStorage.getItem('admin_access_token');
            fetch('http://localhost:5000/admin/add-product', {
                method: "POST",
                contentType: "application/json; charset=utf-8",
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    type: this.state.type,
                    name: this.state.name,
                    price: this.state.price,
                    stalk: this.state.stalk,
                    image: this.state.image,
                    description: this.state.description,
                })
            }).then((response) => response.json())
                .then((responseJson) => {
                    let token = responseJson.token;
                    console.log(responseJson);
                    if (responseJson.success == 'true') {
                        // localStorage.setItem('access_token', token);
                        // this.props.history.push('/home', { userid: responseJson.userid });
                        console.log('successss....');
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
        localStorage.setItem('current_location', this.props.location.pathname);
        let userToken = localStorage.getItem('admin_access_token');
        const { formErrors } = this.state;
        if (userToken == "") {
            return <Redirect to="/admin" />
        }
        return (
            <div className="main-container">
                <div className="">
                    <Navbar />
                </div>
                <div className=" container" style={{ padding: "0em 10em 5em 10em" }}>
                    <form onSubmit={this.submitForm}>
                        <div className="form-row">
                            <label htmlFor="type">Select type</label>
                            <select name="type" className={formErrors.type.length > 0 ? "err-field form-control" : "form-control"} noValidate onChange={this.onChange}>
                                <option value="">Select type</option>
                                <option value="admin">Electronic</option>
                                <option value="seller">Clothing</option>
                                <option value="buyer">Footwears</option>
                            </select>
                            {formErrors.type.length > 0 && (
                                <span className="text-danger">{formErrors.type}</span>
                            )}
                        </div>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="name">Product Name</label>
                                <input
                                    type="text"
                                    className={formErrors.name.length > 0 ? "err-field form-control" : "form-control"}
                                    placeholder="Product Name"
                                    name="name"
                                    noValidate
                                    onChange={this.onChange}
                                />
                                {formErrors.name.length > 0 && (
                                    <span className="text-danger">{formErrors.name}</span>
                                )}
                            </div>
                            <div className="form-row">
                                <label htmlFor="description">Product Description</label>
                                <textarea
                                    type="text"
                                    className={formErrors.description.length > 0 ? "err-field form-control" : "form-control"}
                                    placeholder="Description"
                                    name="description"
                                    noValidate
                                    onChange={this.onChange}
                                ></textarea>
                                {formErrors.description.length > 0 && (
                                    <span className="text-danger">{formErrors.description}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="price">Price</label>
                                <input
                                    type="text"
                                    className={formErrors.price.length > 0 ? "err-field form-control" : "form-control"}
                                    placeholder="Price"
                                    name="price"
                                    noValidate
                                    onChange={this.onChange}
                                />
                                {formErrors.price.length > 0 && (
                                    <span className="text-danger">{formErrors.price}</span>
                                )}
                            </div>
                            <div className="form-row">
                                <label htmlFor="stalk">stalk</label>
                                <input
                                    type="text"
                                    className={formErrors.stalk.length > 0 ? "err-field form-control" : "form-control"}
                                    placeholder="Stalk"
                                    name="stalk"
                                    noValidate
                                    onChange={this.onChange}
                                />
                                {formErrors.stalk.length > 0 && (
                                    <span className="text-danger">{formErrors.stalk}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="image">Upload Image</label>
                                <input
                                    type="file"
                                    className={formErrors.image.length > 0 ? "err-field form-control" : "form-control"}
                                    placeholder="Choose image"
                                    name="image"
                                    noValidate
                                    onChange={(e)=>this.imageHandler(e)}
                                />
                                {formErrors.image.length > 0 && (
                                    <span className="text-danger">{formErrors.image}</span>
                                )}
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-row">
                                <input type="submit" value="Add Product" className=" btn-primary" />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="">
                    <Footer />
                </div>
            </div>
        )
    }
}
