import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { NavLink } from "react-router-dom";
// import { BrowserRouter as Router, Route, Redirect, Link, Switch } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPage,
  setWorlds,
  setPublicWorlds,
  loadFromStorage,
  toggleMenu
} from "../../redux/actions/index";
// import Cookies from "universal-cookie";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import API from "../../api";

const mapStateToProps = state => {
  return {
    selectedPage: state.app.selectedPage,
    user: state.session.user,
    selectedWorld: state.app.selectedWorld,
    mobileMenuOpen: !state.app.menuOpen // This defaults to closed instead of open
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds)),
    loadFromStorage: () => dispatch(loadFromStorage({})),
    toggleMenu: () => dispatch(toggleMenu({}))
  };
}
class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.api = API.getInstance();
  }

  componentDidMount() {
    this.props.loadFromStorage();
  }

  menuClick = () => {
    this.props.toggleMenu();
  }

  render() {
    return (
      <AppBar position="static">
        <Toolbar>
          <Grid container spacing={0}>
            <Grid item xs>
              <IconButton
                style={{ color: "white" }}
                aria-label="Menu"
                onClick={this.menuClick}
              >
                <MenuIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <ListItem className="curvedButton">
                <ListItemText
                  primary={
                    this.props.selectedWorld === null
                      ? "Welcome!"
                      : this.props.selectedWorld.Name
                  }
                />
              </ListItem>
            </Grid>
            <Grid item xs>
              <NavLink
                className="float-right blue whiteFont"
                to="/User/Login"
                activeClassName="active"
              >
                <ListItem className="curvedButton float-right">
                  <Icon>person</Icon>
                  <ListItemText
                    primary={
                      this.props.user === null ||
                      this.props.user.firstName === undefined
                        ? " Login/Register"
                        : ` ${this.props.user.firstName} ${this.props.user.lastName}`
                    }
                  />
                </ListItem>
              </NavLink>
            </Grid>
          </Grid>
        </Toolbar>
        <Box display={this.props.mobileMenuOpen ? 'inline' : 'none'}>
          <Box display={{ xs: 'inline', sm: 'none' }}>
            Mobile Menu
          </Box>
        </Box>
      </AppBar>
      // <div className="row">
      //   <AppBar position="static">
      //     <Toolbar className="Wide12 blackFont">
      //       <div className="col-sm-3">
      //         <Typography color="inherit">{ this.props.selectedWorld === null ? "Welcome!" : this.props.selectedWorld.Name }</Typography>
      //       </div>
      //       <div className="col-sm-9">

      //         <NavLink className="float-right blue blackFont"
      //           to="/User/Login"
      //           activeClassName="active">
      //           <ListItem className="curvedButton">
      //             <Icon>person</Icon><ListItemText primary={ this.props.user === null ? " Login/Register" : ` ${this.props.user.firstName} ${this.props.user.lastName}` } />
      //           </ListItem>
      //         </NavLink>
      //       </div>
      //     </Toolbar>
      //   </AppBar>
      // </div>
    );
  }
}

const NavBar = connect(mapStateToProps, mapDispatchToProps)(Bar);
export default NavBar;
