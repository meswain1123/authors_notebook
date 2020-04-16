import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { ArrowBack } from "@material-ui/icons";
import { 
  Grid, Button, Checkbox, FormControl, FormControlLabel,
  OutlinedInput, InputLabel, FormHelperText, Tooltip, Fab 
} from "@material-ui/core";
import { Helmet } from 'react-helmet';
import { Multiselect } from 'multiselect-react-dropdown';
import AttributesControl from "./AttributesControl";
import {
  updateSelectedType,
  addType,
  updateType,
  addAttributes
} from "../../redux/actions/index";
import API from "../../api";

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
    user: state.app.user,
    attributesByID: state.app.attributesByID,
    attributesByName: state.app.attributesByName
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedType: type => dispatch(updateSelectedType(type)),
    addType: type => dispatch(addType(type)),
    updateType: type => dispatch(updateType(type)),
    addAttributes: attrs => dispatch(addAttributes(attrs))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: undefined,
      Name: "",
      Description: "",
      Supers: [],
      Attributes: [],
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
      resetting: false
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
      // case "AttributesArr":
      //   valid = true;
      //   value = this.props.selectedType[fieldName];
      //   message = "";
      //   for (let i = 0; i < value.length; i++) {
      //     if (value.filter(attr2 => attr2.Name === value[i].Name).length > 1) {
      //       valid = false;
      //       message = "Attribute Names must be unique";
      //       break;
      //     }
      //     else if ((value[i].AttributeType === "Type" || (value[i].AttributeType === "List" && value[i].ListType === "Type")) && (value[i].DefinedType === undefined || value[i].DefinedType === null || value[i].DefinedType === "")) {
      //       valid = false;
      //       message = `A Defined Type must be selected for ${value[i].Name}.`;
      //       break;
      //     }
      //     else if ((value[i].AttributeType === "Options" || (value[i].AttributeType === "List" && value[i].ListType === "Options")) && (value[i].Options === undefined || value[i].Options === null || value[i].Options.length === 0)) {
      //       valid = false;
      //       message = `At least one Option must be set for ${value[i].Name}.`;
      //       break;
      //     }
      //   } 
      //   break;
      case "Attributes":
        valid = true;
        value = this.props.selectedType[fieldName];
        message = "";
        for (let i = 0; i < value.length; i++) {
          if (value.filter(attr2 => attr2.Name === value[i].Name).length > 1) {
            valid = false;
            message = "Attribute Names must be unique";
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
    const superIDs = this.state.Supers.map(s => {
      return s._id;
    });

    const attributes = this.props.selectedType.AttributesArr.map(a => {
      return {
        _id: a.attrID,
        Name: a.Name,
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

      this.api.getAttributesForWorld(this.props.selectedWorldID).then(res2 => {
        if (res2 !== undefined && res2.error === undefined) {
          // We store the attributes in two hashes, by name and by id
          this.props.setAttributes(res2.attributes);
        }
          
        const type = {
          _id: this.state._id,
          Name: this.state.Name,
          Description: this.state.Description,
          SuperIDs: superIDs,
          // AttributesArr: this.props.selectedType.AttributesArr,
          Attributes: typeAttributes,
          Defaults: [],
          worldID: this.props.selectedWorld._id,
          Major: this.state.Major,
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
        Object.keys(this.props.selectedType.DefaultsHash).forEach(_id => {
          const def = this.props.selectedType.DefaultsHash[_id];
          type.Defaults.push({
            _id, 
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
                type._id = res.typeID;
                type.Supers = [];
                type.SuperIDs.forEach(sID=> {
                  type.Supers = type.Supers.concat(this.props.types.filter(t2=>t2._id === sID));
                });
                this.props.addType(type);
                if (this.state.addMore) {
                  this.props.updateSelectedType({
                    _id: null,
                    Name: "",
                    Description: "",
                    Supers: [],
                    AttributesArr: [],
                    Attributes: [],
                    Major: false
                  });
                  this.setState({
                    _id: null,
                    Name: "",
                    Description: "",
                    Supers: [],
                    Attributes: [],
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
                if (this.state.addMore) {
                  this.props.updateSelectedType({
                    _id: null,
                    Name: "",
                    Description: "",
                    Supers: [],
                    AttributesArr: [],
                    Attributes: [],
                    Major: false
                  });
                  this.setState({
                    Name: "",
                    Description: "",
                    Supers: [],
                    Attributes: [],
                    Major: false,
                    fieldValidation: {
                      Name: { valid: true, message: "" },
                      AttributesArr: { valid: true, message: "" },
                      Attributes: { valid: true, message: "" }
                    },
                    formValid: false,
                    message: "",
                    waiting: false,
                    addMore: false,
                    resetting: true, 
                    redirectTo: `/type/create`
                  });
                }
                else {
                  this.setState({
                    waiting: false,
                    redirectTo: `/world/details/${this.props.selectedWorld._id}`
                  });
                }
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
    });
  };

  supersChange = (e, value) => {
    let supers = [];
    for (let i = 0; i < value.length; i++) {
      const t = value[i];
      supers.push(t);
      supers = supers.concat(t.Supers);
    }
    this.setState({ Supers: supers });
  };

  addSuperOld = (selectedList, selectedItem) => {
    selectedItem.Supers.forEach(s => {
      if (selectedList.filter(s2 => s2._id === s._id).length === 0) selectedList.push(s);
    });
    const type = this.props.selectedType;
    let attributes = [...type.AttributesArr];
    for (let i = 0; i < selectedItem.AttributesArr.length; i++) {
      const attribute = selectedItem.AttributesArr[i];
      attribute.FromSupers.push(selectedItem._id);
      const matches = attributes.filter(a => a.Name === attribute.Name);
      if (matches.length === 0) {
        // It's a new attribute.
        attribute.index = attributes.length;
        attributes.push(attribute);
      } else {
        // It's an existing attribute,
        // so we just need to add the appropriate ids to FromSupers.
        // TODO: I also need to make sure the type and details match.
        const superIDs = [...matches[0].FromSupers];
        for (let i = 0; i < attribute.FromSupers.length; i++) {
          const superID = attribute.FromSupers[i];
          if (!superIDs.includes(superID)) {
            superIDs.push(superID);
          }
        }
        matches[0].FromSupers = superIDs;
      }
    }
    this.setState({ Supers: selectedList });
    type.AttributesArr = attributes;
    this.props.updateSelectedType(type);
  }

  addSuper = (selectedList, selectedItem) => {
    const type = this.props.selectedType;
    type.SuperIDs.push(selectedItem._id);
    selectedItem.Supers.forEach(s => {
      if (selectedList.filter(s2 => s2._id === s._id).length === 0) {
        selectedList.push(s);
        type.SuperIDs.push(s._id);
      }
    });
    type.Supers = selectedList;
    this.props.updateSelectedType(type);
    this.setState({ Supers: selectedList });
  }
  
  removeSuper = (selectedList, removedItem) => {
    let supers = [];
    let superIDs = [];
    let removeUs = [removedItem._id];
    const type = this.props.selectedType;
    for (let i = 0; i < this.state.Supers.length; i++) {
      const checkMe = this.props.types.filter(
        t => t._id === this.state.Supers[i]._id
      )[0];
      if (checkMe._id === removedItem._id || checkMe.SuperIDs.includes(removedItem._id))
        removeUs.push(checkMe._id);
      else {
        supers.push(checkMe);
        superIDs.push(checkMe._id);
      }
    }
    type.Supers = supers;
    type.SuperIDs = superIDs;
    this.props.updateSelectedType(type);
    this.setState({ Supers: supers });
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
    const id = this.state._id;
    if (id !== null) {
      this.api.getType(this.props.selectedWorldID, id).then(res => {
        if (res.error === undefined) {
          const supers = this.props.types.filter(type =>
            res.SuperIDs.includes(type._id)
          );
          res.Supers = supers;
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
              attrID: a.attrID
            });
          });
          const defHash = {};
          if (res.Defaults !== undefined) {
            res.Defaults.forEach(def => {
              defHash[def.attrID] = def;
            });
          }
          res.DefaultsHash = defHash;

          this.props.updateSelectedType(res);
          this.setState({
            Name: res.Name,
            Description: res.Description,
            _id: id,
            Supers: supers,
            Major: res.Major,
            loaded: true
          });
        }
        else {
          this.setState({ message: res.error, loaded: true });
        }
      });
    } else {
      this.props.updateSelectedType({
        _id: null,
        Name: "",
        Description: "",
        Supers: [],
        SuperIDs: [],
        AttributesArr: [],
        Attributes: [],
        Major: false,
        DefaultsHash: {}
      });
      this.setState({ loaded: true });
    }
  }

  render() {
    let { id } = this.props.match.params;
    if (id === undefined)
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
      const types =
        this.props.types === undefined || this.state._id === null
          ? this.props.types
          : this.props.types.filter(type => type._id !== this.state._id);
      
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.Major}
                      onChange={this.handleUserInput}
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
                    selectedValues={this.state.Supers}
                    onSelect={this.addSuper}
                    onRemove={this.removeSuper}
                    displayValue="Name"
                  />
                }
              </Grid>
              <Grid item>
                { this.state.loaded &&
                  <AttributesControl />
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
              <Grid item>{this.state.message}</Grid>
            </Grid>
          }
        </Grid>
      );
    }
  }
}

const TypeEditPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default TypeEditPage;
