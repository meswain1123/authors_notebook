
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { selectPage } from "../../redux/actions/index";

// This is a template to use when creating pages.
// It's recommended not to make your own base component classes,
// but I have just a couple things I want to add to my 'page'
// components.  I'll copy this template whenever creating a
// new 'page' component.

const mapStateToProps = state => {
  // // console.log(state);
  return { selectedPage: state.app.selectedPage };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page))
  };
}
class Page extends Component {
  componentDidMount() {
    if (`/${this.props.selectedPage}` === window.location.pathname)
    {
      setTimeout(() => { 
        this.props.selectPage(null); 
      }, 500); // Sets selectedPage to null half a second after the page loads
    }
  }
  render() {
    if (
      this.props.selectedPage === null ||
      `/${this.props.selectedPage}` === window.location.pathname
    ) {
      return (
        <div className="col-sm-12">
          Forum Menu Page!
        </div>
      );
    } else {
      return (
        <Redirect
          to={`/${this.props.selectedPage}`}
        />
      );
    }
  }
}
const ForumMenuPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default ForumMenuPage;
