import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
// import {
//     // fetchData, 
//     postData,
//     // putData
//   } from './api';
  // import { 
  //   Button, 
  //   FormGroup, 
  //   // FormControl, 
  //   // ControlLabel 
  // } from 'react-bootstrap';


/* 
  This component will take the main portion of the page and is used to 
  confirm that the User really wants to delete a Type.  It will include 
  a lot of warnings to tell the User what other things will be changed.
  Currently the plan is that when a Type is Deleted, all SubTypes will
  just have it removed as a Super Type, all Things with it in Types will
  likewise just have it removed, Relationship Types for it will
  no longer be Relationship Types but will still exist, and Attributes
  of the deleted Type or of a List of the deleted Type will be changed
  to str or List<str>.
*/
class TypeDelete extends Component {
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
    // const response = await postData('/user/login', this.state.user);
    // const body = await response.json();

    // if (response.status !== 200) throw Error(body.message);

    // return body;
    return "";
  };

  render() {
    return (
      <div className="Login">
      </div>
    );
  }
}

export default TypeDelete;
