import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { 
  selectWorld, setTypes, setThings, setWorlds, 
  setPublicWorlds, updatePublicWorldForCollab,
  setAttributes, 
  setTemplates,
  updateAttributes,
  notFromLogin,
  toggleLogin
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
import { Helmet } from 'react-helmet';
import TemplateModal from "../../components/Modals/TemplateModal";
import TemplatesModal from "../../components/Modals/TemplatesModal";

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
    templates: state.app.templates
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectWorld: worldID => dispatch(selectWorld(worldID)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    setTemplates: templates => dispatch(setTemplates(templates)),
    setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds)),
    updatePublicWorldForCollab: world => dispatch(updatePublicWorldForCollab(world)),
    setAttributes: attributes => dispatch(setAttributes(attributes)),
    updateAttributes: attributes => dispatch(updateAttributes(attributes)),
    notFromLogin: () => dispatch(notFromLogin({})),
    toggleLogin: () => dispatch(toggleLogin({}))
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
      selectedTemplateIDs: []
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
    setTimeout(() => {
      this.props.selectWorld(id);
      this.api.getWorld(id).then(res => {
        this.props.setAttributes(res.attributes);
        this.props.setTypes(res.types);
        this.props.setThings(res.things);
      });
    }, 500);
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
    this.setState({ redirectTo: `/world/collaborate/${this.props.selectedWorldID}/${invite.collabID}` });
  }

  updateTemplates = () => {
    this.api.getTemplates().then(res => {
      this.props.setTemplates(res.templates);
      this.setState({ templateMode: false });
    });
  }

  importSelectedTemplates = () => {
    const templatesToImport = [...this.state.selectedTemplateIDs];
    if (templatesToImport.length > 0) {
      const template = {...this.props.templates.filter(t => t._id === templatesToImport[0])[0]};
      this.importDumbTypesRecursive(0, template.Types, [], {}, template.Attributes, template.Name);
    }
  }

  /**
   * This checks to see if a type by that name exists.
   * If so then it merges their descriptions and majorness,
   * then it puts it in the map.
   * If not then it inserts it with just name, description, 
   * and majorness, and puts it in the map.
   * After all the dumb types are merged or inserted and mapped,
   * and after all the attributes are merged, upserted, and mapped,
   * then we go through all the types and merge in their attributes.
   */
  importDumbTypesRecursive = (typePos, types, newTypes, typeMap, attributes, templateName) => {
    // function next() {
      
    // }
    const type = {...types[typePos]};
    const typeID = type.typeID;
    // Check for an existing Type with the same name.
    let existingType = this.props.types.filter(t => t.Name.trim().toLowerCase() === type.Name.trim().toLowerCase());
    if (existingType.length > 0) {
      existingType = existingType[0];
      typeMap[typeID] = existingType._id;
      newTypes.push(existingType);
      if (existingType.Description === type.Description && (existingType.Major || !type.Major)) {
        // Sans attributes, they match, so we can just move on.
        // next();
        typePos++;
        if (types.length === typePos) {
          // We're done with all the types.
          // Now for the attributes.
          this.compareAndFixAttributes(types, newTypes, typeMap, attributes, templateName);
        } else {
          this.importDumbTypesRecursive(typePos, types, newTypes, typeMap, attributes, templateName);
        }
      } else {
        if (existingType.Description !== type.Description) {
          existingType.Description += ` From Template (${templateName}) ${type.Description}`;
        }
        if (type.Major)
          existingType.Major = true;
        if (existingType.PluralName === undefined || existingType.PluralName === "")
          existingType.PluralName = type.PluralName;
        this.api.updateType(existingType).then(res => {
          // next();
          typePos++;
          if (types.length === typePos) {
            // We're done with all the types.
            // Now for the attributes.
            this.compareAndFixAttributes(types, newTypes, typeMap, attributes, templateName);
          } else {
            this.importDumbTypesRecursive(typePos, types, newTypes, typeMap, attributes, templateName);
          }
        });
      }
    } else {
      // Remove the attributes
      delete type.typeID;
      type.Attributes = [];
      type.worldID = this.props.selectedWorldID;
      // insert it
      this.api.createType(type).then(res => {
        if (res.error === undefined) {
          // map it
          typeMap[typeID] = res.typeID;
          type._id = res.typeID;
          newTypes.push(type);
          // next();
          typePos++;
          if (types.length === typePos) {
            // We're done with all the types.
            // Now for the attributes.
            this.compareAndFixAttributes(types, newTypes, typeMap, attributes, templateName);
          } else {
            this.importDumbTypesRecursive(typePos, types, newTypes, typeMap, attributes, templateName);
          }
        } else {
          console.log(res.error);
        }
      });
    }
  }
  
  /**
   * This goes through all the Attributes, 
   * and looks for existing Attributes with the same name.  
   * If it finds one it checks to see if they're compatible 
   * (same type, etc).  
   * If they're compatible then it merges them.  
   * If not then the new one gets the template name appended to its name.
   * Then they're upserted, and then all attributes are pulled, 
   * and it puts together a mapping of the ids to be used in the types.
   */
  compareAndFixAttributes = (types, newTypes, typeMap, attributes, templateName) => {
    const upsertUs = [];
    const nameChanges = {
      // oldName: newName
    };
    attributes.forEach(a => {
      const attribute = {...a};
      delete attribute.attrID;
      if (attribute.AttributeType === "Type" || (attribute.AttributeType === "List" && attribute.ListType === "Type")) {
        // We need to fix DefinedType
        attribute.DefinedType = typeMap[attribute.DefinedType];
      }
      const existingAttribute = this.props.attributesByName[attribute.Name];
      if (existingAttribute !== undefined) {
        // We've got a matching name.  Check if the types match.
        if (attribute.AttributeType !== existingAttribute.AttributeType || (attribute.AttributeType === "List" && attribute.ListType !== existingAttribute.ListType)) {
          // They don't, so we need to change the name.
          attribute.Name += ` From Template (${templateName})`;
          nameChanges[existingAttribute.Name] = attribute.Name;
        } else {
          // It matches, so we can merge them.
          attribute._id = existingAttribute._id;
          if (attribute.AttributeType === "Options" || (attribute.AttributeType === "List" && attribute.ListType === "Options")) {
            // It's Options, so we need to merge the Options.
            const attrOptions = attribute.Options;
            attribute.Options = existingAttribute.Options;
            attrOptions.forEach(o => {
              if (!attribute.Options.includes(o))
                attribute.Options.push(o);
            });
          }
        }
      }
      attribute.worldID = this.props.selectedWorldID;
      upsertUs.push(attribute);
    });
    // We've compared them, now we upsert.
    this.api.upsertAttributes(this.props.selectedWorldID, upsertUs).then(res => {
      // Now we need to build the map
      const attrMap = {
        // templateID: realID
      };
      attributes.forEach(a => {
        if (nameChanges[a.Name] !== undefined) {
          // The name changed so use the new name.
          attrMap[a.attrID] = res.attributes[nameChanges[a.Name]];
        } else {
          attrMap[a.attrID] = res.attributes[a.Name];
        }
      });
      // The map is built, so now we're done here, and we need to update the types with their attributes
      this.addAttributesToDumbTypesRecursive(0, types, newTypes, typeMap, attributes, attrMap, templateName);
    });
  }

  /**
   * Goes through each type and adds its attributes onto its 
   * corresponding type in newTypes, updates, then sends it back 
   * to the beginning of the process.
   * 
   */
  addAttributesToDumbTypesRecursive = (typePos, types, newTypes, typeMap, attributes, attrMap, templateName) => {
    const type = types[typePos];
    const newType = newTypes[typePos];
    if (type.Name !== newType.Name) {
      console.log("Names don't match");
      // If this happens then I did something wrong.  Should never happen
    }
    else {
      // function next() {
        
      // }
      let attributesAdded = false;
      if (newType.Attributes.length === 0) {
        // It's not a merged type, so just add the attributes.
        let index = 0;
        type.Attributes.forEach(attr => {
          const realID = attrMap[attr.attrID];
          newType.Attributes.push({
            attrID: realID, index
          });
          index++;
          attributesAdded = true;
        });
      } else {
        // It's a merged type, so we need to check each attribute to see if it's already on it.
        let index = newType.Attributes.length;
        type.Attributes.forEach(attr => {
          const realID = attrMap[attr.attrID];
          if (newType.Attributes.filter(a => a.attrID === realID).length === 0) {
            newType.Attributes.push({
              attrID: realID, index
            });
            index++;
            attributesAdded = true;
          }
        });
      }
      if (attributesAdded) {
        // Update the type
        this.api.updateType(newType).then(res => {
          if (res.error === undefined) {
            // Done.  Move on.
            // next();
            typePos++;
            if (types.length === typePos) {
              // We're done with all the types.
              // Now we see if there's another selected template.
              this.api.getWorld(this.props.selectedWorldID, true).then(res => {
                this.props.setAttributes(res.attributes);
                this.props.setTypes(res.types);
                this.props.setThings(res.things);

                let templateIDs = [...this.state.selectedTemplateIDs];
                templateIDs.splice(0);
                this.setState({ selectedTemplateIDs: templateIDs });
              });
            } else {
              this.addAttributesToDumbTypesRecursive(typePos, types, newTypes, typeMap, attributes, attrMap, templateName);
            }
          } else {
            console.log(res.error);
          }
        });
      } else {
        // Nothing to update.  Move on.
        // next();
        typePos++;
        if (types.length === typePos) {
          // We're done with all the types.
          // Now we see if there's another selected template.
          this.api.getWorld(this.props.selectedWorldID, true).then(res => {
            this.props.setAttributes(res.attributes);
            this.props.setTypes(res.types);
            this.props.setThings(res.things);

            let templateIDs = [...this.state.selectedTemplateIDs];
            templateIDs.splice(0);
            this.setState({ selectedTemplateIDs: templateIDs });
          });
        } else {
          this.addAttributesToDumbTypesRecursive(typePos, types, newTypes, typeMap, attributes, attrMap, templateName);
        }
      }
    }
  }

  render() {
    const { id } = this.props.match.params;
    if ((this.props.worlds.length > 0 || this.props.publicWorlds.length > 0) && (this.props.selectedWorldID === null || this.props.selectedWorldID !== id)) {
      this.load(id);
    }
    if (this.state.redirectTo !== null) {
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
        <TemplatesModal 
          templates={this.props.templates} 
          onSubmit={selectedTemplateIDs => {
            this.setState({ selectedTemplateIDs, importMode: false });
            // console.log(selectedTemplateIDs);
            // this.updateTemplates();
          }}
          onCancel={_ => {
            this.setState({ importMode: false });
          }} />
      );
    } else if (this.state.selectedTemplateIDs.length > 0) {
      setTimeout(() => {
        this.importSelectedTemplates();
      }, 500);
      return (
        <span>Importing {this.props.templates.filter(t => t._id === this.state.selectedTemplateIDs[0] )[0].Name}.  Please Wait.</span>
      );
    } else {
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
                  {this.props.selectedWorld.Description}
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
                                onClick={ _ => {this.setState({redirectTo:`/world/edit/${this.props.selectedWorldID}`})}}
                              >
                                <Edit />
                              </Fab>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={4} sm={12}>
                            <Tooltip title={`Edit Collaborators`}>
                              <Fab size="small" color="primary"
                                onClick={ _ => {this.setState({redirectTo:`/world/collaborators/${this.props.selectedWorldID}`})}}
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
                      { this.props.selectedWorld.Collaborators.filter(c=> c.userID === this.props.user._id).length === 0 ?
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
                </Grid>
              }
              <Grid item xs={12}>
                <Box display={{ xs: 'block', sm: 'none' }}>
                  <Index />
                </Box>
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
