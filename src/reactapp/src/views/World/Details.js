import React, { Component } from "react";
import { connect } from "react-redux";
// import { Redirect, BrowserRouter as Router, Route } from "react-router-dom";
import { selectWorld, setTypes, setThings } from "../../redux/actions/index";
import API from "../../api";
// import TypeIndex from "../Type/Index";
import Index from "./Index";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import TextField from '@material-ui/core/TextField';

const mapStateToProps = state => {
  // console.log(state);
  return {
    selectedPage: state.app.selectedPage,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    worlds: state.app.worlds,
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
    setThings: things => dispatch(setThings(things))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      world: null
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

  render() {
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
                    href={`/world/delete/${this.props.selectedWorld._id}`}
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
      </Grid>
    );
  }
}
const WorldDetailsPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default WorldDetailsPage;
