import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPage,
  updateSelectedThing,
  addThing,
  updateThing,
  setThings
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
import Modal from '@material-ui/core/Modal';

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
    types: state.app.types,
    things: state.app.things,
    user: state.app.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    updateSelectedThing: thing => dispatch(updateSelectedThing(thing)),
    addThing: thing => dispatch(addThing(thing)),
    updateThing: thing => dispatch(updateThing(thing)),
    setThings: things => dispatch(setThings(things))
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
      redirectTo: null,
      modalOpen: false
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      if (id !== undefined) {
        this.api.getThing(this.props.selectedWorldID, id).then(res => {
          let Types = [];
          res.TypeIDs.forEach(tID=> {
            Types = Types.concat(this.props.types.filter(t2=>t2._id === tID));
          });
          this.setState({
            Name: res.Name,
            Description: res.Description,
            _id: id,
            Types: Types
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

  getModalStyle = () => {
    const top = Math.round(window.innerHeight / 2) - 50;
    const left = Math.round(window.innerWidth / 2) - 200;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(${left}px, ${top}px)`,
    };
  }

  delete = e => {
    // console.log(this.state._id);
    this.api.deleteThing(this.props.user._id, this.state._id).then(res=>{
      // console.log(res);
      const things = this.props.things.filter(t=>t._id!==this.state._id);
      this.props.setThings(things);
      this.setState({redirectTo: `/world/details/${this.props.selectedWorldID}`})
    });
  }

  render() {
    // console.log(this.props);
    // const { id } = this.props.match.params;
    // if (
    //   this.props.selectedThing !== undefined &&
    //   this.props.selectedThing !== null &&
    //   this.props.selectedThing._id !== id
    // ) {
    //   // setTimeout(() => {
    //   if (id !== undefined) {
    //     this.api.getThing(this.props.selectedWorldID, id).then(res => {
    //       let Types = [];
    //       res.TypeIDs.forEach(tID=> {
    //         Types = Types.concat(this.props.types.filter(t2=>t2._id === tID));
    //       });
    //       this.setState({
    //         Name: res.Name,
    //         Description: res.Description,
    //         _id: id,
    //         Types: Types
    //       });
    //       this.props.updateSelectedThing(res);
    //     });
    //   } else {
    //     this.props.updateSelectedThing({
    //       _id: null,
    //       Name: "",
    //       Description: "",
    //       Types: [],
    //       AttributesArr: []
    //     });
    //   }
    //   // }, 500);
    // }
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
                    onClick={e => {this.setState({modalOpen: true})}}
                    // href={`/thing/delete/${this.state._id}`}
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
                                {attribute.Name}:&nbsp;
                                {attribute.Type === "Type" && attribute.Value !== "" ?
                                <Button
                                  variant="contained"
                                  color="primary"
                                  href={`/thing/details/${attribute.Value}`}
                                >
                                  <ListItemText primary={this.props.things.filter(t=>t._id === attribute.Value)[0].Name}/>
                                </Button>
                                : attribute.Type === "List" ?
                                  attribute.ListValues.map(
                                    (listValue, i) => {
                                      return (
                                      <span key={i}>
                                        {
                                          attribute.ListType === "Type" ?
                                          <span>
                                            <Button
                                              variant="contained"
                                              color="primary"
                                              href={`/thing/details/${listValue}`}
                                            >
                                              <ListItemText primary={this.props.things.filter(t=>t._id === listValue)[0].Name}/>
                                            </Button> 
                                            &nbsp;
                                          </span>
                                          :
                                          i > 0 ? `, ${listValue}` : `${listValue}`
                                        }
                                      </span>
                                      );
                                    })
                                : attribute.Value}
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
          <Modal
            aria-labelledby="delete-thing-modal"
            aria-describedby="delete-thing-modal-description"
            open={this.state.modalOpen}
            onClose={e => {this.setState({modalOpen: false})}}
          >
            <div style={this.getModalStyle()} className="paper">
              <Grid container spacing={1} direction="column">
                <Grid item>
                  Are you sure you want to delete {this.state.Name}?
                </Grid>
                <Grid item>
                  (All references to it will be left alone and may not work correctly)
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

const ThingDetails = connect(mapStateToProps, mapDispatchToProps)(Page);
export default ThingDetails;
