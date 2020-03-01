import React, { Component } from "react";
// import { sessionService } from 'redux-react-session';
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
// import TextField from "@material-ui/core/TextField";
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from '@material-ui/core/FormHelperText';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { userLogin, selectPage, setWorlds } from "../../redux/actions/index";
// import { Button } from "reactstrap";
// import {
//   Form,
//   FormGroup,
//   FormControl,
//   // ControlLabel,
//   Checkbox
// } from "react-bootstrap";
// import FormErrors from "../Controls/FormErrors";
// import { Link } from "react-bootstrap/lib/Navbar";
import Link from "@material-ui/core/Link";
import Cookies from "universal-cookie";
import API from '../../api';


const mapStateToProps = state => {
  return { 
    selectedPage: state.app.selectedPage, 
    user: state.app.user, 
    loginError: state.app.loginError 
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectPage: page => dispatch(selectPage(page)),
    userLogin: user => dispatch(userLogin(user)),
    setWorlds: worlds => dispatch(setWorlds(worlds))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    const cookies = new Cookies();
    const emailCookie = cookies.get('email');
    const passCookie = cookies.get('password');
    this.state = {
      formMode: "login",
      email: (emailCookie === undefined ? "" : emailCookie),
      password: (passCookie === undefined ? "" : passCookie),
      confirmEmail: "",
      confirmPassword: "",
      fieldValidation: { 
        email: { valid: true, message: "" }, 
        password: { valid: true, message: "" }, 
        confirmEmail: { valid: true, message: "" }, 
        confirmPassword: { valid: true, message: "" },
        firstName: { valid: true, message: "" },
        lastName: { valid: true, message: "" }
      },
      // emailValid: false,
      // passwordValid: false,
      formValid: false,
      remember: false,
      message: "",
      firstName: "",
      lastName: "",
      redirectTo: null
    };
    this.api = API.getInstance();
  }

  componentDidMount = () => {
    if (this.state.email) {
      this.validateField("email");
      this.validateField("password");
      this.setState({remember: true});
    }
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
    // let fieldValidationErrors = this.state.fieldValidation;
    // let emailValid = fieldValidationErrors.email.valid; // this.state.emailValid;
    // let passwordValid = fieldValidationErrors.password.valid; // this.state.passwordValid;
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
      case "firstName":
        valid = value.length >= 2;
        message = valid ? "" : "First Name is too short";
        break;
      case "lastName":
        valid = value.length >= 2;
        message = valid ? "" : "Last Name is too short";
        break;
      default:
        break;
    }
    const response = { valid: valid, message: message };
    return response;
  };

  validateForm = (respond) => {
    const emailValid = this.validateField("email");
    let confirmEmailValid = { valid: true, message: "" };
    let passwordValid = { valid: true, message: "" };
    let confirmPasswordValid = { valid: true, message: "" };
    let firstNameValid = { valid: true, message: "" };
    let lastNameValid = { valid: true, message: "" };
    switch (this.state.formMode) {
      case "Login":
        passwordValid = this.validateField("password");
        break;
      case "Register":
        confirmEmailValid = this.validateField("confirmEmail");
        passwordValid = this.validateField("password");
        confirmPasswordValid = this.validateField("confirmPassword");
        firstNameValid = this.validateField("firstName");
        lastNameValid = this.validateField("lastName");
      break;
      default:
      break;
    }
    const formValid = 
      emailValid.valid && 
      passwordValid.valid && 
      confirmEmailValid.valid && 
      confirmPasswordValid.valid && 
      firstNameValid.valid &&
      lastNameValid.valid;
    const fieldValidation = this.state.fieldValidation;
    fieldValidation.email = emailValid;
    fieldValidation.password = passwordValid;
    fieldValidation.confirmEmail = confirmEmailValid;
    fieldValidation.confirmPassword = confirmPasswordValid;
    fieldValidation.firstName = firstNameValid;
    fieldValidation.lastName = lastNameValid;
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
    const user = {
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    };
    if (this.state.formMode === "login") {
      this.api.login(user).then(res => {
        console.log(res);
        if (res.user === null) {
          let errors = this.state.fieldValidation;
          errors.loginError = { message: res.message, valid: false, show: true };
          this.setState({ fieldValidation: errors, waiting: false });
        }
        else {
          if (this.state.remember) {
            const cookies = new Cookies();
            cookies.set('email', this.state.email);
            cookies.set('password', this.state.password);
          }
          this.api.getWorldsForUser(res.user._id).then(res => {
            console.log(res);
            this.props.setWorlds(res.worlds);
          });
          // const { token } = res.user;
          // sessionService.saveSession({ token })
          // .then(() => {
          //   sessionService.saveUser(res.user)
          //   .then(() => {
          //   }).catch(err => console.error(err));
          // }).catch(err => console.error(err));
          // console.log('hi');
          this.props.userLogin(res.user);
          this.setState({ redirectTo: "/" });
        }
      })
      .catch(err => console.log(err));
    } else if (this.state.formMode === "register") {
      this.api.register(user).then(res => {
        this.setState({ message: res.message, formMode: "login", fieldValidation: { 
          email: { valid: false, message: "" }, 
          password: { valid: false, message: "" }, 
          confirmEmail: { valid: false, message: "" }, 
          confirmPassword: { valid: false, message: "" },
          firstName: { valid: false, message: "" },
          lastName: { valid: false, message: "" },
          waiting: false
        }});
      })
      .catch(err => console.log(err));
    } else if (this.state.formMode === "password") {
      this.api.sendReset(user).then(res => {
        this.setState({ message: res.message, formMode: "login", fieldValidation: { 
          email: { valid: false, message: "" }, 
          password: { valid: false, message: "" }, 
          confirmEmail: { valid: false, message: "" }, 
          confirmPassword: { valid: false, message: "" },
          firstName: { valid: false, message: "" },
          lastName: { valid: false, message: "" }
        },
          waiting: false 
        });
      })
      .catch(err => console.log(err));
    }
  }

  loginClick = () => {
    this.setState({ formMode: "login" });
  };

  registerClick = () => {
    this.setState({ formMode: "register" });
  };

  passwordClick = () => {
    this.setState({ formMode: "password" });
  };

  render() {
    console.log(this.props);
    if (this.state.redirectTo !== null && 
      this.props.user !== null && 
      this.props.user !== undefined && 
      this.props.user.firstName !== undefined && 
      this.props.user.firstName !== "") {
      return (<Redirect to={this.state.redirectTo} />);
    }
    else {
      if (this.state.formMode === "login") {
        return (
          <div>
            <h2>Login</h2>
            <div className="row">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-12 margined">
                    <FormControl variant="outlined"
                        fullWidth>
                      <InputLabel htmlFor="email">Email</InputLabel>
                      <OutlinedInput
                        id="email"
                        name="email"
                        type="email"
                        error={ !this.state.fieldValidation.email.valid }
                        value={this.state.email}
                        onChange={this.handleUserInput}
                        onBlur={this.inputBlur}
                        labelWidth={40}
                        fullWidth
                      />
                      <FormHelperText>{ this.state.fieldValidation.email.message }</FormHelperText>
                    </FormControl>
                  </div>
                </div>
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
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={this.state.remember}
                          onChange={this.handleUserInput}
                          name="remember"
                          color="primary"
                        />
                      }
                      label="Remember Me"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="float-left">
                  <Link
                    onClick={this.registerClick}
                  >
                    Register
                  </Link>{" "}
                  <Link
                    onClick={this.passwordClick}
                  >
                    Forgot Password
                  </Link>
                </div>
                <div className="float-right">
                  <Button className="w-200" 
                    variant="contained" color="primary"
                    disabled={this.state.waiting}
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
      } else if (this.state.formMode === "register") {
        return (
          <div>
            <h2>Register</h2>
            <div className="row">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-6">
                    <div className="row">
                      <div className="col-sm-12 margined">
                        <FormControl variant="outlined"
                            fullWidth>
                          <InputLabel htmlFor="firstName">First Name</InputLabel>
                          <OutlinedInput
                            id="firstName"
                            name="firstName"
                            type="text"
                            value={this.state.firstName}
                            error={ !this.state.fieldValidation.firstName.valid }
                            onChange={this.handleUserInput}
                            onBlur={this.inputBlur}
                            labelWidth={80}
                            fullWidth
                          />
                          <FormHelperText>{ this.state.fieldValidation.firstName.message }</FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 margined">
                        <FormControl variant="outlined"
                          fullWidth>
                          <InputLabel htmlFor="lastName">Last Name</InputLabel>
                          <OutlinedInput
                            id="lastName"
                            name="lastName"
                            type="text"
                            value={this.state.lastName}
                            error={ !this.state.fieldValidation.lastName.valid }
                            onChange={this.handleUserInput}
                            onBlur={this.inputBlur}
                            labelWidth={80}
                            fullWidth
                          />
                          <FormHelperText>{ this.state.fieldValidation.lastName.message }</FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="row">
                      <div className="col-sm-12 margined">
                        <FormControl variant="outlined"
                            fullWidth>
                          <InputLabel htmlFor="email">Email</InputLabel>
                          <OutlinedInput
                            id="email"
                            name="email"
                            type="email"
                            value={this.state.email}
                            error={ !this.state.fieldValidation.email.valid }
                            onChange={this.handleUserInput}
                            onBlur={this.inputBlur}
                            labelWidth={40}
                            fullWidth
                          />
                          <FormHelperText>{ this.state.fieldValidation.email.message }</FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 margined">
                        <FormControl variant="outlined"
                          fullWidth>
                          <InputLabel htmlFor="confirmEmail">Confirm Email</InputLabel>
                          <OutlinedInput
                            id="confirmEmail"
                            name="confirmEmail"
                            type="email"
                            error={ !this.state.fieldValidation.confirmEmail.valid }
                            value={this.state.confirmEmail}
                            onChange={this.handleUserInput}
                            onBlur={this.inputBlur}
                            labelWidth={100}
                            fullWidth
                          />
                          <FormHelperText>{ this.state.fieldValidation.confirmEmail.message }</FormHelperText>
                        </FormControl>
                      </div>
                    </div>
                  </div> 
                </div>
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
                <div className="float-left">
                  <Link
                    onClick={this.loginClick}
                  >
                    Login
                  </Link>{" "}
                  <Link
                    onClick={this.passwordClick}
                  >
                    Forgot Password
                  </Link>{" "}
                </div>
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
      } else if (this.state.formMode === "password") {
        return (
          <div>
            <h2>Forgot Password?</h2>
            <div className="row">
              <div className="col-sm-12">
                <div className="row">
                  <div className="col-sm-12 margined">
                    <FormControl variant="outlined"
                        fullWidth>
                      <InputLabel htmlFor="email">Email</InputLabel>
                      <OutlinedInput
                        id="email"
                        name="email"
                        type="email"
                        value={this.state.email}
                        error={ !this.state.fieldValidation.email.valid }
                        onChange={this.handleUserInput}
                        onBlur={this.inputBlur}
                        labelWidth={40}
                        fullWidth
                      />
                      <FormHelperText>{ this.state.fieldValidation.email.message }</FormHelperText>
                    </FormControl>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-sm-12">
                <div className="float-left">
                  <Link
                    onClick={this.registerClick}
                  >
                    Register
                  </Link>{" "}
                  <Link
                    onClick={this.loginClick}
                  >
                    Login
                  </Link>
                </div>
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
    }
  }
}

const LoginPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default LoginPage;
