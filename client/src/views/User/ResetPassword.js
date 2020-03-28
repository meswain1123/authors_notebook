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
      resetPasswordCode: null,
      codeValid: false,
      password: "",
      confirmPassword: "",
      fieldValidation: { 
        password: { valid: true, message: "" }, 
        confirmPassword: { valid: true, message: "" }
      },
      formValid: false,
      message: "Please wait.  Validating code."
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
    if (this.state.resetPasswordCode === null) {
      const { id } = this.props.match.params;
      setTimeout(() => {
        this.api.checkResetPasswordCode(id).then(res => {
          if (res.error !== undefined) {
            this.setState({resetPasswordCode: id, codeValid: false, message: res.error});
          }
          else {
            this.setState({resetPasswordCode: id, codeValid: true, message: ""});
          }
        });
      }, 500);
      return (
        <div>
          <h2>Reset Password</h2>
          {this.state.message}
        </div>
      );
    }
    else if (this.state.codeValid) {
      return (
        <div>
          <h2>Reset Password</h2>
          <div className="row">
            <div className="col-sm-12">
              <div className="row">
                <div className="col-sm-12 margined">
                  <FormControl variant="outlined"
                      fullWidth>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-password"
                      name="password"
                      type={this.state.showPassword ? 'text' : 'password'}
                      value={this.state.password}
                      error={ !this.state.fieldValidation.password.valid }
                      onChange={this.handleUserInput}
                      onBlur={this.inputBlur}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={this.handleClickShowPassword}
                            onMouseDown={this.handleMouseDownPassword}
                            edge="end"
                          >
                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={70}
                      fullWidth
                    />
                    <FormHelperText>{ this.state.fieldValidation.password.message }</FormHelperText>
                  </FormControl>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12 margined">
                  <FormControl variant="outlined"
                      fullWidth>
                    <InputLabel htmlFor="confirm-password">Confirm Password</InputLabel>
                    <OutlinedInput
                      id="confirm-password"
                      name="confirmPassword"
                      type={this.state.showPassword ? 'text' : 'password'}
                      value={this.state.confirmPassword}
                      error={ !this.state.fieldValidation.confirmPassword.valid }
                      onChange={this.handleUserInput}
                      onBlur={this.inputBlur}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={this.handleClickShowPassword}
                            onMouseDown={this.handleMouseDownPassword}
                            edge="end"
                          >
                            {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                      labelWidth={130}
                      fullWidth
                    />
                    <FormHelperText>{ this.state.fieldValidation.confirmPassword.message }</FormHelperText>
                  </FormControl>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <div className="float-right">
                <Button className="w200" disabled={this.state.waiting}
                  onClick={this.onSubmit}
                  type="submit">{this.state.waiting ? "Please Wait" : "Submit"}
                </Button>
              </div>
            </div>
          </div>
          {this.state.message}
          {
            Object.keys(this.state.fieldValidation).map((fieldName, i) => {
              if (this.state.fieldValidation[fieldName] !== undefined && this.state.fieldValidation[fieldName].message.length > 0) {
                return (
                  <p className="redFont" key={i}>
                    {this.state.fieldValidation[fieldName].message}
                  </p>
                );
              } else {
                return "";
              }
            })
          }
        </div>
      );
    }
    else {
      return (
        <div>
          <h2>Reset Password</h2>
          {this.state.message}
        </div>
      );
    }
  }
}

const ResetPasswordPage = connect()(Page);
export default ResetPasswordPage;
