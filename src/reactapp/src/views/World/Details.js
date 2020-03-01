import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import { Redirect, BrowserRouter as Router, Route } from "react-router-dom";
import { selectWorld, setTypes, setThings, setWorlds, setPublicWorlds } from "../../redux/actions/index";
import API from "../../api";
// import TypeIndex from "../Type/Index";
import Index from "./Index";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Modal from '@material-ui/core/Modal';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import TextField from '@material-ui/core/TextField';

const mapStateToProps = state => {
  // console.log(state);
  return {
    selectedPage: state.app.selectedPage,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    worlds: state.app.worlds,
    publicWorlds: state.app.publicWorlds,
    types: state.app.types,
    things: state.app.things,
    user: state.app.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
    // selectPage: page => dispatch(selectPage(page)),
    selectWorld: worldID => dispatch(selectWorld(worldID)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      world: null,
      modalOpen: false,
      redirectTo: null
    };
    this.api = API.getInstance();
  }
  componentDidMount() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      // this.api.selectWorld(this.props.user._id, id).then(res => {
      // localStorage.setItem("selectedWorldID", id);
      this.props.selectWorld(id);
      this.getTypes();
      // });
    }, 500);
  }

  getTypes() {
    // console.log('Getting Types');
    // console.log(this.props);
    this.api.getTypesForWorld(this.props.user._id, this.props.selectedWorldID).then(res => {
      // console.log(res);
      if (res !== undefined) {
        // Add Supers to each type
        const types = res.types;
        types.forEach(t=> {
          t.Supers = [];
          t.SuperIDs.forEach(sID=> {
            // console.log(sID);
            // console.log(types.filter(t2=>t2._id === sID));
            t.Supers = t.Supers.concat(types.filter(t2=>t2._id === sID));
            // console.log(t.Supers);
          });
        });
        this.props.setTypes(types);
        this.getThings();
      } else {
        // // console.log('retry');
        setTimeout(() => {
          this.getTypes();
        }, 500);
      }
    });
  }
  getThings() {
    this.api.getThingsForWorld(this.props.user._id, this.props.selectedWorldID).then(res => {
      if (res !== undefined) {
        // console.log(res);
        const things = res.things;
        things.forEach(t=> {
          t.Types = [];
          t.TypeIDs.forEach(tID=> {
            t.Types = t.Types.concat(this.props.types.filter(t2=>t2._id === tID));
          });
        });
        this.props.setThings(things);
      } else {
        // // console.log('retry');
        setTimeout(() => {
          this.getThings();
        }, 500);
      }
    });
  }

  delete = e => {
    // console.log(this.state._id);
    this.api.deleteWorld(this.props.user._id, this.props.selectedWorldID).then(res=>{
      // console.log(res);
      this.props.selectWorld(null);
      let worlds = this.props.worlds.filter(t=>t._id!==this.props.selectedWorldID);
      this.props.setWorlds(worlds);
      worlds = this.props.publicWorlds.filter(t=>t._id!==this.props.selectedWorldID);
      this.props.setPublicWorlds(worlds);
      this.setState({modalOpen: false, redirectTo: `/`});
    });
  }

  getModalStyle = () => {
    const top = Math.round(window.innerHeight / 2) - 50;
    const left = Math.round(window.innerWidth / 2) - 200;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(${left}px, ${top}px)`,
    };
  }

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <Grid item xs={12} container spacing={0} direction="column">
          {this.props.selectedWorld === null ? (
            ""
          ) : (
            <Grid item container spacing={0} direction="row">
              <Grid item xs={9}>
                <h2>{this.props.selectedWorld.Name}</h2>
              </Grid>
              <Grid item xs={3}>
                <List>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      href={`/world/edit/${this.props.selectedWorld._id}`}
                    >
                      <Edit />
                    </Button>
                  </ListItem>
                  <ListItem>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      // href={`/world/delete/${this.props.selectedWorld._id}`}
                      onClick={e => {this.setState({modalOpen: true})}}
                      // onClick={this.delete}
                    >
                      <Delete />
                    </Button>
                  </ListItem>
                </List>
              </Grid>
            </Grid>
          )}
          <Grid item>
            <Index />
          </Grid>
          {/* <Grid item container spacing={0} direction="row">
            <Grid item xs={6}>
              <TypeIndex />
            </Grid>
            <Grid item xs={6}>
              <ThingIndex />
            </Grid>
          </Grid> */}
          <Modal
              aria-labelledby="delete-thing-modal"
              aria-describedby="delete-thing-modal-description"
              open={this.state.modalOpen}
              onClose={e => {this.setState({modalOpen: false})}}
            >
              <div style={this.getModalStyle()} className="paper">
                <Grid container spacing={1} direction="column">
                  <Grid item>
                    Are you sure you want to delete {this.props.selectedWorld !== null ? this.props.selectedWorld.Name : ""}?
                  </Grid>
                  <Grid item>
                    (All external references to it will be left alone and may not work correctly)
                  </Grid>
                  <Grid item container spacing={1} direction="row">
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={this.delete}
                      >
                        Yes
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={e => {this.setState({modalOpen: false})}}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Modal>
        </Grid>
      );
    }
  }
}
const WorldDetailsPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default WorldDetailsPage;
