import React, { Component } from "react";
import "../../App.css";
import logo from "../../logo.svg";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";
import Divider from "@material-ui/core/Divider";
import { NavLink } from "react-router-dom";
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
    user: state.app.user
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
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    this.api.getPublicWorlds().then(res => {
      this.props.setPublicWorlds(res.worlds);
    });
    if (this.props.user !== null) {
      this.api.getWorldsForUser(this.props.user._id).then(res => {
        if (res.worlds !== undefined)
          this.props.setWorlds(res.worlds);
      });
    }
  }

  links() {
    return (
      <div>
        {menuRoutes.map((prop, key) => {
          return (
            <ListItem key={key}>
              <Button 
                fullWidth variant="contained" color="primary" 
                href={prop.path}>
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
      <NavLink
        to={`/`} className="blue blackFont"
        activeClassName="active"
      >
        <ListItem button className="curvedButton">
          <img src={logo} alt="logo" className="App-logo" />
          <ListItemText primary={this.props.logoText} />
        </ListItem>
      </NavLink>
    );
  }

  publicWorlds() {
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
    return (
      <div>
        <ListItem>
          <ListItemText display="none" primary={"Public Worlds"} />
        </ListItem>
        {worldLinks}
      </div>
      );
  }

  myWorlds() {
    if (this.props.user === null || this.props.user === undefined) {
      return "";
    }
    else {
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
          {worldLinks}
        </div>
      );
    }
  }

  render() {
    return (
      <List className="Sidebar">
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
