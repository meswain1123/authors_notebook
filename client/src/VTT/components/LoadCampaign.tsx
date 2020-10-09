
import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import {
  Button, Grid
} from "@material-ui/core";
import { Campaign } from "../models";

// This lets the user select a Campaign to use.

interface AppState {
  campaigns: Campaign[] | null
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  campaigns: state.app.campaigns
})

const mapDispatch = {
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  selectCampaign: (campaign: Campaign) => void;
  mode: string;
}

export interface ILoadCampaignStateType {
  selectedCampaign: Campaign | null;
}

class LoadCampaign extends Component<
  Props,
  ILoadCampaignStateType
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedCampaign: null
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

  selectCampaign = (campaign: Campaign) => {
    this.setState({
      selectedCampaign: campaign
    });
  };

  loadCampaign = () => {
    if (this.state.selectedCampaign !== null) {
      this.props.selectCampaign(this.state.selectedCampaign);
    }
  }

  renderMain = () => {
    if (this.props.campaigns === null) {
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
            {/* { this.renderSelectedMap() } */}
          </Grid>
          <Grid item>
            <Button disabled={ this.state.selectedCampaign === null } 
              onClick={this.loadCampaign} 
              variant="contained" color="primary">
              Submit
            </Button>
          </Grid>
        </Grid>
      );
    }
  };

  renderMapList = () => {
    if (this.props.campaigns !== null) {
      return (
        <Grid item xs={6} 
          container spacing={1} direction="column">
          Select a Campaign
          {this.props.campaigns.map((campaign, key) => {
            return (
              <Grid item key={key} 
                onClick={() => {
                  this.selectCampaign(campaign);
                }}
                style={{
                  backgroundColor: (this.state.selectedCampaign && this.state.selectedCampaign._id === campaign._id ? "blue" : "transparent"),
                  color: (this.state.selectedCampaign && this.state.selectedCampaign._id === campaign._id ? "white" : "black"),
                  cursor: "pointer"
                }}>
                {campaign.name}
              </Grid>
            );
          })}
        </Grid>
        );
    } else {
      return (<Grid item xs={6}>{"I'm invisible!"}</Grid>);
    }
  };

  render() {
    return [
      // this.renderHeader(),
      this.renderMain()
    ];
  }
}

export default connector(LoadCampaign);
