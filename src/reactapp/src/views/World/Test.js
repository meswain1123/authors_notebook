import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { selectPage } from "../../redux/actions/index";


// All route props (match, location and history) are available to User

const mapStateToProps = state => {
  return {
    checked: state.session.checked,
    authenticated: state.session.authenticated,
    selectedPage: state.app.selectedPage
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page))
  };
}
class TestComponent extends Component {
  componentDidMount() {
  }
  render() {
    return <h1>Hello {this.props.match.params.testtext}!</h1>;
  }
    
}

const Test = connect(mapStateToProps, mapDispatchToProps)(TestComponent);
export default Test;
