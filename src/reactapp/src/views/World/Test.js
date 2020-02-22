import React, { Component } from "react";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { selectPage } from "../../redux/actions/index";


// All route props (match, location and history) are available to User

const mapStateToProps = state => {
  // // console.log(state);
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
  // constructor(props) {
  //   super(props);

  // }
  componentDidMount() {
    // // console.log(this.props);
  }
  render() {
    // // console.log(this.props);
    return <h1>Hello {this.props.match.params.testtext}!</h1>;
  }
    
}

const Test = connect(mapStateToProps, mapDispatchToProps)(TestComponent);
export default Test;

// function Test(props) {
//   // console.log(props);
//   return <h1>Hello {props.match.params.testtext}!</h1>;
// }

// export default Test;
