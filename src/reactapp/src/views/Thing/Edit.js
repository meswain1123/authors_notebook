import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPage,
  updateSelectedThing,
  addThing,
  updateThing
} from "../../redux/actions/index";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import AttributesControl from "./AttributesControl";
import { Multiselect } from 'multiselect-react-dropdown';
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
    user: state.app.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    updateSelectedThing: thing => dispatch(updateSelectedThing(thing)),
    addThing: thing => dispatch(addThing(thing)),
    updateThing: thing => dispatch(updateThing(thing))
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
      waiting: false
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      if (id !== undefined) {
        if (id.includes("type_id_")) {
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
        else {
          // We're editing an existing Thing
          this.api.getThing(id).then(res => {
            const things = this.props.things.filter(
              thing => res._id !== thing._id
            );
            let Types = [];
            res.TypeIDs.forEach(tID=> {
              Types = Types.concat(this.props.types.filter(t2=>t2._id === tID));
            });
            let attributes = [...res.AttributesArr];
            Types.forEach(type=> {
              for (let i = 0; i < type.AttributesArr.length; i++) {
                const attribute = {...type.AttributesArr[i]};
                attribute.FromTypes = [...attribute.FromSupers];
                delete attribute.FromSupers;
                attribute.FromTypes.push(type._id);
                const matches = attributes.filter(a => a.Name === attribute.Name);
                if (matches.length === 0) {
                  // It's a new attribute.
                  // Thing Attributes have Values, so we need to add that field.
                  // In the future I'll have List Types, in which case this will be more complicated.
                  // Also I'll be adding default values.
                  attribute.Value = "";
                  attribute.ListValues = [];
                  attributes.push(attribute);
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
            });
            res.AttributesArr = attributes;
            this.setState({
              Name: res.Name,
              Description: res.Description,
              _id: id,
              Things: things,
              Types: Types
            });
            this.props.updateSelectedThing(res);
          });
        }
      } else {
        // We're creating a new thing from blank.
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
      AttributesArr: []
    };
    let attributes = [];
    for (let i = 0; i < type.AttributesArr.length; i++) {
      const attribute = {...type.AttributesArr[i]};
      attribute.FromTypes = [...attribute.FromSupers];
      delete attribute.FromSupers;
      attribute.FromTypes.push(type._id);
      const matches = attributes.filter(a => a.Name === attribute.Name);
      if (matches.length === 0) {
        // It's a new attribute.
        // Thing Attributes have Values, so we need to add that field.
        // In the future I'll have List Types, in which case this will be more complicated.
        // Also I'll be adding default values.
        attribute.Value = "";
        attribute.ListValues = [];
        attributes.push(attribute);
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
    this.setState({ Types: types });
    thing.AttributesArr = attributes;
    this.props.updateSelectedThing(thing);
  };

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
        for (let i = 0; i < value.length; i++) {
          if (value.filter(attr2 => attr2.Name === value[i].Name).length > 1) {
            valid = false;
            break;
          }
        }
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
    const attrArrValid = this.validateField("AttributesArr");
    const formValid = nameValid.valid && attrArrValid.valid;
    const fieldValidation = this.state.fieldValidation;
    fieldValidation.Name = nameValid;
    fieldValidation.AttributesArr = attrArrValid;
    this.setState(
      {
        formValid: formValid,
        fieldValidation: fieldValidation
      },
      respond
    );
  };

  onSubmit = () => {
    function respond() {
      if (this.state.formValid) {
        this.setState({ waiting: true }, this.submitThroughAPI);
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
      Name: this.state.Name,
      Description: this.state.Description,
      TypeIDs: typeIDs,
      AttributesArr: this.props.selectedThing.AttributesArr,
      WorldID: this.props.selectedWorld._id,
      ReferenceIDs: []
    };
    this.props.selectedThing.AttributesArr.filter(a=>a.Type === "Type").forEach(a=>{
      if (!thing.ReferenceIDs.includes(a.Value)) {
        thing.ReferenceIDs.push(a.Type2);
      }
    });
    this.props.selectedThing.AttributesArr.filter(a=>a.Type === "List" && a.ListType === "Type").forEach(a=>{
      a.ListValues.forEach(v=> {
        if (!thing.ReferenceIDs.includes(v)) {
          thing.ReferenceIDs.push(v);
        }
      });
    });

    if (thing._id === null) {
      this.api
        .createThing(thing)
        .then(res => {
          thing._id = res.thingID;
          thing.Types = this.state.Types;
          this.props.addThing(thing);
          this.setState({
            waiting: false,
            redirectTo: `/world/details/${this.props.selectedWorld._id}`
          });
        })
        .catch(err => console.log(err));
    } else {
      this.api
        .updateThing(thing)
        .then(res => {
          thing.Types = this.state.Types;
          this.props.updateThing(thing);
          this.setState({
            waiting: false,
            redirectTo: `/world/details/${this.props.selectedWorld._id}`
          });
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

  addType = (selectedList, selectedItem) => {
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
        attribute.Value = "";
        attribute.ListValues = [];
        attributes.push(attribute);
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
    this.setState({ Types: selectedList });
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

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.props.selectedWorld !== null && this.props.selectedWorld.Owner !== this.props.user._id) {
      return <Redirect to="/" />;
    } else {
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          <Grid item>
            {this.renderHeader()}
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
                value={this.state.Description}
                onChange={this.handleUserInput}
                onBlur={this.inputBlur}
                labelWidth={82}
                fullWidth
              />
            </FormControl>
          </Grid>
          <Grid item>
            <Multiselect
              placeholder="Types"
              options={this.props.types}
              selectedValues={this.state.Types}
              onSelect={this.addType}
              onRemove={this.removeType}
              displayValue="Name"
            />
          </Grid>
          <Grid item>
            <AttributesControl />
            <FormHelperText>
              {this.state.fieldValidation.AttributesArr.message}
            </FormHelperText>
          </Grid>
          <Grid item>
            <div className="float-right">
              <Button
                variant="contained" color="primary"
                className="w200"
                disabled={this.state.waiting}
                onClick={this.onSubmit}
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

const ThingEditPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default ThingEditPage;
