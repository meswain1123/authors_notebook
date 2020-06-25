import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { 
  Route, 
  Switch } from "react-router-dom";
  import { connect } from "react-redux";
import HomePage from "./Home";
import GeneralDiscussionPage from "./Discussion/GeneralDiscussion";
import ProfilePage from "./User/Profile";
// import UserEditPage from "./User/Edit";
import WorldDetailsPage from "./World/Details";
import WorldEditPage from "./World/Edit";
import CollaboratePage from "./World/Collaborate";
import EditCollaboratorsPage from "./World/EditCollaborators";
// import WorldDeletePage from "./World/Delete";
import TypeDetailsPage from "./Type/Details";
import TypeEditPage from "./Type/Edit";
// import TypeDeletePage from "./Type/Delete";
import ThingDetailsPage from "./Thing/Details";
import ThingEditPage from "./Thing/Edit";
import ResetPasswordPage from "./User/ResetPassword";
import ConfirmEmailPage from "./User/ConfirmEmail";
// import ThingDeletePage from "./Thing/Delete";
import Grid from "@material-ui/core/Grid";
import LoginControl from './User/LoginControl';
import {
  toggleLogin
} from "../redux/actions/index";


const mapStateToProps = state => {
  return {
    loginOpen: state.app.loginOpen
  };
};
function mapDispatchToProps(dispatch) {
  return {
    toggleLogin: () => dispatch(toggleLogin({}))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "0"
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <Grid item xs={12} container spacing={0} direction="column">
        <Grid item className="h-100 margined">
          { this.props.loginOpen ?
            <LoginControl onLogin={_ => { 
              this.props.toggleLogin();
            }}/>
          :
            <Switch>
              {/* <Route exact path="/Template" component={TemplatePage} /> */}
              <Route exact path="/" component={HomePage} />
              <Route exact path="/home" component={HomePage} />
              <Route exact path="/User/Profile" component={ProfilePage} />
              <Route exact path="/User/resetPassword/:id" component={ResetPasswordPage} />
              <Route exact path="/User/confirmEmail/:id" component={ConfirmEmailPage} />
              {/* <Route exact path="/profile" component={UserEditPage} /> */}
              
              {/* <Route exact path="/test/:testtext" component={Test} /> */}
              <Route exact path="/discussion" component={GeneralDiscussionPage} />
              <Route exact path="/project/details/:id" component={WorldDetailsPage} />
              <Route exact path="/project/create" component={WorldEditPage} />
              <Route exact path="/project/edit/:id" component={WorldEditPage} />
              <Route exact path="/project/collaborators/:id" component={EditCollaboratorsPage} />
              <Route exact path="/project/collaborate/:worldID/:collabID" component={CollaboratePage} />
              {/* <Route exact path="/project/delete/:id" component={WorldDeletePage} /> */}
              <Route exact path="/type/create" component={TypeEditPage} />
              <Route exact path="/type/details/:id" component={TypeDetailsPage} />
              <Route exact path="/type/edit/:id" component={TypeEditPage} />
              {/* <Route exact path="/type/delete/:id" component={TypeDeletePage} /> */}
              <Route exact path="/thing/create" component={ThingEditPage} />
              <Route exact path="/thing/create/:id" component={ThingEditPage} />
              <Route exact path="/thing/details/:id" component={ThingDetailsPage} />
              <Route exact path="/thing/edit/:id" component={ThingEditPage} />
              {/* <Route exact path="/thing/delete/:id" component={ThingDeletePage} /> */}
            </Switch>
          }
        </Grid>
        <Grid item style={{ minHeight: "100px" }}>&nbsp;</Grid>
      </Grid>
    );
  }
}

const MainPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default MainPage;
