import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import history from './history';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Checkout from './components/Checkout';
import ThankYou from './components/ThankYou';
import MyOrders from './components/MyOrders';
import SingleProduct from './components/SingleProduct';

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch history={history}>
          <Route exact path="/" component={Login} />
          <Route exact path="/signup" component={Register} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/checkout" component={Checkout} />
          <Route exact path="/thank-you" component={ThankYou} />
          <Route exact path="/my-orders" component={MyOrders} />
          <Route exact path="/product/:slug" component={SingleProduct} />
        </Switch>
      </BrowserRouter>
    )
  }
}
