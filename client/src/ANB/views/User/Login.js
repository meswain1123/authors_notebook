import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from 'react-helmet';
import LoginControl from './LoginControl';


class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null
    };
  }

  componentDidMount = () => {
    // if (this.state.email) {
    //   this.validateField("email");
    //   this.validateField("password");
    //   this.setState({remember: true});
    // }
  }

  render() {
    if (this.state.redirectTo !== null) {
      return (<Redirect to={this.state.redirectTo} />);
    }
    else {
      return (
        <div>
          <Helmet>
            <title>Author's Notebook: Login</title>
          </Helmet>
          <LoginControl onLogin={user => { this.setState({redirectTo: "/"}); }}/>
        </div>
      );
    }
  }
}

const LoginPage = connect()(Page);
export default LoginPage;
