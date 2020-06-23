import React, { Component } from "react";
import "../../App.css";
import {
  // Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Icon,
  FormControl,
  InputLabel,
  OutlinedInput,
  Fab,
  Tooltip
} from "@material-ui/core";
import { Add, Star, Search } from "@material-ui/icons";
import { NavLink } from "react-router-dom";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import { connect } from "react-redux";
import menuRoutes from "./routes";
import {
  setWorlds,
  setPublicWorlds,
  setTemplates,
  setAllUsers,
  setFollowingWorlds,
  toggleMenu,
  logout,
  // toggleLogin
} from "../../redux/actions/index";
import API from "../../smartAPI";

const mapStateToProps = state => {
  return {
    selectedPage: state.app.selectedPage,
    worlds: state.app.worlds,
    publicWorlds: state.app.publicWorlds,
    user: state.app.user,
    followingWorlds: state.app.followingWorlds,
    width: state.app.width
  };
};
function mapDispatchToProps(dispatch) {
  return {
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds)),
    setTemplates: templates => dispatch(setTemplates(templates)),
    setAllUsers: allUsers => dispatch(setAllUsers(allUsers)),
    setFollowingWorlds: worldIDs => dispatch(setFollowingWorlds(worldIDs)),
    toggleMenu: () => dispatch(toggleMenu({})),
    // toggleLogin: () => dispatch(toggleLogin({}))
    logout: () => dispatch(logout({}))
  };
}
class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      browse: false,
      Filter: ""
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    this.api.getWorlds(true).then(res => {
      this.props.setPublicWorlds(res.publicWorlds.worlds);
      this.props.setTemplates(res.templates.templates);
      this.props.setAllUsers(res.allUsers);
      
      if (this.props.user !== null) {
        if (res.userWorlds.worlds === undefined) {
          this.props.logout();
        } else {
          this.props.setWorlds(res.userWorlds.worlds);
        }
      }
    });
    // this.api.getPublicWorlds().then(res => {
    //   this.props.setPublicWorlds(res.worlds);
    // });
    // if (this.props.user !== null) {
    //   this.api.getWorldsForUser().then(res => {
    //     if (res.worlds !== undefined) {
    //       this.props.setWorlds(res.worlds);
    //     }
    //     else {
    //       // User's login is no longer valid.
    //       this.props.logout();
    //     }
    //   });
    // }
  }

  links() {
    return (
      <div>
        {menuRoutes.map((prop, key) => (
          <ListItem key={key} className="curvedButton">
            <NavLink
              to={prop.path}
              onClick={_ => {
                this.props.toggleMenu();
              }}
              style={{
                width: `${this.props.width}px`
              }}
              className="MyButton"
              activeClassName="active"
            >
              <ListItem button>
                {typeof prop.icon === "string" ? (
                  <Icon className="marginLeft">{prop.icon}</Icon>
                ) : (
                  <prop.icon className="marginLeft" />
                )}
                &nbsp;
                <ListItemText primary={prop.name} className="marginLeft" />
              </ListItem>
            </NavLink>
          </ListItem>
        ))}
      </div>
    );
  }

  toggleFollow = (worldID, follow) => {
    let followingWorlds = [...this.props.followingWorlds];
    if (follow) {
      followingWorlds.push(worldID);
    } else {
      const index = followingWorlds.indexOf(worldID);
      followingWorlds.splice(index, 1);
    }
    if (this.props.user !== null) {
      const user = { ...this.props.user };
      user.followingWorlds = followingWorlds;
      this.props.setFollowingWorlds(followingWorlds);
      this.api.updateUser(user);
    } else {
      this.props.setFollowingWorlds(followingWorlds);
    }
  };

  handleUserInput = e => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState({ [name]: value });
  };

  publicWorlds() {
    const followingWorlds = [];
    const otherWorlds = [];
    if (
      this.props.publicWorlds !== undefined &&
      this.props.publicWorlds !== null &&
      this.props.publicWorlds.error === undefined
    ) {
      this.props.publicWorlds.forEach(w => {
        if (this.state.browse) {
          if (
            this.state.Filter === "" ||
            w.Name.toLowerCase().includes(this.state.Filter.toLowerCase())
          ) {
            if (this.props.followingWorlds.includes(w._id)) {
              followingWorlds.push(w);
            } else {
              otherWorlds.push(w);
            }
          }
        } else if (this.props.followingWorlds.includes(w._id)) {
          followingWorlds.push(w);
        }
      });
    }
    if (this.state.browse) {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="filter">Filter</InputLabel>
              <OutlinedInput
                id="filter"
                name="Filter"
                type="text"
                autoComplete="Off"
                value={this.state.Filter}
                onChange={this.handleUserInput}
                labelWidth={43}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item>
            <List>
              {followingWorlds.map((w, key) => (
                <ListItem key={key} className="curvedButton">
                  <NavLink
                    to={`/world/details/${w._id}`}
                    onClick={_ => {
                      this.props.toggleMenu();
                    }}
                    style={{
                      width: `${this.props.width - 80}px`
                    }}
                    className="MySmallerButton"
                    activeClassName="active"
                  >
                    <ListItem button>
                      <ListItemText primary={w.Name} className="marginLeft" />
                    </ListItem>
                  </NavLink>
                  <Fab
                    size="small"
                    color="primary"
                    onClick={e => {
                      this.toggleFollow(w._id, false);
                    }}
                  >
                    <Star />
                  </Fab>
                </ListItem>
              ))}
              {otherWorlds.map((w, key) => (
                <ListItem key={key} className="curvedButton">
                  <NavLink
                    to={`/world/details/${w._id}`}
                    onClick={_ => {
                      this.props.toggleMenu();
                    }}
                    style={{
                      width: `${this.props.width - 80}px`
                    }}
                    className="MySmallerButton"
                    activeClassName="active"
                  >
                    <ListItem button>
                      <ListItemText primary={w.Name} className="marginLeft" />
                    </ListItem>
                  </NavLink>
                  <Fab
                    size="small"
                    color="primary"
                    onClick={e => {
                      this.toggleFollow(w._id, true);
                    }}
                  >
                    <StarBorderIcon />
                  </Fab>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      );
    }
    return followingWorlds.map((w, key) => (
      <ListItem key={key} className="curvedButton">
        <NavLink
          to={`/world/details/${w._id}`}
          onClick={_ => {
            this.props.toggleMenu();
          }}
          style={{
            width: `${this.props.width}px`
          }}
          className="MyButton"
          activeClassName="active"
        >
          <ListItem button>
            <ListItemText primary={w.Name} className="marginLeft" />
          </ListItem>
        </NavLink>
      </ListItem>
    ));
  }

  myWorlds() {
    if (this.props.user === null || this.props.user === undefined) {
      return "";
    } else {
      const worldLinks =
        this.props.worlds === undefined
          ? ""
          : this.props.worlds.map((w, key) => (
              <ListItem key={key} className="curvedButton">
                <NavLink
                  to={`/world/details/${w._id}`}
                  onClick={_ => {
                    this.props.toggleMenu();
                  }}
                  style={{
                    width: `${this.props.width}px`
                  }}
                  className="MyButton"
                  activeClassName="active"
                >
                  <ListItem button>
                    <ListItemText primary={w.Name} className="marginLeft" />
                  </ListItem>
                </NavLink>
              </ListItem>
            ));
      return worldLinks;
    }
  }

  render() {
    return (
      <List>
        {this.links()}
        <ListItem>
          <ListItemText display="none" primary={"Public Worlds"} />
          <Tooltip title={`Browse Public Worlds`}>
            <Fab
              size="small"
              color="primary"
              onClick={e => {
                this.setState({ browse: !this.state.browse });
              }}
            >
              <Search />
            </Fab>
          </Tooltip>
        </ListItem>
        {this.publicWorlds()}
        { this.props.user !== null &&
          <ListItem>
            <ListItemText primary={"My Worlds"} />
          </ListItem>
        }
        { this.props.user !== null &&
          <ListItem className="curvedButton">
            <NavLink 
            to={`/world/create`}
            onClick={_ => {
              this.props.toggleMenu();
            }}
            style={{
              width: `${this.props.width}px`
            }} 
            className="MyButton" 
            activeClassName="active">
              <ListItem button>
                <Add />
                <ListItemText primary={"Create New"} />
              </ListItem>
            </NavLink>
          </ListItem>
        }
        {this.myWorlds()}
      </List>
    );
  }
}

const MobileMenu = connect(mapStateToProps, mapDispatchToProps)(Menu);
export default MobileMenu;
