import React, { Component } from "react";
// import logo from "./logo.svg";
import "./assets/css/material-dashboard-react.css";
// import Login from "./components/User/Login";
import {
  BrowserRouter as Router,
  // Route,
  // Redirect,
  // Link,
  // Switch
} from "react-router-dom";
import { connect } from "react-redux";
// import { selectPage } from "./redux/actions/index";
// import MainMenu from "./components/Navigation/MainMenu";
import NavBar from "./components/Navigation/Navbar";
import Sidebar from "./components/Navigation/Sidebar";
import MainPage from "./views/MainPage";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
// import Container from '@material-ui/core/Container';

const mapStateToProps = state => {
  return {
    menuOpen: state.app.menuOpen
  };
};
class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      version: "0",
      width: 0,
      marginLeft: 220
    };
    // this.api = API.getInstance();
  }

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    console.log(window.innerWidth);
    let w = window.innerWidth;
    if (w >= 600) {
      w -= 200;
      this.setState({ width: w, marginLeft: 220, innerWidth: window.innerWidth });
    }
    else {
      this.setState({ width: w, marginLeft: 0, innerWidth: window.innerWidth });
    }
    // if(window.innerWidth < 500) {
    //   this.setState({ width: 450, height: 102 });
    // } else {
    //   let update_width  = window.innerWidth-100;
    //   let update_height = Math.round(update_width/4.4);
    //   this.setState({ width: update_width, height: update_height });
    // }
  }

  render() {
    return (
      <Router>
        {/* <div className="row h-100">
          <Sidebar logoText={"Author's Notebook"} />
          <div className="col-sm-9">
            <NavBar />
            <MainPage />
          </div>
        </div> */}
        {/* <Grid container spacing={0} className="h-100">
          <Grid item sm={4} md={3}>
            <Box display={{ xs: 'none', sm: 'inline' }} className="w-200 h-100">
              <Sidebar className="w-200" logoText={"Author's Notebook"} />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={9}>
            <NavBar />
            <MainPage />
          </Grid>
        </Grid> */}
        <Box display={this.props.menuOpen ? 'inline' : 'none'}>
          <Box display={{ xs: 'none', sm: 'inline' }} className="Sidebar">
            <Sidebar className="" logoText={"Author's Notebook"} />
          </Box>
        </Box>
        {/* <Box display="inline" 
          style={{ 
            marginLeft: this.state.marginLeft, 
            width: this.state.width 
          }} 
          className="main">
          <NavBar />
          <MainPage />
        </Box> */}
        <Grid container>
          <Grid item xs={12}
            style={{ 
              marginLeft: `${this.props.menuOpen ? this.state.marginLeft : 0}px`, 
              width: `${this.props.menuOpen ? this.state.width : this.state.innerWidth}px` 
            }}>
            <NavBar />
          </Grid>
          <Grid item xs={12}
            style={{ 
              marginLeft: `${this.props.menuOpen ? this.state.marginLeft + 10 : 10}px`, 
              width: `${this.props.menuOpen ? this.state.width - 20 : this.state.innerWidth - 20}px`,
              marginRight: "10px",
              marginTop: "10px" 
            }}>
            <MainPage />
          </Grid>
        </Grid>
      </Router>
    );
  }
}

const App = connect(mapStateToProps)(AppLayout);
export default App;
