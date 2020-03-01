import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPage,
  selectWorld,
  addWorld,
  updateWorld
} from "../../redux/actions/index";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
// import AttributesControl from "./AttributesControl";
// import SupersControl from "./SupersControl";
import Grid from "@material-ui/core/Grid";
import API from "../../api";

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
    user: state.app.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    selectWorld: worldID => dispatch(selectWorld(worldID)),
    addWorld: world => dispatch(addWorld(world)),
    updateWorld: world => dispatch(updateWorld(world))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Name: "",
      Public: false,
      fieldValidation: {
        Name: { valid: true, message: "" }
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
        const { id } = this.props.match.params;
        let world = this.props.worlds.filter(w => w._id === id);
        // console.log(world);
        if (world.length > 0) {
          world = world[0];
          this.setState({
            Name: world.Name,
            Public: world.Public,
            _id: id
          });
          this.props.selectWorld(id);
        }
        // this.api.getWorld(this.props.selectedWorldID, id).then(res => {
        //   if (res.message === undefined) {
        //     this.setState({
        //       Name: res.Name,
        //       _id: id
        //     });
        //     this.props.updateSelectedWorld(res);
        //   }
        //   else {
        //     this.setState({ message: res.message });
        //   }
        // });
      } else {
        this.props.selectWorld(null);
        // this.props.updateSelectedWorld({
        //   _id: null,
        //   Name: ""
        // });
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

  onSubmit = () => {
    // console.log(this.props);
    function respond() {
      if (this.state.formValid) {
        this.setState({ waiting: true }, this.submitThroughAPI);
      }
    }

    this.validateForm(respond);
  };

  submitThroughAPI = () => {
    const world = {
      _id: this.state._id,
      Name: this.state.Name,
      Public: this.state.Public,
      Owner: this.props.user._id
    };
    // console.log(world);

    if (world._id === null) {
      this.api
        .createWorld(this.props.user._id, world)
        .then(res => {
          // console.log(res);
          if (res.message  !== undefined) {
            this.setState({ message: res.message });
          }
          else {
            world._id = res.worldID;
            this.props.addWorld(world);
            this.setState({
              waiting: false,
              redirectTo: `/world/details/${this.props.selectedWorld._id}`
            });
          }
        })
        .catch(err => console.log(err));
    } else {
      this.api
        .updateWorld(this.props.user._id, world)
        .then(res => {
          // console.log(res);
          if (res.message !== `World ${world.Name} updated!`) {
            this.setState({ message: res.message });
          }
          else {
            this.props.updateWorld(world);
            this.setState({
              waiting: false,
              redirectTo: `/world/details/${this.props.selectedWorld._id}`
            });
          }
        })
        .catch(err => console.log(err));
    }
  };

  render() {
    // console.log(this.state);
    // console.log(this.props);
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else {
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          <Grid item>
            <h2>
              {this.state._id === null ? "Create New World" : "Edit World"}
            </h2>
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
          </Grid>
          <Grid item>
            <div className="float-right">
              <Button
                variant="contained"
                color="primary"
                className="w-200"
                disabled={this.state.waiting}
                onClick={this.onSubmit}
                type="submit"
              >
                {this.state.waiting ? "Please Wait" : "Submit"}
              </Button>
              <Button
                variant="contained"
                style={{ marginLeft: "4px" }}
                disabled={this.state.waiting}
                onClick={_ => {
                  this.setState({
                    redirectTo: `/`
                  });
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

const WorldEditPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default WorldEditPage;