
import React, { Component } from "react";
// import { Redirect } from "react-router-dom";
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
import { 
  IconButton, 
  List, ListItem,
  // Checkbox, FormControl, FormControlLabel,
  // OutlinedInput, InputLabel, FormHelperText, 
  Grid, 
  // Tooltip, Fab
} from "@material-ui/core";
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
// import { ArrowBack } from "@material-ui/icons";
// import { Helmet } from 'react-helmet';
import API from "../../smartAPI";
// import TemplatesModal from "../../components/Modals/TemplatesModal";
// import ImportTemplatesControl from "../../components/WorldTemplateControls/ImportTemplatesControl";
// import TextBox from "../../components/Inputs/TextBox";

/**
 * This control imports the templates passed to it into the 
 * selected world.  It displays the name of the template it is
 * currently working on, along with the names of its attributes, 
 * types, and things (if any) and the status of each (pending,
 * importing, imported, defaults pending (this one happens when
 * it is a type with defaults for attributes of Type or 
 * List Type.  Then after it imports the things it comes back to
 * do their defaults.)).  It also has a pause/play control at 
 * the top, and it checks the status of it before starting each
 * import.  If it's paused then it just waits.  If it gets 
 * unpaused then it checks to see what it needs to do next and 
 * picks back up.  Because of the possibility that it will get 
 * paused and unpaused during a single import, it needs to 
 * check for anything importing at the time that it gets 
 * unpaused.
 * Once all statuses are imported then it moves on to the next 
 * template.  Once all templates are imported then it triggers
 * the onCompleteEvent which goes back to the view and lets it 
 * do whatever it's supposed to do next (either reload details
 * or forward to details).
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
    things: state.app.things,
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
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templateID: null, 
      template: null, 
      importingTypes: [], 
      importingAttributes: [], 
      attributesStatus: "Pending",
      importingThings: [], 
      play: true,
      stepInProgress: false
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
  }

  takeNextStep = () => {
    if (this.state.play && !this.state.stepInProgress) {
      this.setState({ stepInProgress: true }, 
        this.reallyTakeNextStep
      );
    }
  }

  reallyTakeNextStep = () => {
    // First do a dumb import of all the types that aren't being merged
    const importingTypes = this.state.importingTypes;
    let type = importingTypes.filter(t => t.status === "Pending");
    if (type.length > 0) {
      type = type[0];
      type.status = "Importing";
      this.setState(
        { 
          importingTypes
        }, this.dumbImportType
      );
    } else {
      // Now upsert all of the attributes that aren't already ready
      const importingAttributes = this.state.importingAttributes;
      let attributes = importingAttributes.filter(a => a.status === "Pending");
      if (attributes.length > 0) {
        this.setState(
          {
            attributesStatus: "Importing"
          },
          this.upsertAttributes
        );
      } else {
        // Now we do a dumb import on the things that aren't going to be merged
        const importingThings = this.state.importingThings;
        let thing = importingThings.filter(t => t.status === "Pending");
        if (thing.length > 0) {
          thing = thing[0];
          let existingThing = this.props.things.filter(t => t.Name.trim().toLowerCase() === thing.Name.trim().toLowerCase());
          if (existingThing.length > 0) {
            existingThing = existingThing[0];

            // It already exists, so add it to the mapping, etc then move on.
            thing.thing = existingThing;
            thing.status = "More Pending";
            const thingMap = this.state.thingMap;
            // const attrMap = this.state.attributeMap;
            // const thingMap = this.state.thingMap;
            thingMap[thing.templateThing.thingID] = existingThing;
            this.setState(
              { 
                importingThings, 
                thingMap,
                stepInProgress: false 
              }, 
              this.takeNextStep
            );
          } else {
            thing.status = "Importing";
            this.setState(
              { 
                importingThings
              }, this.dumbImportThing
            );
          }
        } else {
          // Now we need to go back through the types and update them
          type = importingTypes.filter(t => t.status === "More Pending");
          if (type.length > 0) {
            type = type[0];
            type.status = "Importing";
            this.setState(
              { 
                importingTypes
              }, this.importType
            );
          } else {
            // Now we need to go back through the things and update them
            thing = importingThings.filter(t => t.status === "More Pending");
            if (thing.length > 0) {
              thing = thing[0];
              thing.status = "Importing";
              this.setState(
                { 
                  importingThings
                }, this.importThing
              );
            } else {
              // Yay!  We're done.
              if (this.props.onComplete)
                this.props.onComplete();
            }
          }
        }
      }
    }
  }

  upsertAttributes = () => {
    const importingAttributes = this.state.importingAttributes;
    let attributes = importingAttributes.filter(a => a.status === "Pending");
      
    const typeMap = this.state.typeMap;
    const attributeMap = this.state.attributeMap;
    const templateName = this.state.template.Name;
    const upsertUs = [];
    attributes.forEach(a => {
      let upsert = false;
      const attribute = {...a.templateAttribute};
      attribute.worldID = this.props.selectedWorldID;
      delete attribute.attrID;
      if (attribute.AttributeType === "Type" || (attribute.AttributeType === "List" && attribute.ListType === "Type")) {
        // We need to fix DefinedType
        attribute.DefinedType = typeMap[attribute.DefinedType]._id;
      }
      const existingAttribute = this.props.attributesByName[attribute.Name];
      if (existingAttribute !== undefined) {
        // We've got a matching name.  Check if the types match.
        if (attribute.AttributeType !== existingAttribute.AttributeType || (attribute.AttributeType === "List" && attribute.ListType !== existingAttribute.ListType)) {
          // They don't, so we need to change the name.
          attribute.Name += ` From Template (${templateName})`;
          upsert = true;
        } else {
          // It matches, so we can merge them.
          attribute._id = existingAttribute._id;
          if (attribute.AttributeType === "Options" || (attribute.AttributeType === "List" && attribute.ListType === "Options")) {
            // It's Options, so we need to merge the Options.
            const attrOptions = attribute.Options;
            attribute.Options = existingAttribute.Options;
            attrOptions.forEach(o => {
              if (!attribute.Options.includes(o)){
                attribute.Options.push(o);
                upsert = true;
              }
            });
          }
          if (!upsert) {
            a.status = "Imported";
          }
          a.attribute = attribute;
          attributeMap[a.templateAttribute.attrID] = attribute;
        }
      } else {
        upsert = true;
      }
      if (upsert) {
        upsertUs.push(attribute);
      }
    });
    if (upsertUs.length > 0) {
      this.api.upsertAttributes(this.props.selectedWorldID, upsertUs).then(res => {
        attributes.forEach(a => {
          let id = res.attributes[a.templateAttribute.Name];
          let upserted = upsertUs.filter(a2 => a2.Name === a.templateAttribute.Name);
          if (id === undefined || id === null) {
            id = res.attributes[`${a.templateAttribute.Name} From Template (${templateName})`];
            upserted = upsertUs.filter(a2 => a2.Name === `${a.templateAttribute.Name} From Template (${templateName})`);
          }
          upserted = upserted[0];
          upserted._id = id;
          a.status = "Imported";
          a.attribute = upserted;
          attributeMap[a.templateAttribute.attrID] = upserted;
        });

        this.setState(
          { 
            importingAttributes: attributes, 
            attributeMap,
            stepInProgress: false,
            attributesStatus: "Imported"
          }, 
          this.takeNextStep
        );
      });
    } else {
      this.setState(
        { 
          importingAttributes: attributes, 
          attributesStatus: "Imported",
          attributeMap,
          stepInProgress: false
        }, 
        this.takeNextStep
      );
    }
  }

  dumbImportType = () => {
    const importingTypes = this.state.importingTypes;
    let type = importingTypes.filter(t => t.status === "Importing")[0];
    let existingType = this.props.types.filter(t => t.Name.trim().toLowerCase() === type.templateType.Name.trim().toLowerCase());
    if (existingType.length > 0) {
      existingType = existingType[0];
      this.api.updateType(existingType).then(res => {
        if (res.error === undefined) {
          type.type = existingType;
          type.status = "More Pending";
          const typeMap = this.state.typeMap;
          typeMap[type.templateType.typeID] = existingType;
          this.setState(
            { 
              importingTypes, 
              typeMap,
              stepInProgress: false 
            }, 
            this.takeNextStep
          );
        } else {
          console.log(res.error);
        }
      });
    } else {
      const dumbType = {
        _id: null,
        Name: type.templateType.Name,
        Description: type.templateType.Description,
        SuperIDs: [],
        AttributesArr: [],
        Attributes: [],
        worldID: this.props.selectedWorldID,
        Major: type.templateType.Major,
        EditUserID: this.props.user._id
      };
      this.api.createType(dumbType).then(res => {
        if (res.error === undefined) {
          dumbType._id = res.typeID;
          type.type = dumbType;
          type.status = "More Pending";
          const typeMap = this.state.typeMap;
          typeMap[type.templateType.typeID] = dumbType;
          this.setState(
            { 
              importingTypes, 
              typeMap,
              stepInProgress: false 
            }, 
            this.takeNextStep
          );
        } else {
          console.log(res.error);
        }
      });
    }
  }

  dumbImportThing = () => {
    const importingThings = this.state.importingThings;
    let thing = importingThings.filter(t => t.status === "Importing")[0];
    const dumbThing = {
      _id: null,
      Name: thing.templateThing.Name,
      Description: thing.templateThing.Description,
      worldID: this.props.selectedWorldID,
      TypeIDs: [],
      Attributes: [],
      ReferenceIDs: [],
      EditUserID: this.props.user._id
    };
    this.api.createThing(dumbThing).then(res => {
      if (res.error === undefined) {
        dumbThing._id = res.thingID;
        thing.thing = dumbThing;
        thing.status = "More Pending";
        const thingMap = this.state.thingMap;
        thingMap[thing.templateThing.thingID] = dumbThing;
        this.setState(
          { 
            importingThings, 
            thingMap,
            stepInProgress: false 
          }, 
          this.takeNextStep
        );
      } else {
        console.log(res.error);
      }
    });
  }

  importType = () => {
    const typeMap = this.state.typeMap;
    const attributeMap = this.state.attributeMap;
    const thingMap = this.state.thingMap;
    const importingTypes = this.state.importingTypes;
    const templateType = importingTypes.filter(t => t.status === "Importing")[0];
    let type = this.props.types.filter(t => t.Name === templateType.templateType.Name);
    if (type.length > 0) {
      type = type[0];
      templateType.templateType.SuperIDs.forEach(s => {
        const superID = typeMap[s]._id;
        if (!type.SuperIDs.includes(superID))
          type.SuperIDs.push(superID);
      });
      templateType.templateType.Attributes.forEach(a => {
        const attribute = attributeMap[a.attrID];
        if (type.Attributes.filter(a2 => a2.attrID === attribute._id).length === 0) {
          type.Attributes.push({
            attrID: attribute._id,
            index: type.Attributes.length
          });
        }
      });
      templateType.templateType.Defaults.forEach(d => {
        const attribute = attributeMap[d.attrID];
        let theDefault = type.Defaults.filter(d2 => d2.attrID === attribute._id);
        if (theDefault.length === 0) {
          type.Defaults.push({
            attrID: attribute._id,
            DefaultValue: d.DefaultValue,
            DefaultListValues: d.DefaultListValues
          });
        } else if (attribute.AttributeType === "List") {
          theDefault = theDefault[0];
          if (attribute.ListType === "Type") {
            d.DefaultListValues.forEach(v => {
              const id = thingMap[v]._id;
              if (!theDefault.DefaultListValues.includes(id)) {
                theDefault.DefaultListValues.push(id);
              }
            });
          } else {
            d.DefaultListValues.forEach(v => {
              if (!theDefault.DefaultListValues.includes(v)) {
                theDefault.DefaultListValues.push(v);
              }
            });
          }
        }
      });
      this.api.updateType(type).then(res => {
        if (res.error === undefined) {
          templateType.status = "Imported";
          this.setState(
            { 
              importingTypes,
              stepInProgress: false
            }, 
            this.takeNextStep
          );
        } else {
          console.log(res.error);
        }
      });
    } else {
      type = templateType.type;
      templateType.templateType.SuperIDs.forEach(s => {
        type.SuperIDs.push(typeMap[s]._id);
      });
      templateType.templateType.Attributes.forEach(a => {
        type.Attributes.push({
          attrID: attributeMap[a.attrID]._id,
          index: type.Attributes.length
        });
      });
      if (type.Defaults === undefined || type.Defaults === null) {
        type.Defaults = [];
      }
      templateType.templateType.Defaults.forEach(d => {
        let attribute = attributeMap[d.attrID];
        // let theDefault = type.Defaults.filter(d2 => d2.attrID === attribute._id);
        // if (theDefault.length === 0) {
          let DefaultValue = d.DefaultValue;
          let DefaultListValues = d.DefaultListValues;
          if (attribute.AttributeType === "Type") {
            DefaultValue = thingMap[DefaultValue]._id;
          } else if (attribute.AttributeType === "List" && attribute.ListType === "Type") {
            DefaultListValues = [];
            d.DefaultListValues.forEach(v => {
              DefaultListValues.push(thingMap[v]._id);
            });
          }
          type.Defaults.push({
            attrID: attribute._id,
            DefaultValue,
            DefaultListValues
          });
      });
      this.api.updateType(type).then(res => {
        if (res.error === undefined) {
          templateType.status = "Imported";
          this.setState(
            { 
              importingTypes,
              stepInProgress: false
            }, 
            this.takeNextStep
          );
        } else {
          console.log(res.error);
        }
      });
    }
  }

  importThing = () => {
    const typeMap = this.state.typeMap;
    const attributeMap = this.state.attributeMap;
    const thingMap = this.state.thingMap;
    const importingThings = this.state.importingThings;
    const templateThing = importingThings.filter(t => t.status === "Importing")[0];
    let thing = this.props.things.filter(t => t.Name === templateThing.templateThing.Name);
    if (thing.length > 0) {
      thing = thing[0];
      templateThing.templateThing.TypeIDs.forEach(t => {
        const typeID = typeMap[t]._id;
        if (!thing.TypeIDS.includes(typeID))
          thing.TypeIDs.push(typeID);
      });
      templateThing.templateThing.Attributes.forEach(a => {
        const attribute = attributeMap[a.attrID];
        let Value = a.Value;
        let ListValues = a.ListValues;
        if (thing.Attributes.filter(a2 => a2.attrID === attribute._id).length > 0) {
          if (attribute.AttributeType === "List") {
            // if it exists and isn't a list type then we leave it alone
            const attr = thing.Attributes.filter(a2 => a2.attrID === attribute._id)[0];
            ListValues = attr.ListValues;
            a.ListValues.forEach(v => {
              if (attribute.ListType === "Type") {
                const id = thingMap[v]._id;
                if (!ListValues.includes(id)) {
                  ListValues.push(id);
                  thing.ReferenceIDs.push(id);
                }
              } else if (!ListValues.includes(v)) {
                ListValues.push(v);
              }
            });
          }
        } else {
          if (attribute.AttributeType === "Type") {
            Value = thingMap[a.Value]._id;
            thing.ReferenceIDs.push(Value);
          } else if (attribute.AttributeType === "List" && attribute.ListType === "Type") {
            ListValues = [];
            a.ListValues.forEach(v => {
              ListValues.push(thingMap[v]._id);
              thing.ReferenceIDs.push(thingMap[v]._id);
            });
          }
          thing.Attributes.push({
            attrID: attribute._id,
            index: thing.Attributes.length,
            Value,
            ListValues
          });
        }
      });
      this.api.updateThing(thing).then(res => {
        if (res.error === undefined) {
          templateThing.status = "Imported";
          this.setState(
            { 
              importingThings,
              stepInProgress: false
            }, 
            this.takeNextStep
          );
        } else {
          console.log(res.error);
        }
      });
    } else {
      thing = templateThing.thing;
      templateThing.templateThing.TypeIDs.forEach(t => {
        thing.TypeIDs.push(typeMap[t]._id);
      });
      templateThing.templateThing.Attributes.forEach(a => {
        const attribute = attributeMap[a.attrID];
        let Value = a.Value;
        let ListValues = a.ListValues;
        if (attribute.AttributeType === "Type") {
          Value = thingMap[a.Value]._id;
          thing.ReferenceIDs.push(Value);
        } else if (a.AttributeType === "List" && a.ListType === "Type") {
          ListValues = [];
          a.ListValues.forEach(v => {
            ListValues.push(thingMap[v]._id);
            thing.ReferenceIDs.push(thingMap[v]._id);
          });
        }
        thing.Attributes.push({
          attrID: attribute.attrID,
          index: a.index,
          Value,
          ListValues
        });
      });
      this.api.updateThing(thing).then(res => {
        if (res.error === undefined) {
          templateThing.status = "Imported";
          this.setState(
            { 
              importingThings,
              stepInProgress: false
            }, 
            this.takeNextStep
          );
        } else {
          console.log(res.error);
        }
      });
    }
  }

  render() {
    if (this.props.templateID !== this.state.templateID) {
      let template = this.props.templates.filter(t => t._id === this.props.templateID);
      if (template.length > 0) {
        template = template[0];
        const importingTypes = [];
        template.Types.forEach(t => {
          importingTypes.push({
            status: "Pending",
            templateType: t,
            type: null
          });
        });
        const importingAttributes = [];
        template.Attributes.forEach(a => {
          importingAttributes.push({
            status: "Pending",
            templateAttribute: a,
            attribute: null
          });
        });
        const importingThings = [];
        if (template.Things !== undefined && template.Things !== null) {
          template.Things.forEach(t => {
            importingThings.push({
              status: "Pending",
              templateThing: t,
              thing: null
            });
          });
        }
        this.setState(
          { 
            templateID: this.props.templateID, 
            template, 
            importingTypes, 
            importingAttributes, 
            attributesStatus: "Pending",
            importingThings, 
            play: true,
            typeMap: {},
            attributeMap: {},
            thingMap: {},
            stepInProgress: false
          }, 
          this.takeNextStep
        );
      }
    }
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item>
          <List>
            <ListItem>
              { this.state.play ? 
                <IconButton 
                  aria-label="Pause Import"
                  onClick={_ => {
                    this.setState({ play: false });
                  }}>
                  <PauseCircleOutlineIcon />
                </IconButton>
              : 
                <IconButton 
                  aria-label="Pause Import"
                  onClick={_ => {
                    this.setState({ play: true }, this.takeNextStep);
                  }}>
                  <PlayCircleOutlineIcon />
                </IconButton>
              }
            </ListItem>
          </List>
        </Grid>
        <Grid item>
          Importing {this.props.templates.filter(t => t._id === this.props.templateID )[0].Name}.  Please Wait.
        </Grid>
        <Grid item>
          Types:
        </Grid>
        { this.state.importingTypes.map((type, key) => {
          return (
            <Grid item key={key} container spacing={0} direction="row">
              <Grid item xs={6}>
                {type.templateType.Name}
              </Grid>
              <Grid item xs={6} style={{ color: (type.status === "Importing" ? "blue" : (type.status === "Imported" ? "green" : "grey")) }}>
                {type.status}
              </Grid>
            </Grid>
          );
        })}
        <Grid item container spacing={0} direction="row">
          <Grid item xs={6}>
            Attributes: 
          </Grid>
          <Grid item xs={6} style={{ color: (this.state.attributesStatus === "Importing" ? "blue" : (this.state.attributesStatus === "Imported" ? "green" : "grey")) }}>
            {this.state.attributesStatus}
          </Grid>
        </Grid>
        { this.state.importingThings.length > 0 && 
          <Grid item container spacing={1} direction="column">
            <Grid item>
              Things:
            </Grid>
            { this.state.importingThings.map((thing, key) => {
              return (
                <Grid item key={key} container spacing={0} direction="row">
                  <Grid item xs={6}>
                    {thing.templateThing.Name}
                  </Grid>
                  <Grid item xs={6} style={{ color: (thing.status === "Importing" ? "blue" : (thing.status === "Imported" ? "green" : "grey")) }}>
                    {thing.status}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        }
      </Grid>
    );
  }
}

const ImportingTemplatesControl = connect(mapStateToProps, mapDispatchToProps)(Control);
export default ImportingTemplatesControl;
