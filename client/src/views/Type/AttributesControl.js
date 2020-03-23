import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Modal from '@material-ui/core/Modal';
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import {
  updateSelectedType,
  updateAttributesArr,
  addType,
  addThing
} from "../../redux/actions/index";
import AttributeControl from "./AttributeControl";
import AttributeDefaultControl from "./AttributeDefaultControl";
import API from "../../api";

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

// It will let you add and remove attributes.
// Each needs to have a unique name as part of validation.
// Each also needs to have a valid type.
// The type can be string, integer, double, enum, any Type
// already defined for this world, or a list of any of the
// other types.
// In future versions I will add support for additional types:
// Color, DateTime, Schedule.

const mapStateToProps = state => {
  return {
    selectedType: state.app.selectedType,
    attributesArr: state.app.attributesArr,
    types: state.app.types,
    things: state.app.things,
    selectedWorldID: state.app.selectedWorldID
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedType: type => dispatch(updateSelectedType(type)),
    updateAttributesArr: arr => dispatch(updateAttributesArr(arr)),
    addType: type => dispatch(addType(type)),
    addThing: thing => dispatch(addThing(thing))
  };
}
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeModalOpen: false,
      thingModalOpen: false,
      Name: "",
      fieldValidation: {
        Name: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      waiting: false,
      defaultsMode: false,
      newThingType: null
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
  }

  newAttribute = () => {
    const type = this.props.selectedType;
    type.AttributesArr.push({
      index: type.AttributesArr.length,
      Name: "",
      Type: "Text",
      Options: [],
      Type2: "",
      ListType: "",
      FromSupers: [],
      AttributeTypes: ["Text", "Number", "True/False", "Options", "Type", "List"]
    });
    this.props.updateSelectedType(type);
  };

  changeAttribute = value => {
    const type = this.props.selectedType;
    type.AttributesArr[value.index] = {
      index: value.index,
      Name: value.Name,
      Type: value.Type,
      Options: value.Options,
      Type2: value.Type2,
      ListType: value.ListType,
      FromSupers: value.FromSupers,
      AttributeTypes: ["Text", "Number", "True/False", "Options", "Type", "List"],
      DefaultValue: value.DefaultValue,
      DefaultListValues: value.DefaultListValues
    };
    this.props.updateSelectedType(type);
  };

  blurAttribute = e => {
  };

  deleteAttribute = value => {
    const type = this.props.selectedType;
    const attributesArr = [];
    type.AttributesArr.forEach(t => {
      if (t.index !== value.index) {
        if (t.index > value.index)
          t.index--;
        attributesArr.push(t);
      }
    });
    type.AttributesArr = [];
    this.props.updateSelectedType(type);
    setTimeout(() => {
      type.AttributesArr = attributesArr;
      this.props.updateSelectedType(type);
    }, 500);
  };
  
  getModalStyle = () => {
    const top = Math.round(window.innerHeight / 2) - 50;
    const left = Math.round(window.innerWidth / 2) - 200;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(${left}px, ${top}px)`,
    };
  }

  addNewType = (respond) => {
    // Opens a Modal where they enter a name.
    this.setState({typeModalOpen: true, modalSubmit: respond});
  }

  addNewThing = (respond, type) => {
    // Opens a Modal where they enter a name.
    this.setState({thingModalOpen: true, modalSubmit: respond, newThingType: type});
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
        else if (value.length < 2) {
          valid = false;
          if (this.state.thingModalOpen) {
            message = this.state.newThingType.Name + " Name is too short"
          }
          message = "Type Name is too short";
        } else {
          valid =
            this.props.types.filter(
              t => t.Name === value && t._id !== this.state._id
            ).length === 0;
          if (!valid) message = "This Type Name is already in use";
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
  };

  saveNewType = () => {
    function respond() {
      if (this.state.formValid) {
        this.setState({ waiting: true }, this.submitThroughAPI);
      }
    }

    this.validateForm(respond);
  };

  submitThroughAPI = () => {
    const type = {
      _id: null,
      Name: this.state.Name,
      Description: "",
      SuperIDs: [],
      AttributesArr: [],
      worldID: this.props.selectedWorldID,
      Major: false
    };

    // Calls API
    this.api
      .createType(type)
      .then(res => {
        if (res.typeID !== undefined) {
          type._id = res.typeID;
          // Adds to props 
          this.props.addType(type);
          // Calls respond back to Attribute to set the type
          this.state.modalSubmit(type);
          this.setState({
            waiting: false, 
            typeModalOpen: false
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
  };

  saveNewThing = () => {
    function respond() {
      if (this.state.formValid) {
        this.setState({ waiting: true }, this.submitThingThroughAPI);
      }
    }

    this.validateForm(respond);
  };

  submitThingThroughAPI = () => {
    const types = this.props.types.filter(t=> t._id === this.state.newThingType._id || this.state.newThingType.SuperIDs.includes(t._id));
    const typeIDs = types.map(s => {
      return s._id;
    });
    const thing = {
      _id: null,
      Name: this.state.Name,
      Description: "",
      TypeIDs: typeIDs,
      AttributesArr: [],
      worldID: this.props.selectedWorldID
    };
    console.log(thing);

    // Calls API
    this.api
      .createThing(thing)
      .then(res => {
        console.log(res);
        if (res.thingID !== undefined) {
          thing._id = res.thingID;
          thing.Types = types;
          // Adds to props 
          this.props.addThing(thing);
          // Calls respond back to Attribute to set the thing
          this.state.modalSubmit(thing);
          this.setState({
            waiting: false, 
            thingModalOpen: false
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
  };

  render() {
    return (
      <Grid item xs={12} container spacing={0} direction="column">
        <Grid item>
          <Label>Attributes</Label>
        </Grid>
        <Grid item>
          <List>
            <ListItem>
              <Grid container spacing={0} direction="row">
                <Grid item xs={6}>
                  <Button disabled={this.state.defaultsMode} variant="contained" color="primary" onClick={this.newAttribute}>
                    <Add />
                    <ListItemText primary={"Create New"} />
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="contained" color="primary" onClick={e => { this.setState({defaultsMode: !this.state.defaultsMode}) }}>
                    <ListItemText primary={ this.state.defaultsMode ? "Set Attribute Types" : "Set Defaults"} />
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
            {this.props.selectedType === null ||
            this.props.selectedType === undefined
              ? ""
              : this.props.selectedType.AttributesArr.map((attribute, i) => {
                // TODO: Once all attributes have these fields then I can remove these two lines.
                attribute.DefaultValue = attribute.DefaultValue === undefined ? "" : attribute.DefaultValue;
                attribute.DefaultListValues = attribute.DefaultListValues === undefined ? [] : attribute.DefaultListValues;
                return (
                  <ListItem key={i}>
                    { this.state.defaultsMode ? 
                      <AttributeDefaultControl
                        typeID={this.props.selectedType._id}
                        attribute={attribute}
                        onChange={this.changeAttribute}
                        onBlur={this.blurAttribute}
                        types={this.props.types}
                        things={this.props.things}
                        onNewThing={this.addNewThing}
                      /> : 
                      <AttributeControl
                        typeID={this.props.selectedType._id}
                        attribute={attribute}
                        onChange={this.changeAttribute}
                        onDelete={this.deleteAttribute}
                        onBlur={this.blurAttribute}
                        types={this.props.types}
                        things={this.props.things}
                        onNewType={this.addNewType}
                      /> 
                    }
                  </ListItem>
                );
              })}
          </List>
        </Grid>
        <Modal
          aria-labelledby="new-type-modal"
          aria-describedby="new-type-modal-description"
          open={this.state.typeModalOpen}
          onClose={e => {this.setState({typeModalOpen: false})}}
        >
          <div style={this.getModalStyle()} className="paper">
            <Grid container spacing={1} direction="column">
              <Grid item>
                Just give the new Type a name.
              </Grid>
              <Grid item>
                (You can do the rest later.)
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
              <Grid item container spacing={1} direction="row">
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={this.state.waiting}
                    onClick={this.saveNewType}
                  >
                    {this.state.waiting ? "Please Wait" : "Submit"}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={e => {this.setState({typeModalOpen: false})}}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Modal>
        <Modal
          aria-labelledby="new-thing-modal"
          aria-describedby="new-thing-modal-description"
          open={this.state.thingModalOpen}
          onClose={e => {this.setState({thingModalOpen: false})}}
        >
          <div style={this.getModalStyle()} className="paper">
            <Grid container spacing={1} direction="column">
              <Grid item>
                Just give the new {this.state.newThingType === null ? "" : this.state.newThingType.Name} a name.
              </Grid>
              <Grid item>
                (You can do the rest later.)
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
              <Grid item container spacing={1} direction="row">
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    disabled={this.state.waiting}
                    onClick={this.saveNewThing}
                  >
                    {this.state.waiting ? "Please Wait" : "Submit"}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={e => {this.setState({thingModalOpen: false})}}
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

const AttributesControl = connect(mapStateToProps, mapDispatchToProps)(Control);
export default AttributesControl;
