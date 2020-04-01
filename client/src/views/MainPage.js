import React, { Component } from "react";
import { 
  Route, 
  Switch } from "react-router-dom";
import { connect } from "react-redux";
import HomePage from "./Home";
import ForumMenuPage from "./Forum/ForumMenu";
import LoginPage from "./User/Login";
import UserEditPage from "./User/Edit";
import WorldDetailsPage from "./World/Details";
import WorldEditPage from "./World/Edit";
import CollaboratePage from "./World/Collaborate";
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
      <Grid item xs={12} className="h-100 margined">
        <Switch>
          {/* <Route exact path="/Template" component={TemplatePage} /> */}
          <Route exact path="/" component={HomePage} />
          <Route exact path="/home" component={HomePage} />
          <Route exact path="/User/Login" component={LoginPage} />
          <Route exact path="/User/resetPassword/:id" component={ResetPasswordPage} />
          <Route exact path="/User/confirmEmail/:id" component={ConfirmEmailPage} />
          <Route exact path="/profile" component={UserEditPage} />
          
          {/* <Route exact path="/test/:testtext" component={Test} /> */}
          <Route exact path="/forums" component={ForumMenuPage} />
          <Route exact path="/world/details/:id" component={WorldDetailsPage} />
          <Route exact path="/world/create" component={WorldEditPage} />
          <Route exact path="/world/edit/:id" component={WorldEditPage} />
          <Route exact path="/world/collaborate/:worldID/:collabID" component={CollaboratePage} />
          {/* <Route exact path="/world/delete/:id" component={WorldDeletePage} /> */}
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
      </Grid>
    );
  }
}

const MainPage = connect()(Page);
export default MainPage;
