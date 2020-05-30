
import React, { Component } from "react";
import { connect } from "react-redux";
// import { Redirect } from "react-router-dom";
import {
  // selectWorld, setTypes, setThings, setWorlds, 
  // setPublicWorlds, 
  // updatePublicWorldForCollab,
  // setAttributes, 
  // setTemplates,
  // updateAttributes,
  notFromLogin,
  toggleLogin
} from "../../redux/actions/index";
import API from "../../smartAPI";
import { 
  Grid
} from "@material-ui/core";
import CommentsControl 
from "../../components/Inputs/CommentsControl";

const mapStateToProps = state => {
  return {
    // selectedPage: state.app.selectedPage,
    // selectedWorld: state.app.selectedWorld,
    // selectedWorldID: state.app.selectedWorldID,
    // worlds: state.app.worlds,
    publicWorlds: state.app.publicWorlds,
    // types: state.app.types,
    // things: state.app.things,
    user: state.app.user,
    // attributesByID: state.app.attributesByID,
    // attributesByName: state.app.attributesByName,
    fromLogin: state.app.fromLogin,
    templates: state.app.templates
  };
};
function mapDispatchToProps(dispatch) {
  return {
    // selectWorld: worldID => dispatch(selectWorld(worldID)),
    // setTypes: types => dispatch(setTypes(types)),
    // setThings: things => dispatch(setThings(things)),
    // setWorlds: worlds => dispatch(setWorlds(worlds)),
    // setTemplates: templates => dispatch(setTemplates(templates)),
    // setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds)),
    // updatePublicWorldForCollab: world => dispatch(updatePublicWorldForCollab(world)),
    // setAttributes: attributes => dispatch(setAttributes(attributes)),
    // updateAttributes: attributes => dispatch(updateAttributes(attributes)),
    notFromLogin: () => dispatch(notFromLogin({})),
    toggleLogin: () => dispatch(toggleLogin({}))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.api = API.getInstance();
  }
  componentDidMount() {
  }
  render() {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
    console.log(this.props);
    return (
      <Grid item xs={12} container spacing={0} direction="column">
        <Grid item>
          <h3>General Discussion Board</h3>
        </Grid>
        <Grid item>
          This is a place where anyone can discuss anything related to 
          writing in general, or to look for collaborators, or something
          to collaborate on.
        </Grid>
        <Grid item>
          I plan to add filtering capabilities in the future.
        </Grid>
        <Grid item>
          <CommentsControl 
            user={this.props.user} 
            object={{_id: "General"}}
            objectType="General"
            world={{_id: "General"}}
            api={this.api} 
            onChange={this.commentsChange}
          /> 
        </Grid>
      </Grid>
    );
  }
}
const GeneralDiscussionPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default GeneralDiscussionPage;
