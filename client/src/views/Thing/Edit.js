import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  updateSelectedThing,
  addThing,
  updateThing,
  updateType,
  addType,
  setAttributes,
  setTypes,
  setThings,
  notFromLogin,
  toggleLogin,
  logout
} from "../../redux/actions/index";
import { 
  Button, FormControl, 
  OutlinedInput, InputLabel, 
  FormHelperText, Grid, 
  Fab, Tooltip,
  List, ListItem, ListItemText,
  Select, MenuItem,
  // Modal
} from "@material-ui/core";
import ChipInput from "material-ui-chip-input";
import { ArrowBack, Add, Search } from "@material-ui/icons";
import AttributesControl from "./AttributesControl";
import { Multiselect } from 'multiselect-react-dropdown';
import { Helmet } from 'react-helmet';
import API from "../../smartAPI";
import NewTypeModal from "../../components/Modals/NewTypeModal";
import NewThingModal from "../../components/Modals/NewThingModal";
import TextBox from "../../components/Inputs/TextBox";

/* 
  This component will take the main portion of the page and is used for
  creating or editing a Thing.  It will allow the use of Types to make
  it faster.
*/

const mapStateToProps = state => {
  return {
    selectedPage: state.app.selectedPage,
    selectedThing: state.app.selectedThing,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    things: state.app.things,
    types: state.app.types,
    user: state.app.user,
    attributesByID: state.app.attributesByID,
    attributesByName: state.app.attributesByName,
    fromLogin: state.app.fromLogin,
    typeSuggestions: state.app.typeSuggestions,
    thingSuggestions: state.app.thingSuggestions
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedThing: thing => dispatch(updateSelectedThing(thing)),
    addThing: thing => dispatch(addThing(thing)),
    updateThing: thing => dispatch(updateThing(thing)),
    updateType: type => dispatch(updateType(type)),
    addType: type => dispatch(addType(type)),
    setAttributes: attributes => dispatch(setAttributes(attributes)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    notFromLogin: () => dispatch(notFromLogin({})),
    toggleLogin: () => dispatch(toggleLogin({})),
    logout: () => dispatch(logout({}))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: undefined,
      // Name: "",
      // Description: "",
      // Types: [],
      // AttributesArr: [],
      // Attributes: [],
      fieldValidation: {
        Name: { valid: true, message: "" },
        // AttributesArr: { valid: true, message: "" },
        Attributes: { valid: true, message: "" },
        infoAttributeName: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null,
      waiting: false,
      addMore: "",
      resetting: false,
      loaded: true,
      errors: [],
      infoAttribute: null,
      typeModalOpen: false,
      newTypeForAttribute: "",
      browseAttributes: false,
      browseAttributesFilter: "",
      browseAttributesSelected: "",
      thingModalOpen: false,
      newThingType: null,
      putThingOnAttribute: null,
      majorType: null
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
  }

  createThingFromType = type => {
    let types = [];
    types.push(type);
    type.Supers.forEach(s=>{
      if (types.filter(t=>t._id === s._id).length === 0) {
        let superType = this.props.types.filter(t=>t._id === s._id);
        if (superType.length > 0)
          types.push(superType[0]);
      }
    });
    const thing = {
      _id: null,
      Name: "",
      Description: "",
      Types: [],
      Attributes: []
    };
    let newAttributes = [];
    types.forEach(type=> {
      for (let i = 0; i < type.Attributes.length; i++) {
        const attribute = {...type.Attributes[i]};
        let existing = thing.Attributes.filter(a=>a.attrID === attribute.attrID);
        if (existing.length === 0) {
          attribute.FromTypeIDs = [type._id];
          attribute.index = type.Attributes.length + newAttributes.length;
          newAttributes.push(attribute);
        }
        else {
          existing = existing[0];
          if (existing.FromTypeIDs === undefined || existing.FromTypeIDs === null)
            existing.FromTypeIDs = [];
          existing.FromTypeIDs.push(type._id);
        }
      }
    });
    types.forEach(type=> {
      newAttributes.forEach(attribute => {
        if (type.DefaultsHash[attribute.attrID] === undefined || type.DefaultsHash[attribute.attrID].DefaultValue === undefined) {
          attribute.Value = "";
          attribute.ListValues = [];
        }
        else {
          attribute.Value = type.DefaultsHash[attribute.attrID].DefaultValue;
          attribute.ListValues = type.DefaultsHash[attribute.attrID].DefaultListValues;
        }
      })
    });
    let attributes = [...thing.Attributes, ...newAttributes];
    thing.Attributes = attributes;
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
        FromTypeIDs: a.FromTypeIDs,
        TypeIDs: attr.TypeIDs
      });
    });
    thing.Types = types;
    this.props.updateSelectedThing(thing);
    this.setState({ 
      _id: null, 
      // Types: types, 
      loaded: true,
      majorType: type
    }); //, errors });
  };

  resetForm = () => {
    setTimeout(() => {
      let { id } = this.props.match.params;
      if (id !== undefined && !id.includes("type_id_")) {
        this.setState({
          resetting: false, 
          redirectTo: `/thing/create`
        });
      }
      else {
        this.setState({
          resetting: false
        }, this.finishResettingForm);
      }
    }, 500);
  };

  finishResettingForm = () => {
    const { id } = this.props.match.params;
    if (id !== undefined && id.includes("type_id_")) {
      // We're creating it from a type rather than from blank
      const typeID = id.substring(8);
      let type = this.props.types.filter(t=> t._id === typeID);
      if (type.length > 0) {
        type = type[0];
        this.createThingFromType(type);
      }
      else {
        this.setState({ message: "Invalid Type" });
      }
    }
  }

  // handleUserInput = e => {
  //   const name = e.target.name;
  //   const value =
  //     e.target.type === "checkbox" ? e.target.checked : e.target.value;
  //   this.setState({ [name]: value });
  // };

  handleInfoAttrNameChange = e => {
    const infoAttribute = this.state.infoAttribute;
    infoAttribute.Name = e.target.value;
    this.setState({ infoAttribute });
  };

  inputBlur = e => {
    const name = e.target.name;
    const validation = this.validateField(name);
    const fieldValidation = this.state.fieldValidation;
    if (
      fieldValidation[name] !== undefined &&
      (fieldValidation[name].valid !== validation.valid ||
        fieldValidation[name].message !== validation.message)
    ) {
      fieldValidation[name].valid = validation.valid;
      fieldValidation[name].message = validation.message;
      this.setState({ fieldValidation: fieldValidation });
    }
  };

  inputBlur2 = e => {
    const name = "infoAttributeName";
    const validation = this.validateField(name);
    const fieldValidation = this.state.fieldValidation;
    if (
      fieldValidation[name] !== undefined &&
      (fieldValidation[name].valid !== validation.valid ||
        fieldValidation[name].message !== validation.message)
    ) {
      fieldValidation[name].valid = validation.valid;
      fieldValidation[name].message = validation.message;
      this.setState({ fieldValidation: fieldValidation });
    }
  };

  addSelectedAttribute = () => {
    const thing = this.props.selectedThing;
    const attr = this.props.attributesByID[this.state.browseAttributesSelected];
    const attributes = thing.Attributes;
    const AttributesArr = thing.AttributesArr;
    attributes.push({
      attrID: this.state.browseAttributesSelected,
      Value: "",
      ListValues: [],
      index: attributes.length,
      FromTypeIDs: []
    });
    AttributesArr.push({
      attrID: this.state.browseAttributesSelected,
      index: AttributesArr.length,
      Value: "",
      ListValues: [],
      Name: attr.Name,
      AttributeType: attr.AttributeType,
      Options: attr.Options,
      DefinedType: attr.DefinedType,
      ListType: attr.ListType,
      FromTypeIDs: [],
      TypeIDs: attr.TypeIDs
    });
    thing.Attributes = [];
    thing.AttributesArr = [];
    this.props.updateSelectedThing(thing);
    setTimeout(() => {
      thing.Attributes = attributes;
      thing.AttributesArr = AttributesArr;
      this.props.updateSelectedThing(thing);
      this.setState({ browseAttributesSelected: "" });
    }, 500);
  }

  validateField = fieldName => {
    let value = null;
    let valid = true;
    let message = "";
    switch (fieldName) {
      case "Name":
        value = this.props.selectedThing[fieldName].trim();
        valid = value.match(/^[a-zA-Z0-9 ]*$/i) !== null;
        if (!valid)
          message = "Only Letters, Numbers, and Spaces allowed in Thing Names";
        else if (value.length < 2) {
          valid = false;
          message = "Thing Name is too short";
        } else {
          valid =
            this.props.things.filter(
              t => t.Name === value && t._id !== this.state._id
            ).length === 0;
          if (!valid) message = "This Thing Name is already in use";
        }
        break;
      case "infoAttributeName":
        value = this.state.infoAttribute.Name.trim();
        valid = value.match(/^[a-zA-Z0-9 ]*$/i) !== null;
        if (!valid)
          message = "Only Letters, Numbers, and Spaces allowed in Attribute Names";
        else if (value.length < 2) {
          valid = false;
          message = "Attribute Name is too short";
        } else {
          const attrByName = this.props.attributesByName[value];
          valid = attrByName === undefined || attrByName._id === this.state.infoAttribute.attrID;
          if (!valid) message = "There is another Attribute with this name.";
        }
        break;
      case "AttributesArr":
        valid = true;
        value = this.props.selectedThing[fieldName];
        value.forEach(a => {
          if (valid && value.filter(attr2 => attr2.Name === a.Name).length > 1) {
            valid = false;
          }
        });
        message = valid ? "" : "Attribute Names must be unique";
        break;
      default:
        break;
    }
    const response = { valid: valid, message: message };
    return response;
  };

  validateForm = respond => {
    const nameValid = this.validateField("Name");
    const attrValid = this.validateField("AttributesArr");
    const formValid = nameValid.valid && attrValid.valid;
    const fieldValidation = this.state.fieldValidation;
    fieldValidation.Name = nameValid;
    fieldValidation.Attributes = attrValid;
    this.setState(
      {
        formValid: formValid,
        fieldValidation: fieldValidation
      },
      respond
    );
  };

  validateAttrForm = respond => {
    const nameValid = this.validateField("infoAttributeName");
    const fieldValidation = this.state.fieldValidation;
    fieldValidation.infoAttributeName = nameValid;
    this.setState(
      {
        fieldValidation: fieldValidation
      },
      respond
    );
  };

  onSubmit = (addMore) => {
    function respond() {
      if (this.state.formValid) {
        this.setState({ 
          waiting: true, 
          addMore: addMore 
        }, 
        this.submitThroughAPI);
      }
    }

    this.validateForm(respond);
  };

  submitThroughAPI = () => {
    const typeIDs = this.props.selectedThing.Types.map(s => {
      return s._id;
    });
    const thing = {
      _id: this.state._id,
      Name: this.props.selectedThing.Name.trim(),
      Description: this.props.selectedThing.Description.trim(),
      TypeIDs: typeIDs,
      // AttributesArr: this.props.selectedThing.AttributesArr,
      Attributes: [],
      worldID: this.props.selectedWorld._id,
      ReferenceIDs: []
    };
    this.props.selectedThing.AttributesArr.forEach(a => {
      thing.Attributes.push({
        attrID: a.attrID,
        index: a.index,
        Value: a.Value.trim(),
        ListValues: a.ListValues
      });
      if (a.AttributeType === "Type") {
        if (!thing.ReferenceIDs.includes(a.Value)) {
          thing.ReferenceIDs.push(a.Value);
        }
      }
      if (a.AttributeType === "List" && a.ListType === "Type") {
        a.ListValues.forEach(v=> {
          if (!thing.ReferenceIDs.includes(v)) {
            thing.ReferenceIDs.push(v);
          }
        });
      }
    });
    if (thing._id === null) {
      this.api
        .createThing(thing)
        .then(res => {
          if (res.error === undefined){
            // thing._id = res.thingID;
            // thing.Types = this.state.Types;
            // thing.AttributesArr = this.props.selectedThing.AttributesArr;
            // this.props.addThing(thing);
            this.api.getWorld(this.props.selectedWorldID, true).then(res2 => {
              this.props.setAttributes(res2.attributes);
              this.props.setTypes(res2.types);
              this.props.setThings(res2.things);

              if (this.state.addMore === "add") {
                this.props.updateSelectedThing({
                  _id: null,
                  Name: "",
                  Description: "",
                  Types: [],
                  Attributes: [],
                  AttributesArr: []
                });
                this.setState({
                  _id: null,
                  // Name: "",
                  // Description: "",
                  // Types: [],
                  // Attributes: [],
                  fieldValidation: {
                    Name: { valid: true, message: "" },
                    Attributes: { valid: true, message: "" }
                  },
                  formValid: false,
                  message: "",
                  waiting: false,
                  resetting: true
                }, this.resetForm);
              } else if (this.state.addMore === "next") {
                this.redirectToNext();
              } else {
                this.setState({
                  waiting: false,
                  redirectTo: `/world/details/${this.props.selectedWorld._id}`
                });
              }
            });
          }
          else {
            this.setState({message: res.error}, () => {
              this.props.logout();
            });
          }
        })
        .catch(err => console.log(err));
    } else {
      this.api
        .updateThing(thing)
        .then(res => {
          if (res.error === undefined) {
            this.api.getWorld(this.props.selectedWorldID, true).then(res2 => {
              this.props.setAttributes(res2.attributes);
              this.props.setTypes(res2.types);
              this.props.setThings(res2.things);
              
              if (this.state.addMore === "add") {
                this.props.updateSelectedThing({
                  _id: null,
                  Name: "",
                  Description: "",
                  Types: [],
                  Attributes: [],
                  AttributesArr: []
                });
                this.setState({
                  // Name: "",
                  // Description: "",
                  // Types: [],
                  // Attributes: [],
                  fieldValidation: {
                    Name: { valid: true, message: "" },
                    Attributes: { valid: true, message: "" }
                  },
                  formValid: false,
                  message: "",
                  waiting: false,
                  addMore: false,
                  resetting: true
                }, this.resetForm);
              } else if (this.state.addMore === "next") {
                this.redirectToNext();
              } else {
                this.setState({
                  waiting: false,
                  redirectTo: `/world/details/${this.props.selectedWorld._id}`
                });
              }
            });
          }
          else {
            this.setState({message: res.error}, () => {
              this.props.logout();
            });
          }
        })
        .catch(err => console.log(err));
    }
  };

  typesChange = (e, value) => {
    let types = [];
    for (let i = 0; i < value.length; i++) {
      const t = value[i];
      types.push(t);
      types = types.concat(t.Types);
    }
    const thing = this.props.selectedThing;
    thing.Types = types;
    this.props.updateSelectedThing(thing);
    // this.setState({ Types: types });
  };

  addType = (selectedList, selectedItem) => {
    const thing = this.props.selectedThing;
    const newTypes = {};
    newTypes[selectedItem._id] = selectedItem;
    selectedItem.Supers.forEach(s=>{
      if (selectedList.filter(t=>t._id === s._id).length === 0) {
        let superType = this.props.types.filter(t=>t._id === s._id);
        if (superType.length > 0 && selectedList.filter(t=>t._id === superType[0]._id).length === 0){
          selectedList.push(superType[0]);
          newTypes[superType[0]._id] = superType[0];
        }
      }
      if (this.props.selectedThing.Types.filter(t=>t._id === s._id).length === 0){
        newTypes[s._id] = s;
      }
    });
    let newAttributes = [];
    Object.keys(newTypes).forEach(typeID => {
      const type = newTypes[typeID];
      type.Attributes.forEach(a => {
        const attribute = {...a};
        let existing = thing.Attributes.filter(a=>a.attrID === attribute.attrID);
        if (existing.length === 0) {
          attribute.FromTypeIDs = [type._id];
          attribute.index = type.Attributes.length + newAttributes.length;
          // attribute.attrID = 
          newAttributes.push(attribute);
        }
        else {
          existing = existing[0];
          if (existing.FromTypeIDs === undefined || existing.FromTypeIDs === null)
            existing.FromTypeIDs = [];
          existing.FromTypeIDs.push(type._id);
        }
      });
    });
    Object.keys(newTypes).forEach(typeID => {
      const type = newTypes[typeID];
      newAttributes.forEach(attribute => {
        if (type.DefaultsHash === undefined || type.DefaultsHash[attribute.attrID] === undefined || type.DefaultsHash[attribute.attrID].DefaultValue === undefined) {
          attribute.Value = "";
          attribute.ListValues = [];
        }
        else {
          if (attribute.Value === undefined) {
            attribute.Value = "";
            attribute.ListValues = [];
          }
          if (attribute.Value === "") {
            attribute.Value = type.DefaultsHash[attribute.attrID].DefaultValue;
          }
          type.DefaultsHash[attribute.attrID].DefaultListValues.forEach(listValue => {
            if (!attribute.ListValues.includes(listValue))
              attribute.ListValues.push(listValue);
          });
        }
      })
    });
    let attributes = [...thing.Attributes, ...newAttributes];
    // this.setState({ Types: selectedList });
    thing.Types = selectedList;
    thing.Attributes = attributes;
    thing.AttributesArr = [];
    const AttributesArr = [];
    thing.Attributes.forEach(a => {
      const attr = this.props.attributesByID[a.attrID];
      AttributesArr.push({
        index: thing.AttributesArr.length,
        Name: attr.Name,
        AttributeType: attr.AttributeType,
        Options: attr.Options,
        DefinedType: attr.DefinedType,
        ListType: attr.ListType,
        attrID: a.attrID,
        Value: a.Value,
        ListValues: a.ListValues,
        FromTypeIDs: a.FromTypeIDs,
        TypeIDs: attr.TypeIDs
      });
    });
    this.props.updateSelectedThing(thing);
    setTimeout(() => {
      thing.Attributes = attributes;
      thing.AttributesArr = AttributesArr;
      this.props.updateSelectedThing(thing);
    }, 500);
  }

  addType2 = (type) => {
    const types = this.props.selectedThing.Types;
    types.push(type);
    // this.addType(types, type);

    const newTypes = [type];
    const thing = this.props.selectedThing;
    type.Supers.forEach(s=>{
      if (types.filter(t=>t._id === s._id).length === 0) {
        let superType = this.props.types.filter(t=>t._id === s._id);
        if (superType.length > 0 && types.filter(t=>t._id === superType[0]._id).length === 0){
          types.push(superType[0]);
          newTypes.push(superType[0]);
        }
      }
      if (this.props.selectedThing.Types.filter(t=>t._id === s._id).length === 0){
        newTypes.push(s);
      }
    });
    let newAttributes = [];
    newTypes.forEach(type => {
      type.Attributes.forEach(a => {
        const attribute = {...a};
        let existing = thing.Attributes.filter(a=>a.attrID === attribute.attrID);
        if (existing.length === 0) {
          attribute.FromTypeIDs = [type._id];
          attribute.index = type.Attributes.length + newAttributes.length;
          // attribute.attrID = 
          newAttributes.push(attribute);
        }
        else {
          existing = existing[0];
          if (existing.FromTypeIDs === undefined || existing.FromTypeIDs === null)
            existing.FromTypeIDs = [];
          existing.FromTypeIDs.push(type._id);
        }
      });
    });
    newTypes.forEach(type=> {
      newAttributes.forEach(attribute => {
        if (type.DefaultsHash === undefined || type.DefaultsHash[attribute.attrID] === undefined || type.DefaultsHash[attribute.attrID].DefaultValue === undefined) {
          attribute.Value = "";
          attribute.ListValues = [];
        }
        else {
          attribute.Value = type.DefaultsHash[attribute.attrID].DefaultValue;
          attribute.ListValues = type.DefaultsHash[attribute.attrID].DefaultListValues;
        }
      })
    });
    let attributes = [...thing.Attributes, ...newAttributes];
    this.setState({ 
      // Types: types, 
      resetting: true 
    });
    thing.Types = types;
    thing.Attributes = attributes;
    thing.AttributesArr = [];
    const AttributesArr = [];
    thing.Attributes.forEach(a => {
      const attr = this.props.attributesByID[a.attrID];
      AttributesArr.push({
        index: thing.AttributesArr.length,
        Name: attr.Name,
        AttributeType: attr.AttributeType,
        Options: attr.Options,
        DefinedType: attr.DefinedType,
        ListType: attr.ListType,
        attrID: a.attrID,
        Value: a.Value,
        ListValues: a.ListValues,
        FromTypeIDs: a.FromTypeIDs,
        TypeIDs: attr.TypeIDs
      });
    });
    this.props.updateSelectedThing(thing);
    setTimeout(() => {
      thing.Attributes = attributes;
      thing.AttributesArr = AttributesArr;
      this.props.updateSelectedThing(thing);
      this.setState({ resetting: false, infoAttribute: null });
    }, 500);
  }

  selectNewTypeForAttribute = (e) => {
    if (e.target.value === "new") {
      function respond(newType) {
        // attr["DefinedType"] = newType._id;
        this.setState({ newTypeForAttribute: newType._id });
      }
      this.setState({ typeModalOpen: true, modalSubmit: respond});
    }
    else 
      this.setState({ newTypeForAttribute: e.target.value });
  }

  saveInfoAttribute = () => {
    function respond() {
      if (this.state.fieldValidation.infoAttributeName.valid) {
        this.setState({ 
          waiting: true
        }, 
        this.submitAttributeThroughAPI);
      }
    }

    this.validateAttrForm(respond);
  }

  submitAttributeThroughAPI = () => {
    // Need to upsert the attribute, and then move forward

    const attributes = [{
      _id: this.state.infoAttribute.attrID,
      Name: this.state.infoAttribute.Name.trim(),
      AttributeType: this.state.infoAttribute.AttributeType,
      Options: this.state.infoAttribute.Options,
      DefinedType: this.state.infoAttribute.DefinedType,
      ListType: this.state.infoAttribute.ListType
    }];
    
    this.api.upsertAttributes(this.props.selectedWorldID, attributes).then(res => {
      if (res.error === undefined) {
        // res.attributes is a hash with the name as key and id as value
        this.api.getWorld(this.props.selectedWorldID, true).then(res2 => {
          this.props.setAttributes(res2.attributes);
          this.props.setTypes(res2.types);
          this.props.setThings(res2.things);
          
          const attribute = this.state.infoAttribute;
          if (this.state.newTypeForAttribute !== "") {
            attribute.TypeIDs.push(this.state.newTypeForAttribute);
            attribute.FromTypeIDs.push(this.state.newTypeForAttribute);
          }
          const thing = this.props.selectedThing;
          if (attribute.attrID === null) {
            attribute.attrID = res.attributes[attribute.Name];
            // Add it to the Thing's attributes
            const attr2 = {
              attrID: attribute.attrID,
              index: thing.Attributes.length,
              Value: "",
              ListValues: []
            };
            thing.Attributes.push(attr2);
            thing.AttributesArr.push({
              attrID: attribute.attrID,
              index: attr2.index,
              Value: "",
              ListValues: [],
              Name: attribute.Name,
              AttributeType: attribute.AttributeType,
              Options: attribute.Options,
              DefinedType: attribute.DefinedType,
              ListType: attribute.ListType,
              FromTypeIDs: attribute.FromTypeIDs,
              TypeIDs: attribute.TypeIDs
            });
          }
          else {
            // Update the attribute on the Thing
            const attr2 = thing.AttributesArr.filter(a => a.attrID === attribute.attrID)[0];
            attr2.Name = attribute.Name;
            attr2.AttributeType = attribute.AttributeType;
            attr2.Options = attribute.Options;
            attr2.DefinedType = attribute.DefinedType;
            attr2.ListType = attribute.ListType;
            attr2.FromTypeIDs = attribute.FromTypeIDs;
            attr2.TypeIDs = attribute.TypeIDs;
          }
          if (attribute.FromTypeIDs.length === 0) {
            this.props.updateSelectedThing(thing);
            this.setState({infoAttribute: null, waiting: false});
          }
          else {
            // Need to add it to the type
            const theType = this.props.types.filter(t => t._id === attribute.FromTypeIDs[0])[0];
            const type = {
              _id: theType._id,
              Name: theType.Name,
              Description: theType.Description,
              SuperIDs: theType.SuperIDs,
              // AttributesArr: this.props.selectedType.AttributesArr,
              Attributes: theType.Attributes,
              Defaults: theType.Defaults,
              worldID: this.props.selectedWorld._id,
              Major: theType.Major,
              ReferenceIDs: theType.ReferenceIDs,
              DefaultReferenceIDs: theType.DefaultReferenceIDs
            };
            type.Attributes.push({
              attrID: attribute.attrID,
              index: type.Attributes.length,
              // Name: a.Name,
              // AttributeType: a.AttributeType,
              // Options: a.Options,
              // DefinedType: a.DefinedType,
              // ListType: a.ListType
            });
            this.api
              .updateType(type)
              .then(res => {
                if (res.error === undefined) {
                  type.Supers = [];
                  type.SuperIDs.forEach(sID=> {
                    type.Supers = type.Supers.concat(this.props.types.filter(t2=>t2._id === sID));
                  });
                  type.AttributesArr = [];
                  type.Attributes.forEach(a => {
                    const attr = this.props.attributesByID[a.attrID];
                    type.AttributesArr.push({
                      index: type.AttributesArr.length,
                      Name: attr.Name,
                      AttributeType: attr.AttributeType,
                      Options: attr.Options,
                      DefinedType: attr.DefinedType,
                      ListType: attr.ListType,
                      attrID: a.attrID
                    });
                  });
                  const defHash = {};
                  if (type.Defaults !== undefined) {
                    type.Defaults.forEach(def => {
                      defHash[def.attrID] = def;
                    });
                  }
                  type.DefaultsHash = defHash;
                  this.props.updateType(type);

                  function respond() {
                    this.addType2(type);
                  }
                  
                  this.setState({
                    infoAttribute: null, waiting: false
                  }, respond);
                }
                else {
                  this.setState({
                    waiting: false, 
                    message: res.error 
                  }, () => {
                    this.props.logout();
                  });
                }
              })
              .catch(err => console.log(err));
          }
        });
      }
      else {
        this.setState({ message: res.error, waiting: false }, () => {
          this.props.logout();
        });
      }
    });
  }
  
  removeType = (selectedList, removedItem) => {
    // TODO: Add a confirmation before doing this
    // to let them know it will also remove sub-types.
    let types = [];
    let removeUs = [];
    this.props.selectedThing.Types.forEach(checkMe => {
      if (checkMe._id === removedItem._id || checkMe.SuperIDs.includes(removedItem._id))
        removeUs.push(checkMe._id);
      else types.push(checkMe);
    });
    const thing = this.props.selectedThing;
    let attributes = [...thing.Attributes];
    attributes.forEach(attribute => {
      const newFromTypeIDs = [];
      attribute.FromTypeIDs.forEach(typeID => {
        if (!removeUs.includes(typeID))
          newFromTypeIDs.push(typeID);
      });
      attribute.FromTypeIDs = newFromTypeIDs;
    });
    // this.setState({ Types: types });
    thing.Types = types;
    thing.Attributes = attributes;
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
        FromTypeIDs: a.FromTypeIDs,
        TypeIDs: attr.TypeIDs
      });
    });
    this.props.updateSelectedThing(thing);
  }

  redirectToNext = () => {
    // Find the next thing
    const things = this.state.majorType === null ? this.props.things : this.props.things.filter(t => t.TypeIDs.includes(this.state.majorType._id));
    let index = 0;
    if (this.props.selectedThing === undefined || this.props.selectedThing._id !== null) {
      while (things[index]._id !== this.props.selectedThing._id)
        index++;
      index++;
    }
    if (index === things.length)
      index = 0;
    this.setState({ 
      waiting: false, 
      redirectTo: `/thing/edit/${things[index]._id}` 
    });
  }

  renderHeader() {
    let typeStr = "Thing";
    this.props.selectedThing.Types.forEach(t=>{
      if (t.Major) { 
        if (typeStr === "Thing") {
          typeStr = t.Name;
        }
        else {
          typeStr += "/" + t.Name;
        }
      }
    });
    return <h2>{this.state._id === null ? `Create New ${typeStr}` : `Edit ${typeStr}`}</h2>;
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
    this.api.getWorld(this.props.selectedWorldID).then(res => {
      this.props.setAttributes(res.attributes);
      this.props.setTypes(res.types);
      this.props.setThings(res.things);
      
      if (this.props.fromLogin) {
        this.props.notFromLogin();
        this.setState({
          // _id: id,
          loaded: true,
          message: ""
        });
      }
      else {
        if (this.state._id !== null) {
          // We're editing an existing Thing
          let thing = res.things.filter(t => t._id === this.state._id);
          if (thing.length === 0) {
            this.setState({ message: "Invalid ID" });
          }
          else {
            thing = thing[0];
            // const things = this.props.things.filter(
            //   t => t._id !== thing._id
            // );
            let Types = [];
            thing.TypeIDs.forEach(tID=> {
              Types = Types.concat(this.props.types.filter(t2=>t2._id === tID));
            });
            let newAttributes = [];
            Types.forEach(type=> {
              for (let i = 0; i < type.Attributes.length; i++) {
                const attribute = {...type.Attributes[i]};
                let existing = thing.Attributes.filter(a=>a.attrID === attribute.attrID);
                if (existing.length === 0) {
                  attribute.FromTypeIDs = [type._id];
                  attribute.index = thing.Attributes.length + newAttributes.length;
                  newAttributes.push(attribute);
                }
                else {
                  existing = existing[0];
                  if (existing.FromTypeIDs === undefined || existing.FromTypeIDs === null)
                    existing.FromTypeIDs = [];
                  existing.FromTypeIDs.push(type._id);
                }
              }
            });
            Types.forEach(type=> {
              newAttributes.forEach(attribute => {
                if (type.DefaultsHash[attribute.attrID] === undefined || type.DefaultsHash[attribute.attrID].DefaultValue === undefined) {
                  attribute.Value = "";
                  attribute.ListValues = [];
                }
                else {
                  attribute.Value = type.DefaultsHash[attribute.attrID].DefaultValue;
                  attribute.ListValues = type.DefaultsHash[attribute.attrID].DefaultListValues;
                }
              })
            });
            let attributes = [...thing.Attributes, ...newAttributes];
            thing.Attributes = attributes;
            thing.AttributesArr = [];
            console.log(this.props.attributesByID);
            thing.Attributes.forEach(a => {
              // if (a.attrID !== undefined) {
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
                FromTypeIDs: a.FromTypeIDs,
                TypeIDs: attr.TypeIDs
              });
              // }
            });
            thing.Types = Types;
            this.props.updateSelectedThing(thing);
            if (this.state.majorType === null) {
              let majorType = thing.Types.filter(t=>t.Major);
              if (majorType.length > 0) {
                majorType = majorType[0];
                
                this.setState({
                  loaded: true,
                  majorType
                });
              }
              else {
                this.setState({
                  loaded: true
                });
              }
            }
            else {
              this.setState({
                loaded: true
              });
            }
          }
        } else {
          let { id } = this.props.match.params;
          if (id !== undefined && id.includes("type_id_")) {
            // We're creating it from a type rather than from blank
            const typeID = id.substring(8);
            let type = this.props.types.filter(t=> t._id === typeID);
            if (type.length > 0) {
              type = type[0];
              this.createThingFromType(type);
            }
            else {
              this.setState({ message: "Invalid Type", loaded: true });
            }
          }
          else {
            // We're creating a new thing from blank.
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
        }
      }
    });
  }

  render() {
    let { id } = this.props.match.params;
    if (id === undefined || id.includes("type_id_"))
      id = null;
    if (this.state._id !== id) {
      this.load(id);
      return (<span>Loading...</span>);
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
          this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length === 0)) {
      return <Redirect to="/" />;
    } else if (this.props.selectedThing === null || this.props.selectedThing._id !== id) {
      return <span>Loading...</span>;
    } else if (this.state.typeModalOpen) {
      return (
        <NewTypeModal 
          types={this.props.types}
          selectedWorldID={this.props.selectedWorldID}
          onCancel={_ => {
            this.setState({typeModalOpen: false});
          }}
          addType={type => {
            this.props.addType(type);
          }}
          onSave={type => {
            this.setState({typeModalOpen: false, newTypeForAttribute: type._id});
          }}
          api={this.api}
          logout={() => {
            this.props.logout();
          }}
        />
      );
    } else if (this.state.infoAttribute !== null) {
      const connectedTypes = this.props.types.filter(t=> this.state.infoAttribute.FromTypeIDs.includes(t._id));
      const otherTypes = this.props.types.filter(t=> !this.state.infoAttribute.FromTypeIDs.includes(t._id) && this.state.infoAttribute.TypeIDs.includes(t._id));
      if (connectedTypes.length === 0) {
        if (otherTypes.length === 0) {
          const attributeTypes = [
            "Text",
            "Number",
            "True/False",
            "Options", 
            "Type", 
            "List"
          ];
          const listTypes = [
            "Text",
            "Options", 
            "Type"
          ];
          // This attribute isn't on any types, so we need to give the ability to add it to a type, as well as to edit it.
          return (
            <Grid item xs={12} container spacing={1} direction="column">
              <Grid item>
                <List>
                  <ListItem style={{fontSize:"30px"}}>Attribute Info</ListItem>
                  <ListItem>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="infoAttributeName">Name</InputLabel>
                      <OutlinedInput
                        id="infoAttributeName"
                        name="infoAttributeName"
                        type="text"
                        autoComplete="Off"
                        error={!this.state.fieldValidation.infoAttributeName.valid}
                        value={this.state.infoAttribute.Name}
                        onChange={this.handleInfoAttrNameChange}
                        onBlur={this.inputBlur2}
                        labelWidth={43}
                        fullWidth
                      />
                      <FormHelperText>
                        {this.state.fieldValidation.infoAttributeName.message}
                      </FormHelperText>
                    </FormControl>
                  </ListItem>
                  <ListItem>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="attribute-type" id="attribute-type-label">
                        Attribute Type
                      </InputLabel>
                      <Select
                        labelId="attribute-type-label"
                        id="attribute-type"
                        disabled={this.state.waiting}
                        // disabled={props.attribute.FromSupers.length > 0} 
                        value={this.state.infoAttribute.AttributeType}
                        onChange={e => {
                          const attr = this.state.infoAttribute;
                          attr["AttributeType"] = e.target.value;
                          this.setState({ infoAttribute: attr });
                        }}
                        fullWidth
                        labelWidth={100}
                      >
                        {attributeTypes.map((type, i) => {
                          return (<MenuItem key={i} value={type}>{type}</MenuItem>);
                        })}
                      </Select>
                    </FormControl>
                  </ListItem>
                  { this.state.infoAttribute.AttributeType === "List" && 
                    <ListItem>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="list-type" id="list-type-label">
                          List Type
                        </InputLabel>
                        <Select
                          labelId="list-type-label"
                          id="list-type"
                          disabled={this.state.waiting}
                          // disabled={props.attribute.FromSupers.length > 0} 
                          value={this.state.infoAttribute.ListType}
                          onChange={e => {
                            const attr = this.state.infoAttribute;
                            attr["ListType"] = e.target.value;
                            this.setState({ infoAttribute: attr });
                          }}
                          fullWidth
                          labelWidth={70}
                        >
                          {listTypes.map((type, i) => {
                            return (<MenuItem key={i} value={type}>{type}</MenuItem>);
                          })}
                        </Select>
                      </FormControl>
                    </ListItem> 
                  }
                  { (this.state.infoAttribute.AttributeType === "Type" || (this.state.infoAttribute.AttributeType === "List" && this.state.infoAttribute.ListType === "Type")) && 
                    <ListItem>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="definedType" id="definedType-label">
                          Defined Type
                        </InputLabel>
                        <Select
                          labelId="definedType-label"
                          id="definedType"
                          disabled={this.state.waiting}
                          // disabled={props.attribute.FromSupers.length > 0} 
                          value={this.state.infoAttribute.DefinedType}
                          onChange={e => {
                            const attr = this.state.infoAttribute;
                            attr["DefinedType"] = e.target.value;
                            if (e.target.value === "new") {
                              function respond(newType) {
                                attr["DefinedType"] = newType._id;
                                this.setState({ typeModalOpen: false, infoAttribute: attr });
                              }
                              this.setState({ typeModalOpen: true, modalSubmit: respond});
                            }
                            else 
                              this.setState({ infoAttribute: attr });
                          }}
                          fullWidth
                          labelWidth={100}
                        >
                          <MenuItem value="new">+ Create New Type</MenuItem>
                          {this.props.types.map((type, i) => {
                            return (<MenuItem key={i} value={type._id}>{type.Name}</MenuItem>);
                          })}
                        </Select>
                      </FormControl>
                    </ListItem> 
                  }
                  { (this.state.infoAttribute.AttributeType === "Options" || (this.state.infoAttribute.AttributeType === "List" && this.state.infoAttribute.ListType === "Options")) && 
                    <ListItem>
                      <ChipInput
                        variant="outlined"
                        disabled={this.state.waiting}
                        // disabled={props.attribute.FromSupers.length > 0}
                        defaultValue={this.state.infoAttribute.Options}
                        onChange={chips => {
                          const attr = this.state.infoAttribute;
                          attr["Options"] = chips;
                          this.setState({ infoAttribute: attr });
                        }}
                      />
                    </ListItem>
                  }
                  <ListItem>
                    Select a Type to add this attribute to, and to add to {this.props.selectedThing.Name}
                  </ListItem>
                  <ListItem>
                    <FormControl variant="outlined" fullWidth>
                      <InputLabel htmlFor="newTypeForAttribute" id="newTypeForAttribute-label">
                        Type For Attribute
                      </InputLabel>
                      <Select
                        labelId="newTypeForAttribute-label"
                        id="newTypeForAttribute"
                        value={this.state.newTypeForAttribute}
                        onChange={e => {this.selectNewTypeForAttribute(e)}}
                        fullWidth
                        labelWidth={125}
                      >
                        <MenuItem value="new">+ Create New Type</MenuItem>
                        {this.props.types.map((type, i) => {
                          return (<MenuItem key={i} value={type._id}>{type.Name}</MenuItem>);
                        })}
                      </Select>
                    </FormControl>
                  </ListItem>
                </List>
              </Grid>
              <Grid item>{this.state.message}</Grid>
              <Grid item container spacing={1} direction="row">
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={this.state.waiting}
                    onClick={this.saveInfoAttribute}
                  >
                    {this.state.waiting ? "Please Wait" : "Submit"}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={_ => {this.setState({infoAttribute: null})}}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          );
        }
        else {
          return (
            <Grid item xs={12} container spacing={1} direction="column">
              <Grid item>
                <List>
                  <ListItem style={{fontSize:"30px"}}>Attribute Info</ListItem>
                  <ListItem>Name: {this.state.infoAttribute.Name}</ListItem>
                  <ListItem>Type: {this.state.infoAttribute.AttributeType}</ListItem>
                  { this.state.infoAttribute.AttributeType === "List" && 
                    <ListItem>List Type: {this.state.infoAttribute.ListType}</ListItem> 
                  }
                  { (this.state.infoAttribute.AttributeType === "Type" || (this.state.infoAttribute.AttributeType === "List" && this.state.infoAttribute.ListType === "Type")) && 
                    <ListItem>
                      Defined Type: 
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={ _ => {this.setState({redirectTo:`/type/details/${this.state.infoAttribute.DefinedType}`})}}
                      >
                        {this.props.types.filter(t=>t._id === this.state.infoAttribute.DefinedType)[0].Name}
                      </Button>
                    </ListItem> 
                  }
                  { (this.state.infoAttribute.AttributeType === "Options" || (this.state.infoAttribute.AttributeType === "List" && this.state.infoAttribute.ListType === "Options")) && 
                    <ListItem>
                      Options: 
                      {this.state.infoAttribute.Options.map((option, j) => {
                        return (
                          <span key={j}>
                            {j === 0 ? " " : ", "}
                            {option}
                          </span>
                        );
                      })}
                    </ListItem>
                  }
                  <ListItem>
                    { otherTypes.length === 1 ? "Type associated with this attribute:" : "Types associated with this attribute:" }
                    <List>
                      { otherTypes.map((type, j) => {
                        return (
                          <span key={j}>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}
                            >
                              {type.Name}
                            </Button>

                            <Button
                              variant="contained"
                              color="primary"
                              onClick={ _ => {this.addType2(type)}}
                            >
                              Add {type.Name} to {this.props.selectedThing.Name}
                            </Button>
                          </span>
                        );
                      })}
                    </List>
                  </ListItem>
                </List>
              </Grid>
              <Grid item container spacing={1} direction="row">
                <Grid item xs={6}>
                  {/* <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={this.state.waiting}
                    onClick={this.saveNewThing}
                  >
                    {this.state.waiting ? "Please Wait" : "Submit"}
                  </Button> */}
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={e => {this.setState({infoAttribute: null})}}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          );
        }
      }
      else {
        return (
          <Grid item xs={12} container spacing={1} direction="column">
            <Grid item>
              <List>
                <ListItem style={{fontSize:"30px"}}>Attribute Info</ListItem>
                <ListItem>Name: {this.state.infoAttribute.Name}</ListItem>
                <ListItem>Type: {this.state.infoAttribute.AttributeType}</ListItem>
                { this.state.infoAttribute.AttributeType === "List" && 
                  <ListItem>List Type: {this.state.infoAttribute.ListType}</ListItem> 
                }
                { (this.state.infoAttribute.AttributeType === "Type" || (this.state.infoAttribute.AttributeType === "List" && this.state.infoAttribute.ListType === "Type")) && 
                  <ListItem>
                    Defined Type: 
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={ _ => {this.setState({redirectTo:`/type/details/${this.state.infoAttribute.DefinedType}`})}}
                    >
                      {this.props.types.filter(t=>t._id === this.state.infoAttribute.DefinedType)[0].Name}
                    </Button>
                  </ListItem> 
                }
                { (this.state.infoAttribute.AttributeType === "Options" || (this.state.infoAttribute.AttributeType === "List" && this.state.infoAttribute.ListType === "Options")) && 
                  <ListItem>
                    Options: 
                    {this.state.infoAttribute.Options.map((option, j) => {
                      return (
                        <span key={j}>
                          {j === 0 ? " " : ", "}
                          {option}
                        </span>
                      );
                    })}
                  </ListItem>
                }
                { connectedTypes.length > 0 &&
                  <ListItem>
                    { connectedTypes.length === 1 ? "From Type:" : "From Types:" }
                    {
                      connectedTypes.map((type, j) => {
                        return (
                          <span key={j}>
                            {j === 0 ? " " : ", "}
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}
                            >
                              {type.Name}
                            </Button>
                          </span>
                        );
                      })
                    }
                  </ListItem>
                }
                { otherTypes.length > 0 &&
                  <ListItem>
                    { otherTypes.length === 1 ? "Other Associated Type:" : "Other Associated Types:" }
                    { otherTypes.map((type, j) => {
                      return (
                        <span key={j}>
                          {j === 0 ? " " : ", "}
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}
                          >
                            {type.Name}
                          </Button>
                        </span>
                      );
                    })}
                  </ListItem>
                }
              </List>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                onClick={e => {this.setState({infoAttribute: null})}}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        );
      }
    } else if (this.state.thingModalOpen) {
      return (
        <NewThingModal 
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
          onSave={newThing => {
            this.setState({
              thingModalOpen: false
            }, _ => {
              // Need to put it on putThingOnAttribute
              const thing = this.props.selectedThing;
              const attr = thing.AttributesArr.filter(a => a.attrID === this.state.putThingOnAttribute.attrID)[0];
              if (attr.AttributeType === "Type") {
                attr.Value = newThing._id;
              }
              else {
                // The only way it can be here is if it's List and ListType is Type
                attr.ListValues.push(newThing._id);
              }
              this.props.updateSelectedThing(thing);
            });
          }}
          api={this.api}
          logout={() => {
            this.props.logout();
          }}
        />
      );
    } else {
      let additionalAttributes = [];
      if (this.state.browseAttributes) {
        Object.keys(this.props.attributesByID).forEach(id => {
          if (this.props.selectedThing.Attributes.filter(a => a.attrID === id).length === 0){
            additionalAttributes.push(this.props.attributesByID[id]);
          }
        });
      }
      const suggestions = [...this.props.typeSuggestions, ...this.props.thingSuggestions];
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          { this.props.selectedWorld !== null &&
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
                <Grid item xs={7} sm={9}>
                  {this.renderHeader()}
                </Grid>
                <Grid item xs={4} sm={2}>
                  <ListItem>
                    { this.state.majorType === null && this.props.things.length > 1 ?
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
                    : this.state.majorType !== null && this.props.things.filter(t => t.TypeIDs.includes(this.state.majorType._id)).length > 1 &&
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
                </Grid>
              </Grid>
              <Grid item>
                { this.state.loaded &&  
                  <TextBox 
                    Value={this.props.selectedThing.Name} 
                    fieldName="Name" 
                    message={this.state.fieldValidation.Name.message}
                    onBlur={name => {
                      const thing = this.props.selectedThing;
                      thing.Name = name;
                      this.props.updateSelectedThing(thing);
                      this.validateForm();
                      // this.setState({ Name: name }, this.validateForm);
                    }}
                    labelWidth={43}/>
                }
              </Grid>
              <Grid item>
                { this.state.loaded &&  
                  <TextBox 
                    Value={this.props.selectedThing.Description} 
                    fieldName="Description" 
                    multiline={true}
                    onBlur={desc => {
                      const thing = this.props.selectedThing;
                      thing.Description = desc;
                      this.props.updateSelectedThing(thing);
                      // this.setState({ Description: desc });
                    }}
                    options={suggestions}
                    labelWidth={82}/>
                }
              </Grid>
              <Grid item>
                { !this.state.resetting &&
                  <Multiselect
                    placeholder="Types"
                    options={this.props.types}
                    selectedValues={this.props.selectedThing.Types}
                    onSelect={this.addType}
                    onRemove={this.removeType}
                    displayValue="Name"
                  />
                }
              </Grid>
              <Grid item container spacing={1} direction="column">
                <Grid item>
                  <span>Attributes&nbsp;
                    <Tooltip title={`Add New Attribute`}>
                      <Fab size="small"
                        color="primary"
                        onClick={ _ => {
                          this.setState({ infoAttribute: {
                            index: this.props.selectedThing.AttributesArr.length,
                            Name: "",
                            AttributeType: "Text",
                            Options: [],
                            DefinedType: "",
                            ListType: "",
                            attrID: null,
                            Value: "",
                            ListValues: [],
                            FromTypeIDs: [],
                            TypeIDs: []
                          }});
                        }}
                      >
                        <Add />
                      </Fab>
                    </Tooltip>
                    <Tooltip title={`Browse Additional Attributes`}>
                      <Fab
                        size="small"
                        color="primary"
                        onClick={e => {
                          this.setState({ browseAttributes: !this.state.browseAttributes });
                        }}
                      >
                        <Search />
                      </Fab>
                    </Tooltip>
                  </span>
                </Grid>
                { this.state.browseAttributes && 
                  <Grid item container spacing={1} direction="row">
                    <Grid item xs={12} sm={6}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="browseForAttributes" id="browseForAttributes-label">
                          Browse Additional Attributes
                        </InputLabel>
                        <Select
                          labelId="browseForAttributes-label"
                          id="browseForAttributes"
                          value={this.state.browseAttributesSelected}
                          onChange={e => {
                            this.setState({ browseAttributesSelected: e.target.value });
                          }}
                          fullWidth
                          labelWidth={200}
                        >
                          {additionalAttributes.map((attr, i) => {
                            return (<MenuItem key={i} value={attr._id}>{attr.Name}</MenuItem>);
                          })}
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
                  </Grid>
                }
                { !this.state.resetting && this.state.loaded &&
                  <AttributesControl 
                    addNewThing={attribute => {
                      this.setState({ 
                        thingModalOpen: true,
                        newThingType: this.props.types.filter(t => t._id === attribute.DefinedType)[0],
                        putThingOnAttribute: attribute
                      });
                    }} 
                    onInfo={e => {
                      this.setState({ infoAttribute: e});
                    }} />
                }
                <FormHelperText>
                  {this.state.fieldValidation.Attributes.message}
                </FormHelperText>
              </Grid>
              <Grid item>
                <div className="float-right">
                  { ((this.state.majorType === null && this.props.things.length > 0) || (this.state.majorType !== null && this.props.things.filter(t => t.TypeIDs.includes(this.state.majorType._id)).length > 0)) && 
                    <Button
                      variant="contained" color="primary"
                      disabled={this.state.waiting}
                      onClick={e => {this.onSubmit("next")}}
                      type="submit"
                    >
                      {this.state.waiting ? "Please Wait" : "Submit and Edit Next"}
                    </Button>
                  }
                  <Button
                    variant="contained" color="primary"
                    style={{marginLeft: "4px"}}
                    disabled={this.state.waiting}
                    onClick={e => {this.onSubmit("add")}}
                    type="submit"
                  >
                    {this.state.waiting ? "Please Wait" : "Submit and Create Another"}
                  </Button>
                  <Button
                    variant="contained" color="primary"
                    style={{marginLeft: "4px"}}
                    className="w200"
                    disabled={this.state.waiting}
                    onClick={e => {this.onSubmit("")}}
                    type="submit"
                  >
                    {this.state.waiting ? "Please Wait" : "Submit"}
                  </Button>
                  <Button
                    variant="contained"
                    style={{marginLeft: "4px"}}
                    disabled={this.state.waiting}
                    onClick={_ => {
                      if (this.props.selectedThing._id === null) {
                        this.setState({
                          redirectTo: `/world/details/${this.props.selectedWorldID}`
                        });
                      }
                      else {
                        this.setState({
                          redirectTo: `/thing/details/${this.props.selectedThing._id}`
                        });
                      }
                    }}
                    type="button"
                  >
                    Cancel
                  </Button>
                </div>
              </Grid>
              <Grid item>{this.state.message}</Grid>
              <Grid item>
                {this.state.errors.map((e, key) => {
                  return (<div key={key}>{e}</div>);
                })}
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
          }
        </Grid>
      );
    }
  }
}

const ThingEditPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default ThingEditPage;
