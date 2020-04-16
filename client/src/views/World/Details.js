import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { 
  selectWorld, setTypes, setThings, setWorlds, 
  setPublicWorlds, updatePublicWorldForCollab,
  setAttributes
} from "../../redux/actions/index";
import API from "../../api";
import Index from "./Index";
import Edit from "@material-ui/icons/Edit";
import Delete from "@material-ui/icons/Delete";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab } from "@material-ui/core";
import { People } from "@material-ui/icons";
import { Helmet } from 'react-helmet';

const mapStateToProps = state => {
  return {
    selectedPage: state.app.selectedPage,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    worlds: state.app.worlds,
    publicWorlds: state.app.publicWorlds,
    types: state.app.types,
    things: state.app.things,
    user: state.app.user,
    attributesByID: state.app.attributesByID
  };
};
function mapDispatchToProps(dispatch) {
  return {
    selectWorld: worldID => dispatch(selectWorld(worldID)),
    setTypes: types => dispatch(setTypes(types)),
    setThings: things => dispatch(setThings(things)),
    setWorlds: worlds => dispatch(setWorlds(worlds)),
    setPublicWorlds: worlds => dispatch(setPublicWorlds(worlds)),
    updatePublicWorldForCollab: world => dispatch(updatePublicWorldForCollab(world)),
    setAttributes: attributes => dispatch(setAttributes(attributes))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      world: null,
      modalOpen: false,
      redirectTo: null
    };
    this.api = API.getInstance();
  }
  componentDidMount() {
  }

  getAttributes() {
    this.api.getAttributesForWorld(this.props.selectedWorldID).then(res => {
      if (res !== undefined && res.error === undefined) {
        // We store the attributes in two hashes, by name and by id
        this.props.setAttributes(res.attributes);
        this.getTypes();
      }
    });
  }

  getTypes() {
    this.api.getTypesForWorld(this.props.selectedWorldID).then(res => {
      if (res !== undefined && res.error === undefined) {
        // Add Supers to each type
        const types = res.types;
        types.forEach(t=> {
          t.Supers = [];
          t.SuperIDs.forEach(sID=> {
            t.Supers = t.Supers.concat(types.filter(t2=>t2._id === sID));
          });
          t.AttributesArr = [];
          t.Attributes.forEach(a => {
            const attr = this.props.attributesByID[a.attrID];
            t.AttributesArr.push({
              index: t.AttributesArr.length,
              Name: attr.Name,
              AttributeType: attr.AttributeType,
              Options: attr.Options,
              DefinedType: attr.DefinedType,
              ListType: attr.ListType,
              attrID: a.attrID
            });
          });
          const defHash = {};
          if (t.Defaults !== undefined) {
            console.log(t.Defaults);
            t.Defaults.forEach(def => {
              defHash[def.attrID] = def;
            });
          }
          t.DefaultsHash = defHash;
        });
        this.props.setTypes(types);
        this.getThings();
      }
    });
  }

  getThings() {
    this.api.getThingsForWorld(this.props.selectedWorldID).then(res => {
      if (res !== undefined && res.error === undefined) {
        const things = res.things;
        things.forEach(t=> {
          t.Types = [];
          t.TypeIDs.forEach(tID=> {
            t.Types = t.Types.concat(this.props.types.filter(t2=>t2._id === tID));
          });
        });
        this.props.setThings(things);
      }
    });
  }

  delete = e => {
    this.api.deleteWorld(this.props.selectedWorldID).then(res=>{
      let worlds = this.props.worlds.filter(t=>t._id!==this.props.selectedWorldID);
      this.props.setWorlds(worlds);
      worlds = this.props.publicWorlds.filter(t=>t._id!==this.props.selectedWorldID);
      this.props.setPublicWorlds(worlds);
      this.api.selectWorld(null);
      this.props.selectWorld(null);
      this.setState({modalOpen: false, redirectTo: `/`});
    });
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

  load = (id) => {
    setTimeout(() => {
      this.props.selectWorld(id);
      this.api.selectWorld(id).then(res => {
        this.getAttributes();
      });
    }, 500);
  }

  requestToCollaborate = () => {
    this.api.requestToCollaborate(this.props.selectedWorldID).then(res => {
      const world = this.props.selectedWorld;
      world.Collaborators.push(res);
      this.props.updatePublicWorldForCollab(world);
    });
  }

  respondToInvite = () => {
    const invite = this.props.selectedWorld.Collaborators.filter(c=> c.userID === this.props.user._id && c.type === "invite")[0];
    this.setState({ redirectTo: `/world/collaborate/${this.props.selectedWorldID}/${invite.collabID}` });
  }

  render() {
    const { id } = this.props.match.params;
    if (this.props.selectedWorldID === null || this.props.selectedWorldID !== id) {
      this.load(id);
    }
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    } else if (this.props.selectedWorld !== null && 
      !this.props.selectedWorld.Public && 
      (this.props.user === null || 
        (this.props.selectedWorld.Owner !== this.props.user._id && 
          this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab").length === 0))) {
      return <Redirect to="/" />;
    } else {
      return (
        <Grid item xs={12} container spacing={0} direction="column">
          {this.props.selectedWorld === null ? (
            ""
          ) : (
            <Grid item container spacing={0} direction="row">
              <Helmet>
                <title>{ `Author's Notebook: ${this.props.selectedWorld.Name}` }</title>
              </Helmet>
              <Grid item xs={9}>
                <h2>{this.props.selectedWorld.Name}</h2>
              </Grid>
              <Grid item xs={3}>
                { this.props.user !== null && this.props.user !== null && this.props.selectedWorld.Owner === this.props.user._id ?
                  <List>
                    <ListItem>
                      <Tooltip title={`Edit ${this.props.selectedWorld.Name}`}>
                        <Fab size="small" color="primary"
                          onClick={ _ => {this.setState({redirectTo:`/world/edit/${this.props.selectedWorldID}`})}}
                        >
                        <Edit />
                        </Fab>
                      </Tooltip>
                    </ListItem>
                    <ListItem>
                      <Tooltip title={`Edit Collaborators`}>
                        <Fab size="small" color="primary"
                          onClick={ _ => {this.setState({redirectTo:`/world/collaborators/${this.props.selectedWorldID}`})}}
                        >
                        <People />
                        </Fab>
                      </Tooltip>
                    </ListItem>
                    <ListItem>
                      <Tooltip title={`Delete ${this.props.selectedWorld.Name}`}>
                        <Fab size="small" color="primary"
                          onClick={e => {this.setState({modalOpen: true})}}
                        >
                          <Delete />
                        </Fab>
                      </Tooltip>
                    </ListItem>
                  </List>
                : 
                  <List>
                    { this.props.selectedWorld.Collaborators.filter(c=> c.userID === this.props.user._id).length === 0 ?
                      <ListItem>
                        { this.props.selectedWorld.AcceptingCollaborators && 
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={this.requestToCollaborate}
                            type="button"
                          >
                            Request to Collaborate
                          </Button>
                        }
                      </ListItem>
                    : this.props.selectedWorld.Collaborators.filter(c=> c.userID === this.props.user._id && c.type === "request").length > 0 ?
                      <ListItem>
                        Waiting on Collaboration Request
                      </ListItem>
                    : this.props.selectedWorld.Collaborators.filter(c=> c.userID === this.props.user._id && c.type === "invite").length > 0 &&
                      <ListItem>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.respondToInvite}
                          type="button"
                        >
                          You've been invited to Collaborate
                        </Button>
                      </ListItem>
                    }
                  </List>
                }
              </Grid>
            </Grid>
          )}
          <Grid item>
            <Index />
          </Grid>
          {/* <Grid item container spacing={0} direction="row">
            <Grid item xs={6}>
              <TypeIndex />
            </Grid>
            <Grid item xs={6}>
              <ThingIndex />
            </Grid>
          </Grid> */}
          <Modal
              aria-labelledby="delete-thing-modal"
              aria-describedby="delete-thing-modal-description"
              open={this.state.modalOpen}
              onClose={e => {this.setState({modalOpen: false})}}
            >
              <div style={this.getModalStyle()} className="paper">
                <Grid container spacing={1} direction="column">
                  <Grid item>
                    Are you sure you want to delete {this.props.selectedWorld !== null ? this.props.selectedWorld.Name : ""}?
                  </Grid>
                  <Grid item>
                    (All external references to it will be left alone and may not work correctly)
                  </Grid>
                  <Grid item container spacing={1} direction="row">
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={this.delete}
                      >
                        Yes
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
}
const WorldDetailsPage = connect(mapStateToProps, mapDispatchToProps)(Page);
export default WorldDetailsPage;
