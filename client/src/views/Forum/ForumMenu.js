
import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  notFromLogin
} from "../../redux/actions/index";

const mapStateToProps = state => {
  return { 
    selectedPage: state.app.selectedPage,
    fromLogin: state.app.fromLogin
  };
};
function mapDispatchToProps(dispatch) {
  return {
    notFromLogin: () => dispatch(notFromLogin({}))
  };
}
class Page extends Component {
  componentDidMount() {
  }
  render() {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
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
