import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import AdminLogin from './components/auth/AdminLogin';
import Register from './components/auth/Register';
import Dashboard from './components/admin/Dashboard';
import ManageUsers from './components/admin/ManageUsers';
import ManageProducts from './components/admin/ManageProducts';
import Home from './components/auth/Home';
import AddUser from './components/admin/AddUser';
import './components/auth/style.scss';

export default class App extends Component {
  render() {
    return (
      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Login} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/admin" component={AdminLogin} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/manage-users" component={ManageUsers} />
            <Route exact path="/manage-products" component={ManageProducts} />
            <Route exact path="/add-user" component={AddUser} />
            <Route exact path="/signup" component={Register} />

            {/* <Route exact path="/admin/signin" component={AdminLogin} />
            <Route exact path="/signin" component={UserLogin} />
            <Route exact path="/signup" component={UserRegister} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/user-profile" component={UserProfile} />
            <Route exact path="/logout" component={Logout} /> */}
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}
