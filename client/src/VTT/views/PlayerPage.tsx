import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Button, 
  // Grid
} from "@material-ui/core";
import { 
  Campaign, Map, PlayMap, Token, Player 
} from "../models";
// import Login from "../components/Login";
// import LoadPlayMap from "../components/LoadPlayMap";
import DisplayPlayMap from "../components/DisplayPlayMap";
import API from "../smartAPI";

const HEADER_HEIGHT = 50;

const Heading = styled.div`
  background: dimgrey;
  color: white;
  height: ${HEADER_HEIGHT}px;
  display: flex;
  align-items: center;
  padding-left: 10px;
`;

interface AppState {
  tokens: Token[],
  selectedPlayMap: PlayMap,
  players: Player[],
  maps: Map[],
  playMaps: PlayMap[],
  campaigns: Campaign[],
  selectedCampaign: Campaign,
  selectedPlayer: Player
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  tokens: state.app.tokens,
  selectedPlayMap: state.app.selectedPlayMap,
  playMaps: state.app.playMaps,
  players: state.app.players,
  maps: state.app.maps,
  campaigns: state.app.campaigns,
  selectedCampaign: state.app.selectedCampaign,
  selectedPlayer: state.app.selectedPlayer
});

const mapDispatch = {
  // setMaps: (maps: Map[]) => ({ type: 'SET_MAPS', payload: maps }),
  // setPlayMaps: (playMaps: PlayMap[]) => ({ type: 'SET_PLAYMAPS', payload: playMaps }),
  // addPlayMap: (playMap: PlayMap) => ({ type: 'ADD_PLAYMAP', payload: playMap }),
  selectPlayMap: (playMap: PlayMap) => ({ type: 'SELECT_PLAYMAP', payload: playMap }),
  selectCampaign: (campaign: Campaign) => ({ type: 'SELECT_CAMPAIGN', payload: campaign }),
  selectPlayer: (player: Player) => ({ type: 'SELECT_PLAYER', payload: player }),
  updatePlayMap: (playMap: PlayMap) => ({ type: 'UPDATE_PLAYMAP', payload: playMap }),
  updateCampaign: (campaign: Campaign) => ({ type: 'UPDATE_CAMPAIGN', payload: campaign })
}

const connector = connect(mapState, mapDispatch)

type PropsFromRedux = ConnectedProps<typeof connector>

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {
}

type Props = MatchProps & PropsFromRedux & {
}
export interface IPlayerPageStateType {
  mode: string;
  // selectedTokenID: number;
  // hoveredTokenID: number;
  // deselecting: boolean;
  countdown: number;
  refreshing: boolean;
  running: boolean;
  lastRefresh: Date;
}
class PlayerPage extends Component<
  Props,
  IPlayerPageStateType
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mode: "load",
      // selectedTokenID: -1,
      // hoveredTokenID: -1,
      // deselecting: false
      countdown: 2,
      refreshing: false,
      running: false,
      lastRefresh: new Date()
    };
    this.api = API.getInstance();
  }

  api: any;

  componentDidMount() {}

  // loadPlayMap = () => {
  //   this.setState({
  //     mode: "load"
  //   })
  // }

  // selectPlayMap = (playMap: PlayMap) => {
  //   this.props.selectPlayMap(playMap);
  //   this.setState({ mode: "main" });
  // }

  endTurn = () => {
    const newCampaign = this.props.selectedCampaign;
    newCampaign.turnPlayerID = null;
    this.api.updateCampaign(newCampaign.toDBObj()).then((res: any) => {
      newCampaign.lastUpdate = res.lastUpdate;
      this.props.updateCampaign(newCampaign);
    });
  }

  changePlayer = (e: any) => {
    const playerFinder = this.props.players.filter(p => p._id === e.target.value);
    if (playerFinder.length === 1) {
      this.props.selectPlayer(playerFinder[0]);
      // this.setState({});
    }
  }

  renderHeader = () => {
    return (
      <Heading key="heading"> 
        Dead Simple VTT
        { this.props.selectedCampaign && 
          <span>
            &nbsp;-&nbsp;{this.props.selectedCampaign.name}
          </span>
        }
        { this.props.selectedPlayer ? 
          <span>
            &nbsp;-&nbsp;{this.props.selectedPlayer.username}
          </span>
          :
          <span>
            &nbsp;-&nbsp;
            <FormControl variant="outlined">
              <InputLabel id="player">Select a Player</InputLabel>
              <Select
                labelId="player"
                id="player"
                value={this.props.selectedPlayer}
                onChange={this.changePlayer}
                label="Select a Player"
              >
                { this.props.players.map((p, key) => {
                  return (<MenuItem key={key} value={p._id}>{p.username}</MenuItem>);
                })}
              </Select>
            </FormControl>
          </span>
        }
        { this.props.selectedCampaign && this.props.selectedPlayer &&
          this.props.selectedCampaign.turnPlayerID === this.props.selectedPlayer._id &&
          <div style={{ fontWeight: "bold" }}>
            &nbsp;It's your turn! 
            <Button onClick={this.endTurn}>End Turn</Button>
          </div>
        }
        {/* <Button onClick={this.loadPlayMap}>Load PlayMap</Button> */}
      </Heading>
    );
  };

  renderMain = () => {
    // if (!this.props.selectedPlayer) {
    //   return (
    //     <Login key="main"/>
    //   );
    // } else 
    if (this.props.selectedPlayMap) {
      return (
        <DisplayPlayMap key="main" mode="Player" />
      );
    } else {
      return (
        <div key="main" style={{ margin: 10 }}>
          Load a Map to see it here
        </div>
      );
    }
  };

  load = (id: string) => {
    setTimeout(() => {
      if (this.props.playMaps && this.props.campaigns) {
        const campaignFinder = this.props.campaigns.filter(c => c._id === id);
        if (campaignFinder.length === 1) {
          const campaign = campaignFinder[0];
          this.props.selectCampaign(campaign);
        }
      } else {
        this.load(id);
      }
    }, 1000);
  }

  refresh = () => {
    this.setState({ 
      lastRefresh: new Date() 
    }, () => {
      setTimeout(this.refresh, this.state.countdown * 1000);
    });
  }

  render() {
    if (this.props.selectedPlayer && this.props.selectedCampaign && !this.state.running) {
      this.setState({
        running: true
      }, () => {
        setTimeout(this.refresh, this.state.countdown * 1000);
      });
      return (<div>Loading</div>);
    } else if (this.props.selectedCampaign === null) {
      const { id } = this.props.match.params;
      this.load(id);
      return (<div>Loading</div>);
    } else {
      return [
        this.renderHeader(),
        this.renderMain()
      ];
    }
  }
}

export default connector(PlayerPage);
