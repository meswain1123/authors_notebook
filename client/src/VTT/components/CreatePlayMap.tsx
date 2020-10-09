
import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux';
import {
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  Button, Grid, Select, MenuItem
} from "@material-ui/core";
// import {
//   // notFromLogin
// } from "../redux/actions/index";
import { Campaign, PlayMap, Map } from "../models";
import API from "../smartAPI";

// This lets the user select a Map and use it to create a new
// PlayMap.


interface AppState {
  maps: Map[] | null;
  selectedCampaign: Campaign | null;
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  maps: state.app.maps,
  selectedCampaign: state.app.selectedCampaign
})

const mapDispatch = {
  // setMaps: (maps: Map[]) => ({ type: 'SET_MAPS', payload: maps }),
  // setPlayMaps: (playMaps: PlayMap[]) => ({ type: 'SET_PLAYMAPS', payload: playMaps }),
  addPlayMap: (playMap: PlayMap) => ({ type: 'ADD_PLAYMAP', payload: playMap })
}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
  selectPlayMap: (playMap: PlayMap) => void
}

export interface ICreatePlayMapStateType {
  name: string;
  selectedMap: Map | null;
  selectedCategory: string;
  categories: string[];
  error: string;
  processing: boolean;
}
// export interface ICreatePlayMapProps {
//   maps: Map[];
//   addPlayMap: (playMap: PlayMap) => void;
// }
class CreatePlayMap extends Component<
  Props,
  ICreatePlayMapStateType
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "",
      selectedCategory: "all",
      categories: [],
      selectedMap: null,
      error: "",
      processing: false
    };
    this.api = API.getInstance();
  }

  api: any;

  componentDidMount() {}

  renderHeader = () => {
    return (
      <div key="header"> 
        Select a Map and give the PlayMap a name.
      </div>
    );
  };

  selectMap = (map: Map) => {
    if (this.state.name === "") {
      const now = new Date();
      let month: string = (now.getMonth() + 1).toString();
      if (month.length === 1) {
        month = "0" + month;
      }
      let date: string = now.getDate().toString();
      if (date.length === 1) {
        date = "0" + date;
      }
      this.setState({
        selectedMap: map,
        name: `${map.name} ${now.getFullYear()}${month}${date}`
      });
    } else {
      this.setState({
        selectedMap: map
      });
    }
  };

  createPlayMap = () => {
    this.setState({
      processing: true
    }, () => {
      if (this.state.selectedMap && this.props.selectedCampaign) {
        const mapObj: any = {
          mapID: this.state.selectedMap._id, 
          campaignID: this.props.selectedCampaign._id,
          name: this.state.name,
          playTokens: [], 
          lightMasks: [],
          darkMasks: [],
          fogMasks: [],
          zoom: 1, 
          dx: 0, 
          dy: 0
        };

        this.api.createPlayMap(mapObj).then((res: any) => {
          if (res !== undefined && res.error === undefined && this.state.selectedMap && this.props.selectedCampaign) {
            const newPlayMap: PlayMap = new PlayMap(res.playMapID, this.props.selectedCampaign._id, this.state.name, this.state.selectedMap, [], null, [], [], [], 1, 0, 0);
            this.props.addPlayMap(newPlayMap);
            this.props.selectPlayMap(newPlayMap);
            this.setState({ processing: false });
            // const maps: Map[] = [];
            // res.maps.forEach((m: any) => {
            //   maps.push(new Map(m._id, m.name, m.fileName, m.gridWidth, m.gridHeight));
            // });
            // this.props.setMaps(maps);
          }
        });
      }
    });
  }

  onBlur = () => {
    this.setState(
      { name: this.state.name.trim() }, 
      () => {
        // Check to make sure the name isn't taken.  Low priority.    
      }
    );
  };

  changeCategory = (e: any) => {
    this.setState({ selectedCategory: e.target.value });
  }

  renderCategorySelect = () => {
    return (
      <FormControl variant="outlined">
        <InputLabel id="category">Category</InputLabel>
        <Select
          labelId="category"
          id="category"
          value={this.state.selectedCategory}
          onChange={this.changeCategory}
          label="Category"
        >
          { this.state.categories.map((c, key) => {
            return (<MenuItem key={key} value={c}>{c}</MenuItem>);
          })}
        </Select>
      </FormControl>
    );
  }

  renderMain = () => {
    if (this.props.maps === null) {
      return (<div key="main">I'm invisible</div>);
    } else {
      return (
        <Grid key="main" container spacing={1} direction="column">
          <Grid item>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="text_field_play_map_name">PlayMap Name</InputLabel>
                <OutlinedInput
                  id={`text_field_play_map_name`}
                  name={`text_field_play_map_name`}
                  type="text"
                  autoComplete="Off"
                  error={this.state.error !== ""}
                  value={this.state.name}
                  onChange={e => {
                    this.setState({ name: e.target.value });
                  }}
                  onBlur={() => {
                    this.onBlur();
                  }}
                  labelWidth={120}
                  fullWidth
                />
              <FormHelperText>
                {this.state.error}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item 
            style={{ 
              height: (window.innerHeight - 200),
              overflowY: "scroll"
            }}
            container spacing={1} direction="row">
            <Grid item xs={6} container spacing={1} direction="column">
              <Grid item>
                { this.renderCategorySelect() }
              </Grid>
              <Grid item>
                { this.renderMapList() }
              </Grid>
            </Grid>
            <Grid item xs={6}>
              { this.renderSelectedMap() }
            </Grid>
          </Grid>
          <Grid item>
            <Button disabled={ this.state.processing || this.state.selectedMap === null || this.state.name === "" } 
              onClick={this.createPlayMap} 
              variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      );
    }
  };

  renderMapList = () => {
    if (this.props.maps !== null) {
      return (
        <Grid item xs={6} 
          container spacing={1} direction="column">
          <Grid item>
            Select a Map
          </Grid>
          {this.props.maps.filter(m => this.state.selectedCategory === "all" || this.state.selectedCategory === m.category).map((map, key) => {
            return (
              <Grid item key={key} 
                onClick={() => {
                  this.selectMap(map);
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
    if (this.state.selectedMap !== null) {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            Grid Width: {this.state.selectedMap.gridWidth}
          </Grid>
          <Grid item>
            Grid Height: {this.state.selectedMap.gridHeight}
          </Grid>  
          <Grid item>
            <img 
              style={{ width: "100%" }} 
              src={this.state.selectedMap.file} 
              alt="testing" />
          </Grid>
        </Grid>
      );
    } else {
      return (<div></div>);
    }
  };

  render() {
    if (this.state.categories.length === 0 && this.props.maps) {
      const categories: string[] = [];
      categories.push("all");
      this.props.maps.forEach((m: Map) => {
        if (m.category && !categories.includes(m.category)){
          categories.push(m.category);
        }
      });
      this.setState({ categories });
    }
    return [
      this.renderHeader(),
      this.renderMain()
    ];
  }
}

export default connector(CreatePlayMap);
