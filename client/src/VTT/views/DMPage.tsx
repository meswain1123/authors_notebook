import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import styled
// , { css } 
from "styled-components";
import {
  Button, 
  // Link
} from "@material-ui/core";
import { NavLink } from "react-router-dom";
import { Campaign, PlayMap, Token, Player } from "../models";
// import ReactPanZoom from "../components/my-react-pan-zoom";
import CreateCampaign from "../components/CreateCampaign";
import LoadCampaign from "../components/LoadCampaign";
import CreatePlayMap from "../components/CreatePlayMap";
import LoadPlayMap from "../components/LoadPlayMap";
import DisplayPlayMap from "../components/DisplayPlayMap";
// import ReduxTest from "../components/ReduxTest";
// import SVGTest from "../components/SVGTest";
import API from "../smartAPI";

const HEADER_HEIGHT = 50;
// const Container = css`
//   height: calc(100vh - ${HEADER_HEIGHT}px);
//   width: 100vw;
//   overflow: hidden;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1;
// `;
// const ControlsContainer = styled.div`
//   position: fixed;
//   background: lightgray;
//   height: 100%;
//   right: 0;
//   z-index: 2;
//   cursor: pointer;
//   user-select: none;

//   > div {
//     padding: 15px;
//     &:hover {
//       background: darkgray;
//     }
//     &:active {
//       box-shadow: 1px 1px 1px inset;
//     }
//   }
// `;

const Heading = styled.div`
  background: dimgrey;
  color: white;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

// const Icons = styled.strong`
//   font-size: 2rem;
// `;

// const mapStateToProps = state => {
//   return {
//     // width: state.app.width
//   };
// };
// function mapDispatchToProps(dispatch) {
//   return {
//     // notFromLogin: () => dispatch(notFromLogin({}))
//   };
// }

interface AppState {
  tokens: Token[],
  players: Player[],
  selectedPlayMap: PlayMap,
  selectedCampaign: Campaign
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  tokens: state.app.tokens,
  players: state.app.players,
  selectedPlayMap: state.app.selectedPlayMap,
  selectedCampaign: state.app.selectedCampaign
});

const mapDispatch = {
  // setMaps: (maps: Map[]) => ({ type: 'SET_MAPS', payload: maps }),
  // setPlayMaps: (playMaps: PlayMap[]) => ({ type: 'SET_PLAYMAPS', payload: playMaps }),
  // addPlayMap: (playMap: PlayMap) => ({ type: 'ADD_PLAYMAP', payload: playMap }),
  selectCampaign: (campaign: Campaign) => ({ type: 'SELECT_CAMPAIGN', payload: campaign }),
  updateCampaign: (campaign: Campaign) => ({ type: 'UPDATE_CAMPAIGN', payload: campaign }),
  selectPlayMap: (playMap: PlayMap) => ({ type: 'SELECT_PLAYMAP', payload: playMap }),
  updatePlayMap: (playMap: PlayMap) => ({ type: 'UPDATE_PLAYMAP', payload: playMap })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}
export interface IDMPageStateType {
  mode: string;
  selectedTokenID: number;
  hoveredTokenID: number;
  deselecting: boolean;
  lastRefresh: Date;
  controlMode: string;
}
class DMPage extends Component<
  Props,
  IDMPageStateType
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: "loadCampaign",
      selectedTokenID: -1,
      hoveredTokenID: -1,
      deselecting: false,
      lastRefresh: new Date(),
      controlMode: "controls"
    };
    this.api = API.getInstance();
  }

  api: any;

  componentDidMount() {}

  createCampaign = () => {
    this.setState({
      mode: "createCampaign"
    })
  }

  loadCampaign = () => {
    this.setState({
      mode: "loadCampaign"
    })
  }

  saveCampaign = () => {
    this.api.updateCampaign(this.props.selectedCampaign.toDBObj()).then((res: any) => {
      const campaign = this.props.selectedCampaign;
      campaign.lastUpdate = res.lastUpdate;
      this.props.updateCampaign(campaign);
    });
  }

  selectCampaign = (campaign: Campaign) => {
    this.props.selectCampaign(campaign);
    if (campaign.selectedPlayMapID === "") {
      this.setState({ mode: "loadPlayMap" });
    } else {
      this.setState({ mode: "main" });
    }
  }

  createPlayMap = () => {
    this.setState({
      mode: "createPlayMap"
    })
  }

  loadPlayMap = () => {
    this.setState({
      mode: "loadPlayMap"
    })
  }

  savePlayMap = () => {
    this.api.updatePlayMap(this.props.selectedPlayMap.toDBObj()).then((res: any) => {
      const newCampaign = this.props.selectedCampaign;
      newCampaign.lastUpdate = res.lastUpdate;
      this.props.updateCampaign(newCampaign);
    });
  }

  selectPlayMap = (playMap: PlayMap) => {
    // const campaign: Campaign = this.props.selectedCampaign;
    // campaign.selectedPlayMapID = playMap._id;
    // this.api.updateCampaign(campaign.toDBObj()).then((res: any) => {

    //   this.props.updateCampaign(campaign);
    //   this.setState({ mode: "main" });
    // });
    this.props.selectPlayMap(playMap);
    this.setState({ mode: "main" });
  }

  useSelectedPlayMap = () => {
    const campaign: Campaign = this.props.selectedCampaign;
    campaign.selectedPlayMapID = this.props.selectedPlayMap._id;
    this.api.updateCampaign(campaign.toDBObj()).then((res: any) => {
      campaign.lastUpdate = res.lastUpdate;
      this.props.updateCampaign(campaign);
      this.setState({ mode: "main" });
    });
  }

  renderHeader = () => {
    return (
      <Heading key="heading"> 
        Dead Simple VTT - DM 
        <Button onClick={this.createCampaign}>Create Campaign</Button>
        <Button onClick={this.loadCampaign}>Load Campaign</Button>
        { this.renderControls() }
        {/* { this.props.selectedCampaign && 
          <div>
            <Button onClick={this.createPlayMap}>Create PlayMap</Button>
            <Button onClick={this.loadPlayMap}>Load PlayMap</Button>
            <Button onClick={this.savePlayMap} disabled={this.props.selectedPlayMap === null}>Save PlayMap</Button>
            <Button onClick={this.useSelectedPlayMap} disabled={this.props.selectedPlayMap === null}>Use PlayMap</Button>
            <Link href={`http://localhost:3000/vtt/player/${this.props.selectedCampaign._id}`} style={{ color: "black", fontWeight: "bold" }}>Player Page</Link>
          </div>
        } */}
      </Heading>
    );
  };

  renderControls = () => {
    return (
      <div> 
        { this.props.selectedCampaign && 
          <div>
            <Button onClick={this.createPlayMap}>Create PlayMap</Button>
            <Button onClick={this.loadPlayMap}>Load PlayMap</Button>
            <Button onClick={this.savePlayMap} disabled={this.props.selectedPlayMap === null}>Save PlayMap</Button>
            <Button onClick={this.useSelectedPlayMap} disabled={this.props.selectedPlayMap === null}>Use PlayMap</Button>
            <NavLink to={`/vtt/player/${this.props.selectedCampaign._id}`} target="_blank" style={{ color: "black" }}>
              Player Page
            </NavLink>
          </div>
        }
      </div>
    );
  };

  renderMain = () => {
    if (this.state.mode === "loadCampaign") {
      return (
        <LoadCampaign key="main" mode="DM" selectCampaign={this.selectCampaign} />
      );
    } else if (this.state.mode === "createCampaign") {
      return (
        <CreateCampaign key="main" selectCampaign={this.selectCampaign} />
      );
    } else if (this.state.mode === "loadPlayMap") {
      return (
        <LoadPlayMap key="main" mode="DM" selectPlayMap={this.selectPlayMap} />
      );
    } else if (this.state.mode === "createPlayMap") {
      return (
        <CreatePlayMap key="main" selectPlayMap={this.selectPlayMap} />
      );
    } else {
      if (this.props.selectedPlayMap) {
        return (
          <DisplayPlayMap key="main" mode="DM" />
        );
      } else {
        return (
          <div key="main" style={{ margin: 10 }}>
            Load a Map to see it here
          </div>
        );
      }
    }
  };

  render() {
    return [
      this.renderHeader(),
      this.renderMain()
    ];
  }
}

export default connector(DMPage);
