import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import {
//   deleteThing
// } from "../../redux/actions/index";
// import Button from "@material-ui/core/Button";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
// import { NavLink } from "react-router-dom";
import Button from "@material-ui/core/Button";
// import FormControl from '@material-ui/core/FormControl';
// import OutlinedInput from '@material-ui/core/OutlinedInput';
// import InputLabel from '@material-ui/core/InputLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
// import AttributesControl from "./AttributesControl";
// import SupersControl from "./SupersControl";
// import styled from 'styled-components';
import API from "../../api";
import Grid from "@material-ui/core/Grid";

// const Label = styled('label')`
//   padding: 0 0 4px;
//   line-height: 1.5;
//   display: block;
// `;

/* 
  This component will take the main portion of the page and is used for
  creating or editing a Thing.  It will allow the use of Types
  to make the process faster.
*/

const mapStateToProps = state => {
  // console.log(state);
  // const thing = state.app.selectedThing;
  return {
    // selectedPage: state.app.selectedPage,
    // selectedThing: thing,
    // selectedWorld: state.app.selectedWorld,
    // selectedWorldID: state.app.selectedWorldID,
    // types: state.app.types,
    user: state.app.user,
    things: state.app.things
  };
};
// function mapDispatchToProps(dispatch) {
//   return {
//     deleteThing: thing => dispatch(deleteThing(thing))
//   };
// }
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Name: "",
      redirectTo: null
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      if (id !== undefined) {
        this.api.getThing(this.props.selectedWorldID, id).then(res => {
          this.setState({
            Name: res.Name,
            _id: id
          });
        });
      }
    }, 500);
  }

  delete = e => {
    // console.log(e);
    // this.api.deleteThing()
  }

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <Grid item xs={12}>
          Are you sure you want to delete {this.state.Name}?
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={this.delete}
          >
            Yes
          </Button>
          <Button
            fullWidth
            variant="contained"
            href={`/thing/details/${this.state._id}`}
          >
            Cancel
          </Button>
        </Grid>
      );
    }
  }
}

const ThingDelete = connect(mapStateToProps)(Page);
export default ThingDelete;
