
import React, { Component } from "react";
import { connect } from "react-redux";
import { selectPage } from "../../redux/actions/index";

// This is a template to use when creating pages.
// It's recommended not to make your own base component classes,
// but I have just a couple things I want to add to my 'page'
// components.  I'll copy this template whenever creating a
// new 'page' component.

const mapStateToProps = state => {
  return { selectedPage: state.app.selectedPage };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page))
  };
}
class Page extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <div className="col-sm-12">
        Profile Page
      </div>
    );
  }
}
const UserEditPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default UserEditPage;
