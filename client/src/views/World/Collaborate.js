import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Button,
  Grid
} from "@material-ui/core";
import LoginControl from '../User/LoginControl';
import {
  setWorlds,
  setAttributes,
  setTypes,
  setThings
} from "../../redux/actions/index";
import API from '../../smartAPI';


const mapStateToProps = state => {
  return {
    user: state.app.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    setAttributes: attributes => dispatch(setAttributes(attributes)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worldID: null,
      collabID: null,
      codeValid: false,
      accepted: null,
      message: "Please wait.  Validating code.",
      world: null
    };
    this.api = API.getInstance();
  }

  componentDidMount = () => {
  }

  accept = () => {
    if (this.props.user === null) {
      this.setState({waiting: false, accepted: true});
    }
    else {
      this.setState({waiting: true},
        this.submitAccept
      );
    }
  }

  submitAccept = () => {
    this.api.acceptCollabInvite(this.state.worldID, this.state.collabID).then(res => {
      this.setState({waiting: false, accepted: true}, this.getWorlds);
    });
  }

  getWorlds = () => {
    this.api.getWorldsForUser().then(res => {
      if (res.worlds !== undefined) this.props.setWorlds(res.worlds);
      this.refreshWorld();
    });
  }

  refreshWorld = () => {
    this.api.getWorld(this.state.worldID, true).then(res => {
      this.props.setAttributes(res.attributes);
      this.props.setTypes(res.types);
      this.props.setThings(res.things);
    });
  }

  onLoginAccept = (user) => {
    this.setState({waiting: true},
      this.submitAccept
    );
  }

  decline = () => {
    this.setState({waiting: true},
      this.submitDecline
    );
  }

  submitDecline = () => {
    this.api.declineCollabInvite(this.state.worldID, this.state.collabID).then(res => {
      this.setState({waiting: false, accepted: false}, this.refreshWorld);
    });
  }

  render() {
    if (this.state.collabID === null) {
      const { worldID, collabID } = this.props.match.params;
      setTimeout(() => {
        this.api.checkCollabID(worldID, collabID).then(res => {
          if (res.error !== undefined) {
            this.setState({collabID, worldID, codeValid: false, message: res.error});
          }
          else {
            this.setState({collabID, worldID, world: res.world, codeValid: true, message: ""});
          }
        });
      }, 500);
      return (
        <div>
          <h2>{this.state.message}</h2>
        </div>
      );
    }
    else if (this.state.codeValid) {
      if (this.state.accepted === null) {
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <h2>You've been invited to collaborate on {this.state.world.Name}</h2>
            </Grid>
            <Grid item xs={12} container spacing={1}>
              <Grid item xs={6}>
                <Button className="w-200" 
                  variant="contained" color="primary"
                  disabled={this.state.waiting}
                  onClick={this.accept}
                  type="button">
                  Accept
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button className="w-200" 
                  variant="contained" color="primary"
                  disabled={this.state.waiting}
                  onClick={this.decline}
                  type="button">
                  Decline
                </Button>
              </Grid>
            </Grid>
          </Grid>
        );
      }
      else if (this.state.accepted) {
        if (this.props.user === null) {
          return (
            <Grid container spacing={1} direction="column">
              <Grid item>
                <h2>Please log in (or register and then log in if you're new) so we can add you as a collaborator on {this.state.world.Name}.</h2>
              </Grid>
              <Grid item>
                <LoginControl onLogin={this.onLoginAccept}/>
              </Grid>
            </Grid>
          );
        }
        else {
          return (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <h2>Congratulations! You can now collaborate on {this.state.world.Name}</h2>
              </Grid>
            </Grid>
          );
        }
      }
      else {
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              Okay.  Well, we hope you enjoy working on other worlds.
            </Grid>
          </Grid>
        );
      }
    }
    else {
      return (
        <div>
          <h2>{this.state.message}</h2>
        </div>
      );
    }
  }
}

const CollaboratePage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default CollaboratePage;
