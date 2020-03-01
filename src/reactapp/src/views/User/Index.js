import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import {
    fetchData, 
    postData,
  } from './api';
  import { 
    Button, 
    FormGroup, 
  } from 'react-bootstrap';


/* 
  This component will only be available to Admins, and it will show a
  list of all users with metrics 
  (most recent activity, number of worlds, etc).
  It will also provide an interface for blocking and reenabling 
  user access in case of suspicious activity.
*/
class UserIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
    this.loginClick = this.loginClick.bind(this);
  }

  loginClick() {
    this.login()
      .then(res => { 
        this.setState({ greeting: res.message, user: res.user });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
  }

  login = async () => {
    const response = await postData('/user/login', this.state.user);
    const body = await response.json();

    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  render() {
    return (
      <div className="Login">
      </div>
    );
  }
}

export default UserIndex;
