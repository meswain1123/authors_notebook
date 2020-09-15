
import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import {
//   // notFromLogin,
//   redirectTo
// } from "../redux/actions/index";

// This is a template to use when creating pages.
// It's recommended not to make your own base component classes,
// but I have just a couple things I want to add to my 'page'
// components.  I'll copy this template whenever creating a
// new 'page' component.

const mapStateToProps = state => {
  return { 
    selectedPage: state.app.selectedPage
  };
};
function mapDispatchToProps(dispatch) {
  return {
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "0",
      redirectTo: null
    };
  }

  componentDidMount() {
  }
  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <div className="col-sm-12">
          Template Page
        </div>
      );
    }
  }
}
const TemplatePage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default TemplatePage;
