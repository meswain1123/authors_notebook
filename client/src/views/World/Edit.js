import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectWorld,
  addWorld,
  updateWorld,
  notFromLogin,
  toggleLogin,
  setAttributes,
  setTypes,
  setThings,
  logout
} from "../../redux/actions/index";
import { Button, Checkbox, FormControl, FormControlLabel,
  OutlinedInput, InputLabel, FormHelperText, Grid, Tooltip, Fab
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import { Helmet } from 'react-helmet';
import API from "../../smartAPI";

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
    user: state.app.user,
    fromLogin: state.app.fromLogin
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectWorld: worldID => dispatch(selectWorld(worldID)),
    addWorld: world => dispatch(addWorld(world)),
    updateWorld: world => dispatch(updateWorld(world)),
    notFromLogin: () => dispatch(notFromLogin({})),
    toggleLogin: () => dispatch(toggleLogin({})),
    setAttributes: attributes => dispatch(setAttributes(attributes)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    logout: () => dispatch(logout({}))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Name: "",
      Public: false,
      AcceptingCollaborators: false,
      fieldValidation: {
        Name: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null,
      loaded: true
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
  }

  handleUserInput = e => {
    const name = e.target.name;
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState({ [name]: value });
  }

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
  }

  a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  validateField = fieldName => {
    let value = this.state[fieldName];
    let valid = true;
    let message = "";
    switch (fieldName) {
      case "Name":
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
      case "inviteEmail":
        valid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null;
        message = valid ? "" : "Email is invalid";
        break;
      default:
        break;
    }
    const response = { valid: valid, message: message };
    return response;
  }

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
  }

  onSubmit = () => {
    function respond() {
      if (this.state.formValid) {
        this.setState({ waiting: true }, this.submitThroughAPI);
      }
    }

    this.validateForm(respond);
  }

  submitThroughAPI = () => {
    const world = {
      _id: this.state._id,
      Name: this.state.Name.trim(),
      Public: this.state.Public,
      AcceptingCollaborators: this.state.AcceptingCollaborators,
      Owner: this.props.user._id
    };

    if (world._id === null) {
      this.api
        .createWorld(world)
        .then(res => {
          if (res.error !== undefined) {
            this.setState({ message: res.error }, () => {
              this.props.logout();
            });
          }
          else {
            world._id = res.worldID;
            this.props.addWorld(world);
            this.setState({
              waiting: false,
              redirectTo: `/world/details/${res.worldID}`
            });
          }
        })
        .catch(err => console.log(err));
    } else {
      this.api
        .updateWorld(world)
        .then(res => {
          if (res.error !== undefined) {
            this.setState({ message: res.error }, () => {
              this.props.logout();
            });
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
    if (this.state._id === null) {
      this.setState({
        Name: "",
        Public: false,
        loaded: true
      });
    }
    else {
      this.api.selectWorld(this.state._id).then(res => {
        this.props.selectWorld(this.state._id);
        this.api.getWorld(this.props.selectedWorldID).then(res => {
          this.props.setAttributes(res.attributes);
          this.props.setTypes(res.types);
          this.props.setThings(res.things);

          this.setState({
            Name: this.props.selectedWorld.Name,
            Public: this.props.selectedWorld.Public,
            loaded: true
          });
        });
      });
    }
  }

  render() {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
    let { id } = this.props.match.params;
    if (id === undefined)
      id = null;
    if (this.state._id !== id) {
      this.load(id);
      return (<span>Loading...</span>);
    } else if (!this.state.loaded) {
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
      this.props.selectedWorld.Owner !== this.props.user._id) {
      return <Redirect to="/" />;
    } else {
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          <Helmet>
            <title>{ this.state._id === null ? `Author's Notebook: Create New World` : `Author's Notebook: Edit ${this.props.selectedWorld.Name}` }</title>
          </Helmet>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={1}>
              { this.props.selectedWorld !== null &&
                <Tooltip title={`Back to ${this.props.selectedWorld.Name} Details`}>
                  <Fab size="small"
                    color="primary"
                    onClick={ _ => {this.setState({redirectTo:`/world/details/${this.props.selectedWorldID}`})}}
                  >
                    <ArrowBack />
                  </Fab>
                </Tooltip>
              }
            </Grid>
            <Grid item xs={11}>
              <h2>
                {this.state._id === null ? "Create New World" : "Edit World"}
              </h2>
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
            { this.state.Public ?
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.AcceptingCollaborators}
                  onChange={this.handleUserInput}
                  name="AcceptingCollaborators"
                  color="primary"
                />
              }
              label="Accepting Collaborator Requests"
            /> : "" }
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
                    redirectTo: this.state._id === null ? `/` : `/world/details/${this.state._id}`
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