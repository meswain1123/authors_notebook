
import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import {
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  Button, Grid
} from "@material-ui/core";
import { Campaign } from "../models";
import API from "../smartAPI";

// This lets the user create a new campaign.


interface AppState {
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
})

const mapDispatch = {
  addCampaign: (playMap: Campaign) => ({ type: 'ADD_PLAYMAP', payload: playMap })
}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
  selectCampaign: (playMap: Campaign) => void
}

export interface ICreateCampaignStateType {
  name: string;
  error: string;
  processing: boolean;
}
// export interface ICreateCampaignProps {
//   maps: Map[];
//   addCampaign: (playMap: Campaign) => void;
// }
class CreateCampaign extends Component<
  Props,
  ICreateCampaignStateType
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      name: "",
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
        Name the new Campaign.
      </div>
    );
  };

  createCampaign = () => {
    this.setState({
      processing: true
    }, () => {
      const campaignObj: any = {
        name: this.state.name,
        selectedPlayMapID: "", 
        turnPlayerID: null
      };

      this.api.createCampaign(campaignObj).then((res: any) => {
        if (res !== undefined && res.error === undefined) {
          const newCampaign: Campaign = new Campaign(res.campaignID, this.state.name, "", null, new Date().toString());
          this.props.addCampaign(newCampaign);
          this.props.selectCampaign(newCampaign);
          this.setState({ processing: false });
          // const maps: Map[] = [];
          // res.maps.forEach((m: any) => {
          //   maps.push(new Map(m._id, m.name, m.fileName, m.gridWidth, m.gridHeight));
          // });
          // this.props.setMaps(maps);
        }
      });
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

  renderMain = () => {
    return (
      <Grid key="main" container spacing={1} direction="column">
        <Grid item>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="text_field_play_map_name">Campaign Name</InputLabel>
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
        <Grid item>
          <Button disabled={ this.state.processing || this.state.name === "" } 
            onClick={this.createCampaign} 
            variant="contained" color="primary">
            Submit
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    return [
      this.renderHeader(),
      this.renderMain()
    ];
  }
}

export default connector(CreateCampaign);
