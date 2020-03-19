import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPage,
  updateSelectedType,
  addType,
  updateType,
  setTypes
} from "../../redux/actions/index";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import Add from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import API from "../../api";
import Grid from "@material-ui/core/Grid";
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab } from "@material-ui/core";

/* 
  This component will take the main portion of the page and is used for
  creating or editing a Type.  It will allow the use of Template Types
  and Super Types to make the process faster.
*/

const mapStateToProps = state => {
  const type = state.app.selectedType;
  const subTypes =
    type === null
      ? []
      : state.app.types.filter(t => t.SuperIDs.includes(type._id));
  const things =
    type === null
      ? []
      : state.app.things.filter(t => t.TypeIDs.includes(type._id));
  return {
    selectedPage: state.app.selectedPage,
    selectedType: type,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    types: state.app.types,
    subTypes: subTypes,
    instances: things,
    user: state.app.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    updateSelectedType: type => dispatch(updateSelectedType(type)),
    addType: type => dispatch(addType(type)),
    updateType: type => dispatch(updateType(type)),
    setTypes: types => dispatch(setTypes(types))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Name: "",
      Description: "",
      Supers: [],
      Major: false,
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
      if (id !== undefined) { // When I move to storing more in session, this is the kind of place where I'll check.
        this.api.getType(this.props.selectedWorldID, id).then(res => {
          if (res.message === undefined) {
            const supers = this.props.types.filter(type =>
              res.SuperIDs.includes(type._id)
            );
            this.setState({
              Name: res.Name,
              Description: res.Description,
              _id: id,
              Supers: supers,
              Major: res.Major
            });
            this.props.updateSelectedType(res);
          }
          else {
            console.log(res.message);
          }
        });
      } else {
        this.props.updateSelectedType({
          _id: null,
          Name: "",
          Description: "",
          Supers: [],
          AttributesArr: [],
          Major: false
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
    this.api.deleteType(this.props.selectedWorldID, this.state._id).then(res=>{
      const types = this.props.types.filter(t=>t._id!==this.state._id);
      this.props.setTypes(types);
      this.setState({redirectTo: `/world/details/${this.props.selectedWorldID}`})
    });
  }

  render() { 
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.props.selectedWorld !== null && !this.props.selectedWorld.Public && (this.props.user === null || this.props.selectedWorld.Owner !== this.props.user._id)) {
      return <Redirect to="/" />;
    } else {
      const references = this.props.types.filter(t=>t.ReferenceIDs !== undefined && t.ReferenceIDs.includes(this.state._id));
      return (
        <Grid item xs={12} container spacing={0} direction="column">
          <Grid item container spacing={0} direction="row">
            <Grid item xs={6}>
              <h2>{this.state.Name}</h2>
            </Grid>
            <Grid item sm={3} xs={6}>
              <h3>{this.state.Major ? "Major Type" : ""}</h3>
            </Grid>
            <Grid item sm={3} xs={12}>
              { this.props.user !== null && this.props.selectedWorld !== null && this.props.selectedWorld.Owner === this.props.user._id ?
              <List>
                <ListItem>
                  <Tooltip title={`Create New ${this.state.Name}`}>
                    <Fab size="small"
                      color="primary"
                      href={`/thing/create/type_id_${this.state._id}`}
                    >
                      <Add />
                    </Fab>
                  </Tooltip>
                </ListItem>
                <ListItem>
                  <Tooltip title={`Edit ${this.state.Name}`}>
                    <Fab size="small"
                      color="primary"
                      href={`/type/edit/${this.state._id}`}
                    >
                      <Edit />
                    </Fab>
                  </Tooltip>
                </ListItem>
                <ListItem>
                  <Tooltip title={`Delete ${this.state.Name}`}>
                    <Fab size="small"
                      color="primary"
                      onClick={e => {this.setState({modalOpen: true})}}
                    >
                      <Delete />
                    </Fab>
                  </Tooltip>
                </ListItem>
              </List>
              : "" }
            </Grid>
          </Grid>
          <Grid item container spacing={0} direction="row">
            <Grid item sm={9} xs={12} container spacing={0} direction="column">
              <Grid item>{this.state.Description}</Grid>
              <Grid item>
                Attributes
                <List>
                  {this.props.selectedType === null ||
                  this.props.selectedType === undefined
                    ? ""
                    : this.props.selectedType.AttributesArr.map(
                        (attribute, i) => {
                          return (
                            <ListItem key={i}>
                              <ListItemText>
                                {attribute.Name}:&nbsp;
                                {attribute.Type === "Options" ? (
                                  <span>
                                    Options:
                                    {attribute.Options.map((option, j) => {
                                      return (
                                        <span key={j}>
                                          {j === 0 ? " " : ", "}
                                          {option}
                                        </span>
                                      );
                                    })}
                                  </span>
                                ) : attribute.Type === "Type" ? (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    href={`/type/details/${attribute.Type2}`}
                                  >
                                    <ListItemText primary={this.props.types.filter(t=>t._id === attribute.Type2)[0].Name}/>
                                  </Button>
                                ) : attribute.Type === "List" ? (
                                  <span>
                                    List:&nbsp;
                                    {attribute.ListType === "Options" ? (
                                      <span>
                                        Options:
                                        {attribute.Options.map((option, j) => {
                                          return (
                                            <span key={j}>
                                              {j === 0 ? " " : ", "}
                                              {option}
                                            </span>
                                          );
                                        })}
                                      </span>
                                    ) : attribute.ListType === "Type" ? (
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        href={`/type/details/${attribute.Type2}`}
                                      >
                                        <ListItemText primary={this.props.types.filter(t=>t._id === attribute.Type2)[0].Name}/>
                                      </Button>
                                    ) : (
                                      attribute.ListType
                                    )}
                                  </span>
                                ) : (
                                  attribute.Type
                                )}
                              </ListItemText>
                            </ListItem>
                          );
                        }
                      )}
                </List>
              </Grid>
            </Grid>
            <Grid item sm={3} xs={12} container spacing={0} direction="column">
              {this.state.Supers.length === 0 ? (
                ""
              ) : (
                <Grid item>
                  <List>
                    <ListItem>
                      <ListItemText primary={"Super Types"} />
                    </ListItem>
                    {this.state.Supers.map((superType, i) => {
                      return (
                        <ListItem key={i}>
                          <Button fullWidth
                            variant="contained"
                            color="primary"
                            href={`/type/details/${superType._id}`}
                          >
                            <ListItemText primary={superType.Name} />
                          </Button>
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>
              )}
              {this.props.subTypes.length === 0 ? (
                ""
              ) : (
                <Grid item>
                  <List>
                    <ListItem>
                      <ListItemText primary={"Sub Types"} />
                    </ListItem>
                    {this.props.subTypes.map((sub, i) => {
                      return (
                        <ListItem key={i}>
                          <Button fullWidth
                            variant="contained"
                            color="primary"
                            href={`/type/details/${sub._id}`}
                          >
                            <ListItemText primary={sub.Name} />
                          </Button>
                        </ListItem>
                      );
                    })}
                  </List>
                </Grid>
              )}
              {references.length === 0 ? (
                ""
              ) : (
                <Grid item>
                  <List>
                    <ListItem>
                      <ListItemText primary={"Referenced in:"} />
                    </ListItem>
                    {references.map((type, i) => {
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
              {this.props.instances.length === 0 ? (
                ""
              ) : (
                <Grid item>
                  <List>
                    <ListItem>
                      <ListItemText primary={"Instances"} />
                    </ListItem>
                    {this.props.instances.map((thing, i) => {
                      return (
                        <ListItem key={i}>
                          <Button fullWidth
                            variant="contained"
                            color="primary"
                            href={`/thing/details/${thing._id}`}
                          >
                            <ListItemText primary={thing.Name} />
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
            aria-labelledby="delete-type-modal"
            aria-describedby="delete-type-modal-description"
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

const TypeDetails = connect(mapStateToProps, mapDispatchToProps)(Page);
export default TypeDetails;