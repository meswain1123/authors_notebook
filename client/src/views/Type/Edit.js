import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import uuid from 'react-uuid';
import { ArrowBack, Add, Search } from "@material-ui/icons";
import { 
  Grid, Button, Checkbox, FormControl, FormControlLabel,
  InputLabel, Tooltip, Fab,
  Select, MenuItem,
  // List, ListItem
} from "@material-ui/core";
import { Helmet } from 'react-helmet';
import { Multiselect } from 'multiselect-react-dropdown';
import AttributesControl from "./AttributesControl";
// import AttributeControl from "./AttributeControl";
// import AttributeDefaultControl from "./AttributeDefaultControl";
import {
  updateSelectedType,
  addType,
  updateType,
  addAttributes,
  setAttributes,
  setTypes,
  setThings,
  notFromLogin,
  addThing,
  toggleLogin
} from "../../redux/actions/index";
import API from "../../smartAPI";
import TextBox from "../../components/Inputs/TextBox";
import NewTypeModal from "../../components/Modals/NewTypeModal";
import NewThingModal from "../../components/Modals/NewThingModal";

/* 
  This component will take the main portion of the page and is used for
  creating or editing a Type.  It will allow the use of Template Types
  and Super Types to make the process faster.
*/

const mapStateToProps = state => {
  return {
    selectedPage: state.app.selectedPage,
    selectedType: state.app.selectedType,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    types: state.app.types,
    things: state.app.things,
    user: state.app.user,
    attributesByID: state.app.attributesByID,
    attributesByName: state.app.attributesByName,
    fromLogin: state.app.fromLogin
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedType: type => dispatch(updateSelectedType(type)),
    addType: type => dispatch(addType(type)),
    updateType: type => dispatch(updateType(type)),
    addAttributes: attrs => dispatch(addAttributes(attrs)),
    setAttributes: attrs => dispatch(setAttributes(attrs)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    notFromLogin: () => dispatch(notFromLogin({})),
    addThing: thing => dispatch(addThing(thing)),
    toggleLogin: () => dispatch(toggleLogin({}))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: undefined,
      // Name: "",
      // Description: "",
      // Supers: [],
      // Attributes: [],
      Major: false,
      fieldValidation: {
        Name: { valid: true, message: "" },
        AttributesArr: { valid: true, message: "" },
        Attributes: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null,
      waiting: false,
      addMore: false,
      resetting: false,
      browseAttributes: false,
      browseAttributesSelected: "",
      browseTypesSelected: "",
      newThingType: {}
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
  }

  resetForm = () => {
    setTimeout(() => {
      let { id } = this.props.match.params;
      if (id !== undefined) {
        this.setState({
          resetting: false, 
          redirectTo: `/type/create`});
      }
      else {
        this.setState({
          resetting: false
        });
      }
    }, 500);
  };

  // handleUserInput = e => {
  //   const name = e.target.name;
  //   const value =
  //     e.target.type === "checkbox" ? e.target.checked : e.target.value;
  //   this.setState({ [name]: value });
  // };

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
  };

  validateField = fieldName => {
    let value = null;
    let valid = true;
    let message = "";
    switch (fieldName) {
      case "Name":
        value = this.props.selectedType[fieldName];
        valid = value.match(/^[a-zA-Z0-9 ]*$/i) !== null;
        if (!valid)
          message = "Only Letters, Numbers, and Spaces allowed in Type Names";
        else if (value.length < 2) {
          valid = false;
          message = "Type Name is too short";
        } else {
          valid =
            this.props.types.filter(
              t => t.Name === value && t._id !== this.state._id
            ).length === 0;
          if (!valid) message = "This Type Name is already in use";
        }
        break;
      case "AttributesArr":
        valid = true;
        value = this.props.selectedType[fieldName];
        message = "";
        for (let i = 0; i < value.length; i++) {
          const attrByName = this.props.attributesByName[value[i].Name];
          if (attrByName !== undefined && 
            attrByName._id !== value[i].attrID) {
            valid = false;
            message = `An attribute with the name '${value[i].Name}' already exists`;
            break;
          }
          else if ((value[i].AttributeType === "Type" || (value[i].AttributeType === "List" && value[i].ListType === "Type")) && (value[i].DefinedType === undefined || value[i].DefinedType === null || value[i].DefinedType === "")) {
            valid = false;
            message = `A Defined Type must be selected for ${value[i].Name}.`;
            break;
          }
          else if ((value[i].AttributeType === "Options" || (value[i].AttributeType === "List" && value[i].ListType === "Options")) && (value[i].Options === undefined || value[i].Options === null || value[i].Options.length === 0)) {
            valid = false;
            message = `At least one Option must be set for ${value[i].Name}.`;
            break;
          }
        } 
        break;
      case "Attributes":
        valid = true;
        value = this.props.selectedType[fieldName];
        message = "";
        for (let i = 0; i < value.length; i++) {
          const attrByName = this.props.attributesByName[value[i].Name];
          if (attrByName !== undefined && 
            attrByName._id !== value[i].attrID) {
            valid = false;
            message = `An attribute with this name already exists`;
            break;
          }
          else if ((value[i].AttributeType === "Type" || (value[i].AttributeType === "List" && value[i].ListType === "Type")) && (value[i].DefinedType === undefined || value[i].DefinedType === null || value[i].DefinedType === "")) {
            valid = false;
            message = `A Defined Type must be selected for ${value[i].Name}.`;
            break;
          }
          else if ((value[i].AttributeType === "Options" || (value[i].AttributeType === "List" && value[i].ListType === "Options")) && (value[i].Options === undefined || value[i].Options === null || value[i].Options.length === 0)) {
            valid = false;
            message = `At least one Option must be set for ${value[i].Name}.`;
            break;
          }
        } 
        break;
      default:
        break;
    }
    const response = { valid: valid, message: message };
    return response;
  };

  validateForm = respond => {
    const nameValid = this.validateField("Name");
    const attrArrValid = this.validateField("AttributesArr");
    // const attrValid = this.validateField("Attributes");
    const formValid = nameValid.valid && attrArrValid.valid;
    const fieldValidation = this.state.fieldValidation;
    fieldValidation.Name = nameValid;
    fieldValidation.AttributesArr = attrArrValid;
    // fieldValidation.Attributes = attrValid;
    this.setState(
      {
        formValid: formValid,
        fieldValidation: fieldValidation
      },
      respond
    );
  };

  onSubmit = (addMore) => {
    function respond() {
      if (this.state.formValid) {
        this.setState({ waiting: true, addMore: addMore }, this.submitThroughAPI);
      }
    }

    this.validateForm(respond);
  };

  submitThroughAPI = () => {
    const superIDs = this.props.selectedType.Supers.map(s => {
      return s._id;
    });

    const attributes = this.props.selectedType.AttributesArr.map(a => {
      return {
        _id: a.attrID,
        Name: a.Name.trim(),
        AttributeType: a.AttributeType,
        Options: a.Options,
        DefinedType: a.DefinedType,
        ListType: a.ListType
      };
    });
    
    this.api.upsertAttributes(this.props.selectedWorldID, attributes).then(res => {
      const typeAttributes = [];
      this.props.selectedType.AttributesArr.forEach(a => {
        const id = a.attrID.includes("null") ? res.attributes[a.Name] : a.attrID;
        typeAttributes.push({
          attrID: id,
          index: a.index,
          // Name: a.Name,
          // AttributeType: a.AttributeType,
          // Options: a.Options,
          // DefinedType: a.DefinedType,
          // ListType: a.ListType
        });
      });

      const type = {
        _id: this.state._id,
        Name: this.props.selectedType.Name.trim(),
        PluralName: this.props.selectedType.PluralName === undefined ? "" : this.props.selectedType.PluralName.trim(),
        Description: this.props.selectedType.Description,
        SuperIDs: superIDs,
        // AttributesArr: this.props.selectedType.AttributesArr,
        Attributes: typeAttributes,
        Defaults: [],
        worldID: this.props.selectedWorld._id,
        Major: this.props.selectedType.Major,
        ReferenceIDs: [],
        DefaultReferenceIDs: []
      };
      // this.props.selectedType.AttributesArr.filter(a=>a.AttributeType === "Type" || (a.AttributeType === "List" && a.ListType === "Type")).forEach(a=>{
      //   if (!type.ReferenceIDs.includes(a.DefinedType)) {
      //     type.ReferenceIDs.push(a.DefinedType);
      //   }
      // });
      this.props.selectedType.AttributesArr.filter(a=>a.AttributeType === "Type" || (a.AttributeType === "List" && a.ListType === "Type")).forEach(a=>{
        if (!type.ReferenceIDs.includes(a.DefinedType)) {
          type.ReferenceIDs.push(a.DefinedType);
        }
      });
      this.props.selectedType.Supers.forEach(s=> {
        s.AttributesArr.filter(a=>a.AttributeType === "Type" || (a.AttributeType === "List" && a.ListType === "Type")).forEach(a=>{
          if (!type.ReferenceIDs.includes(a.DefinedType)) {
            type.ReferenceIDs.push(a.DefinedType);
          }
        });
      });
      Object.keys(this.props.selectedType.DefaultsHash).forEach(attrID => {
        // There's the situation which can happen here where a default thing gets deleted (not removed as default).
        // I really should filter it out, but it's not hurting anything for now, so I'm going to leave it.
        const def = this.props.selectedType.DefaultsHash[attrID];
        type.Defaults.push({
          attrID, 
          FromTypeID: def.FromTypeID, 
          DefaultValue: def.DefaultValue, 
          DefaultListValues: def.DefaultListValues 
        });
      });
  
      if (type._id === null) {
        this.api
          .createType(type)
          .then(res => {
            if (res.typeID !== undefined) {
              this.api.getWorld(this.props.selectedWorldID, true).then(res2 => {
                this.props.setAttributes(res2.attributes);
                this.props.setTypes(res2.types);
                this.props.setThings(res2.things);

                if (this.state.addMore) {
                  this.props.updateSelectedType({
                    _id: null,
                    Name: "",
                    PluralName: "",
                    Description: "",
                    Supers: [],
                    AttributesArr: [],
                    Attributes: [],
                    Major: false
                  });
                  this.setState({
                    _id: null,
                    // Name: "",
                    // Description: "",
                    // Supers: [],
                    // Attributes: [],
                    // Major: false,
                    fieldValidation: {
                      Name: { valid: true, message: "" },
                      AttributesArr: { valid: true, message: "" },
                      Attributes: { valid: true, message: "" }
                    },
                    formValid: false,
                    message: "",
                    redirectTo: null,
                    waiting: false,
                    addMore: false,
                    resetting: true
                  }, this.resetForm);
                }
                else {
                  this.setState({
                    waiting: false,
                    redirectTo: `/world/details/${this.props.selectedWorld._id}`
                  });
                }
              });
            }
            else if (res.error !== undefined) {
              this.setState({
                waiting: false, 
                message: res.error 
              });
            }
          })
          .catch(err => console.log(err));
      } else {
        this.api
          .updateType(type)
          .then(res => {
            if (res.error === undefined) {
              this.api.getWorld(this.props.selectedWorldID, true).then(res2 => {
                this.props.setAttributes(res2.attributes);
                this.props.setTypes(res2.types);
                this.props.setThings(res2.things);

                if (this.state.addMore) {
                  this.props.updateSelectedType({
                    _id: null,
                    Name: "",
                    PluralName: "",
                    Description: "",
                    Supers: [],
                    AttributesArr: [],
                    Attributes: [],
                    Major: false
                  });
                  this.setState({
                    _id: null,
                    // Name: "",
                    // Description: "",
                    // Supers: [],
                    // Attributes: [],
                    // Major: false,
                    fieldValidation: {
                      Name: { valid: true, message: "" },
                      AttributesArr: { valid: true, message: "" },
                      Attributes: { valid: true, message: "" }
                    },
                    formValid: false,
                    message: "",
                    redirectTo: null,
                    waiting: false,
                    addMore: false,
                    resetting: true
                  }, this.resetForm);
                }
                else {
                  this.setState({
                    waiting: false,
                    redirectTo: `/world/details/${this.props.selectedWorld._id}`
                  });
                }
              });
            }
            else {
              this.setState({
                waiting: false, 
                message: res.error 
              });
            }
          })
          .catch(err => console.log(err));
      }
    });
  };

  supersChange = (e, value) => {
    let supers = [];
    for (let i = 0; i < value.length; i++) {
      const t = value[i];
      supers.push(t);
      supers = supers.concat(t.Supers);
    }
    const type = this.props.selectedType;
    type.Supers = supers;
    this.props.updateSelectedType(type);
    // this.setState({ Supers: supers });
  };

  addSuper = (selectedList, selectedItem) => {
    const type = this.props.selectedType;
    type.SuperIDs.push(selectedItem._id);
    selectedItem.Supers.forEach(s => {
      if (selectedList.filter(s2 => s2._id === s._id).length === 0) {
        selectedList.push(s);
        type.SuperIDs.push(s._id);
      }
    });
    // We need to go through all the attributes on type, 
    // and make sure that none of them are also on a super type
    let duplicateAttributes = [];
    selectedList.forEach(t => {
      duplicateAttributes = duplicateAttributes.concat(type.AttributesArr.filter(a => a.TypeIDs.includes(t._id)));
    });
    type.AttributesArr = type.AttributesArr.filter(a => duplicateAttributes.filter(d => d.attrID === a.attrID).length === 0);
    
    type.Supers = selectedList;
    this.props.updateSelectedType(type);
    // this.setState({ Supers: selectedList });
  }

  newAttribute = () => {
    const type = this.props.selectedType;
    type.AttributesArr.push({
      index: type.AttributesArr.length,
      attrID: `null_${uuid()}`,
      Name: "",
      AttributeType: "Text",
      Options: [],
      DefinedType: "",
      ListType: "",
      TypeIDs: []
    });
    this.props.updateSelectedType(type);
  }

  addSelectedAttribute = () => {
    const attr = this.props.attributesByID[this.state.browseAttributesSelected];
    
    const type = this.props.selectedType;
    type.AttributesArr.push({
      index: type.AttributesArr.length,
      attrID: attr._id,
      Name: attr.Name,
      AttributeType: attr.AttributeType,
      Options: attr.Options,
      DefinedType: attr.DefinedType,
      ListType: attr.ListType,
      TypeIDs: attr.TypeIDs
    });
    this.props.updateSelectedType(type);
    this.setState({ 
      browseAttributesSelected: "",
      browseTypesSelected: "" 
    });
  }

  addBrowsedType = (typeID) => {
    const type = this.props.selectedType;
    let attrType = this.props.types.filter(t => t._id === typeID)[0];
    
    type.SuperIDs.push(attrType._id);
    const selectedList = type.Supers;
    selectedList.push(attrType);

    attrType.Supers.forEach(s => {
      if (selectedList.filter(s2 => s2._id === s._id).length === 0) {
        selectedList.push(s);
        type.SuperIDs.push(s._id);
      }
    });
    // We need to go through all the attributes on type, 
    // and make sure that none of them are also on a super type
    let duplicateAttributes = [];
    selectedList.forEach(t => {
      duplicateAttributes = duplicateAttributes.concat(type.AttributesArr.filter(a => a.TypeIDs.includes(t._id)));
    });
    type.AttributesArr = type.AttributesArr.filter(a => duplicateAttributes.filter(d => d.attrID === a.attrID).length === 0);
    
    type.Supers = [];
    this.props.updateSelectedType(type);
    // this.setState({ Supers: [] });
    setTimeout(() => {
      type.Supers = selectedList;
      this.props.updateSelectedType(type);
      this.setState({ 
        browseAttributesSelected: "", 
        browseTypesSelected: "", 
        // Supers: selectedList 
      });
    }, 500);
  }
  
  removeSuper = (selectedList, removedItem) => {
    let supers = [];
    let superIDs = [];
    let removeUs = [removedItem._id];
    const type = this.props.selectedType;
    for (let i = 0; i < type.Supers.length; i++) {
      const checkMe = this.props.types.filter(
        t => t._id === type.Supers[i]._id
      )[0];
      if (checkMe._id === removedItem._id || checkMe.SuperIDs.includes(removedItem._id))
        removeUs.push(checkMe._id);
      else {
        supers.push(checkMe);
        superIDs.push(checkMe._id);
      }
    }
    type.Supers = []; // supers;
    type.SuperIDs = []; // superIDs;
    this.props.updateSelectedType(type);
    this.setState({ 
      // Supers: supers, 
      loaded: false 
    });
    setTimeout(() => {
      type.Supers = supers;
      type.SuperIDs =  superIDs;
      this.props.updateSelectedType(type);
      this.setState({ loaded: true });
    }, 500);
  }

  load = (id) => {
    setTimeout(() => {
      this.setState({
        _id: id,
        redirectTo: null,
        loaded: false,
        message: "Loading..."
      }, this.finishLoading);
    }, 500);
  }

  finishLoading = () => {
    const id = this.state._id;
    if (this.props.fromLogin) {
      this.props.notFromLogin();
      this.setState({
        _id: id,
        loaded: true,
        message: ""
      });
    }
    else {
      this.api.getWorld(this.props.selectedWorldID).then(res => {
        this.props.setAttributes(res.attributes);
        this.props.setTypes(res.types);
        this.props.setThings(res.things);
        if (id !== null) {
          let type = res.types.filter(t => t._id === id);
          if (type.length > 0) {
            type = type[0];

            const supers = this.props.types.filter(t =>
              type.SuperIDs.includes(t._id)
            );
            type.Supers = supers;
            this.props.updateSelectedType(type);
            this.setState({
              // Name: type.Name,
              // Description: type.Description,
              _id: id,
              // Supers: supers,
              // Major: type.Major,
              loaded: true,
              message: ""
            });
          }
          else {
            this.api.getWorld(this.props.selectedWorldID, true).then(res2 => {
              this.props.setAttributes(res2.attributes);
              this.props.setTypes(res2.types);
              this.props.setThings(res2.things);
              if (id !== null) {
                let type = res2.types.filter(t => t._id === id);
                if (type.length > 0) {
                  type = type[0];
      
                  const supers = this.props.types.filter(t =>
                    type.SuperIDs.includes(t._id)
                  );
                  type.Supers = supers;
                  this.props.updateSelectedType(type);
                  this.setState({
                    // Name: type.Name,
                    // Description: type.Description,
                    _id: id,
                    // Supers: supers,
                    // Major: type.Major,
                    loaded: true,
                    message: ""
                  });
                }
                else {
                  // I had it get here with an ID from Cosmere, when I was supposed to be looking at a Type from Ozzie.
                  // Need to figure out how it got the wrong ID.
                  this.setState({ 
                    message: `Invalid ID: ${id}`, 
                    loaded: true 
                  });
                }
              } else {
                this.props.updateSelectedType({
                  _id: null,
                  Name: "",
                  PluralName: "",
                  Description: "",
                  Supers: [],
                  SuperIDs: [],
                  AttributesArr: [],
                  Attributes: [],
                  Major: false,
                  DefaultsHash: {}
                });
                this.setState({ 
                  message: "", 
                  loaded: true 
                });
              }
            });
          }
        } else {
          this.props.updateSelectedType({
            _id: null,
            Name: "",
            PluralName: "",
            Description: "",
            Supers: [],
            SuperIDs: [],
            AttributesArr: [],
            Attributes: [],
            Major: false,
            DefaultsHash: {}
          });
          this.setState({ 
            message: "",
            loaded: true 
          });
        }
      });
    }
  }

  changeDefault = value => {
    const type = this.props.selectedType;
    type.DefaultsHash[value.attrID] = {
      attrID: value.attrID,
      DefaultValue: value.DefaultValue,
      DefaultListValues: value.DefaultListValues,
      FromTypeIDs: value.FromTypeIDs
    };
    this.props.updateSelectedType(type);
  }

  newAttribute = () => {
    const type = this.props.selectedType;
    type.AttributesArr.push({
      index: type.AttributesArr.length,
      attrID: `null_${uuid()}`,
      Name: "",
      AttributeType: "Text",
      Options: [],
      DefinedType: "",
      ListType: ""
    });
    this.props.updateSelectedType(type);
  }

  changeAttribute = value => {
    const type = this.props.selectedType;
    type.AttributesArr[value.index] = {
      index: value.index,
      attrID: value.attrID,
      Name: value.Name,
      AttributeType: value.AttributeType,
      Options: value.Options,
      DefinedType: value.DefinedType,
      ListType: value.ListType,
    };
    this.props.updateSelectedType(type);
  }

  deleteAttribute = value => {
    const type = this.props.selectedType;
    const attributes = [];
    type.AttributesArr.forEach(t => {
      if (t.index !== value.index) {
        if (t.index > value.index)
          t.index--;
        attributes.push(t);
      }
    });
    type.AttributesArr = [];
    let defaults = {...type.DefaultsHash};
    if (defaults[value.attrID] !== undefined) {
      delete defaults[value.attrID];
    }
    type.DefaultsHash = {};
    this.props.updateSelectedType(type);
    setTimeout(() => {
      type.AttributesArr = attributes;
      type.DefaultsHash = defaults;
      this.props.updateSelectedType(type);
    }, 500);
  }

  renderAttributes = () => {
    return (
      <AttributesControl 
        defaultsMode={this.state.defaultsMode} 
        addNewType={attribute => {
          this.setState({ 
            // onTypeModalAdd: respond,
            typeModalOpen: true,
            putTypeOnAttribute: attribute
          });
        }}
        addNewThing={(attribute) => {
          console.log(attribute);
          this.setState({ 
            // onThingModalAdd: respond,
            thingModalOpen: true,
            newThingType: this.props.types.filter(t => t._id === attribute.DefinedType)[0],
            putThingOnAttribute: attribute
          });
        }}
      />
    );
  }

  render() {
    let { id } = this.props.match.params;
    if (id === undefined)
      id = null;
    if (this.state._id !== id) {
      this.load(id);
      return (<span>Loading...</span>);
    }
    else if (this.state.redirectTo !== null) {
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
          this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length === 0)) {
      return <Redirect to="/" />;
    } else if (this.props.selectedType === null || this.props.selectedType._id !== id) {
      return <span>{this.state.message}</span>;
    } else if (this.state.typeModalOpen) {
      return (
        <NewTypeModal 
          // open={this.state.typeModalOpen} 
          types={this.props.types}
          selectedWorldID={this.props.selectedWorldID}
          onCancel={_ => {
            this.setState({
              typeModalOpen: false
            });
          }}
          addType={type => {
            this.props.addType(type);
          }}
          onSave={newType => {
            const type = this.props.selectedType;
            // console.log(type);
            // console.log(this.state.putTypeOnAttribute);
            const attr = type.AttributesArr.filter(a => a.attrID === this.state.putTypeOnAttribute.attrID)[0];
            attr.DefinedType = newType._id;
            this.props.updateSelectedType(type);
            this.setState({
              typeModalOpen: false
            });
          }}
          api={this.api}
        />
      );
    } else if (this.state.thingModalOpen) {
      return (
        <NewThingModal 
          // open={this.state.typeModalOpen} 
          things={this.props.things}
          newThingType={this.state.newThingType}
          selectedWorldID={this.props.selectedWorldID}
          onCancel={_ => {
            this.setState({
              thingModalOpen: false
            });
          }}
          addThing={thing => {
            this.props.addThing(thing);
          }}
          onSave={thing => {
            this.setState({
              thingModalOpen: false
            }, _ => {
              // this.state.onThingModalAdd(thing);
              // Need to put it on putThingOnAttribute
              const type = this.props.selectedType;
              const attr = type.AttributesArr.filter(a => a.attrID === this.state.putThingOnAttribute.attrID)[0];
              let def = this.props.selectedType.DefaultsHash[attr.attrID];
              if (def === undefined)
                def = { attrID: attr.attrID, DefaultValue: "", DefaultListValues: [] };
              // console.log(def);
              if (attr.AttributeType === "Type") {
                def.DefaultValue = thing._id;
              }
              else {
                // The only way it can be here is if it's List and ListType is Type
                def.DefaultListValues.push(thing._id);
              }
              this.props.updateSelectedType(type);
            });
          }}
          api={this.api}
        />
      );
    } else {
      const types =
        this.props.types === undefined || this.state._id === null
          ? this.props.types
          : this.props.types.filter(type => type._id !== this.state._id);
      let additionalAttributes = [];
      let selectedAttributeTypes = [];
      let selectedAttributeName = "";
      if (this.state.browseAttributes) {
        Object.keys(this.props.attributesByID).forEach(id => {
          const attr = this.props.attributesByID[id];
          if (!attr.TypeIDs.includes(this.props.selectedType._id) && 
            this.props.selectedType.AttributesArr.filter(a => a.attrID === attr._id).length === 0) { // This second condition will make newly added attributes not show up.
            let found = false;
            for (let i = 0; i < this.props.selectedType.Supers.length; i++) {
              if (attr.TypeIDs.includes(this.props.selectedType.Supers[i]._id)) {
                found = true;
                break;
              }
            }
            if (!found) {
              additionalAttributes.push({
                _id: attr._id,
                Name: attr.Name
              });
            }
          }
        });

        if (this.state.browseAttributesSelected !== "") {
          selectedAttributeName = this.props.attributesByID[this.state.browseAttributesSelected].Name;
          selectedAttributeTypes = this.props.types.filter(t => this.props.attributesByID[this.state.browseAttributesSelected].TypeIDs.includes(t._id));
        }
      }
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          { this.props.selectedWorld === null ? "" :
            <Grid item container spacing={1} direction="column">
              <Helmet>
                <title>{ `Author's Notebook: ${this.props.selectedWorld.Name}` }</title>
              </Helmet>
              <Grid item container spacing={1} direction="row">
                <Grid item xs={1}>
                  <Tooltip title={`Back to ${this.props.selectedWorld.Name}`}>
                    <Fab size="small"
                      color="primary"
                      onClick={ _ => {this.setState({redirectTo:`/world/details/${this.props.selectedWorldID}`})}}
                    >
                      <ArrowBack />
                    </Fab>
                  </Tooltip>
                </Grid>
                <Grid item xs={11}>
                  <h2>{this.state._id === null ? "Create New Type" : "Edit Type"}</h2>
                </Grid>
              </Grid>
              <Grid item>
                { this.state.loaded &&  
                  <TextBox 
                    Value={this.props.selectedType.Name} 
                    fieldName="Name" 
                    message={this.state.fieldValidation.Name.message}
                    onBlur={name => {
                      const type = this.props.selectedType;
                      type.Name = name;
                      this.props.updateSelectedType(type);
                      this.validateForm();
                      // this.setState({ Name: name }, 
                      //   this.validateForm);
                    }}
                    labelWidth={43}/>
                }
              </Grid>
              <Grid item>
                { this.state.loaded &&  
                  <TextBox 
                    Value={this.props.selectedType.PluralName} 
                    fieldName="PluralName" 
                    displayName="Plural Name" 
                    onBlur={name => {
                      const type = this.props.selectedType;
                      type.PluralName = name;
                      this.props.updateSelectedType(type);
                      this.validateForm();
                      // this.setState({ Name: name }, 
                      //   this.validateForm);
                    }}
                    labelWidth={85}/>
                }
              </Grid>
              <Grid item>
                { this.state.loaded &&  
                  <TextBox 
                    Value={this.props.selectedType.Description} 
                    fieldName="Description" 
                    multiline={true}
                    onBlur={desc => {
                      const type = this.props.selectedType;
                      type.Description = desc;
                      this.props.updateSelectedType(type);
                    }}
                    labelWidth={82}/>
                }
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.props.selectedType.Major}
                      onChange={ e => {
                        const value = e.target.checked;
                        const type = this.props.selectedType;
                        type.Major = value;
                        this.props.updateSelectedType(type);
                        // this.setState({ [name]: value });
                        // this.handleUserInput(e);
                      }}
                      name="Major"
                      color="primary"
                    />
                  }
                  label="Major Type"
                />
              </Grid>
              <Grid item>
                { this.state.resetting ? "" :
                  <Multiselect
                    placeholder="Super Types"
                    options={types}
                    selectedValues={this.props.selectedType.Supers}
                    onSelect={this.addSuper}
                    onRemove={this.removeSuper}
                    displayValue="Name"
                  />
                }
              </Grid>
              <Grid item container spacing={0} direction="row">
                <Grid item xs={6}>
                  <span>Attributes&nbsp;
                    <Tooltip 
                      title={`Add New Attribute`}>
                      <span>
                        <Fab size="small"
                          color="primary"
                          disabled={this.state.defaultsMode}
                          onClick={ _ => { this.newAttribute()}}
                        >
                          <Add />
                        </Fab>
                      </span>
                    </Tooltip>
                    <Tooltip 
                      title={`Browse Additional Attributes`}>
                      <span>
                        <Fab
                          size="small"
                          color="primary" 
                          disabled={this.state.defaultsMode}
                          onClick={e => {
                            this.setState({ browseAttributes: !this.state.browseAttributes });
                          }}
                        >
                          <Search />
                        </Fab>
                      </span>
                    </Tooltip>
                  </span>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" color="primary" onClick={e => { this.setState({defaultsMode: !this.state.defaultsMode}) }}>
                    { this.state.defaultsMode ? "Set Attribute Types" : "Set Defaults"}
                  </Button>
                </Grid>
              </Grid>
              { this.state.browseAttributes && 
                <Grid item container spacing={1} direction="row">
                  <Grid item xs={12} sm={6}>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="browseForAttributes" id="browseForAttributes-label">
                        Browse Attributes
                      </InputLabel>
                      <Select
                        labelId="browseForAttributes-label"
                        id="browseForAttributes"
                        value={this.state.browseAttributesSelected}
                        onChange={e => {
                          this.setState({ browseAttributesSelected: e.target.value });
                        }}
                        fullWidth
                        labelWidth={130}
                      >
                        {
                          additionalAttributes.map((attr, i) => {
                            return (
                              <MenuItem key={i} value={attr._id}>
                                {attr.Name}
                              </MenuItem>
                            );
                          })
                        }
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Button
                      variant="contained" color="primary"
                      disabled={ this.state.browseAttributesSelected === "" }
                      onClick={e => {this.addSelectedAttribute();}}
                      type="submit"
                    >
                      Add Attribute
                    </Button>
                  </Grid>
                  { selectedAttributeTypes.length === 1 ?
                    <Grid style={{color: "red"}} item xs={12} container spacing={1} direction="row">
                      <Grid item xs={12}>
                        This Attribute is also found on the Type '{selectedAttributeTypes[0].Name}'.  You may want to add '{selectedAttributeTypes[0].Name}' as a Super Type instead of adding the Attribute.
                      </Grid>                      
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="contained" color="primary"
                          onClick={e => {this.addBrowsedType(selectedAttributeTypes[0]._id);}}
                          type="submit"
                        >
                          Add {selectedAttributeTypes[0].Name}
                        </Button>
                      </Grid>
                    </Grid>
                  : selectedAttributeTypes.length > 1 &&
                    <Grid style={{color: "red"}} item xs={12} container spacing={1} direction="row">
                      <Grid item xs={12}>
                        This Attribute is also found on other Types.  You may want to add one as a Super Type instead of adding the Attribute.
                      </Grid>                      
                      <Grid item xs={12} sm={6}>
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel htmlFor="browseTypesWithAttribute" id="browseTypesWithAttribute-label">
                            Browse Types with {selectedAttributeName}
                          </InputLabel>
                          <Select
                            labelId="browseTypesWithAttribute-label"
                            id="browseTypesWithAttribute"
                            value={this.state.browseTypesSelected}
                            onChange={e => {
                              this.setState({ browseTypesSelected: e.target.value });
                            }}
                            fullWidth
                            labelWidth={140 + selectedAttributeName.length * 9}
                          >
                            { selectedAttributeTypes.map((type, i) => {
                              return (
                                <MenuItem key={i} value={type._id}>
                                  {type.Name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          variant="contained" color="primary"
                          disabled={ this.state.browseTypesSelected === "" }
                          onClick={e => {this.addBrowsedType(this.state.browseTypesSelected);}}
                          type="submit"
                        >
                          Add Type
                        </Button>
                      </Grid>
                    </Grid>
                  }
                </Grid>
              }
              <Grid item>
                { this.state.loaded &&
                  this.renderAttributes()
                }
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
              <Grid item>
                <div className="float-right">
                  <Button
                    variant="contained" color="primary"
                    disabled={this.state.waiting}
                    onClick={e => {this.onSubmit(true);}}
                    type="submit"
                  >
                    {this.state.waiting ? "Please Wait" : "Submit and Create Another"}
                  </Button>
                  <Button
                    variant="contained" color="primary"
                    style={{marginLeft: "4px"}}
                    className="w-200"
                    disabled={this.state.waiting}
                    onClick={e => {this.onSubmit(false);}}
                    type="submit"
                  >
                    {this.state.waiting ? "Please Wait" : "Submit"}
                  </Button>
                  <Button
                    variant="contained"
                    style={{marginLeft: "4px"}}
                    disabled={this.state.waiting}
                    onClick={_ => {
                      if (this.props.selectedType._id === null) {
                        this.setState({
                          redirectTo: `/world/details/${this.props.selectedWorldID}`
                        });
                      }
                      else {
                        this.setState({
                          redirectTo: `/type/details/${this.props.selectedType._id}`
                        });
                      }
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                </div>
              </Grid>
              <Grid item style={{color:"red"}}>{this.state.message}</Grid>
            </Grid>
          }
        </Grid>
      );
    }
  }
}

const TypeEditPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default TypeEditPage;
