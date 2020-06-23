import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectWorld,
  addAndSelectWorld,
  updateWorld,
  notFromLogin,
  toggleLogin,
  setAttributes,
  setTypes,
  setThings,
  logout
} from "../../redux/actions/index";
import { Button, Checkbox, FormControl, FormControlLabel,
  OutlinedInput, InputLabel, FormHelperText, Grid, Tooltip, Fab
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Helmet } from 'react-helmet';
import API from "../../smartAPI";
import TemplatesModal from "../../components/Modals/TemplatesModal";
import TextBox from "../../components/Inputs/TextBox";

/* 
  This component will take the main portion of the page and is used for
  creating or editing a World.  It will allow the use of Template Worlds
  which come with preloaded Template Types.
*/

const mapStateToProps = state => {
  return {
    selectedPage: state.app.selectedPage,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    worlds: state.app.worlds,
    user: state.app.user,
    fromLogin: state.app.fromLogin,
    templates: state.app.templates,
    types: state.app.types,
    attributesByName: state.app.attributesByName,
    typeSuggestions: state.app.typeSuggestions,
    thingSuggestions: state.app.thingSuggestions
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectWorld: worldID => dispatch(selectWorld(worldID)),
    addAndSelectWorld: world => dispatch(addAndSelectWorld(world)),
    updateWorld: world => dispatch(updateWorld(world)),
    notFromLogin: () => dispatch(notFromLogin({})),
    toggleLogin: () => dispatch(toggleLogin({})),
    setAttributes: attributes => dispatch(setAttributes(attributes)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    logout: () => dispatch(logout({}))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // _id: null, // This gets used, but I'm intentionally making it undefined to start
      Name: "",
      Description: "",
      Public: false,
      AcceptingCollaborators: false,
      fieldValidation: {
        Name: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null,
      loaded: true,
      importMode: false,
      selectedTemplateIDs: [],
      tempSelectedTemplateIDs: []
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
  }

  handleUserInput = e => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState({ [name]: value });
  }

  inputBlur = e => {
    const name = e.target.name;
    const validation = this.validateField(name);
    const fieldValidation = this.state.fieldValidation;
    if (
      fieldValidation[name] !== undefined &&
      fieldValidation[name].valid !== validation.valid
    ) {
      fieldValidation[name].valid = validation.valid;
      fieldValidation[name].message = validation.message;
      this.setState({ fieldValidation: fieldValidation });
    }
  }

  a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  validateField = fieldName => {
    let value = this.state[fieldName];
    let valid = true;
    let message = "";
    switch (fieldName) {
      case "Name":
        valid = value.match(/^[a-zA-Z0-9 ]*$/i) !== null;
        if (!valid)
          message = "Only Letters, Numbers, and Spaces allowed in World Names";
        else if (value.length < 4) {
          valid = false;
          message = "World Name is too short";
        } else {
          valid =
            this.props.worlds.filter(
              w => w.Name === value && w._id !== this.state._id
            ).length === 0;
          if (!valid) message = "This World Name is already in use";
        }
        break;
      case "inviteEmail":
        valid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null;
        message = valid ? "" : "Email is invalid";
        break;
      default:
        break;
    }
    const response = { valid: valid, message: message };
    return response;
  }

  validateForm = respond => {
    const nameValid = this.validateField("Name");
    const formValid = nameValid.valid;
    const fieldValidation = this.state.fieldValidation;
    fieldValidation.Name = nameValid;
    this.setState(
      {
        formValid: formValid,
        fieldValidation: fieldValidation
      },
      respond
    );
  }

  onSubmit = () => {
    function respond() {
      if (this.state.formValid) {
        this.setState({ waiting: true }, this.submitThroughAPI);
      }
    }

    this.validateForm(respond);
  }

  submitThroughAPI = () => {
    const world = {
      _id: this.state._id,
      Name: this.state.Name.trim(),
      Description: this.state.Description.trim(),
      Public: this.state.Public,
      AcceptingCollaborators: this.state.AcceptingCollaborators,
      Owner: this.props.user._id
    };

    if (world._id === null) {
      this.api
        .createWorld(world)
        .then(res => {
          if (res.error !== undefined) {
            this.setState({ message: res.error }, () => {
              this.props.logout();
            });
          }
          else {
            world._id = res.worldID;
            this.props.addAndSelectWorld(world);
            // this.props.selectWorld(world._id);
            if (this.state.tempSelectedTemplateIDs === undefined || this.state.tempSelectedTemplateIDs.length === 0) {
              this.setState({
                waiting: false,
                redirectTo: `/world/details/${res.worldID}`
              });
            } else {
              this.setState({
                selectedTemplateIDs: this.state.tempSelectedTemplateIDs,
                tempSelectedTemplateIDs: []
              });
            }
          }
        })
        .catch(err => console.log(err));
    } else {
      this.api
        .updateWorld(world)
        .then(res => {
          if (res.error !== undefined) {
            this.setState({ message: res.error }, () => {
              this.props.logout();
            });
          }
          else {
            this.props.updateWorld(world);
            if (this.state.tempSelectedTemplateIDs === undefined || this.state.tempSelectedTemplateIDs.length === 0) {
              this.setState({
                waiting: false,
                redirectTo: `/world/details/${this.props.selectedWorldID}`
              });
            } else {
              this.setState({
                selectedTemplateIDs: this.state.tempSelectedTemplateIDs,
                tempSelectedTemplateIDs: []
              });
            }
          }
        })
        .catch(err => console.log(err));
    }
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
    if (this.state._id === null) {
      this.setState({
        Name: "",
        Description: "",
        AcceptingCollaborators: false,
        Public: false,
        loaded: true
      });
    }
    else {
      this.api.selectWorld(this.state._id).then(res => {
        this.props.selectWorld(this.state._id);
        this.api.getWorld(this.props.selectedWorldID).then(res => {
          this.props.setAttributes(res.attributes);
          this.props.setTypes(res.types);
          this.props.setThings(res.things);

          this.setState({
            Name: this.props.selectedWorld.Name,
            Description: this.props.selectedWorld.Description === undefined ? "" : this.props.selectedWorld.Description,
            AcceptingCollaborators: this.props.selectedWorld.AcceptingCollaborators === undefined ? false : this.props.selectedWorld.AcceptingCollaborators,
            Public: this.props.selectedWorld.Public,
            loaded: true
          });
        });
      });
    }
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
                if (templateIDs.length === 0) {
                  this.setState({
                    waiting: false,
                    redirectTo: `/world/details/${this.props.selectedWorldID}`,
                    selectedTemplateIDs: templateIDs 
                  });
                }
                else {
                  this.setState({ selectedTemplateIDs: templateIDs });
                }
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
            if (templateIDs.length === 0) {
              this.setState({
                waiting: false,
                redirectTo: `/world/details/${this.props.selectedWorldID}`,
                selectedTemplateIDs: templateIDs 
              });
            }
            else {
              this.setState({ selectedTemplateIDs: templateIDs });
            }
          });
        } else {
          this.addAttributesToDumbTypesRecursive(typePos, types, newTypes, typeMap, attributes, attrMap, templateName);
        }
      }
    }
  }

  render() {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
    let { id } = this.props.match.params;
    if (id === undefined)
      id = null;
    if (this.state._id !== id) {
      this.load(id);
      return (<span>Loading...</span>);
    } else if (!this.state.loaded) {
      return (<span>Loading2...</span>);
    } else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.props.selectedWorld !== null && 
      this.props.user === null) {
      setTimeout(() => {
        this.props.toggleLogin();
      }, 500);
      return <span>Requires Login</span>;
    } else if (this.state._id !== null && this.props.selectedWorld !== null && 
      (this.props.user === null || this.props.selectedWorld.Owner !== this.props.user._id)) {
      return <Redirect to="/" />;
    } else if (this.state.importMode) {
      return (
        <TemplatesModal 
          templates={this.props.templates} 
          selectedTemplateIDs={this.state.tempSelectedTemplateIDs}
          onSubmit={ tempSelectedTemplateIDs => {
            this.setState({ tempSelectedTemplateIDs, importMode: false });
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
      const suggestions = [...this.props.typeSuggestions, ...this.props.thingSuggestions];
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          <Helmet>
            <title>{ this.state._id === null ? `Author's Notebook: Create New World` : `Author's Notebook: Edit ${this.props.selectedWorld.Name}` }</title>
          </Helmet>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={1}>
              { this.props.selectedWorld !== null &&
                <Tooltip title={`Back to ${this.props.selectedWorld.Name} Details`}>
                  <Fab size="small"
                    color="primary"
                    onClick={ _ => {this.setState({redirectTo:`/world/details/${this.props.selectedWorldID}`})}}
                  >
                    <ArrowBack />
                  </Fab>
                </Tooltip>
              }
            </Grid>
            <Grid item xs={11}>
              <h2>
                {this.state._id === null ? "Create New World" : "Edit World"}
              </h2>
            </Grid>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="name">Name</InputLabel>
              <OutlinedInput
                id="name"
                name="Name"
                type="text"
                autoComplete="Off"
                error={!this.state.fieldValidation.Name.valid}
                value={this.state.Name}
                onChange={this.handleUserInput}
                onBlur={this.inputBlur}
                labelWidth={43}
                fullWidth
              />
              <FormHelperText>
                {this.state.fieldValidation.Name.message}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item>
            {/* <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="description">Description</InputLabel>
              <OutlinedInput
                id="description"
                name="Description"
                type="text"
                autoComplete="Off"
                multiline
                value={this.state.Description}
                onChange={this.handleUserInput}
                onBlur={this.inputBlur}
                labelWidth={80}
                fullWidth
              />
            </FormControl> */}
            <TextBox 
              Value={this.state.Description} 
              fieldName="Description" 
              multiline={true}
              onBlur={desc => {
                this.setState({ Description: desc });
                // const type = this.props.selectedType;
                // type.Description = desc;
                // this.props.updateSelectedType(type);
              }}
              labelWidth={82}
              options={suggestions}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.Public}
                  onChange={this.handleUserInput}
                  name="Public"
                  color="primary"
                />
              }
              label="Public"
            />
            { this.state.Public ?
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.AcceptingCollaborators}
                  onChange={this.handleUserInput}
                  name="AcceptingCollaborators"
                  color="primary"
                />
              }
              label="Accepting Collaborator Requests"
            /> : "" }
          </Grid>
          <Grid item>{this.state.message}</Grid>
          { this.state.tempSelectedTemplateIDs !== undefined && this.state.tempSelectedTemplateIDs.length > 0 &&
            <Grid item>Templates will be imported on submit</Grid>
          }
          <Grid item container spacing={1} direction="row">
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                disabled={this.state.waiting}
                onClick={_ => {
                  this.setState({ importMode: true });
                }}
                type="submit"
              >
                Import Templates
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                fullWidth
                color="primary"
                disabled={this.state.waiting}
                onClick={this.onSubmit}
                type="submit"
              >
                {this.state.waiting ? "Please Wait" : "Submit"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                fullWidth
                disabled={this.state.waiting}
                onClick={_ => {
                  this.setState({
                    redirectTo: this.state._id === null ? `/` : `/world/details/${this.state._id}`
                  });
                }}
                type="button"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            {Object.keys(this.state.fieldValidation).map((fieldName, i) => {
              if (
                this.state.fieldValidation[fieldName] !== undefined &&
                this.state.fieldValidation[fieldName].message.length > 0
              ) {
                return (
                  <p className="redFont" key={i}>
                    {this.state.fieldValidation[fieldName].message}
                  </p>
                );
              } else {
                return "";
              }
            })}
          </Grid>
        </Grid>
      );
    }
  }
}

const WorldEditPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default WorldEditPage;