import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  selectPage,
  selectWorld,
  addWorld,
  updateWorld
} from "../../redux/actions/index";
import { Button, Checkbox, FormControl, FormControlLabel,
  OutlinedInput, InputLabel, FormHelperText, Grid, 
  ListItem, ListItemText,
  Tooltip, Fab, AppBar, Tabs, Tab, Box, 
  InputAdornment, IconButton,
  Select, MenuItem
} from "@material-ui/core";
import {Add, ArrowBack, FileCopyOutlined, Delete} from "@material-ui/icons";
import { Helmet } from 'react-helmet';
import API from "../../api";

/* 
  This component will take the main portion of the page and is used for
  creating or editing a World.  It will allow the use of Template Worlds
  which come with preloaded Template Types.
*/

function TabPanel(props) {
  const { children, value, index } = props;

  return (
    <div>{value === index && <Box p={3}>{children}</Box>}</div>
  );
}

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
      AcceptingCollaborators: false,
      Collaborators: [],
      // nonUser: { _id: -1, username: "(Select a User)" },
      allUsers: null,
      fieldValidation: {
        Name: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null,
      newCollaborators: false,
      newCollabTab: 0,
      collabTab: 0,
      collabLink: null,
      collabLinkCopied: false,
      selectedUser: { _id: -1, username: "(Select a User)" },
      inviteEmail: ""
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      if (id !== undefined) {
        const { id } = this.props.match.params;
        let world = this.props.worlds.filter(w => w._id === id);
        console.log(world);
        if (world.length > 0) {
          world = world[0];
          this.setState({
            Name: world.Name,
            Public: world.Public,
            AcceptingCollaborators: world.AcceptingCollaborators === undefined ? false : world.AcceptingCollaborators,
            Collaborators: world.Collaborators === undefined ? [] : world.Collaborators,
            _id: id
          });
          this.api.selectWorld(id);
          this.props.selectWorld(id);
        }
      } else {
        this.api.selectWorld(null);
        this.props.selectWorld(null);
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

  a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

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

  addNewCollaborator = () => {
    this.api.addNewCollaborator(this.props.selectedWorldID, this.state.selectedUser._id, this.state.selectedUser.email).then(res => {
      if (res.error === undefined) {
        const collabs = [...this.state.Collaborators];
        collabs.push(res);
        const world = this.props.selectedWorld;
        world.Collaborators = collabs;
        this.props.updateWorld(world);
        this.setState({
          Collaborators: collabs
        });
      }
      else {
        this.setState({message: res.error});
      }
    });
  }

  emailCollaborator = () => {
    this.api.emailCollaborator(this.props.selectedWorldID, this.state.inviteEmail).then(res => {
      if (res.error === undefined) {
        const collabs = [...this.state.Collaborators];
        collabs.push(res);
        const world = this.props.selectedWorld;
        world.Collaborators = collabs;
        this.props.updateWorld(world);
        this.setState({
          Collaborators: collabs
        });
      }
      else {
        this.setState({message: res.error});
      }
    });
  }

  // Creates a collab invite on the world, but no user or email associated
  generateCollabLink = () => {
    this.api.generateCollabLink(this.props.selectedWorldID).then(res => {
      if (res.error === undefined) {
        const collabs = [...this.state.Collaborators];
        collabs.push(res);
        const world = this.props.selectedWorld;
        world.Collaborators = collabs;
        this.props.updateWorld(world);
        this.setState({
          collabLink: res.collabLink, 
          collabLinkCopied: false,
          Collaborators: collabs
        });
      }
      else {
        this.setState({message: res.error});
      }
    });
  }

  deleteCollab = (collab) => {
    this.api.deleteCollab(this.props.selectedWorldID, collab.collabID).then(res => {
      if (res.error === undefined) {
        const collabs = this.state.Collaborators.filter(c=>c.collabID !== collab.collabID);
        const world = this.props.selectedWorld;
        world.Collaborators = collabs;
        this.props.updateWorld(world);
        this.setState({
          collabLink: res.collabLink, 
          collabLinkCopied: false,
          Collaborators: collabs
        });
      }
      else {
        this.setState({message: res.error});
      }
    });
  }

  // Copies the collaborator link to the user's clipboard
  copyCollabLink = () => {
    const el = this.generatedLink;
    const textarea = el.children[0];
    textarea.select();
    document.execCommand("copy");
    this.setState({collabLinkCopied: true});
  }

  onSubmit = () => {
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
      AcceptingCollaborators: this.state.AcceptingCollaborators,
      Collaborators: this.state.Collaborators,
      Owner: this.props.user._id
    };

    if (world._id === null) {
      this.api
        .createWorld(world)
        .then(res => {
          if (res.error  !== undefined) {
            this.setState({ message: res.error });
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
            this.setState({ message: res.error });
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
    // console.log(this.state.Collaborators);
    if (this.state.allUsers === null) {
      this.api.getAllUsers().then(res => {
        this.setState({allUsers: res});
      });
      return (<div></div>);
    }
    else if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.props.selectedWorld !== null && (this.props.user === null || this.props.selectedWorld.Owner !== this.props.user._id)) {
      return <Redirect to="/" />;
    } else {
      const collabs = this.state.Collaborators.filter(c=>c.type==="collab");
      const invites = this.state.Collaborators.filter(c=>c.type==="invite");
      const requests = this.state.Collaborators.filter(c=>c.type==="request");
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          <Helmet>
            <title>{ this.state._id === null ? `Author's Notebook: Create New World` : `Author's Notebook: Edit ${this.props.selectedWorld.Name}` }</title>
          </Helmet>
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
            <ListItem style={{maxWidth: "200px"}}>
              <ListItemText primary="Collaborators (in progress, please don't use)" />
              { this.state.newCollaborators ?
                <Tooltip title={`Manage Existing Collaborators`}>
                  <Fab
                    size="small"
                    color="primary"
                    onClick={_ => {
                      this.setState({ newCollaborators: false });
                    }}
                  >
                    <ArrowBack />
                  </Fab>
                </Tooltip>  :
                <Tooltip title={`Add New Collaborators`}>
                  <Fab
                    size="small"
                    color="primary"
                    onClick={_ => {
                      this.setState({ newCollaborators: true });
                    }}
                  >
                    <Add />
                  </Fab>
                </Tooltip> 
              }
            </ListItem>
          </Grid>
          { this.state.newCollaborators ?
            <Grid item container spacing={1} direction="column">
              <Grid item>
                <AppBar position="static">
                  <Tabs value={this.state.newCollabTab} onChange={(_, newValue) => { this.setState({newCollabTab: newValue})}} aria-label="Add Collaborator Method">
                    <Tab label="Find Existing User" {...this.a11yProps(0)} />
                    <Tab label="Invite via Email" {...this.a11yProps(1)} />
                    <Tab label="Get an Invite Link" {...this.a11yProps(2)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={this.state.newCollabTab} index={0}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="user-select" id="user-select-label">
                      Select a User
                    </InputLabel>
                    <Select
                      labelId="user-select-label"
                      id="user-select"
                      value={this.state.selectedUser}
                      onChange={e => {
                        this.setState({selectedUser: e.target.value})
                      }}
                      labelWidth={90}
                    >
                      {/* {selectUsers.map((u, i) => { */}
                      {this.state.allUsers.map((u, i) => {
                        return (
                          <MenuItem key={i} value={u}>
                            {u.username}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={this.state.selectedUser._id === -1}
                    onClick={this.addNewCollaborator}
                  >
                    Send Invite
                  </Button> 
                </TabPanel>
                <TabPanel value={this.state.newCollabTab} index={1}>
                  Textbox to take email
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.emailCollaborator}
                  >
                    Send Invite
                  </Button> 
                </TabPanel>
                <TabPanel value={this.state.newCollabTab} index={2}>
                  <Grid container spacing={1} direction="column">
                    <Grid item>
                      Generate a single use link to send someone yourself
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={this.generateCollabLink}
                      >
                        Generate Link
                      </Button> 
                    </Grid>
                      { this.state.collabLink !== null && 
                        <Grid item>
                          <OutlinedInput
                            id="generatedLink"
                            name="generatedLink"
                            ref={(input) => this.generatedLink = input}
                            type="text"
                            multiline={true}
                            value={this.state.collabLink}
                            // disabled={true}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="copy to clipboard"
                                  onClick={this.copyCollabLink}
                                  edge="end"
                                >
                                  <FileCopyOutlined />
                                </IconButton>
                              </InputAdornment>
                            }
                            labelWidth={70}
                            fullWidth
                          />
                          { this.state.collabLinkCopied && 
                            <span style={{fontColor: "red"}}>
                              Link Copied to Clipboard
                            </span>
                          }
                        </Grid>
                      }
                  </Grid>
                  
                </TabPanel>
              </Grid>
            </Grid> :
            <Grid item container spacing={1} direction="column">
              <Grid item>
                <AppBar position="static">
                  <Tabs value={this.state.collabTab} onChange={(_, newValue) => { this.setState({collabTab: newValue})}} aria-label="Collaborators">
                    <Tab label={`Collaborators (${collabs.length})`} {...this.a11yProps(0)} />
                    <Tab label={`Invites (${invites.length})`} {...this.a11yProps(1)} />
                    <Tab label={`Requests (${requests.length})`} {...this.a11yProps(2)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={this.state.collabTab} index={0}>
                  <Grid container spacing={3} direction="column">
                    { collabs.map((c, key) => {
                      return (
                        <Grid item container spacing={1} direcion="row" key={key}>
                          <Grid item xs={12} sm={9}>
                            {this.state.allUsers.filter(u=>u._id === c.userID)[0].username}
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Tooltip title={`Remove Collaborator`}>
                              <Fab size="small"
                                color="primary"
                                onClick={e => {this.deleteCollab(c)}}
                              >
                                <Delete />
                              </Fab>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </TabPanel>
                <TabPanel value={this.state.collabTab} index={1}>
                  <Grid container spacing={3} direction="column">
                    { invites.map((c, key) => {
                      let user = this.state.allUsers.filter(u=>u._id === c.userID);
                      if (user.length === 0)
                        user = null;
                      else {
                        user = user[0];
                      }
                      return (
                        <Grid item container spacing={1} direction="row" key={key}>
                          <Grid item xs={12} sm={9} container spacing={1} direction="column">
                            { user !== null &&
                              <Grid item>
                                Username: {user.username}
                              </Grid>
                            }
                            { c.email !== "" &&
                              <Grid item>
                                Email: {c.email}
                              </Grid>
                            }
                            <Grid item>
                              Invite Link: {c.collabLink}
                            </Grid>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Tooltip title={`Delete Invite`}>
                              <Fab size="small"
                                color="primary"
                                onClick={e => {this.deleteCollab(c)}}
                              >
                                <Delete />
                              </Fab>
                            </Tooltip>
                          </Grid>
                        </Grid>  
                      );
                    })}
                  </Grid>
                </TabPanel>
                <TabPanel value={this.state.collabTab} index={2}>
                  <Grid container spacing={3} direction="column">
                    { requests.map((c, key) => {
                      return (
                        <Grid item container spacing={1} direcion="row" key={key}>
                          <Grid item xs={12} sm={9}>
                            {this.state.allUsers.filter(u=>u._id === c.userID)[0].username}
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Tooltip title={`Delete Request`}>
                              <Fab size="small"
                                color="primary"
                                onClick={e => {this.deleteCollab(c)}}
                              >
                                <Delete />
                              </Fab>
                            </Tooltip>
                          </Grid>
                        </Grid>
                      );
                    })}
                  </Grid>
                </TabPanel>
              </Grid>
            </Grid>
          }
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