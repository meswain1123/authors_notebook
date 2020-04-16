import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  updateSelectedType,
  addType,
  updateType,
  setTypes,
  setAttributes
} from "../../redux/actions/index";
import { Edit, Delete, Add, ArrowBack } from "@material-ui/icons";
import { Fab, Modal, Grid, Button, Tooltip, List, ListItem, ListItemText } from "@material-ui/core";
import { Helmet } from 'react-helmet';
import API from "../../api";

/* 
  This component will take the main portion of the page and is used for
  creating or editing a Type.  It will allow the use of Template Types
  and Super Types to make the process faster.
*/

const mapStateToProps = state => {
  const type = state.app.selectedType;
  const subTypes =
    type === null
      ? []
      : state.app.types.filter(t => t.SuperIDs.includes(type._id));
  const things =
    type === null
      ? []
      : state.app.things.filter(t => t.TypeIDs.includes(type._id));
  return {
    selectedPage: state.app.selectedPage,
    selectedType: type,
    selectedWorld: state.app.selectedWorld,
    selectedWorldID: state.app.selectedWorldID,
    types: state.app.types,
    subTypes: subTypes,
    instances: things,
    user: state.app.user,
    things: state.app.things,
    attributesByID: state.app.attributesByID,
    attributesByName: state.app.attributesByName,
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedType: type => dispatch(updateSelectedType(type)),
    addType: type => dispatch(addType(type)),
    updateType: type => dispatch(updateType(type)),
    setTypes: types => dispatch(setTypes(types)),
    setAttributes: attributes => dispatch(setAttributes(attributes))
  };
}
class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: null,
      Name: "",
      Description: "",
      Supers: [],
      Major: false,
      Attributes: [],
      fieldValidation: {
        Name: { valid: true, message: "" },
        AttributesArr: { valid: true, message: "" }
      },
      formValid: false,
      message: "",
      redirectTo: null,
      modalOpen: false
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
    // load();
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

  delete = e => {
    this.api.deleteType(this.props.selectedWorldID, this.state._id).then(res=>{
      const types = this.props.types.filter(t=>t._id!==this.state._id);
      this.props.setTypes(types);
      this.setState({redirectTo: `/world/details/${this.props.selectedWorldID}`})
    });
  }

  load = (id) => {
    // const { id } = this.props.match.params;
    setTimeout(() => {
      this.setState({
        _id: id,
        redirectTo: null
      }, this.finishLoading);
    }, 500);
  }

  finishLoading = () => {
    const id = this.state._id;
    if (id !== undefined) { // When I move to storing more in session, this is the kind of place where I'll check.
      this.api.getType(this.props.selectedWorldID, id).then(res => {
        if (res.error === undefined) {
          res.Supers = [];
          res.SuperIDs.forEach(sID=> {
            res.Supers = res.Supers.concat(this.props.types.filter(t2=>t2._id === sID));
          });
          res.AttributesArr = [];
          res.Attributes.forEach(a => {
            const attr = this.props.attributesByID[a.attrID];
            res.AttributesArr.push({
              index: res.AttributesArr.length,
              Name: attr.Name,
              AttributeType: attr.AttributeType,
              Options: attr.Options,
              DefinedType: attr.DefinedType,
              ListType: attr.ListType,
              attrID: a.attrID
            });
          });
          const defHash = {};
          if (res.Defaults !== undefined) {
            res.Defaults.forEach(def => {
              defHash[def.attrID] = def;
            });
          }
          res.DefaultsHash = defHash;
          this.setState({
            Name: res.Name,
            Description: res.Description,
            _id: id,
            Supers: res.Supers,
            Major: res.Major
          });
          this.props.updateSelectedType(res);
        }
        else {
          console.log(res.error);
        }
      });
    } else {
      this.props.updateSelectedType({
        _id: null,
        Name: "",
        Description: "",
        Supers: [],
        AttributesArr: [],
        Attributes: [],
        Major: false
      });
    }
  }

  render() {
    const { id } = this.props.match.params;
    if (this.state._id !== id) {
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
    } else if (this.props.selectedType === undefined || this.props.selectedType === null) {
      return (<span>Loading</span>);
    } else {
      const references = this.props.types.filter(t=>t.ReferenceIDs !== undefined && t.ReferenceIDs.includes(this.state._id));
      const inheritedAttributes = [];
      this.props.selectedType.Supers.forEach(superType => {
        superType.AttributesArr.forEach(attribute => {
          if (inheritedAttributes.filter(a=>a.attrID === attribute.attrID).length === 0) {
            inheritedAttributes.push(attribute);
          }
        });
      });
      return (
        <Grid item xs={12} container spacing={0} direction="column">
          { this.props.selectedWorld === null ? "" :
            <div>
              <Helmet>
                <title>{ `Author's Notebook: ${this.props.selectedWorld.Name}` }</title>
              </Helmet>
              <Grid item container spacing={0} direction="row">
                <Grid item xs={1}>
                  <Tooltip title={`Back to ${this.props.selectedWorld.Name}`}>
                    <Fab size="small"
                      color="primary"
                      onClick={ _ => {this.setState({redirectTo:`/world/details/${this.props.selectedWorldID}`})}}
                    >
                      <ArrowBack />
                    </Fab>
                  </Tooltip>
                </Grid>
                <Grid item xs={5}>
                  <h2>{this.state.Name}</h2>
                </Grid>
                <Grid item sm={3} xs={6}>
                  <h3>{this.state.Major ? "Major Type" : ""}</h3>
                </Grid>
                <Grid item sm={3} xs={12}>
                  <List>
                    { (this.props.user !== null && 
                      this.props.selectedWorld !== null && 
                      (this.props.selectedWorld.Owner === this.props.user._id || 
                        this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length > 0)) &&
                      <ListItem>
                        <Tooltip title={`Create New ${this.state.Name}`}>
                          <Fab size="small"
                            color="primary"
                            onClick={ _ => {this.setState({redirectTo:`/thing/create/type_id_${this.state._id}`})}}
                          >
                            <Add />
                          </Fab>
                        </Tooltip>
                      </ListItem>
                    }
                    { (this.props.user !== null && 
                      this.props.selectedWorld !== null && 
                      (this.props.selectedWorld.Owner === this.props.user._id || 
                        this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length > 0)) &&
                      <ListItem>
                        <Tooltip title={`Edit ${this.state.Name}`}>
                          <Fab size="small"
                            color="primary"
                            onClick={ _ => {this.setState({redirectTo:`/type/edit/${this.state._id}`})}}
                          >
                            <Edit />
                          </Fab>
                        </Tooltip>
                      </ListItem>
                    }
                    { (this.props.user !== null && 
                      this.props.selectedWorld !== null && 
                      (this.props.selectedWorld.Owner === this.props.user._id || 
                        this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length > 0)) &&
                      <ListItem>
                        <Tooltip title={`Delete ${this.state.Name}`}>
                          <Fab size="small"
                            color="primary"
                            onClick={e => {this.setState({modalOpen: true})}}
                          >
                            <Delete />
                          </Fab>
                        </Tooltip>
                      </ListItem>
                    }
                  </List>
                </Grid>
              </Grid>
              <Grid item container spacing={0} direction="row">
                <Grid item sm={9} xs={12} container spacing={0} direction="column">
                  <Grid item>{this.state.Description}</Grid>
                  <Grid item>
                    Attributes
                    <List>
                      { this.props.selectedType !== null && this.props.selectedType !== undefined &&
                        inheritedAttributes.map((attribute, i) => {
                          let definedType = this.props.types.filter(t=>t._id === attribute.DefinedType);
                          definedType = definedType.length === 0 ? {Name:""} : definedType[0];
                          const def = this.props.selectedType.DefaultsHash[attribute.attrID];
                          return (
                            <ListItem key={i}>
                              <ListItemText>
                                {attribute.Name}:&nbsp;
                                {attribute.AttributeType === "Options" ? (
                                  <span>
                                    Options:
                                    {attribute.Options.map((option, j) => {
                                      return (
                                        <span key={j}>
                                          {j === 0 ? " " : ", "}
                                          {option}
                                        </span>
                                      );
                                    })}
                                    { def !== undefined && def.DefaultValue !== undefined && def.DefaultValue !== "" &&
                                      ` (Default: ${def.DefaultValue})`
                                    }
                                  </span>
                                ) : attribute.AttributeType === "Type" ? (
                                  <span>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={ _ => {this.setState({redirectTo:`/type/details/${attribute.DefinedType}`})}}
                                    >
                                      <ListItemText primary={definedType.Name}/>
                                    </Button>
                                    { def !== undefined && def.DefaultValue !== undefined && def.DefaultValue !== "" &&
                                      ` (Default: ${this.props.things.filter(t=>t._id === def.DefaultValue)[0].Name})`
                                    }
                                  </span>
                                ) : attribute.AttributeType === "List" ? (
                                  <span>
                                    List:&nbsp;
                                    {attribute.ListType === "Options" ? (
                                      <span>
                                        Options:
                                        {attribute.Options.map((option, j) => {
                                          return (
                                            <span key={j}>
                                              {j === 0 ? " " : ", "}
                                              {option}
                                            </span>
                                          );
                                        })}
                                        { def !== undefined && def.DefaultListValues !== undefined && def.DefaultListValues.length > 0 &&
                                          <span>
                                            &nbsp;(Defaults:
                                            {def.DefaultListValues.map((defaultValue, j) => {
                                              return (
                                                <span key={j}>
                                                  {j === 0 ? " " : ", "}
                                                  {defaultValue}
                                                </span>
                                              );
                                            })}
                                            )
                                          </span>
                                        }
                                      </span>
                                    ) : attribute.ListType === "Type" ? (
                                      <span>
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={ _ => {this.setState({redirectTo:`/type/details/${attribute.DefinedType}`})}}
                                        >
                                          <ListItemText primary={definedType.Name}/>
                                        </Button>
                                        { def !== undefined && def.DefaultListValues !== undefined && def.DefaultListValues.length > 0 &&
                                          <span>
                                            &nbsp;(Defaults:
                                            {attribute.DefaultListValues.map((defaultValue, j) => {
                                              return (
                                                <span key={j}>
                                                  {j === 0 ? " " : ", "}
                                                  <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={ _ => {this.setState({redirectTo:`/thing/details/${defaultValue}`})}}
                                                  >
                                                    <ListItemText primary={this.props.things.filter(t=>t._id === defaultValue)[0].Name}/>
                                                  </Button>
                                                </span>
                                              );
                                            })}
                                            )
                                          </span>
                                        }
                                      </span>
                                    ) : (
                                      <span>
                                        {attribute.ListType}
                                        { def !== undefined && def.DefaultListValues !== undefined && def.DefaultListValues.length > 0 &&
                                          <span>
                                            &nbsp;(Defaults:
                                            {def.DefaultListValues.map((defaultValue, j) => {
                                              return (
                                                <span key={j}>
                                                  {j === 0 ? " " : ", "}
                                                  {defaultValue}
                                                </span>
                                              );
                                            })}
                                            )
                                          </span>
                                        }
                                      </span>
                                    )}
                                  </span>
                                ) : attribute.AttributeType === "True/False" ? (
                                  <span>
                                    {attribute.AttributeType}
                                    { def !== undefined && def.DefaultValue !== undefined && def.DefaultValue !== "" ?
                                      ` (Default: ${def.DefaultValue})`
                                    : " (Default: False)"}
                                  </span>
                                ) : (
                                  <span>
                                    {attribute.AttributeType}
                                    { def !== undefined && def.DefaultValue !== undefined && def.DefaultValue !== "" &&
                                      ` (Default: ${def.DefaultValue})`
                                    }
                                  </span>
                                )}
                              </ListItemText>
                            </ListItem>
                          );
                        })
                      }
                      { this.props.selectedType !== null &&
                        this.props.selectedType !== undefined && 
                          this.props.selectedType.AttributesArr.map((attribute, i) => {
                            let definedType = this.props.types.filter(t=>t._id === attribute.DefinedType);
                            definedType = definedType.length === 0 ? {Name:""} : definedType[0];
                            const def = this.props.selectedType.DefaultsHash[attribute.attrID];
                            return (
                              <ListItem key={i}>
                                <ListItemText>
                                  {attribute.Name}:&nbsp;
                                  {attribute.AttributeType === "Options" ? (
                                    <span>
                                      Options:
                                      {attribute.Options.map((option, j) => {
                                        return (
                                          <span key={j}>
                                            {j === 0 ? " " : ", "}
                                            {option}
                                          </span>
                                        );
                                      })}
                                      { def !== undefined && def.DefaultValue !== undefined && def.DefaultValue !== "" &&
                                        ` (Default: ${def.DefaultValue})`
                                      }
                                    </span>
                                  ) : attribute.AttributeType === "Type" ? (
                                    <span>
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={ _ => {this.setState({redirectTo:`/type/details/${attribute.DefinedType}`})}}
                                      >
                                        <ListItemText primary={definedType.Name}/>
                                      </Button>
                                      { def !== undefined && def.DefaultValue !== undefined && def.DefaultValue !== "" &&
                                        ` (Default: ${this.props.things.filter(t=>t._id === def.DefaultValue)[0].Name})`
                                      }
                                    </span>
                                  ) : attribute.AttributeType === "List" ? (
                                    <span>
                                      List:&nbsp;
                                      {attribute.ListType === "Options" ? (
                                        <span>
                                          Options:
                                          {attribute.Options.map((option, j) => {
                                            return (
                                              <span key={j}>
                                                {j === 0 ? " " : ", "}
                                                {option}
                                              </span>
                                            );
                                          })}
                                          { def !== undefined && def.DefaultListValues !== undefined && def.DefaultListValues.length > 0 &&
                                            <span>
                                              &nbsp;(Defaults:
                                              {def.DefaultListValues.map((defaultValue, j) => {
                                                return (
                                                  <span key={j}>
                                                    {j === 0 ? " " : ", "}
                                                    {defaultValue}
                                                  </span>
                                                );
                                              })}
                                              )
                                            </span>
                                          }
                                        </span>
                                      ) : attribute.ListType === "Type" ? (
                                        <span>
                                          <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={ _ => {this.setState({redirectTo:`/type/details/${attribute.DefinedType}`})}}
                                          >
                                            <ListItemText primary={definedType.Name}/>
                                          </Button>
                                          { def !== undefined && def.DefaultListValues !== undefined && def.DefaultListValues.length > 0 &&
                                            <span>
                                              &nbsp;(Defaults:
                                              {attribute.DefaultListValues.map((defaultValue, j) => {
                                                return (
                                                  <span key={j}>
                                                    {j === 0 ? " " : ", "}
                                                    <Button
                                                      variant="contained"
                                                      color="primary"
                                                      onClick={ _ => {this.setState({redirectTo:`/thing/details/${defaultValue}`})}}
                                                    >
                                                      <ListItemText primary={this.props.things.filter(t=>t._id === defaultValue)[0].Name}/>
                                                    </Button>
                                                  </span>
                                                );
                                              })}
                                              )
                                            </span>
                                          }
                                        </span>
                                      ) : (
                                        <span>
                                          {attribute.ListType}
                                          { def !== undefined && def.DefaultListValues !== undefined && def.DefaultListValues.length > 0 &&
                                            <span>
                                              &nbsp;(Defaults:
                                              {def.DefaultListValues.map((defaultValue, j) => {
                                                return (
                                                  <span key={j}>
                                                    {j === 0 ? " " : ", "}
                                                    {defaultValue}
                                                  </span>
                                                );
                                              })}
                                              )
                                            </span>
                                          }
                                        </span>
                                      )}
                                    </span>
                                  ) : attribute.AttributeType === "True/False" ? (
                                    <span>
                                      {attribute.AttributeType}
                                      { def !== undefined && def.DefaultValue !== undefined && def.DefaultValue !== "" ?
                                        ` (Default: ${def.DefaultValue})`
                                      : " (Default: False)"}
                                    </span>
                                  ) : (
                                    <span>
                                      {attribute.AttributeType}
                                      { def !== undefined && def.DefaultValue !== undefined && def.DefaultValue !== "" &&
                                        ` (Default: ${def.DefaultValue})`
                                      }
                                    </span>
                                  )}
                                </ListItemText>
                              </ListItem>
                            );
                          })
                      }
                    </List>
                  </Grid>
                </Grid>
                <Grid item sm={3} xs={12} container spacing={0} direction="column">
                  {this.state.Supers.length === 0 && (
                    <Grid item>
                      <List>
                        <ListItem>
                          <ListItemText primary={"Super Types"} />
                        </ListItem>
                        {this.state.Supers.map((superType, i) => {
                          return (
                            <ListItem key={i}>
                              <Button fullWidth
                                variant="contained"
                                color="primary"
                                onClick={ _ => {this.setState({redirectTo:`/type/details/${superType._id}`})}}
                              >
                                <ListItemText primary={superType.Name} />
                              </Button>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  )}
                  {this.props.subTypes.length === 0 && (
                    <Grid item>
                      <List>
                        <ListItem>
                          <ListItemText primary={"Sub Types"} />
                        </ListItem>
                        {this.props.subTypes.map((sub, i) => {
                          return (
                            <ListItem key={i}>
                              <Button fullWidth
                                variant="contained"
                                color="primary"
                                onClick={ _ => {this.setState({redirectTo:`/type/details/${sub._id}`})}}
                              >
                                <ListItemText primary={sub.Name} />
                              </Button>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  )}
                  {references.length !== 0 && (
                    <Grid item>
                      <List>
                        <ListItem>
                          <ListItemText primary={"Referenced in:"} />
                        </ListItem>
                        {references.map((type, i) => {
                          return (
                            <ListItem key={i}>
                              <Button fullWidth
                                variant="contained"
                                color="primary"
                                onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}
                              >
                                <ListItemText primary={type.Name} />
                              </Button>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  )}
                  {this.props.instances.length === 0 && (
                    <Grid item>
                      <List>
                        <ListItem>
                          <ListItemText primary={"Instances"} />
                        </ListItem>
                        {this.props.instances.map((thing, i) => {
                          return (
                            <ListItem key={i}>
                              <Button fullWidth
                                variant="contained"
                                color="primary"
                                onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}
                              >
                                <ListItemText primary={thing.Name} />
                              </Button>
                            </ListItem>
                          );
                        })}
                      </List>
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Modal
                aria-labelledby="delete-type-modal"
                aria-describedby="delete-type-modal-description"
                open={this.state.modalOpen}
                onClose={e => {this.setState({modalOpen: false})}}
              >
                <div style={this.getModalStyle()} className="paper">
                  <Grid container spacing={1} direction="column">
                    <Grid item>
                      Are you sure you want to delete {this.state.Name}?
                    </Grid>
                    <Grid item>
                      (All references to it will be left alone and may not work correctly)
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
            </div>
          }
        </Grid>
      );
    }
  }
}

const TypeDetails = connect(mapStateToProps, mapDispatchToProps)(Page);
export default TypeDetails;
