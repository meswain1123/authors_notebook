
import React, { Component } from "react";
import "./assets/css/material-dashboard-react.css";
import {
  BrowserRouter as Router
} from "react-router-dom";
import { connect } from "react-redux";
import MainPage from "./views/MainPage";
import Grid from "@material-ui/core/Grid";
// import Box from "@material-ui/core/Box";
import { 
  // setWidth,
  // setAPI
} from "./redux/actions/index";
// import API from "./smartAPI";
import "./assets/css/quill.snow.css";

const mapStateToProps = (state: any) => {
  return {
    // menuOpen: state.app.menuOpen,
    // api: state.app.api
  };
};
function mapDispatchToProps(dispatch: any) {
  return {
    // setWidth: (width: any) => dispatch(setWidth(width)),
    // setAPI: (api: any) => dispatch(setAPI(api))
  };
}
interface IProps {
  // menuOpen: boolean;
  // api: any;
  // setWidth: (width: any) => void;
  // setAPI: (api: any) => void;
}

interface IState {
  version: string;
  width: number;
  innerWidth: number;
  marginLeft: number;
}
class AppLayout extends Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      version: "0",
      width: 0,
      innerWidth: 0,
      marginLeft: 220
    };
    // this.api = API.getInstance();
  }

  api: any;

  props: any;

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    // let w = window.innerWidth;
    // if (w >= 600) {
    //   w -= 200;
    //   this.props.setWidth(w);
    //   this.setState({ width: w, marginLeft: 220, innerWidth: window.innerWidth });
    // }
    // else {
      // this.props.setWidth(w);
    //   this.setState({ width: w, marginLeft: 0, innerWidth: window.innerWidth });
    // }
  }

  render() {
    // if (this.props.api === null) {
    //   this.props.setAPI(this.api);
    // }
    return (
      <Router>
        <Grid container>
          <Grid item xs={12}
            // style={{ 
            //   marginLeft: `${this.props.menuOpen ? this.state.marginLeft + 10 : 10}px`, 
            //   width: `${this.props.menuOpen ? this.state.width - 20 : this.state.innerWidth - 20}px`,
            //   marginRight: "10px",
            //   marginTop: "10px" 
            // }}
            >
            <MainPage />
          </Grid>
        </Grid>
      </Router>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(AppLayout);
export default App;

