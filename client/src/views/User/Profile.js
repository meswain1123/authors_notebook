import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
// import uuid from 'react-uuid';
// import { ArrowBack, Add, Search } from "@material-ui/icons";
import { 
  Grid, 
  //Button, 
  // Checkbox, FormControl, FormControlLabel,
  // InputLabel, Tooltip, Fab,
  // Select, MenuItem 
} from "@material-ui/core";
import { Helmet } from 'react-helmet';
// import { Multiselect } from 'multiselect-react-dropdown';
import {
  // updateSelectedType,
  // addType,
  // updateType,
  // addAttributes,
  setAttributes,
  setTypes,
  setThings,
  notFromLogin
} from "../../redux/actions/index";
import API from "../../smartAPI";
// import TextBox from "../../components/Inputs/TextBox";

/* 
  This component will take the main portion of the page and is used for
  creating or editing a Type.  It will allow the use of Template Types
  and Super Types to make the process faster.
*/

const mapStateToProps = state => {
  return {
    types: state.app.types,
    user: state.app.user,
    fromLogin: state.app.fromLogin
  };
};
function mapDispatchToProps(dispatch) {
  return {
    setAttributes: attrs => dispatch(setAttributes(attrs)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    notFromLogin: () => dispatch(notFromLogin({}))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      fieldValidation: {
        username: { valid: true, message: "" },
        email: { valid: true, message: "" },
      },
      formValid: false,
      message: "",
      redirectTo: null,
      waiting: false,
      loaded: false
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
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

  validateField = fieldName => {
    let value = null;
    let valid = true;
    let message = "";
    switch (fieldName) {
      case "username":
        value = this.state.username;
        // valid = value.match(/^[a-zA-Z0-9 ]*$/i) !== null;
        // if (!valid)
        //   message = "Only Letters, Numbers, and Spaces allowed in Type Names";
        // else 
        if (value.length < 2) {
          valid = false;
          message = "Username is too short";
        } else if (this.state.allUsers.filter(u=>u.username === value && u._id !== this.props.user._id).length !== 0) {
          valid = false;
          message = "This Username is taken";
        }
        break;
      case "email":
        value = this.state.email;
        valid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null;
        message = valid ? "" : "Email is invalid";
        if (valid && value !== this.props.user.email)
          message = "You will be sent a confirmation email at your new email upon submission.  Please use the link.";
        break;
      default:
        break;
    }
    const response = { valid: valid, message: message };
    return response;
  }

  validateForm = respond => {
    const nameValid = this.validateField("username");
    const emailValid = this.validateField("email");
    const formValid = nameValid.valid && emailValid.valid;
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
    const user = {
      _id: this.props.user._id,
      username: this.state.username.trim(),
      email: this.state.email.trim()
    };

    this.api.updateUser(user).then(res => {
      // Should do all the same stuff that is done on login.
      if (res.user === null) {
        let errors = this.state.fieldValidation;
        errors.loginError = { message: res.error, valid: false, show: true };
        this.setState({ fieldValidation: errors, waiting: false });
      }
      else {
        this.props.userLogin(res.user);
        this.api.getWorldsForUser(res.user._id).then(res => {
          this.props.setWorlds(res.worlds);
          this.props.onLogin(res.user);
          // this.setState({ redirectTo: "/" });
        });
      }
    });
  }

  load = () => {
    setTimeout(() => {
      this.setState({
        redirectTo: null,
        message: "Loading..."
      }, this.finishLoading);
    }, 500);
  }

  finishLoading = () => {
    if (this.props.fromLogin) {
      this.props.notFromLogin();
    }
    this.api.getAllUsers().then(res2 => {
      this.setState({
        allUsers: res2, 
        username: this.props.user.username, 
        email: this.props.user.email,
        loaded: true,
        message: ""
      });
    });
  }

  render() {
    if (!this.state.loaded)
      this.load();
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.props.user === null) {
      return <span>Please log in to be able to access your profile.</span>;
    } else {
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          <Helmet>
            <title>{ `Author's Notebook: User Profile` }</title>
          </Helmet>
          <Grid item>
            <h2>User Profile</h2>
          </Grid>
          <Grid item>
            Username: {this.props.user.username}
            {/* { this.state.loaded && <span>{this.state.username}</span> 
              // <TextBox 
              //   Value={this.state.username} 
              //   fieldName="username" 
              //   displayName="Username" 
              //   message={this.state.fieldValidation.username.message}
              //   onBlur={name => {
              //     this.setState({ username: name }, this.validateForm);
              //   }}
              //   labelWidth={70}/>
            } */}
          </Grid>
          <Grid item>
            Email: {this.props.user.email}
            {/* { this.state.loaded &&  
              <TextBox 
                Value={this.state.email} 
                fieldName="email" 
                displayName="Email" 
                message={this.state.fieldValidation.email.message}
                onBlur={email => {
                  this.setState({ email }, this.validateForm);
                }}
                labelWidth={43}/>
            } */}
          </Grid>
          <Grid item>I'll add more profile elements here as the website grows</Grid>
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
          </Grid>
          <Grid item>
            <div className="float-right">
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
            </div>
          </Grid>
          <Grid item style={{color:"red"}}>{this.state.message}</Grid> */}
        </Grid>
      );
    }
  }
}

const ProfilePage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default ProfilePage;
