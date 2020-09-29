
import React, { Component } from "react";
import { connect, ConnectedProps } from 'react-redux';
import {
  FormControl,
  OutlinedInput,
  InputLabel,
  // FormHelperText,
  Button, Grid
} from "@material-ui/core";
import { Campaign, Player } from "../models";
import API from "../smartAPI";

// This lets the user create a new campaign.


interface AppState {
  players: Player[],
  campaigns: Campaign[]
}

interface RootState {
  app: AppState
}

const mapState = (state: RootState) => ({
  players: state.app.players,
  campaigns: state.app.campaigns
})

const mapDispatch = {
  selectPlayer: (player: Player) => ({ type: 'SELECT_PLAYER', payload: player })
}

const connector = connect(mapState, mapDispatch)

// The inferred type will look like:
// {isOn: boolean, toggleOn: () => void}
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
  // backgroundColor: string
  // selectPlayer: (player: Player) => void
}

export interface State {
  email: string;
  password: string;
  processing: boolean;
}
// export interface ICreateCampaignProps {
//   maps: Map[];
//   addCampaign: (playMap: Campaign) => void;
// }
class Login extends Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      processing: false
    };
    this.api = API.getInstance();
  }

  api: any;

  componentDidMount() {}

  renderHeader = () => {
    return (
      <div key="header"> 
        Welcome Adventurer!  Please login
      </div>
    );
  };

  login = () => {
    this.setState({
      processing: true
    }, () => {
      this.api.login(this.state.email, this.state.password).then((res: any) => {
        if (res !== undefined && res.error === undefined) {
          const campaignFinder = this.props.campaigns.filter(c => c._id === res.campaignID);
          let campaign: (Campaign | null) = null;
          if (campaignFinder.length === 1) {
            campaign = campaignFinder[0];
          }
          const newPlayer: Player = new Player(res._id, res.email, res.username, res.password, campaign, new Date(Date.parse(res.lastPing)), res.refreshIndex);
          this.props.selectPlayer(newPlayer);
          this.setState({ processing: false });
        }
      });
    });
  }

  renderMain = () => {
    return (
      <Grid key="main" container spacing={1} direction="column">
        <Grid item>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="text_field_login_email">Email</InputLabel>
              <OutlinedInput
                id={`text_field_login_email`}
                name={`text_field_login_email`}
                type="text"
                autoComplete="Off"
                // error={this.state.error !== ""}
                value={this.state.email}
                onChange={e => {
                  this.setState({ email: e.target.value });
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !this.state.processing && this.state.email !== "" && this.state.password !== "") {
                    this.login();
                  }
                }}
                labelWidth={40}
                fullWidth
              />
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="text_field_login_password">Password</InputLabel>
              <OutlinedInput
                id={`text_field_login_password`}
                name={`text_field_login_password`}
                type="password"
                autoComplete="Off"
                // error={this.state.error !== ""}
                value={this.state.password}
                onChange={e => {
                  this.setState({ password: e.target.value });
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !this.state.processing && this.state.email !== "" && this.state.password !== "") {
                    this.login();
                  }
                }}
                labelWidth={70}
                fullWidth
              />
          </FormControl>
        </Grid>
        <Grid item>
          <Button disabled={ this.state.processing || this.state.email === "" || this.state.password === "" } 
            onClick={this.login} 
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

export default connector(Login);
