
import React, { Component } from "react";
import { connect } from "react-redux";

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
  };
}
class Page extends Component {
  componentDidMount() {
  }
  render() {
    return (
      <div className="col-sm-12">
        Template Page
      </div>
    );
  }
}
const TemplatePage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default TemplatePage;
