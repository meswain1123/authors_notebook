import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPage,
  updateSelectedThing,
  addThing,
  updateThing
} from "../../redux/actions/index";
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
  const thing = state.app.selectedThing;
  return {
    selectedPage: state.app.selectedPage,
    selectedThing: thing,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    types: state.app.types
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    updateSelectedThing: type => dispatch(updateSelectedThing(type)),
    addThing: type => dispatch(addThing(type)),
    updateThing: type => dispatch(updateThing(type))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Name: "",
      Description: "",
      Types: [],
      Attributes: [],
      fieldValidation: {
        Name: { valid: true, message: "" },
        AttributesArr: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
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
            Description: res.Description,
            _id: id,
            Types: res.Types
          });
          this.props.updateSelectedThing(res);
        });
      } else {
        this.props.updateSelectedThing({
          _id: null,
          Name: "",
          Description: "",
          Types: [],
          AttributesArr: []
        });
      }
    }, 500);
  }

  render() {
    // console.log(this.props.match.params);
    const { id } = this.props.match.params;
    if (
      this.props.selectedThing !== undefined &&
      this.props.selectedThing !== null &&
      this.props.selectedThing._id !== id
    ) {
      // setTimeout(() => {
      if (id !== undefined) {
        this.api.getThing(this.props.selectedWorldID, id).then(res => {
          this.setState({
            Name: res.Name,
            Description: res.Description,
            _id: id,
            Types: res.Types
          });
          this.props.updateSelectedThing(res);
        });
      } else {
        this.props.updateSelectedThing({
          _id: null,
          Name: "",
          Description: "",
          Types: [],
          AttributesArr: []
        });
      }
      // }, 500);
    }
    // const types = this.props.types === undefined || this.state._id === null ? this.props.types : this.props.types.filter(type => type._id !== this.state._id);

    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <Grid item xs={12} container spacing={0} direction="column">
          <Grid item container spacing={0} direction="row">
            <Grid item xs={9}>
              <h2>{this.state.Name}</h2>
            </Grid>
            <Grid item xs={3}>
              <List>
                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    href={`/thing/edit/${this.state._id}`}
                  >
                    <Edit />
                  </Button>
                </ListItem>
                <ListItem>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    href={`/thing/delete/${this.state._id}`}
                  >
                    <Delete />
                  </Button>
                </ListItem>
              </List>
            </Grid>
          </Grid>
          <Grid item container spacing={0} direction="row">
            <Grid item sm={9} xs={12} container spacing={0} direction="column">
              <Grid item>{this.state.Description}</Grid>
              <Grid item>
                Attributes
                <List>
                  {this.props.selectedThing === null ||
                  this.props.selectedThing === undefined
                    ? ""
                    : this.props.selectedThing.AttributesArr.map(
                        (attribute, i) => {
                          return (
                            <ListItem key={i}>
                              <ListItemText>
                                {attribute.Name}:
                                {attribute.Value}
                              </ListItemText>
                            </ListItem>
                          );
                        }
                      )}
                </List>
              </Grid>
            </Grid>
            <Grid item sm={3} xs={12} container spacing={0} direction="column">
              {this.state.Types.length === 0 ? (
                ""
              ) : (
                <Grid item>
                  <List>
                    <ListItem>
                      <ListItemText primary={"Types"} />
                    </ListItem>
                    {this.state.Types.map((type, i) => {
                      return (
                        <ListItem key={i}>
                          <Button fullWidth
                            variant="contained"
                            color="primary"
                            href={`/type/details/${type._id}`}
                          >
                            <ListItemText primary={type.Name} />
                          </Button>
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }
}

const ThingDetails = connect(mapStateToProps, mapDispatchToProps)(Page);
export default ThingDetails;
