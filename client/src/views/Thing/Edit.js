import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  updateSelectedThing,
  addThing,
  updateThing
} from "../../redux/actions/index";
import { 
  Button, FormControl, OutlinedInput, InputLabel, 
  FormHelperText, Grid, Fab, Tooltip 
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import AttributesControl from "./AttributesControl";
import { Multiselect } from 'multiselect-react-dropdown';
import { Helmet } from 'react-helmet';
import API from "../../api";

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
    attributesByID: state.app.attributesByID
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedThing: thing => dispatch(updateSelectedThing(thing)),
    addThing: thing => dispatch(addThing(thing)),
    updateThing: thing => dispatch(updateThing(thing))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: undefined,
      Name: "",
      Description: "",
      Types: [],
      // AttributesArr: [],
      Attributes: [],
      fieldValidation: {
        Name: { valid: true, message: "" },
        // AttributesArr: { valid: true, message: "" },
        Attributes: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null,
      waiting: false,
      addMore: false,
      resetting: false,
      loaded: true,
      errors: []
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
  }

  createThingFromTypeOld = type => {
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
      AttributesArr: []
    };
    let attributes = [];
    const errors = [];
    for (let i = 0; i < type.AttributesArr.length; i++) {
      const attribute = {...type.AttributesArr[i]};
      attribute.FromTypes = [...attribute.FromSupers];
      delete attribute.FromSupers;
      attribute.FromTypes.push(type._id);
      const matches = attributes.filter(a => a._id === attribute._id);
      const nameMatches = attributes.filter(a => a.Name === attribute.Name);
      if (matches.length === 0 && nameMatches.length === 0) {
        // It's a new attribute.
        // Thing Attributes have Values, so we need to add that field.
        // In the future I'll have List Types, in which case this will be more complicated.
        // Also I'll be adding default values.
        if (attribute.DefaultValue === undefined) {
          attribute.Value = "";
          attribute.ListValues = [];
        }
        else {
          attribute.Value = attribute.DefaultValue;
          attribute.ListValues = attribute.DefaultListValues;
        }
        attribute.index = attributes.length;
        attributes.push(attribute);
      } else if (matches.length === 0) {
        // It's a new attribute, but there's an existing attribute with the same name
        // Check the attribute type data to see if it's a match.
        // If not then we need to alert the user that it's a name collision
        if (nameMatches[0].AttributeType !== attribute.AttributeType || 
          (attribute.AttributeType === "List" && 
            attribute.ListType !== nameMatches[0].ListType) ||
          (attribute.AttributeType === "Type" && 
            attribute.DefinedType !== nameMatches[0].DefinedType) ||
          (attribute.AttributeType === "List" && 
            attribute.ListType === "Type" &&
            attribute.DefinedType !== nameMatches[0].DefinedType)) {
          // Name collision
          errors.push(`Attribute ${attribute.Name} has a Name Collision.  Please resolve it.`);
        }
      } else if (nameMatches.length === 0) {
        // It's an existing attribute, but the name was changed on the type.
        // Update the name to match.
        errors.push(`Attribute ${attribute.Name} has been changed on its Type to `);
        attribute.Name = matches[0].Name;
      } else {
        // It's an existing attribute,
        // so we just need to add the appropriate ids to FromTypes.
        const typeIDs = [...matches[0].FromTypes];
        for (let i = 0; i < attribute.FromTypes.length; i++) {
          const typeID = attribute.FromTypes[i];
          if (!typeIDs.includes(typeID)) {
            typeIDs.push(typeID);
          }
        }
        matches[0].FromTypes = typeIDs;
      }
    }
    thing.AttributesArr = attributes;
    this.props.updateSelectedThing(thing);
    this.setState({ _id: null, Types: types, loaded: true, errors });
  };

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
        if (thing.Attributes.filter(a=>a.attrID === attribute.attrID).length === 0) {
          attribute.FromTypeID = type._id;
          attribute.index = type.Attributes.length + newAttributes.length;
          newAttributes.push(attribute);
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
    thing.AttributesArr = attributes;
    this.props.updateSelectedThing(thing);
    this.setState({ _id: null, Types: types, loaded: true }); //, errors });
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

  handleUserInput = e => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState({ [name]: value });
  };

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
        value = this.state[fieldName];
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
    const typeIDs = this.state.Types.map(s => {
      return s._id;
    });
    const thing = {
      _id: this.state._id,
      Name: this.state.Name.trim(),
      Description: this.state.Description.trim(),
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
            thing._id = res.thingID;
            thing.Types = this.state.Types;
            this.props.addThing(thing);
            if (this.state.addMore) {
              this.props.updateSelectedThing({
                _id: null,
                Name: "",
                Description: "",
                Types: [],
                Attributes: []
              });
              this.setState({
                _id: null,
                Name: "",
                Description: "",
                Types: [],
                Attributes: [],
                fieldValidation: {
                  Name: { valid: true, message: "" },
                  Attributes: { valid: true, message: "" }
                },
                formValid: false,
                message: "",
                waiting: false,
                resetting: true
              }, this.resetForm);
            }
            else {
              this.setState({
                waiting: false,
                redirectTo: `/world/details/${this.props.selectedWorld._id}`
              });
            }
          }
          else {
            this.setState({message: res.error});
          }
        })
        .catch(err => console.log(err));
    } else {
      this.api
        .updateThing(thing)
        .then(res => {
          if (res.error === undefined){
            thing.Types = this.state.Types;
            this.props.updateThing(thing);
            if (this.state.addMore) {
              this.props.updateSelectedThing({
                _id: null,
                Name: "",
                Description: "",
                Types: [],
                Attributes: []
              });
              this.setState({
                Name: "",
                Description: "",
                Types: [],
                Attributes: [],
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
            }
            else {
              this.setState({
                waiting: false,
                redirectTo: `/world/details/${this.props.selectedWorld._id}`
              });
            }
          }
          else {
            this.setState({message: res.error});
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
    this.setState({ Types: types });
  };

  addTypeOld = (selectedList, selectedItem) => {
    selectedItem.Supers.forEach(s=>{
      if (selectedList.filter(t=>t._id === s._id).length === 0) {
        let superType = this.props.types.filter(t=>t._id === s._id);
        if (superType.length > 0)
        selectedList.push(superType[0]);
      }
    });
    const thing = this.props.selectedThing;
    let attributes = [...thing.AttributesArr];
    for (let i = 0; i < selectedItem.AttributesArr.length; i++) {
      const attribute = selectedItem.AttributesArr[i];
      if (attribute.FromTypes === undefined)
        attribute.FromTypes = [];
      attribute.FromTypes.push(selectedItem._id);
      const matches = attributes.filter(a => a.Name === attribute.Name);
      if (matches.length === 0) {
        // It's a new attribute.
        // Thing Attributes have Values, so we need to add that field.
        // In the future I'll have List Types, in which case this will be more complicated.
        // Also I'll be adding default values.
        if (attribute.DefaultValue === undefined) {
          attribute.Value = "";
          attribute.ListValues = [];
        }
        else {
          attribute.Value = attribute.DefaultValue;
          attribute.ListValues = attribute.DefaultListValues;
        }
        attributes.push(attribute);
      } else {
        // It's an existing attribute,
        // so we just need to add the appropriate ids to FromTypes.
        // Unless the attribute has a default, and the Thing doesn't have a value already.
        const typeIDs = [...matches[0].FromTypes];
        for (let i = 0; i < attribute.FromTypes.length; i++) {
          const typeID = attribute.FromTypes[i];
          if (!typeIDs.includes(typeID)) {
            typeIDs.push(typeID);
          }
        }
        if (matches[0].AttributeType !== "List" && (matches[0].Value === undefined || matches[0].Value === "") && attribute.DefaultValue !== undefined && attribute.DefaultValue !== "") {
          matches[0].Value = attribute.DefaultValue;
        }
        else if (matches[0].AttributeType === "List" && attribute.DefaultListValues !== undefined) {
          attribute.DefaultListValues.forEach(v=> {
            if (!matches[0].ListValues.includes(v))
              matches[0].ListValues.push(v);
          });
        }
        matches[0].FromTypes = typeIDs;
      }
    }
    this.setState({ Types: selectedList });
    thing.AttributesArr = attributes;
    thing.AttributesArr = [];
    this.props.updateSelectedThing(thing);
    setTimeout(() => {
      thing.AttributesArr = attributes;
      this.props.updateSelectedThing(thing);
    }, 500);
  }

  addType = (selectedList, selectedItem) => {
    const thing = this.props.selectedThing;
    const newTypes = [];
    selectedItem.Supers.forEach(s=>{
      if (selectedList.filter(t=>t._id === s._id).length === 0) {
        let superType = this.props.types.filter(t=>t._id === s._id);
        if (superType.length > 0 && selectedList.filter(t=>t._id === superType[0]._id).length === 0){
          selectedList.push(superType[0]);
          newTypes.push(superType[0]);
        }
      }
      if (this.state.Types.filter(t=>t._id === s._id).length === 0){
        newTypes.push(s);
      }
    });
    let newAttributes = [];
    newTypes.forEach(type=> {
      for (let i = 0; i < type.Attributes.length; i++) {
        const attribute = {...type.Attributes[i]};
        if (thing.Attributes.filter(a=>a.attrID === attribute.attrID).length === 0) {
          attribute.FromTypeID = type._id;
          attribute.index = type.Attributes.length + newAttributes.length;
          // attribute.attrID = 
          newAttributes.push(attribute);
        }
      }
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
    this.setState({ Types: selectedList });
    thing.Attributes = attributes;
    thing.Attributes = [];
    this.props.updateSelectedThing(thing);
    setTimeout(() => {
      thing.Attributes = attributes;
      this.props.updateSelectedThing(thing);
    }, 500);
  }
  
  removeTypeOld = (selectedList, removedItem) => {
    // TODO: Add a confirmation before doing this
    // to let them know it will also remove sub-types.
    let types = [];
    let removeUs = [];
    this.state.Types.forEach(checkMe => {
      if (checkMe._id === removedItem._id || checkMe.SuperIDs.includes(removedItem._id))
        removeUs.push(checkMe._id);
      else types.push(checkMe);
    });
    const thing = this.props.selectedThing;
    let attributes = [...thing.AttributesArr];
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      if (attribute.FromTypes === undefined) {
        // TODO: Remove this once all attributes have been changed to include the field
        attribute.FromTypes = [];
      }
      let j = 0;
      while (j < attribute.FromTypes.length) {
        const checkMe = attribute.FromTypes[j];
        if (removeUs.includes(checkMe)) {
          attribute.FromTypes.splice(j, 1);
        } else {
          j++;
        }
      }
    }
    this.setState({ Types: types });
    thing.AttributesArr = attributes;
    this.props.updateSelectedThing(thing);
  }
  
  removeType = (selectedList, removedItem) => {
    // TODO: Add a confirmation before doing this
    // to let them know it will also remove sub-types.
    let types = [];
    let removeUs = [];
    this.state.Types.forEach(checkMe => {
      if (checkMe._id === removedItem._id || checkMe.SuperIDs.includes(removedItem._id))
        removeUs.push(checkMe._id);
      else types.push(checkMe);
    });
    const thing = this.props.selectedThing;
    let attributes = [...thing.Attributes];
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      if (removeUs.includes(attribute.FromTypeID))
        attribute.FromTypeID = null;
    }
    this.setState({ Types: types });
    thing.Attributes = attributes;
    this.props.updateSelectedThing(thing);
  }

  renderHeader() {
    let typeStr = "Thing";
    this.state.Types.forEach(t=>{
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
    if (this.state._id !== null) {
      // We're editing an existing Thing
      this.api.getThing(this.props.selectedWorldID, this.state._id).then(res => {
        const things = this.props.things.filter(
          thing => res._id !== thing._id
        );
        let Types = [];
        res.TypeIDs.forEach(tID=> {
          Types = Types.concat(this.props.types.filter(t2=>t2._id === tID));
        });
        let newAttributes = [];
        Types.forEach(type=> {
          for (let i = 0; i < type.Attributes.length; i++) {
            const attribute = {...type.Attributes[i]};
            if (res.Attributes.filter(a=>a.attrID === attribute.attrID).length === 0) {
              attribute.FromTypeID = type._id;
              attribute.index = res.Attributes.length + newAttributes.length;
              newAttributes.push(attribute);
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
        let attributes = [...res.Attributes, ...newAttributes];
        res.Attributes = attributes;
        res.AttributesArr = [];
        res.Attributes.forEach(a => {
          const attr = this.props.attributesByID[a.attrID];
          res.AttributesArr.push({
            index: res.AttributesArr.length,
            Name: attr.Name,
            AttributeType: attr.AttributeType,
            Options: attr.Options,
            DefinedType: attr.DefinedType,
            ListType: attr.ListType,
            attrID: a.attrID,
            Value: a.Value,
            ListValues: a.ListValues
          });
        });
        this.props.updateSelectedThing(res);
        this.setState({
          Name: res.Name,
          Description: res.Description,
          Things: things,
          Types: Types,
          loaded: true
        });
      });
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
          Attributes: []
        });
        this.setState({ loaded: true });
      }
    }
  }

  render() {
    let { id } = this.props.match.params;
    if (id === undefined || id.includes("type_id_"))
      id = null;
    if (this.state._id !== id) {
      this.load(id);
    }
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.props.selectedWorld !== null && 
      !this.props.selectedWorld.Public && 
      (this.props.user === null || 
        (this.props.selectedWorld.Owner !== this.props.user._id && 
          this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length === 0))) {
      return <Redirect to="/" />;
    } else {
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
                  {this.renderHeader()}
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
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor="description">Description</InputLabel>
                  <OutlinedInput
                    id="description"
                    name="Description"
                    type="text"
                    multiline={true}
                    value={this.state.Description}
                    onChange={this.handleUserInput}
                    onBlur={this.inputBlur}
                    labelWidth={82}
                    fullWidth
                  />
                </FormControl>
              </Grid>
              <Grid item>
                { this.state.resetting ? "" :
                  <Multiselect
                    placeholder="Types"
                    options={this.props.types}
                    selectedValues={this.state.Types}
                    onSelect={this.addType}
                    onRemove={this.removeType}
                    displayValue="Name"
                  />
                }
              </Grid>
              <Grid item>
                { !this.state.resetting && this.state.loaded &&
                  <AttributesControl />
                }
                <FormHelperText>
                  {this.state.fieldValidation.Attributes.message}
                </FormHelperText>
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
                    className="w200"
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
