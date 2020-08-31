import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { 
  Edit, Delete, People
} from "@material-ui/icons";
import {
  List, ListItem, 
  Grid, Button, 
  Modal, Tooltip,
  Fab, Box
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Helmet } from 'react-helmet';
import TemplateModal from "../../components/Modals/TemplateModal";
// import TemplatesModal from "../../components/Modals/TemplatesModal";
import ImportTemplatesControl from "../../components/WorldTemplateControls/ImportTemplatesControl";
import ImportingTemplatesControl from "../../components/WorldTemplateControls/ImportingTemplatesControl";
import CommentsControl from "../../components/Inputs/CommentsControl";

const mapStateToProps = state => {
  return {
    // selectedPage: state.app.selectedPage,
    // selectedWorld: state.app.selectedWorld,
    // selectedWorldID: state.app.selectedWorldID,
    // worlds: state.app.worlds,
    // publicWorlds: state.app.publicWorlds,
    // types: state.app.types,
    // things: state.app.things,
    // user: state.app.user,
    // attributesByID: state.app.attributesByID,
    // attributesByName: state.app.attributesByName,
    // fromLogin: state.app.fromLogin,
    // templates: state.app.templates,
    // allUsers: state.app.allUsers,
    // typeSuggestions: state.app.typeSuggestions,
    // thingSuggestions: state.app.thingSuggestions,
    // // views: state.app.views
  };
};
function mapDispatchToProps(dispatch) {
  return {
    // selectWorld: worldID => dispatch(selectWorld(worldID)),
    // setTypes: types => dispatch(setTypes(types)),
    // setThings: things => dispatch(setThings(things)),
    // setWorlds: worlds => dispatch(setWorlds(worlds)),
    // setTemplates: templates => dispatch(setTemplates(templates)),
    // setAllUsers: allUsers => dispatch(setAllUsers(allUsers)),
    // setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds)),
    // updatePublicWorldForCollab: world => dispatch(updatePublicWorldForCollab(world)),
    // setAttributes: attributes => dispatch(setAttributes(attributes)),
    // updateAttributes: attributes => dispatch(updateAttributes(attributes)),
    // notFromLogin: () => dispatch(notFromLogin({})),
    // toggleLogin: () => dispatch(toggleLogin({})),
    // // setViews: views => dispatch(setViews(views))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // world: null,
      // modalOpen: false,
      // redirectTo: null,
      // templateMode: false,
      // importMode: false,
      // selectedTemplateIDs: [],
      // // recentTypeChanges: [],
      // // recentThingChanges: [],
      // expandRecentChanges: true
    };
    // this.api = API.getInstance();
  }
  componentDidMount() {
  }

  render() {
    return (
      <div>
        I'm making my own super simple VTT.
        For now it will just use images that I will include in the project.
        It will let the user select an image as the background image,
        and add additional images as tokens.  
        The background images will have associated widths and heights.
        Tokens when added will be allowed to have sizes associated with
        them.  These sizes will be numeric, and represent how many squares
        wide the token is, and the default is 1.
        There will also be a fog of war/darkness effect which can be
        added and removed.
        I want to make it so there are two pages.  
        One for the DM, and one for the players.  The DM page has 
        controls, and the fog is translucent.  The player page it's 
        just display and the fog is opaque.  The player page would
        have to update in real time.
        I would also allow zooming in and out and panning, 
        controlled on the DM page.
        Both pages cause the header and sidebar to hide when the page is loaded.
      </div>
    );
  }
}
const WorldDetailsPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default WorldDetailsPage;
