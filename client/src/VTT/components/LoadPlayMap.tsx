
import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import {
  // FormControl,
  // OutlinedInput,
  // InputLabel,
  // FormHelperText,
  Button, Grid
} from "@material-ui/core";

import { PlayMap, Campaign } from "../models";

// import API from "../smartAPI";

// This lets the user select a PlayMap to use.

interface AppState {
  playMaps: PlayMap[] | null;
  selectedCampaign: Campaign;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  playMaps: state.app.playMaps,
  selectedCampaign: state.app.selectedCampaign
})

const mapDispatch = {
  // setMaps: (maps: Map[]) => ({ type: 'SET_MAPS', payload: maps }),
  // setPlayMaps: (playMaps: PlayMap[]) => ({ type: 'SET_PLAYMAPS', payload: playMaps }),
  // addPlayMap: (playMap: PlayMap) => ({ type: 'ADD_PLAYMAP', payload: playMap })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  selectPlayMap: (playMap: PlayMap) => void;
  mode: string;
}

export interface ILoadPlayMapStateType {
  selectedMap: PlayMap | null;
}

class LoadPlayMap extends Component<
  Props,
  ILoadPlayMapStateType
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedMap: null
    };
    // this.api = API.getInstance();
  }

  // api: any;

  componentDidMount() {}

  // renderHeader = () => {
  //   return (
  //     <div key="header"> 
  //       Select a Map
  //     </div>
  //   );
  // };

  selectPlayMap = (map: PlayMap) => {
    this.setState({
      selectedMap: map
    });
  };

  loadPlayMap = () => {
    if (this.state.selectedMap !== null) {
      this.props.selectPlayMap(this.state.selectedMap);
    }
  }

  renderMain = () => {
    if (this.props.playMaps === null) {
      return (<div key="main">I'm invisible</div>);
    } else {
      return (
        <Grid key="main" style={{ margin: 4 }} container spacing={1} direction="column">
          <Grid item 
            style={{ 
              height: (window.innerHeight - 200),
              overflowY: "scroll"
            }}
            container spacing={1} direction="row">
            { this.renderMapList() }
            { this.renderSelectedMap() }
          </Grid>
          <Grid item>
            <Button disabled={ this.state.selectedMap === null } 
              onClick={this.loadPlayMap} 
              variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      );
    }
  };

  renderMapList = () => {
    if (this.props.playMaps !== null) {
      return (
        <Grid item xs={6} 
          container spacing={1} direction="column">
          Select a Map
          {this.props.playMaps.filter(m => m.campaignID === this.props.selectedCampaign._id).map((map, key) => {
            return (
              <Grid item key={key} 
                onClick={() => {
                  this.selectPlayMap(map);
                }}
                style={{
                  backgroundColor: (this.state.selectedMap && this.state.selectedMap._id === map._id ? "blue" : "transparent"),
                  color: (this.state.selectedMap && this.state.selectedMap._id === map._id ? "white" : "black"),
                  cursor: "pointer"
                }}>
                {map.name}
              </Grid>
            );
          })}
        </Grid>
        );
    } else {
      return (<Grid item xs={6}>{"I'm invisible!"}</Grid>);
    }
  };

  renderSelectedMap = () => {
    if (this.state.selectedMap !== null && this.props.mode === "DM") {
      return (
        <Grid item xs={6} container spacing={1} direction="column">
          <Grid item>
            Grid Width: {this.state.selectedMap.map.gridWidth}
          </Grid>
          <Grid item>
            Grid Height: {this.state.selectedMap.map.gridHeight}
          </Grid>  
          <Grid item>
            <img 
              style={{ width: "100%" }} 
              src={this.state.selectedMap.map.file} 
              alt="testing" />
          </Grid>
        </Grid>
      );
    } else {
      return (<Grid item xs={6}></Grid>);
    }
  };

  render() {
    return [
      // this.renderHeader(),
      this.renderMain()
    ];
  }
}

export default connector(LoadPlayMap);
