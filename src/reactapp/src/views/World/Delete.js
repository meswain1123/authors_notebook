
import React, { Component } from "react";
import { connect } from "react-redux";
// import { Redirect } from "react-router-dom";
import { selectPage } from "../../redux/actions/index";

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
    // if (`/${this.props.selectedPage}` === window.location.pathname)
    // {
    //   setTimeout(() => { 
    //     this.props.selectPage(null); 
    //   }, 500); // Sets selectedPage to null half a second after the page loads
    // }
  }
  render() {
    // if (
    //   this.props.selectedPage === null ||
    //   `/${this.props.selectedPage}` === window.location.pathname
    // ) {
    return (
      <div className="col-sm-12">
        World Delete Page
      </div>
    );
    // } else  {
    //   return (
    //     <Redirect
    //       to={`/${this.props.selectedPage}`}
    //     />
    //   );
    // }
  }
}
const WorldDeletePage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default WorldDeletePage;
