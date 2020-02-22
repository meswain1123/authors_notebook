import React, { Component } from "react";
// import "./assets/css/material-dashboard-react.css";
// import { BrowserRouter as Router, Route, Redirect, Link, Switch } from "react-router-dom";
import { connect } from "react-redux";


class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "0"
    };
    // this.api = API.getInstance();
  }

  componentDidMount() {
    // this.api.getVersion()
    //   .then(res => {
    //     this.setState({ version: res.version });
    //   })
    //   .catch(err => console.log(err));
  }

  render() {
    return (
        <div>Home</div>
    );
  }
}

const HomePage = connect()(Page);
export default HomePage;
