import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import styled from "styled-components";
// import {
//   Button
// } from "@material-ui/core";
import { Campaign } from "../models/Campaign";
import { Map } from "../models/Map";
import { PlayMap } from "../models/PlayMap";
import { Token } from "../models/Token";
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
  maps: Map[],
  playMaps: PlayMap[],
  campaigns: Campaign[],
  selectedCampaign: Campaign
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  tokens: state.app.tokens,
  selectedPlayMap: state.app.selectedPlayMap,
  playMaps: state.app.playMaps,
  maps: state.app.maps,
  campaigns: state.app.campaigns,
  selectedCampaign: state.app.selectedCampaign
});

const mapDispatch = {
  // setMaps: (maps: Map[]) => ({ type: 'SET_MAPS', payload: maps }),
  // setPlayMaps: (playMaps: PlayMap[]) => ({ type: 'SET_PLAYMAPS', payload: playMaps }),
  // addPlayMap: (playMap: PlayMap) => ({ type: 'ADD_PLAYMAP', payload: playMap }),
  selectPlayMap: (playMap: PlayMap) => ({ type: 'SELECT_PLAYMAP', payload: playMap }),
  selectCampaign: (campaign: Campaign) => ({ type: 'SELECT_CAMPAIGN', payload: campaign }),
  updatePlayMap: (playMap: PlayMap) => ({ type: 'UPDATE_PLAYMAP', payload: playMap })
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
      countdown: -1,
      refreshing: false
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

  renderHeader = () => {
    return (
      <Heading key="heading"> 
        Dead Simple VTT
        {/* <Button onClick={this.loadPlayMap}>Load PlayMap</Button> */}
      </Heading>
    );
  };

  renderMain = () => {
    // if (this.state.mode === "load") {
    //   return (
    //     <LoadPlayMap key="main" mode="player" selectPlayMap={this.selectPlayMap} />
    //   );
      // return (
      //   <ReduxTest key="main" backgroundColor="red" />
      // );
      
    //   <style type='text/css'>
    //   div, img { position:absolute; top:0; left:0; width:250px; height:250px; }
    //   img {
    //     -webkit-mask-image:-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));
    //     mask-image: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
    //   }
    // </style>
      // return (
      //   <div>
      //     <div style={{ position:"relative", top:0, left:0, width:250, height:250 }}>
      //       Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet porttitor massa. Morbi eget tortor congue, aliquet odio a, viverra metus. Ut cursus enim eu felis sollicitudin, vitae eleifend urna lobortis. Mauris elementum erat non facilisis cursus. Fusce sit amet lacus dictum, porta libero sed, euismod tellus. Aenean erat augue, sodales sed gravida ac, imperdiet ac augue. Ut condimentum dictum mauris. Donec tincidunt enim a massa molestie, vel volutpat massa dictum. Donec semper odio vitae adipiscing lacinia.</div>
      //     <img src='https://i.imgur.com/sLa5gg2.jpg' alt='testing'
      //       style={{ 
      //         position:"relative", top:0, left:0, width:250, height:250,
      //         WebkitMaskImage:"-webkit-gradient(linear, left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))",
      //         maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0))"
      //       }} />
      //   </div>
      // );
    // } else {
      if (this.props.selectedPlayMap) {
        return (
          <DisplayPlayMap key="main" mode="Player" />
        );
        // const StyledReactPanZoom = styled(ReactPanZoom)`
        //   ${Container};
        // `;
        // return (
        //   <StyledReactPanZoom key="main"
        //     zoom={this.state.playMap.zoom}
        //     pandx={this.state.playMap.dx}
        //     pandy={this.state.playMap.dy}
        //     onPan={this.onPan}
        //     onClick={this.onClick}
        //     enableClick={this.state.mode === "move"}
        //   >
        //     <div style={{position: "relative", left: ((-1 * window.innerWidth / 2) + 0), top: ((-1 * window.innerHeight / 2) + 25)}}>
        //       <img style={{
        //           position: "absolute",
        //           top: 0,
        //           left: 0
        //         }} src="https://i.imgur.com/WJ17gs5.jpg" alt="testing" />
        //       { this.state.playMap.tokens.map((t, key) => {
        //         return (
        //           <div key={key} style={{
        //             position: "absolute",
        //             left: t.x + (window.innerWidth / 2) - (t.size * 25),
        //             top: t.y + (window.innerHeight / 2) - 25 - (t.size * 25),
        //             width: t.size * 50,
        //             height: t.size * 50,
        //             backgroundColor: (t.id === this.state.selectedTokenID ? "blue" : "transparent"),
        //             borderRadius: (t.size * 25)
        //           }}
        //           onMouseEnter={() => {
        //             // console.log(t.id);
        //             this.setState({ hoveredTokenID: t.id });
        //           }}
        //           onMouseLeave={() => {
        //             if (this.state.hoveredTokenID === t.id) {
        //               // console.log(t.id);
        //               this.setState({ hoveredTokenID: -1 });
        //             }
        //           }}>
        //             <img src={t.token.file} alt="testing" 
        //               style={{
        //                 width: t.size * 50,
        //                 height: t.size * 50
        //               }}
        //             />
        //           </div>
        //         );
        //       })}
        //     </div>
        //   </StyledReactPanZoom>
        // );
      } else {
        return (
          <div key="main" style={{ margin: 10 }}>
            Load a Map to see it here
          </div>
        );
      }
    // }
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

  render() {
    if (this.props.selectedCampaign === null) {
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
