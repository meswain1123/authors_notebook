import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPage,
  updateSelectedType,
  addType,
  updateType
} from "../../redux/actions/index";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import AttributesControl from "./AttributesControl";
import { Multiselect } from 'multiselect-react-dropdown';
import Grid from "@material-ui/core/Grid";
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
    user: state.app.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    updateSelectedType: type => dispatch(updateSelectedType(type)),
    addType: type => dispatch(addType(type)),
    updateType: type => dispatch(updateType(type))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Name: "",
      Description: "",
      Supers: [],
      Attributes: [],
      Major: false,
      fieldValidation: {
        Name: { valid: true, message: "" },
        AttributesArr: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      if (id !== undefined) {
        this.api.getType(this.props.selectedWorldID, id).then(res => {
          if (res.message === undefined) {
            const supers = this.props.types.filter(type =>
              res.SuperIDs.includes(type._id)
            );
            this.setState({
              Name: res.Name,
              Description: res.Description,
              _id: id,
              Supers: supers,
              Major: res.Major
            });
            this.props.updateSelectedType(res);
          }
          else {
            this.setState({ message: res.message });
          }
        });
      } else {
        this.props.updateSelectedType({
          _id: null,
          Name: "",
          Description: "",
          Supers: [],
          AttributesArr: [],
          Major: false
        });
      }
    }, 500);
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
          message = "Only Letters, Numbers, and Spaces allowed in Type Names";
        else if (value.length < 4) {
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
          if (value.filter(attr2 => attr2.Name === value[i].Name).length > 1) {
            valid = false;
            message = "Attribute Names must be unique";
            break;
          }
          else if ((value[i].Type === "Type" || (value[i].Type === "List" && value[i].ListType === "Type")) && (value[i].Type2 === undefined || value[i].Type2 === null || value[i].Type2 === "")) {
            valid = false;
            message = `A Defined Type must be selected for ${value[i].Name}.`;
            break;
          }
          else if ((value[i].Type === "Options" || (value[i].Type === "List" && value[i].ListType === "Options")) && (value[i].Options === undefined || value[i].Options === null || value[i].Options.length === 0)) {
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
    const superIDs = this.state.Supers.map(s => {
      return s._id;
    });
    const type = {
      _id: this.state._id,
      Name: this.state.Name,
      Description: this.state.Description,
      SuperIDs: superIDs,
      AttributesArr: this.props.selectedType.AttributesArr,
      WorldID: this.props.selectedWorld._id,
      Major: this.state.Major
    };

    if (type._id === null) {
      this.api
        .createType(this.props.user._id, type)
        .then(res => {
          if (res.typeID !== undefined) {
            type._id = res.typeID;
            this.props.addType(type);
            this.setState({
              waiting: false,
              redirectTo: `/world/details/${this.props.selectedWorld._id}`
            });
          }
          else if (res.message !== undefined) {
            this.setState({
              waiting: false, 
              message: res.message 
            });
          }
        })
        .catch(err => console.log(err));
    } else {
      this.api
        .updateType(this.props.user._id, type)
        .then(res => {
          this.props.updateType(type);
          this.setState({
            waiting: false,
            redirectTo: `/world/details/${this.props.selectedWorld._id}`
          });
        })
        .catch(err => console.log(err));
    }
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

  addSuper = (selectedList, selectedItem) => {
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
  
  removeSuper = (selectedList, removedItem) => {
    let supers = [];
    let removeUs = [removedItem._id];
    for (let i = 0; i < this.state.Supers.length; i++) {
      const checkMe = this.props.types.filter(
        t => t._id === this.state.Supers[i]._id
      )[0];
      if (checkMe._id === removedItem._id || checkMe.SuperIDs.includes(removedItem._id))
        removeUs.push(checkMe._id);
      else supers.push(checkMe);
    }
    const type = this.props.selectedType;
    let attributes = [...type.AttributesArr];
    for (let i = 0; i < attributes.length; i++) {
      const attribute = attributes[i];
      let j = 0;
      while (j < attribute.FromSupers.length) {
        const checkMe = attribute.FromSupers[j];
        if (removeUs.includes(checkMe)) {
          attribute.FromSupers.splice(j, 1);
        } else {
          j++;
        }
      }
    }
    this.setState({ Supers: supers });
    type.AttributesArr = attributes;
    this.props.updateSelectedType(type);
  }

  render() {
    const types =
      this.props.types === undefined || this.state._id === null
        ? this.props.types
        : this.props.types.filter(type => type._id !== this.state._id);
    
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          <Grid item>
            <h2>{this.state._id === null ? "Create New Type" : "Edit Type"}</h2>
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
            <Multiselect
              placeholder="Super Types"
              options={types}
              selectedValues={this.state.Supers}
              onSelect={this.addSuper}
              onRemove={this.removeSuper}
              displayValue="Name"
            />
          </Grid>
          <Grid item>
            <AttributesControl />
          </Grid>
          <Grid item>
            {/* <FormHelperText>
              {this.state.fieldValidation.AttributesArr.message}
            </FormHelperText> */}
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
                className="w-200"
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
          {/* <Grid item>
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
          </Grid> */}
        </Grid>
      );
    }
  }
}

const TypeEditPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default TypeEditPage;
