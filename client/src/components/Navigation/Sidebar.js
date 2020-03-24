import React, { Component } from "react";
import "../../App.css";
// import logo from "../../logo.svg";
import logo from "../../assets/img/ANB.png";
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Icon,
  Divider,
  FormControl,
  InputLabel,
  OutlinedInput,
  Fab,
  Tooltip
} from "@material-ui/core";
import { Add, Star, Search } from "@material-ui/icons";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import menuRoutes from "./routes";
import {
  selectPage,
  setWorlds,
  setPublicWorlds,
  setFollowingWorlds
} from "../../redux/actions/index";
import API from "../../api";

const mapStateToProps = state => {
  return {
    selectedPage: state.app.selectedPage,
    worlds: state.app.worlds,
    publicWorlds: state.app.publicWorlds,
    user: state.app.user,
    followingWorlds: state.app.followingWorlds
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds)),
    setFollowingWorlds: worldIDs => dispatch(setFollowingWorlds(worldIDs))
  };
}
class Bar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      browse: false,
      Filter: ""
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    this.api.getPublicWorlds().then(res => {
      this.props.setPublicWorlds(res.worlds);
    });
    // These kinds of things can also be done in render,
    // but I prefer to put it here because it's only run once.
    // The downside is that it's run before props gets populated
    // so, it needs to be put into setTimeout to give the props
    // a chance to get populated.
    setTimeout(() => {
      if (this.props.user !== null) {
        this.api.getWorldsForUser().then(res => {
          if (res.worlds !== undefined) this.props.setWorlds(res.worlds);
        });
      }
    }, 500);
  }

  links() {
    return (
      <div>
        {menuRoutes.map((prop, key) => {
          return (
            <ListItem key={key}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                href={prop.path}
              >
                {typeof prop.icon === "string" ? (
                  <Icon className="marginLeft">{prop.icon}</Icon>
                ) : (
                  <prop.icon className="marginLeft" />
                )}
                &nbsp;
                <ListItemText primary={prop.name} className="marginLeft" />
              </Button>
            </ListItem>
          );
        })}
      </div>
    );
  }

  brand() {
    return (
      <NavLink to={`/`} className="blue blackFont" activeClassName="active">
        <ListItem button className="curvedButton">
          <img src={logo} alt="logo" className="App-logo" />
          <ListItemText primary={this.props.logoText} />
        </ListItem>
      </NavLink>
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
    if (this.props.publicWorlds !== undefined &&
      this.props.publicWorlds !== null &&
      this.props.publicWorlds.error === undefined) {
      this.props.publicWorlds.forEach(w => {
        if (this.state.browse) {
          if (this.state.Filter === "" || w.Name.toLowerCase().includes(this.state.Filter.toLowerCase())) {
            if (this.props.followingWorlds.includes(w._id)) {
              followingWorlds.push(w);
            }
            else {
              otherWorlds.push(w);
            }
          }
        } else if (this.props.followingWorlds.includes(w._id)) {
          followingWorlds.push(w);
        }
      });
    }
    return (
      <div>
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
        { this.state.browse ?
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
                {
                  followingWorlds.map((w, key) => {
                    return (
                      <ListItem key={key}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          href={`/world/details/${w._id}`}
                        >
                          <ListItemText primary={w.Name} />
                        </Button>
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
                    );
                  })
                }
                {
                  otherWorlds.map((w, key) => {
                    return (
                      <ListItem key={key}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          href={`/world/details/${w._id}`}
                        >
                          <ListItemText primary={w.Name} />
                        </Button>
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
                    );
                  })
                }
              </List>
            </Grid>
          </Grid> :
          <div>
            {
              followingWorlds.map((w, key) => {
                return (
                  <ListItem key={key}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      href={`/world/details/${w._id}`}
                    >
                      <ListItemText primary={w.Name} />
                    </Button>
                  </ListItem>
                );
              })
            }
          </div>
        }
      </div>
    );
  }

  myWorlds() {
    if (this.props.user === null || this.props.user === undefined) {
      return "";
    } else {
      const worldLinks =
        this.props.worlds === undefined
          ? ""
          : this.props.worlds.map((prop, key) => {
              return (
                <ListItem key={key}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    href={`/world/details/${prop._id}`}
                  >
                    <ListItemText primary={prop.Name} />
                  </Button>
                </ListItem>
              );
            });
      return (
        <div>
          <ListItem>
            <ListItemText primary={"My Worlds"} />
          </ListItem>
          <ListItem>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              href={`/world/create`}
            >
              <Add />
              <ListItemText primary={"Create New"} />
            </Button>
          </ListItem>
          {worldLinks}
        </div>
      );
    }
  }

  render() {
    return (
      <List>
        {this.brand()}
        <Divider light />
        {this.links()}
        {this.publicWorlds()}
        {this.myWorlds()}
      </List>
    );
  }
}

const Sidebar = connect(mapStateToProps, mapDispatchToProps)(Bar);
export default Sidebar;
