import React, { Component } from "react";
import { connect } from "react-redux";
import AttributeControl from "./AttributeControl";
import Grid from "@material-ui/core/Grid";
import { updateSelectedThing, addThing } from "../../redux/actions/index";
import API from "../../api";

const mapStateToProps = state => {
  return {
    selectedThing: state.app.selectedThing,
    things: state.app.things,
    types: state.app.types,
    selectedWorldID: state.app.selectedWorldID
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedThing: thing => dispatch(updateSelectedThing(thing)),
    addThing: thing => dispatch(addThing(thing)),
  };
}
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      Name: "",
      fieldValidation: {
        Name: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      waiting: false
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
  }

  newAttribute = () => {
    const thing = this.props.selectedThing;
    thing.AttributesArr.push({
      index: thing.AttributesArr.length,
      Name: "",
      Type: "Text",
      Options: [],
      Type2: "",
      ListType: "",
      FromTypes: [],
      Value: "",
      ListValues: [],
    });
    this.props.updateSelectedThing(thing);
  };

  changeAttribute = value => {
    const thing = this.props.selectedThing;
    thing.AttributesArr[value.index] = {
      index: value.index,
      Name: value.Name,
      Type: value.Type,
      Options: value.Options,
      Type2: value.Type2,
      ListType: value.ListType,
      FromTypes: value.FromTypes,
      Value: value.Value,
      ListValues: value.ListValues,
    };
    this.props.updateSelectedThing(thing);
  };

  blurAttribute = e => {
  };

  deleteAttribute = value => {
    const thing = this.props.selectedThing;
    thing.AttributesArr.splice(value.index);
    this.props.updateSelectedThing(thing);
  };

  optionsChange = (e, props) => {
  }

  addNewType = (respond) => {
    // Opens a Modal where they enter a name.
    this.setState({modalOpen: true, modalSubmit: respond});
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
      WorldID: this.props.selectedWorldID,
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
            modalOpen: false
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
      <Grid item xs={12} container spacing={1} direction="column">
        <Grid item>Attributes</Grid>
        {this.props.selectedThing === null || this.props.selectedThing === undefined ? ""
          : this.props.selectedThing.AttributesArr.map((attribute, i) => {
            return (
              <AttributeControl
                key={i}
                thingID={this.props.selectedThing._id}
                attribute={attribute}
                onChange={this.changeAttribute}
                onDelete={this.deleteAttribute}
                onBlur={this.blurAttribute}
                things={this.props.things}
                types={this.props.types}
                onNewType={this.addNewType}
              />
            );
          })
        }
        <Modal
          aria-labelledby="new-thing-modal"
          aria-describedby="new-thing-modal-description"
          open={this.state.modalOpen}
          onClose={e => {this.setState({modalOpen: false})}}
        >
          <div style={this.getModalStyle()} className="paper">
            <Grid container spacing={1} direction="column">
              <Grid item>
                Just give the new {this.state.newThingType.Name} a name.
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

const AttributesControl = connect(mapStateToProps, mapDispatchToProps)(Control);
export default AttributesControl;
