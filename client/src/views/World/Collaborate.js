import React, { Component } from "react";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from '@material-ui/core/FormHelperText';
import API from '../../api';


class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      worldID: null,
      collabID: null,
      codeValid: false,
      message: "Please wait.  Validating code.",
      world: null
    };
    this.api = API.getInstance();
  }

  componentDidMount = () => {
  }

  handleUserInput = e => {
    const name = e.target.name;
    const value = (e.target.type === "checkbox" ? e.target.checked : e.target.value);
    this.setState({ [name]: value });
  };

  inputBlur = e => {
    const name = e.target.name;
    const validation = this.validateField(name);
    const fieldValidation = this.state.fieldValidation;
    if (fieldValidation[name].valid !== validation.valid) {
      fieldValidation[name].valid = validation.valid;
      fieldValidation[name].message = validation.message;
      this.setState({ fieldValidation: fieldValidation });
    }
  }

  handleClickShowPassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  handleMouseDownPassword = event => {
    event.preventDefault();
  };

  validateField = (fieldName) => {
    let valid = true;
    let message = "";
    let value = this.state[fieldName];
    switch (fieldName) {
      case "email":
        valid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null;
        message = valid ? "" : "Email is invalid";
        break;
      case "password":
        valid = value.length >= 6;
        message = valid ? "" : "Password is too short";
        break;
      case "confirmEmail":
        valid = value === this.state.email;
        message = valid ? "" : "Confirm Email doesn't match Email";
        break;
      case "confirmPassword":
        valid = value === this.state.password;
        message = valid ? "" : "Confirm Password doesn't match Password";
        break;
      case "username":
        valid = value.length >= 2;
        message = valid ? "" : "Username is too short";
        break;
      default:
        break;
    }
    const response = { valid: valid, message: message };
    return response;
  };

  validateForm = (respond) => {
    const passwordValid = this.validateField("password");
    const confirmPasswordValid = this.validateField("confirmPassword");
    const formValid = 
      passwordValid.valid && 
      confirmPasswordValid.valid;
    const fieldValidation = this.state.fieldValidation;
    fieldValidation.password = passwordValid;
    fieldValidation.confirmPassword = confirmPasswordValid;
    this.setState({ 
      formValid: formValid,
      fieldValidation: fieldValidation
    }, respond);
  }

  onSubmit = () => {
    function respond() {
      if (this.state.formValid) {
        this.setState({ waiting: true },
          this.submitThroughAPI);
      }
    }

    this.validateForm(respond);
  };

  submitThroughAPI = () => {
    this.api.resetPassword(this.state.resetPasswordCode, this.state.password).then(res => {
      this.setState({ 
        message: res.message,
        waiting: false
      });
    })
    .catch(err => console.log(err));
  }

  render() {
    if (this.state.collabID === null) {
      const { worldID, collabID } = this.props.match.params;
      setTimeout(() => {
        this.api.checkCollabID(worldID, collabID).then(res => {
          if (res.error !== undefined) {
            this.setState({collabID, codeValid: false, message: res.error});
          }
          else {
            this.setState({collabID, world: res.world, codeValid: true, message: ""});
          }
        });
      }, 500);
      return (
        <div>
          <h2>{this.state.message}</h2>
        </div>
      );
    }
    else if (this.state.codeValid) {
      return (
        <div>
          <h2>Collaboration on {this.state.world.Name}</h2>
          Display two options: Accept and Decline Invite.
          If they decline then that's the end of it.
          If they accept then check if they're logged in.
          If so then submit it, update their worlds, and display success.
          If not then display log in component (which I need to pull out of LoginPage),
          and once they're logged in (even if they have to register first), 
          then submit it, update their worlds, and display success.
        </div>
      );
    }
    else {
      return (
        <div>
          <h2>{this.state.message}</h2>
        </div>
      );
    }
  }
}

const CollaboratePage = connect()(Page);
export default CollaboratePage;
