import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import {
  setWorlds,
  loadFromStorage,
  toggleMenu
} from "../../redux/actions/index";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import API from "../../api";
import MobileMenu from "./MobileMenu";

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
                      this.props.user.username === undefined
                        ? " Login/Register"
                        : ` ${this.props.user.username}`
                    }
                  />
                </ListItem>
              </NavLink>
            </Grid>
          </Grid>
        </Toolbar>
        {this.props.mobileMenuOpen ? 
          <Box display={{ xs: 'inline', sm: 'none' }}>
            <MobileMenu />
          </Box>
        : "" }
      </AppBar>
    );
  }
}

const NavBar = connect(mapStateToProps, mapDispatchToProps)(Bar);
export default NavBar;
