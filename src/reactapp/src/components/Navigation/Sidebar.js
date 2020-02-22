import React, { Component } from "react";
import "../../App.css";
import logo from "../../logo.svg";
// import Drawer from "@material-ui/core/Drawer";
// import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import Divider from "@material-ui/core/Divider";
import { NavLink } from "react-router-dom";
// import Grid from "@material-ui/core/Grid";
// import {
//   BrowserRouter as Router,
//   Route,
//   Redirect,
//   Link,
//   Switch
// } from "react-router-dom";
import { connect } from "react-redux";
import menuRoutes from "./routes";
import { 
  selectPage, setWorlds, setPublicWorlds 
} from "../../redux/actions/index";
import API from "../../api";


const mapStateToProps = state => {
  return { 
    selectedPage: state.app.selectedPage,
    worlds: state.app.worlds,
    publicWorlds: state.app.publicWorlds,
    user: state.session.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds))
  };
}
class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // left: false,
      // right: false,
      // top: false,
      // bottom: false
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    // console.log(this.props);
    this.api.getPublicWorlds().then(res => {
      // console.log(res);
      this.props.setPublicWorlds(res.worlds);
    });
    this.api.getWorldsForUser().then(res => {
      // console.log(res);
      if (res.worlds !== undefined)
        this.props.setWorlds(res.worlds);
    });
  }

  linkClick(name) {
    // this.props.selectPage(name);
  }

  links() {
    return (
      <div>
        {menuRoutes.map((prop, key) => {
          return (
            <ListItem key={key}>
              <Button 
                fullWidth variant="contained" color="primary" 
                href={`/world/details/${prop._id}`}>
                {typeof prop.icon === "string" ? (
                  <Icon className="marginLeft">{prop.icon}</Icon>
                ) : (
                  <prop.icon className="marginLeft" />
                )}
                &nbsp;<ListItemText primary={prop.name} className="marginLeft" />
              </Button>
            </ListItem>
          );
        })}
      </div>
    );
  }

  brand() {
    return (
      // <div className="sidebarHeader">
      //   <img src={logo} alt="logo" className="App-logo" />
      //   {this.props.logoText}
      // </div>
      <NavLink
        to={`/`} className="blue blackFont"
        activeClassName="active"
        onClick={() => {this.linkClick("Home")}}
      >
        <ListItem button className="curvedButton">
          <img src={logo} alt="logo" className="App-logo" />
          <ListItemText primary={this.props.logoText} />
        </ListItem>
      </NavLink>
    );
  }

  publicWorlds() {
    // console.log(this.props);
    const worldLinks = (this.props.publicWorlds === undefined || this.props.publicWorlds === null || this.props.publicWorlds.message !== undefined ? "" : this.props.publicWorlds.map((prop, key) => {
      return (
        <ListItem key={key}>
          <Button 
            fullWidth variant="contained" color="primary" 
            href={`/world/details/${prop._id}`}>
            <ListItemText primary={prop.Name} />
          </Button>
        </ListItem>
      );
    }));
    return (<div>{worldLinks}</div>);
  }

  worlds() {
    const worldLinks = (this.props.worlds === undefined ? "" : this.props.worlds.map((prop, key) => {
      return (
        <ListItem key={key}>
          <Button 
            fullWidth variant="contained" color="primary" 
            href={`/world/details/${prop._id}`}>
            <ListItemText primary={prop.Name} />
          </Button>
        </ListItem>
      );
    }));
    return (<div>{worldLinks}</div>);
  }

  myWorlds() {
    if (this.props.user === null || this.props.user === undefined) {
      return "";
    }
    else {
      return (
        <div>
          <ListItem>
            <ListItemText primary={"My Worlds"} />
          </ListItem>
          <ListItem>
            <Button 
              fullWidth variant="contained" color="primary" 
              href={`/world/create`}>
              <Add/><ListItemText primary={"Create New"} />
            </Button>
          </ListItem>
          {this.worlds()}
        </div>
      );
    }
  }

  render() {
    return (
      // <Grid container spacing={0} className="Sidebar">
      //   <Grid item xs>
          <List className="Sidebar">
            {this.brand()}
            <Divider light />
            {this.links()}
            <ListItem>
              <ListItemText display="none" primary={"Public Worlds"} />
            </ListItem>
            {this.publicWorlds()}
            {this.myWorlds()}
          </List>
      //   </Grid>
      // </Grid>
      // <Grid container spacing={0} className="Sidebar">
      //   <Grid item xs>
      //     <List>
      //       {this.brand()}
      //       <Divider light />
      //       {this.links()}
      //       <ListItem>
      //         <ListItemText display="none" primary={"Public Worlds"} />
      //       </ListItem>
      //       {this.publicWorlds()}
      //       {this.myWorlds()}
      //     </List>
      //   </Grid>
      // </Grid>
      // <div className="Sidebar col-sm-3">
      //   <List>
      //     {this.brand()}
      //     <Divider light />
      //     {this.links()}
      //     <ListItem>
      //       <ListItemText primary={"Public Worlds"} />
      //     </ListItem>
      //     {this.publicWorlds()}
      //     {this.myWorlds()}
      //   </List>
      // </div>
    );
  }
}

// export default Sidebar;
const Sidebar = connect(mapStateToProps, mapDispatchToProps)(Bar);
// const Sidebar = connect()(Bar);
export default Sidebar;
