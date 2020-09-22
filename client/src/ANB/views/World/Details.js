import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { 
  selectWorld, setTypes, setThings, setWorlds, 
  setPublicWorlds, updatePublicWorldForCollab,
  setAttributes, 
  setTemplates,
  setAllUsers,
  updateAttributes,
  notFromLogin,
  toggleLogin,
  // setViews
} from "../../redux/actions/index";
import API from "../../smartAPI";
import Index from "./Index";
import { 
  Edit, Delete, People
} from "@material-ui/icons";
import {
  List, ListItem, 
  Grid, Button, 
  Modal, Tooltip,
  Fab, Box
} from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Helmet } from 'react-helmet';
import TemplateModal from "../../components/Modals/TemplateModal";
// import TemplatesModal from "../../components/Modals/TemplatesModal";
import ImportTemplatesControl from "../../components/WorldTemplateControls/ImportTemplatesControl";
import ImportingTemplatesControl from "../../components/WorldTemplateControls/ImportingTemplatesControl";
import CommentsControl from "../../components/Inputs/CommentsControl";

const mapStateToProps = state => {
  return {
    selectedPage: state.app.selectedPage,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    worlds: state.app.worlds,
    publicWorlds: state.app.publicWorlds,
    types: state.app.types,
    things: state.app.things,
    user: state.app.user,
    attributesByID: state.app.attributesByID,
    attributesByName: state.app.attributesByName,
    fromLogin: state.app.fromLogin,
    templates: state.app.templates,
    allUsers: state.app.allUsers,
    typeSuggestions: state.app.typeSuggestions,
    thingSuggestions: state.app.thingSuggestions,
    // views: state.app.views
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectWorld: worldID => dispatch(selectWorld(worldID)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    setTemplates: templates => dispatch(setTemplates(templates)),
    setAllUsers: allUsers => dispatch(setAllUsers(allUsers)),
    setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds)),
    updatePublicWorldForCollab: world => dispatch(updatePublicWorldForCollab(world)),
    setAttributes: attributes => dispatch(setAttributes(attributes)),
    updateAttributes: attributes => dispatch(updateAttributes(attributes)),
    notFromLogin: () => dispatch(notFromLogin({})),
    toggleLogin: () => dispatch(toggleLogin({})),
    // setViews: views => dispatch(setViews(views))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      world: null,
      modalOpen: false,
      redirectTo: null,
      templateMode: false,
      importMode: false,
      selectedTemplateIDs: [],
      // recentTypeChanges: [],
      // recentThingChanges: [],
      expandRecentChanges: true
    };
    this.api = API.getInstance();
  }
  componentDidMount() {
  }

  getAttributes() {
    this.api.getAttributesForWorld(this.props.selectedWorldID).then(res => {
      if (res !== undefined && res.error === undefined) {
        // We store the attributes in two hashes, by name and by id
        this.props.setAttributes(res.attributes);
        this.getTypes();
      }
    });
  }

  getTypes() {
    this.api.getTypesForWorld(this.props.selectedWorldID).then(res => {
      if (res !== undefined && res.error === undefined) {
        // Add Supers to each type
        const types = res.types;
        const updateAttributes = [];
        types.forEach(t=> {
          t.Supers = [];
          t.SuperIDs.forEach(sID=> {
            t.Supers = t.Supers.concat(types.filter(t2=>t2._id === sID));
          });
          t.AttributesArr = [];
          t.Attributes.forEach(a => {
            const attr = this.props.attributesByID[a.attrID];
            attr.TypeIDs.push(t._id);
            updateAttributes.push(attr);
            t.AttributesArr.push({
              index: t.AttributesArr.length,
              Name: attr.Name,
              AttributeType: attr.AttributeType,
              Options: attr.Options,
              DefinedType: attr.DefinedType,
              ListType: attr.ListType,
              attrID: a.attrID,
              TypeIDs: a.TypeIDs
            });
          });
          const defHash = {};
          if (t.Defaults !== undefined) {
            t.Defaults.forEach(def => {
              defHash[def.attrID] = def;
            });
          }
          t.DefaultsHash = defHash;
        });
        this.props.updateAttributes(updateAttributes);
        this.props.setTypes(types);
        this.getThings();
      }
    });
  }

  getThings() {
    this.api.getThingsForWorld(this.props.selectedWorldID).then(res => {
      if (res !== undefined && res.error === undefined) {
        const things = res.things;
        things.forEach(t=> {
          t.Types = [];
          t.TypeIDs.forEach(tID=> {
            t.Types = t.Types.concat(this.props.types.filter(t2=>t2._id === tID));
          });
        });
        this.props.setThings(things);
      }
    });
  }

  delete = e => {
    this.api.deleteWorld(this.props.selectedWorldID).then(res=>{
      if (res.error === undefined) {
        this.api.getWorlds(true).then(res2 => {
          this.props.setPublicWorlds(res2.publicWorlds.worlds);
          this.props.setWorlds(res2.userWorlds.worlds);
          this.props.setTemplates(res2.templates.templates);
          this.props.setAllUsers(res2.allUsers);

          this.props.selectWorld(null);
          this.setState({modalOpen: false, redirectTo: `/`});
        });
      }
      else {
        this.setState({ waiting: false, message: res.error });
      }
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

  load = (id) => {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
    if (this.state.templateMode || this.state.importMode) {
      this.setState({ 
        loading: true, templateMode: false, importMode: false 
      }, _ => {
        this.props.selectWorld(id);
        this.api.getWorld(id).then(res => {
          this.props.setAttributes(res.attributes);
          this.props.setTypes(res.types);
          this.props.setThings(res.things);

          if (this.props.user !== null && this.props.user !== undefined) {
            this.loadViews();
          } else {
            this.setState({ 
              loading: false, 
              recentTypeChanges: [], 
              recentThingChanges: [] 
            });
          }
        });
      });
    } else {
      this.setState({ loading: true }, _ => {
        this.props.selectWorld(id);
        this.api.getWorld(id).then(res => {
          this.props.setAttributes(res.attributes);
          this.props.setTypes(res.types);
          this.props.setThings(res.things);

          if (this.props.user !== null && this.props.user !== undefined) {
            this.loadViews();
          } else {
            this.setState({ 
              loading: false, 
              recentTypeChanges: [], 
              recentThingChanges: [] 
            });
          }
          // this.setState({ loading: false });
        });
      });
    }
  }

  loadViews = () => {
    // function finish() {
    //   this.api.getViews(this.props.selectedWorldID, this.props.user._id).then(res => {
    //     const typeViews = res.filter(v => v.objectType === "Type");
    //     const recentTypeChanges = this.props.types.filter(t => t.EditUserID !== this.props.user._id && typeViews.filter(v => v.objectID === t._id && v.ViewDT < t.EditDT).length > 0);
    //     const thingViews = res.filter(v => v.objectType === "Type");
    //     const recentThingChanges = this.props.things.filter(t => t.EditUserID !== this.props.user._id && thingViews.filter(v => v.objectID === t._id && v.ViewDT < t.EditDT).length > 0);

    //     this.setState({ 
    //       loading: false, 
    //       recentTypeChanges, 
    //       recentThingChanges 
    //     });
    //   });
    // }
    if (this.state.loading) {
      // finish();
      this.api.getViews(this.props.selectedWorldID, this.props.user._id).then(res => {
        const typeViews = res.filter(v => v.objectType === "Type");
        const recentTypeChanges = this.props.types.filter(t => t.EditUserID !== this.props.user._id && typeViews.filter(v => v.objectID === t._id && v.ViewDT < t.EditDT).length > 0);
        const thingViews = res.filter(v => v.objectType === "Type");
        const recentThingChanges = this.props.things.filter(t => t.EditUserID !== this.props.user._id && thingViews.filter(v => v.objectID === t._id && v.ViewDT < t.EditDT).length > 0);

        this.setState({ 
          loading: false, 
          recentTypeChanges, 
          recentThingChanges 
        });
      });
    } else {
      this.setState({ 
        loading: true, templateMode: false, importMode: false 
      }, _ => {
        this.api.getViews(this.props.selectedWorldID, this.props.user._id).then(res => {
          const typeViews = res.filter(v => v.objectType === "Type");
          const recentTypeChanges = this.props.types.filter(t => t.EditUserID !== this.props.user._id && typeViews.filter(v => v.objectID === t._id && v.ViewDT < t.EditDT).length > 0);
          const thingViews = res.filter(v => v.objectType === "Type");
          const recentThingChanges = this.props.things.filter(t => t.EditUserID !== this.props.user._id && thingViews.filter(v => v.objectID === t._id && v.ViewDT < t.EditDT).length > 0);
  
          this.setState({ 
            loading: false, 
            recentTypeChanges, 
            recentThingChanges 
          });
        });
      });
    }
  }

  requestToCollaborate = () => {
    this.api.requestToCollaborate(this.props.selectedWorldID).then(res => {
      const world = this.props.selectedWorld;
      world.Collaborators.push(res);
      this.props.updatePublicWorldForCollab(world);
    });
  }

  respondToInvite = () => {
    const invite = this.props.selectedWorld.Collaborators.filter(c=> c.userID === this.props.user._id && c.type === "invite")[0];
    this.setState({ redirectTo: `/project/collaborate/${this.props.selectedWorldID}/${invite.collabID}` });
  }

  updateTemplates = () => {
    this.api.getTemplates().then(res => {
      this.props.setTemplates(res.templates);
      this.setState({ templateMode: false });
    });
  }

  render() {
    const { id } = this.props.match.params;
    if ((this.props.worlds.length > 0 || this.props.publicWorlds.length > 0) && (this.props.selectedWorldID === null || this.props.selectedWorldID !== id)) {
      this.load(id);
      return (<span>Loading</span>);
    } else if (this.state.recentTypeChanges === undefined && this.props.user !== null && this.props.user !== undefined) {
      this.loadViews();
      return (<span>Loading</span>);
    } else if (this.state.loading) {
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
    } else if (this.state.templateMode) {
      return (
        <TemplateModal 
          world={this.props.selectedWorld} 
          types={this.props.types}
          things={this.props.things}
          attributesByID={this.props.attributesByID}
          templates={this.props.templates} 
          onSave={_ => {
            this.updateTemplates();
          }}
          onCancel={_ => {
            this.setState({ templateMode: false });
          }}
          api={this.api} />
      );
    } else if (this.state.importMode) {
      return (
        <ImportTemplatesControl 
          templates={this.props.templates} 
          onSubmit={selectedTemplateIDs => {
            setTimeout(() => {
              this.setState(
                { 
                  selectedTemplateIDs, 
                  importMode: false 
                }
              );
            }, 500);
          }}
          onCancel={_ => {
            this.setState({ importMode: false });
          }} 
        />
      );
    } else if (this.state.selectedTemplateIDs.length > 0) {
      return (
        <ImportingTemplatesControl 
          templateID={this.state.selectedTemplateIDs[0]} 
          onComplete={_ => {
            this.api.getWorld(id, true).then(res => {
              this.props.setAttributes(res.attributes);
              this.props.setTypes(res.types);
              this.props.setThings(res.things);

              setTimeout(() => {
                const selectedTemplateIDs = [...this.state.selectedTemplateIDs];
                selectedTemplateIDs.shift();
                this.setState({ selectedTemplateIDs });
              }, 500);
            });
          }}
          onCancel={_ => {
            this.setState({ selectedTemplateIDs: [] });
          }}
        />
      );
    } else {
      const suggestions = [...this.props.typeSuggestions, ...this.props.thingSuggestions];
      return (
        <Grid item xs={12} container spacing={0} direction="column">
          {this.props.selectedWorld !== null && 
            <Grid item container spacing={0} direction="row">
              <Helmet>
                <title>{ `Author's Notebook: ${this.props.selectedWorld.Name}` }</title>
              </Helmet>
              <Grid item xs={12} sm={8} container spacing={0} direction="column">
                <Grid item>
                  <h2>{this.props.selectedWorld.Name}</h2>
                </Grid>
                <Grid item>
                  <div  dangerouslySetInnerHTML={{__html: this.props.selectedWorld.Description}} />
                  {/* {this.props.selectedWorld.Description} */}
                </Grid>
                <Grid item>
                  <Box display={{ xs: 'none', sm: 'block' }}>
                    <Index />
                  </Box>
                </Grid>
              </Grid>
              { this.props.user !== null &&
                <Grid item xs={12} sm={4}>
                  { this.props.selectedWorld.Owner === this.props.user._id ?
                    <List>
                      <ListItem>
                        <Grid container spacing={1} direction="row">
                          <Grid item xs={4} sm={12}>
                            <Tooltip title={`Edit ${this.props.selectedWorld.Name}`}>
                              <Fab size="small" color="primary"
                                onClick={ _ => {this.setState({redirectTo:`/project/edit/${this.props.selectedWorldID}`})}}
                              >
                                <Edit />
                              </Fab>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={4} sm={12}>
                            <Tooltip title={`Edit Collaborators`}>
                              <Fab size="small" color="primary"
                                onClick={ _ => {this.setState({redirectTo:`/project/collaborators/${this.props.selectedWorldID}`})}}
                              >
                              <People />
                              </Fab>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={4} sm={12}>
                            <Tooltip title={`Delete ${this.props.selectedWorld.Name}`}>
                              <Fab size="small" color="primary"
                                onClick={e => {this.setState({modalOpen: true})}}
                              >
                                <Delete />
                              </Fab>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </ListItem>
                      <ListItem>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={_ => {
                            this.setState({ templateMode: true });
                          }}
                        >
                          Create a Template
                        </Button>
                      </ListItem>
                      <ListItem>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={_ => {
                            this.setState({ importMode: true });
                          }}
                        >
                          Import Templates
                        </Button>
                      </ListItem>
                    </List>
                  : 
                    <List>
                      { this.props.selectedWorld.Collaborators !== undefined && this.props.selectedWorld.Collaborators.filter(c=> c.userID === this.props.user._id).length === 0 ?
                        <ListItem>
                          { this.props.selectedWorld.AcceptingCollaborators && 
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={this.requestToCollaborate}
                              type="button"
                            >
                              Request to Collaborate
                            </Button>
                          }
                        </ListItem>
                      : this.props.selectedWorld.Collaborators.filter(c=> c.userID === this.props.user._id && c.type === "request").length > 0 ?
                        <ListItem>
                          Waiting on Collaboration Request
                        </ListItem>
                      : this.props.selectedWorld.Collaborators.filter(c=> c.userID === this.props.user._id && c.type === "invite").length > 0 &&
                        <ListItem>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.respondToInvite}
                            type="button"
                          >
                            You've been invited to Collaborate
                          </Button>
                        </ListItem>
                      }
                    </List>
                  }
                  { this.state.recentTypeChanges !== undefined && (this.state.recentTypeChanges.length + this.state.recentThingChanges.length > 0) && 
                    <Grid container spacing={1} direction="column">
                      <Grid item>
                        {this.state.expandRecentChanges ? 
                          <Tooltip title={`Collapse Recent Changes`}>
                            <Button 
                              onClick={_ => {this.setState({ expandRecentChanges: false })}}>
                                <KeyboardArrowDownIcon/>
                            </Button>
                          </Tooltip>
                        :
                          <Tooltip title={`Expand Recent Changes`}>
                              <Button 
                                onClick={_ => {this.setState({ expandRecentChanges: true })}}>
                                <KeyboardArrowRightIcon/>
                              </Button>
                            </Tooltip>
                        }
                        <span className={"MuiTypography-root MuiListItemText-primary MuiTypography-body1"}>
                          Recent Changes ({this.state.recentTypeChanges.length + this.state.recentThingChanges.length})
                        </span>
                      </Grid>
                      { this.state.expandRecentChanges && 
                        <Grid item>
                          <List>
                            {
                              this.state.recentTypeChanges.map((type, i) => {
                                let editedByUser = this.props.allUsers.filter(u => u._id === type.EditUserID);
                                if (editedByUser.length > 0){
                                  editedByUser = editedByUser[0];
                                } else {
                                  editedByUser = {
                                    username: "Unknown"
                                  };
                                }
                                return (
                                  <ListItem key={i}>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={_ => {
                                        this.setState({redirectTo:`/type/details/${type._id}`});
                                      }}
                                      type="button"
                                    >
                                      {type.Name} ({new Date(type.EditDT).toDateString()}, {editedByUser.username})
                                    </Button>
                                  </ListItem>
                                );
                              })
                            }
                          </List>
                          <List>
                            {
                              this.state.recentThingChanges.map((thing, i) => {
                                let editedByUser = this.props.allUsers.filter(u => u._id === thing.EditUserID);
                                if (editedByUser.length > 0){
                                  editedByUser = editedByUser[0];
                                } else {
                                  editedByUser = null;
                                }
                                return (
                                  <ListItem key={i}>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={_ => {
                                        this.setState({redirectTo:`/thing/details/${thing._id}`});
                                      }}
                                      type="button"
                                    >
                                      {thing.Name} ({thing.EditDT}, {editedByUser.username})
                                    </Button>
                                  </ListItem>
                                );
                              })
                            }
                          </List>
                        </Grid>
                      }
                    </Grid>
                  }
                </Grid>
              }
              <Grid item xs={12}>
                <Box display={{ xs: 'block', sm: 'none' }}>
                  <Index />
                </Box>
              </Grid>
              <Grid item xs={12}>
                <CommentsControl 
                  user={this.props.user} 
                  allUsers={this.props.allUsers}
                  object={this.props.selectedWorld}
                  objectType="World"
                  world={this.props.selectedWorld}
                  api={this.api} 
                  onChange={this.commentsChange}
                  suggestions={suggestions}
                /> 
              </Grid>
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
