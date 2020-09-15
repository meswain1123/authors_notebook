
import React, { Component } from "react";
import "./assets/css/material-dashboard-react.css";
import {
  BrowserRouter as Router
} from "react-router-dom";
import { connect, ConnectedProps } from "react-redux";
import NavBar from "./components/Navigation/Navbar";
import Sidebar from "./components/Navigation/Sidebar";
import MainPage from "./views/MainPage";
import { Grid, Box } from "@material-ui/core";
// import { 
//   setWidth,
//   setHeight,
//   setAPI
// } from "./redux/actions/index";
import API from "./smartAPI";
import "./assets/css/quill.snow.css";

interface AppState {
  menuOpen: boolean;
  api: any;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  menuOpen: state.app.menuOpen,
  api: state.app.api
})
const mapDispatch = {
  setWidth: (width: number) => ({ type: 'SET_WIDTH', payload: width }),
  setHeight: (height: number) => ({ type: 'SET_HEIGHT', payload: height }),
  setAPI: (api: any) => ({ type: 'SET_API', payload: api })
}
const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // playMap: PlayMap,
  // mode: string
}

export interface State {
  version: string,
  width: number,
  marginLeft: number,
  innerWidth: number | null
}
class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      version: "0",
      width: 0,
      marginLeft: 220, 
      innerWidth: null
    };
    this.api = API.getInstance();
  }

  api: any;

  componentDidMount() {
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions() {
    let w = window.innerWidth;
    this.props.setHeight(window.innerHeight);
    if (w >= 600) {
      w -= 200;
      this.props.setWidth(w);
      this.setState({ width: w, marginLeft: 220, innerWidth: window.innerWidth });
    }
    else {
      this.props.setWidth(w);
      this.setState({ width: w, marginLeft: 0, innerWidth: window.innerWidth });
    }
  }

  render() {
    if (this.props.api === null) {
      this.props.setAPI(this.api);
    }
    return (
      <Router>
        {this.props.menuOpen &&
          <Box display={{ xs: 'none', sm: 'inline' }} className="Sidebar">
            <Sidebar className="" logoText={"Author's Notebook"} />
          </Box>
        }
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
              width: `${this.props.menuOpen || !this.state.innerWidth ? this.state.width - 20 : this.state.innerWidth - 20}px`,
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

// const App = connect(mapStateToProps, mapDispatchToProps)(AppLayout);
// export default App;

export default connector(App);
