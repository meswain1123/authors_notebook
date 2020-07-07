import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ArrowBack, Edit, Delete } from "@material-ui/icons";
import { 
  Fab, Tooltip, Modal, Grid, Button, 
  List, ListItem, ListItemText, Box
} from "@material-ui/core";
import { Helmet } from 'react-helmet';
import {
  updateSelectedThing,
  addThing,
  updateThing,
  setAttributes,
  setTypes,
  setThings,
  setAllUsers,
  notFromLogin,
  toggleLogin,
  logout,
  selectWorld
} from "../../redux/actions/index";
import API from "../../smartAPI";
import ThingTable from "../../components/Displays/ThingTable";
import CommentsControl from "../../components/Inputs/CommentsControl";

const mapStateToProps = state => {
  const thing = state.app.selectedThing;
  return {
    selectedPage: state.app.selectedPage,
    selectedThing: thing,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    types: state.app.types,
    things: state.app.things,
    user: state.app.user,
    attributesByID: state.app.attributesByID,
    fromLogin: state.app.fromLogin,
    allUsers: state.app.allUsers,
    typeSuggestions: state.app.typeSuggestions,
    thingSuggestions: state.app.thingSuggestions
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedThing: thing => dispatch(updateSelectedThing(thing)),
    addThing: thing => dispatch(addThing(thing)),
    updateThing: thing => dispatch(updateThing(thing)),
    setAttributes: attrs => dispatch(setAttributes(attrs)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    setAllUsers: allUsers => dispatch(setAllUsers(allUsers)),
    notFromLogin: () => dispatch(notFromLogin({})),
    toggleLogin: () => dispatch(toggleLogin({})),
    logout: () => dispatch(logout({})),
    selectWorld: worldID => dispatch(selectWorld(worldID))
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
      AttributesArr: [],
      fieldValidation: {
        Name: { valid: true, message: "" },
        AttributesArr: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null,
      modalOpen: false,
      majorType: null
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
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
    this.setState({ waiting: true }, this.finishDelete);
  }

  finishDelete = e => {
    this.api.deleteThing(this.props.selectedWorldID, this.state._id).then(res=>{
      if (res.error === undefined) {
        this.api.getWorld(this.props.selectedWorldID, true).then(res2 => {
          this.props.setAttributes(res2.attributes);
          this.props.setTypes(res2.types);
          this.props.setThings(res2.things);

          this.setState({ waiting: false, redirectTo: `/project/details/${this.props.selectedWorldID}`});
        });
      }
      else {
        this.setState({ waiting: false, message: res.error }, () => {
          this.props.logout();
        });
      }
      // const things = this.props.things.filter(t=>t._id!==this.state._id);
      // this.props.setThings(things);
      // this.setState({redirectTo: `/project/details/${this.props.selectedWorldID}`})
    });
  }

  redirectToNext = () => {
    // Find the next thing
    const things = this.state.majorType === null ? this.props.things : this.props.things.filter(t => t.TypeIDs.includes(this.state.majorType._id));
    let index = 0;
    while (things[index]._id !== this.props.selectedThing._id)
      index++;
    index++;
    if (index === things.length)
      index = 0;
    this.setState({ 
      waiting: false, 
      redirectTo: `/thing/details/${things[index]._id}` 
    });
  }

  load = (id) => {
    setTimeout(() => {
      this.setState({
        _id: id,
        redirectTo: null,
        loaded: false
      }, this.finishLoading);
    }, 500);
  }

  finishLoading = () => {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
    const id = this.state._id;
    if (this.props.selectedWorldID) {
      this.api.getWorld(this.props.selectedWorldID).then(res => {
        this.props.setAttributes(res.attributes);
        this.props.setTypes(res.types);
        this.props.setThings(res.things);
        
        if (id !== undefined) {
          let thing = res.things.filter(t => t._id === id);
          if (thing.length === 0) {
            this.setState({ message: "Invalid Thing ID", loaded: true });
          }
          else {
            thing = thing[0];
            thing.AttributesArr = [];
            thing.Attributes.forEach(a => {
              const attr = this.props.attributesByID[a.attrID];
              thing.AttributesArr.push({
                index: thing.AttributesArr.length,
                Name: attr.Name,
                AttributeType: attr.AttributeType,
                Options: attr.Options,
                DefinedType: attr.DefinedType,
                ListType: attr.ListType,
                attrID: a.attrID,
                Value: a.Value,
                ListValues: a.ListValues,
                TypeIDs: attr.TypeIDs
              });
            });
            this.props.updateSelectedThing(thing);
            if (this.state.majorType === null) {
              let majorType = thing.Types.filter(t=>t.Major);
              if (majorType.length > 0) {
                majorType = majorType[0];
                
                this.setState({
                  Name: thing.Name,
                  Description: thing.Description,
                  _id: id,
                  Types: thing.Types,
                  majorType,
                  loaded: true
                });
              }
              else {
                this.setState({
                  Name: thing.Name,
                  Description: thing.Description,
                  _id: id,
                  Types: thing.Types,
                  loaded: true
                });
              }
            }
            else {
              this.setState({
                Name: thing.Name,
                Description: thing.Description,
                _id: id,
                Types: thing.Types,
                loaded: true
              });
            }
          }
        } else {
          this.props.updateSelectedThing({
            _id: null,
            Name: "",
            Description: "",
            Types: [],
            Attributes: [],
            AttributesArr: []
          });
          this.setState({ loaded: true });
        }
      });
    } else {
      this.api.getWorldByThingID(id).then((res) => {
        this.props.selectWorld(res.worldID);
        this.props.setAttributes(res.attributes);
        this.props.setTypes(res.types);
        this.props.setThings(res.things);
        
        if (id !== undefined) {
          let thing = res.things.filter(t => t._id === id);
          if (thing.length === 0) {
            this.setState({ message: "Invalid Thing ID", loaded: true });
          }
          else {
            thing = thing[0];
            thing.AttributesArr = [];
            thing.Attributes.forEach(a => {
              const attr = this.props.attributesByID[a.attrID];
              thing.AttributesArr.push({
                index: thing.AttributesArr.length,
                Name: attr.Name,
                AttributeType: attr.AttributeType,
                Options: attr.Options,
                DefinedType: attr.DefinedType,
                ListType: attr.ListType,
                attrID: a.attrID,
                Value: a.Value,
                ListValues: a.ListValues,
                TypeIDs: attr.TypeIDs
              });
            });
            this.props.updateSelectedThing(thing);
            if (this.state.majorType === null) {
              let majorType = thing.Types.filter(t=>t.Major);
              if (majorType.length > 0) {
                majorType = majorType[0];
                
                this.setState({
                  Name: thing.Name,
                  Description: thing.Description,
                  _id: id,
                  Types: thing.Types,
                  majorType,
                  loaded: true
                });
              }
              else {
                this.setState({
                  Name: thing.Name,
                  Description: thing.Description,
                  _id: id,
                  Types: thing.Types,
                  loaded: true
                });
              }
            }
            else {
              this.setState({
                Name: thing.Name,
                Description: thing.Description,
                _id: id,
                Types: thing.Types,
                loaded: true
              });
            }
          }
        } else {
          this.props.updateSelectedThing({
            _id: null,
            Name: "",
            Description: "",
            Types: [],
            Attributes: [],
            AttributesArr: []
          });
          this.setState({ loaded: true });
        }
      });
    }
  }

  render() {
    const { id } = this.props.match.params;
    if (this.state._id !== id) {
      this.load(id);
      return (<span>Loading</span>);
    } else if (!this.state.loaded) {
      return (<span>Loading</span>);
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.props.selectedWorld !== null && 
      !this.props.selectedWorld.Public && 
      this.props.user === null) {
      setTimeout(() => {
        this.props.toggleLogin();
      }, 500);
      return <span>Requires Login</span>;
    } else if (this.props.selectedWorld !== null && 
      !this.props.selectedWorld.Public && 
      (this.props.selectedWorld.Owner !== this.props.user._id && 
        this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab").length === 0)) {
      return <Redirect to="/" />;
    // } else if (this.props.allUsers.length === 0) {
    //   setTimeout(() => {
    //     this.api.getAllUsers().then(res => {
    //       this.props.setAllUsers(res);
    //     });
    //   }, 500);
    //   return (<span>Loading</span>);
    } else {
      const references = this.props.things.filter(t=>t.ReferenceIDs !== undefined && t.ReferenceIDs.includes(this.state._id));
      const suggestions = [...this.props.typeSuggestions, ...this.props.thingSuggestions];
      return (
        <Grid item xs={12} container spacing={0} direction="column">
          { this.props.selectedWorld === null ? "" :
            <div>
              <Helmet>
                <title>{ `Author's Notebook: ${this.props.selectedWorld.Name}` }</title>
              </Helmet>
              <Grid item container spacing={0} direction="row">
                <Grid item xs={12} sm={8} container spacing={0} direction="column">
                  <Grid item container spacing={0} direction="row">
                    <Grid item xs={1}>
                      <Tooltip title={`Back to ${this.props.selectedWorld.Name}`}>
                        <Fab size="small"
                          color="primary"
                          onClick={ _ => {this.setState({redirectTo:`/project/details/${this.props.selectedWorldID}`})}}
                        >
                          <ArrowBack />
                        </Fab>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={11}>
                      <h2>{this.state.Name}</h2>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <div  dangerouslySetInnerHTML={{__html: this.state.Description}} />
                    
                    {/* {this.state.Description} */}
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <List>
                    { (this.props.user !== null && 
                      this.props.selectedWorld !== null && 
                      (this.props.selectedWorld.Owner === this.props.user._id || 
                        this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length > 0)) &&
                      <ListItem>
                        <Box display={{ xs: 'block', sm: 'none' }} width={1}>
                          <Grid container spacing={1} direction="row">
                            <Grid item xs={3}>
                              &nbsp;
                            </Grid>
                            <Grid item xs={4}>
                              <Tooltip title={`Edit ${this.state.Name}`}>
                                <Fab size="small"
                                  color="primary"
                                  onClick={ _ => {this.setState({redirectTo:`/thing/edit/${this.state._id}`})}}
                                >
                                  <Edit />
                                </Fab>
                              </Tooltip>
                            </Grid>
                            <Grid item xs={5}>
                              <Tooltip title={`Delete ${this.state.Name}`}>
                                <Fab size="small"
                                  color="primary"
                                  onClick={e => {this.setState({modalOpen: true})}}
                                >
                                  <Delete />
                                </Fab>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Box>
                        <Box display={{ xs: 'none', sm: 'block' }}>
                          <Grid container spacing={1} direction="column">
                            <Grid item>
                              <Tooltip title={`Edit ${this.state.Name}`}>
                                <Fab size="small"
                                  color="primary"
                                  onClick={ _ => {this.setState({redirectTo:`/thing/edit/${this.state._id}`})}}
                                >
                                  <Edit />
                                </Fab>
                              </Tooltip>
                            </Grid>
                            <Grid item>
                              <Tooltip title={`Delete ${this.state.Name}`}>
                                <Fab size="small"
                                  color="primary"
                                  onClick={e => {this.setState({modalOpen: true})}}
                                >
                                  <Delete />
                                </Fab>
                              </Tooltip>
                            </Grid>
                          </Grid>
                        </Box>
                      </ListItem>
                    }
                    <ListItem>
                      { this.state.majorType === null ?
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={_ => {
                            this.redirectToNext();
                          }}
                        >
                          <ListItemText primary="Next" />
                        </Button>
                      :
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={_ => {
                            this.redirectToNext();
                          }}
                        >
                          <ListItemText primary={`Next ${this.state.majorType.Name}`}/>
                        </Button>
                      }
                    </ListItem>
                  </List> 
                </Grid>
              </Grid>
              <Grid item container spacing={0} direction="row">
                <Grid item xs={12} sm={8}>
                  Attributes
                  <List>
                    { this.props.selectedThing !== null && this.props.selectedThing !== undefined &&
                      this.props.selectedThing.AttributesArr.map(
                        (attribute, i) => {
                          return (
                            <ListItem key={i}>
                              { attribute.AttributeType === "Type" && attribute.Value !== "" ?
                                <ThingTable 
                                  attributesByID={this.props.attributesByID} 
                                  label={attribute.Name} 
                                  things={this.props.things.filter(t=>t._id === attribute.Value)} 
                                  allThings={this.props.things}
                                />
                              : attribute.AttributeType === "List" && attribute.ListType === "Type" ?
                                <ThingTable 
                                  attributesByID={this.props.attributesByID} 
                                  label={attribute.Name} 
                                  things={this.props.things.filter(t=>attribute.ListValues.includes(t._id))} 
                                  allThings={this.props.things}
                                  buttonClick={thingID => {
                                    this.setState({redirectTo:`/thing/details/${thingID}`});
                                  }}
                                />
                              : attribute.AttributeType === "List" ?
                                <span>{attribute.Name}:&nbsp;
                                { attribute.ListValues.map(
                                  (listValue, i) => {
                                    return(
                                      <span key={i}>
                                        { 
                                          i > 0 ? `, ${listValue}` : `${listValue}`
                                        }
                                      </span>
                                    );
                                  })
                                }
                                </span>
                              : 
                                <span>{attribute.Name}:&nbsp;{attribute.Value}</span>
                              }
                            </ListItem>
                          );
                        }
                      )
                    }
                  </List>
                </Grid>
                <Grid item xs={12} sm={4} container spacing={0} direction="column">
                  { this.state.Types.length > 0 && 
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
                                onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}
                              >
                                <ListItemText primary={type.Name} />
                              </Button>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  }
                  { references.length > 0 &&
                    <Grid item>
                      <List>
                        <ListItem>
                          <ListItemText primary={"Referenced in:"} />
                        </ListItem>
                        {references.map((thing, i) => {
                          return (
                            <ListItem key={i}>
                              <Button fullWidth
                                variant="contained"
                                color="primary"
                                onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}
                              >
                                <ListItemText primary={thing.Name} />
                              </Button>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  }
                </Grid>
              </Grid>
              { this.props.selectedThing !== null &&
                <Grid item xs={12}>
                  <CommentsControl 
                    user={this.props.user} 
                    allUsers={this.props.allUsers}
                    object={this.props.selectedThing}
                    objectType="Thing"
                    world={this.props.selectedWorld}
                    api={this.api} 
                    onChange={this.commentsChange}
                    suggestions={suggestions}
                  /> 
                </Grid>
              }
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
            </div>
          }
        </Grid>
      );
    }
  }
}

const ThingDetails = connect(mapStateToProps, mapDispatchToProps)(Page);
export default ThingDetails;
