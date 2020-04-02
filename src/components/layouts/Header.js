import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItems: [],
      cartCount: 0
    }
  }
  logoutFunction = () => {
    localStorage.setItem('user_access_token', "");
    // this.props.history.push('/');
    return <Redirect to="/" />
  }
  componentDidMount() {
    if (localStorage.getItem('cartItems')) {
      this.setState({
        cartItems: JSON.parse(localStorage.getItem('cartItems'))
      })
    }
  }
  render() {
    const { cartItems } = this.state;
    return (
      <div>
        <nav className="navbar navbar-primary bg-primary">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="http://localhost:3000/home">Product App</a>
            </div>
            <div className="collapse navbar-collapse" id="myNavbar">
              <ul className="nav navbar-nav">
                <li className="active"><a href="http://localhost:3000/my-orders">My Orders</a></li>
                <li>
                  <a href="http://localhost:3000/cart">My Cart</a>
                  {/* <div className="header-cart-count">
                    <p className="">{cartItems.length}</p>
                  </div> */}
                </li>
                {/* <li><a href="#">Page 2</a></li>
                <li><a href="#">Page 3</a></li> */}
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <a className="dropdown-toggle" data-toggle="dropdown" href="#"><i className="fa fa-user-circle-o"></i>
                    <i className="fa fa-caret-down"></i></a>
                  <ul className="dropdown-menu">
                    <li><a onClick={this.props.handleLogout}>Logout</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
