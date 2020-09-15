
import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
import { connect, ConnectedProps } from 'react-redux'
// import {
//   // notFromLogin
// } from "../redux/actions/index";
import { PlayMap } from "../models/PlayMap";
import { Map } from "../models/Map";
// import { PlayToken } from "../models/PlayToken";
// import { Token } from "../models/Token";
import {
  Button
} from "@material-ui/core";

// This control will be used to add or edit PlayTokens.
// It will show all the PlayTokens which are part of the PlayMap
// on a grid.  New Tokens can be added, and any attribute of a
// token can be edited, including the Token it uses (polymorph),
// and its size (Reduce/Enlarge).



interface RootState {
  maps: Map[]
}


const mapState = (state: RootState) => ({
  maps: state.maps
})

const mapDispatch = {
  addPlayMap: (playMap: PlayMap) => ({ type: 'ADD_PLAYMAP', payload: playMap })
}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  backgroundColor: string
}

export interface IManageTokensStateType {
  name: string;
}
export interface IManageTokensProps {
  maps: Map[];
}
class ManageTokens extends Component<
  IManageTokensProps,
  IManageTokensStateType
> {
  constructor(props: IManageTokensProps) {
    super(props);
    this.state = {
      name: ""
    };
  }

  componentDidMount() {}

  renderHeader = () => {
    return (
      <div key="header"> 
        Manage Tokens
      </div>
    );
  };

  renderMain = () => {
    return (
      <div key="main">Add and Edit Tokens (grid format)</div>
    );
  };

  render() {
    return [
      this.renderHeader(),
      this.renderMain()
    ];
  }
}

export default connector(ManageTokens);
