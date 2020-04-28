import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  updateWorld, selectWorld
} from "../../redux/actions/index";
import { Button, Checkbox, FormControl, FormControlLabel,
  OutlinedInput, InputLabel, FormHelperText, Grid, 
  ListItem, ListItemText, 
  Tooltip, Fab, AppBar, Tabs, Tab, Box, 
  InputAdornment, IconButton,
  Select, MenuItem
} from "@material-ui/core";
import { Add, ArrowBack, FileCopyOutlined, Delete } from "@material-ui/icons";
import { Helmet } from 'react-helmet';
import API from "../../smartAPI";

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
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    worlds: state.app.worlds,
    user: state.app.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateWorld: world => dispatch(updateWorld(world)),
    selectWorld: worldID => dispatch(selectWorld(worldID)),
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Collaborators: [],
      allUsers: null,
      fieldValidation: {
        inviteEmail: { valid: true, message: "" }
      },
      message: "",
      redirectTo: null,
      newCollaborators: false,
      newCollabTab: 0,
      collabTab: 0,
      collabLink: null,
      collabLinkCopied: false,
      selectedUser: "",
      inviteEmail: "",
      inviteMessage: "", 
      waiting: false
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      if (id !== undefined) {
        const { id } = this.props.match.params;
        let world = this.props.worlds.filter(w => w._id === id);
        if (world.length > 0) {
          world = world[0];
          this.setState({
            Name: world.Name,
            Public: world.Public,
            AcceptingCollaborators: world.AcceptingCollaborators === undefined || world.AcceptingCollaborators === null ? false : world.AcceptingCollaborators,
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
    let value = this.state[fieldName];
    let valid = true;
    let message = "";
    switch (fieldName) {
      case "inviteEmail":
        valid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) !== null;
        message = valid ? "" : "Email is invalid";
        break;
      default:
        break;
    }
    const response = { valid: valid, message: message };
    return response;
  };

  addNewCollaborator = () => {
    function respond() {
      this.api.addNewCollaborator(this.props.selectedWorldID, this.state.selectedUser._id, this.state.selectedUser.email).then(res => {
        if (res.error === undefined) {
          const collabs = [...this.state.Collaborators];
          collabs.push(res);
          const world = this.props.selectedWorld;
          world.Collaborators = collabs;
          this.props.updateWorld(world);
          this.setState({
            Collaborators: collabs, 
            inviteMessage: "Invite Sent",
            selectedUser: "",
            waiting: false
          });
        }
        else {
          this.setState({message: res.error, waiting: false});
        }
      });
    }
    this.setState({waiting: true}, respond);
  }

  emailCollaborator = () => {
    const emailValid = this.validateField("inviteEmail");
    if (emailValid) {
      function respond() {
        this.api.emailCollaborator(this.props.selectedWorldID, this.state.inviteEmail).then(res => {
          if (res.error === undefined) {
            const collabs = [...this.state.Collaborators];
            collabs.push(res);
            const world = this.props.selectedWorld;
            world.Collaborators = collabs;
            this.props.updateWorld(world);
            this.setState({
              Collaborators: collabs, 
              inviteMessage: "Email Sent", 
              inviteEmail: "",
              waiting: false
            });
          }
          else {
            this.setState({message: res.error, waiting: false});
          }
        });
      }
      this.setState({waiting: true}, respond);
    }
  }

  updateCollaboratorPermission = (collaborator, permission) => {
    collaborator.editPermission = permission;
    function respond() {
      this.api.updateCollaboratorPermission(this.props.selectedWorldID, collaborator.collabID, permission).then(res => {
        if (res.error === undefined) {
          const collabs = [...this.state.Collaborators];
          const collab = collabs.filter(c=>c.collabID === collaborator.collabID)[0];
          collab.editPermission = permission;
          const world = this.props.selectedWorld;
          world.Collaborators = collabs;
          this.props.updateWorld(world);
          this.setState({
            Collaborators: collabs, waiting: false
          });
        }
        else {
          this.setState({message: res.error, waiting: false});
        }
      });
    }
    this.setState({waiting: true}, respond);
  }

  // Creates a collab invite on the world, but no user or email associated
  generateCollabLink = () => {
    function respond() {
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
            Collaborators: collabs, 
            waiting: false
          });
        }
        else {
          this.setState({message: res.error, waiting: false});
        }
      });
    }
    this.setState({waiting: true}, respond);
  }

  deleteCollab = (collab) => {
    function respond() {
      this.api.deleteCollab(this.props.selectedWorldID, collab.collabID).then(res => {
        if (res.error === undefined) {
          const collabs = this.state.Collaborators.filter(c=>c.collabID !== collab.collabID);
          const world = this.props.selectedWorld;
          world.Collaborators = collabs;
          this.props.updateWorld(world);
          this.setState({
            collabLink: res.collabLink, 
            collabLinkCopied: false,
            Collaborators: collabs, 
            waiting: false
          });
        }
        else {
          this.setState({message: res.error, waiting: false});
        }
      });
    }
    this.setState({waiting: true}, respond);
  }

  // Copies the collaborator link to the user's clipboard
  copyCollabLink = () => {
    const el = this.generatedLink;
    const textarea = el.children[0];
    textarea.select();
    document.execCommand("copy");
    this.setState({collabLinkCopied: true});
  }

  render() {
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
      const selectUsers = this.state.allUsers.filter(u=>u._id !== this.props.selectedWorld.Owner && this.state.Collaborators.filter(c=>c.userID === u._id).length === 0);
      const userMenuItems = selectUsers.map((u, i) => {
        return (
          <MenuItem key={i} value={u}>
            {u.username}
          </MenuItem>
        );
      });
      return (
        <Grid item xs={12} container spacing={1} direction="column">
          <Helmet>
            <title>{ this.state._id === null ? `Author's Notebook: Create New World` : `Author's Notebook: Edit ${this.props.selectedWorld.Name} Collaborators` }</title>
          </Helmet>
          <Grid item container spacing={1} direction="row">
            <Grid item xs={1}>
              <Tooltip title={`Back to ${this.props.selectedWorld.Name} Details`}>
                <Fab size="small"
                  color="primary"
                  onClick={ _ => {this.setState({redirectTo:`/world/details/${this.props.selectedWorldID}`})}}
                >
                  <ArrowBack />
                </Fab>
              </Tooltip>
            </Grid>
            <Grid item xs={11}>
              <h2>Edit Collaborators</h2>
            </Grid>
          </Grid>
          <Grid item>
            <ListItem style={{maxWidth: "200px"}}>
              <ListItemText primary="Collaborators" />
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
                  <Tabs value={this.state.newCollabTab} onChange={(_, newValue) => { this.setState({newCollabTab: newValue, inviteMessage: ""})}} aria-label="Add Collaborator Method">
                    <Tab label="Find Existing User" {...this.a11yProps(0)} />
                    <Tab label="Invite via Email" {...this.a11yProps(1)} />
                    <Tab label="Get an Invite Link" {...this.a11yProps(2)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={this.state.newCollabTab} index={0}>
                  <Grid container spacing={1} direction="column">
                    <Grid item>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="user-select" id="user-select-label">
                          Select a User
                        </InputLabel>
                        <Select
                          labelId="user-select-label"
                          id="user-select"
                          value={this.state.selectedUser}
                          onChange={e => {
                            this.setState({selectedUser: e.target.value, inviteMessage: "" })
                          }}
                          labelWidth={90}
                        >
                          {userMenuItems}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={this.state.selectedUser === "" || this.state.waiting}
                        onClick={this.addNewCollaborator}
                      >
                        Send Invite
                      </Button> 
                      { this.state.inviteMessage }
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={this.state.newCollabTab} index={1}>
                  <Grid container spacing={1} direction="column">
                    <Grid item>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="inviteEmail">Collaborator Email</InputLabel>
                        <OutlinedInput
                          id="inviteEmail"
                          name="inviteEmail"
                          type="email"
                          autoComplete="Off"
                          error={!this.state.fieldValidation.inviteEmail.valid}
                          value={this.state.inviteEmail}
                          onChange={this.handleUserInput}
                          onBlur={this.inputBlur}
                          labelWidth={140}
                          fullWidth
                        />
                        <FormHelperText>
                          {this.state.fieldValidation.inviteEmail.message}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={this.state.waiting}
                        onClick={this.emailCollaborator}
                      >
                        Send Invite
                      </Button> 
                      { this.state.inviteMessage }
                    </Grid>
                  </Grid>
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
                        disabled={this.state.waiting}
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
                          <Grid item xs={12} sm={3}>
                            {this.state.allUsers.filter(u=>u._id === c.userID)[0].username}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControlLabel
                              control={
                                <Checkbox 
                                  checked={c.editPermission} 
                                  disabled={this.state.waiting}
                                  onChange={e => {
                                    this.updateCollaboratorPermission(c, e.target.checked);
                                  }}
                                  color="primary" />
                              }
                              label="Full Permissions"
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Tooltip title={`Remove Collaborator`}>
                              <Fab size="small"
                                color="primary"
                                disabled={this.state.waiting}
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
                                disabled={this.state.waiting}
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
                                disabled={this.state.waiting}
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

const EditCollaboratorPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default EditCollaboratorPage;