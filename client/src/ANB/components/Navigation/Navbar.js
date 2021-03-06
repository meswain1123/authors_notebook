import React, { Component } from "react";
import {
  AppBar, Toolbar, ListItem, 
  ListItemText, 
  // Icon, 
  IconButton, 
  // Button
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import PersonIcon from '@material-ui/icons/Person';
// import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  setWorlds,
  loadFromStorage,
  toggleMenu,
  toggleLogin,
  logout,
  redirectTo
} from "../../redux/actions/index";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import API from "../../smartAPI";
import MobileMenu from "./MobileMenu";
import UserMenu from "./UserMenu";

const mapStateToProps = state => {
  return {
    selectedPage: state.app.selectedPage,
    user: state.app.user,
    selectedWorld: state.app.selectedWorld,
    mobileMenuOpen: !state.app.menuOpen // This defaults to closed instead of open
  };
};
function mapDispatchToProps(dispatch) {
  return {
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    loadFromStorage: () => dispatch(loadFromStorage({})),
    toggleMenu: () => dispatch(toggleMenu({})),
    toggleLogin: () => dispatch(toggleLogin({})),
    logout: () => dispatch(logout({})),
    redirectTo: page => dispatch(redirectTo(page))
  };
}
class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    this.props.loadFromStorage();
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
                onClick={_ => {
                  this.props.toggleMenu();
                }}
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
              { this.props.user === null || this.props.user.username === undefined ? 
                <span style={{cursor: "pointer"}} 
                  onClick={_ => {
                    this.props.toggleLogin();
                  }}
                  className="float-right blue whiteFont">
                  <ListItem className="curvedButton float-right">
                    <PersonIcon/>
                    <ListItemText primary=" Login/Register"/>
                  </ListItem>
                </span>
              : 
                <UserMenu 
                  username={this.props.user.username}
                  onLogout={_ => {
                    this.api.logout().then(_ => {
                      this.props.logout();
                    });
                  }}
                />
              }
            </Grid>
          </Grid>
        </Toolbar>
        {this.props.mobileMenuOpen &&
          <Box display={{ xs: 'inline', sm: 'none' }}>
            <MobileMenu />
          </Box>
        }
      </AppBar>
    );
  }
}

const NavBar = connect(mapStateToProps, mapDispatchToProps)(Bar);
export default NavBar;
