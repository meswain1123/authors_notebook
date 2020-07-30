import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Add, Edit
} from "@material-ui/icons";
import {
  Grid, List, ListItem, Button, Tooltip, Fab
} from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
// import Tooltip from '@material-ui/core/Tooltip';
// import { Fab } from "@material-ui/core";
import {
  updateIndexExpandedPanel
} from "../../redux/actions/index";
import UnderConstruction from "../../assets/img/under_construction.png";
import UnderConstructionWhite from "../../assets/img/under_construction_white.png";

/* 
  This component will be used by the WorldDetails component.  It will
  have a link at the top for creating new Things, and will list all
  Things in the selected World, allowing navigation to their Details.  
  The List will have pagination and filtering controls to make it 
  easier to manage.
*/
const mapStateToProps = state => {
  return { 
    things: state.app.things,
    types: state.app.types,
    selectedWorld: state.app.selectedWorld,
    user: state.app.user,
    indexExpandedPanel: state.app.indexExpandedPanel
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateIndexExpandedPanel: panel => dispatch(updateIndexExpandedPanel(panel))
  };
}
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null
    };
  }

  componentDidMount() {
  }

  handleChange = panel => {
    this.props.updateIndexExpandedPanel(this.props.indexExpandedPanel === panel ? false : panel);
  }

  renderListForType(type) {
    // TODO: Add a PluralName field to types so I can use it here.  It may end up being useful other places too.
    const things = this.props.things.filter(thing => thing.TypeIDs.includes(type._id));
    return (
      <div className="Things">
        <List style={{ width: "240px" }}>
          <ListItem>
            <Button 
              fullWidth variant="contained" color="primary" 
              onClick={ _ => {this.setState({redirectTo:`/thing/create/type_id_${type._id}`})}}>
              <Add/>{`Create New ${type.Name}`}
            </Button>
          </ListItem>
          {
            things.map((thing, i) => {
              return (
                <ListItem key={i}>
                  <Button 
                    fullWidth variant="contained" color="primary" 
                    onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}>
                    {thing.Name}
                  </Button>
                </ListItem>
              );
            })
          }
        </List>
      </div>
    );
  }

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    }
    else {
      const majorless = this.props.things.filter(thing => thing.Types.filter(t=>t.Major).length === 0);
      const createButtons = this.props.selectedWorld !== null && 
        this.props.user !== null && 
        (this.props.selectedWorld.Owner === this.props.user._id || 
          this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length > 0);

      return (
        <div>
          <Grid item container spacing={1} direction="column">
            <Grid item>
              {this.props.indexExpandedPanel === "TYPES" ? 
                <Tooltip title={`Collapse Types`}>
                  <Button 
                    onClick={_ => {this.handleChange("TYPES")}}>
                      <KeyboardArrowDownIcon/>
                  </Button>
                </Tooltip>
              :
                <Tooltip title={`Expand Types`}>
                    <Button 
                      onClick={_ => {this.handleChange("TYPES")}}>
                      <KeyboardArrowRightIcon/>
                    </Button>
                  </Tooltip>
              }
              <span className={"MuiTypography-root MuiListItemText-primary MuiTypography-body1"}>
                { this.props.types.filter(t => t.NeedsWork !== undefined && t.NeedsWork).length > 0 ?
                  <span>Types ({this.props.types.length}) ({this.props.types.filter(t => t.NeedsWork !== undefined && t.NeedsWork).length} <img style={{ height: "20px", marginBottom: "-4px" }} src={UnderConstruction} alt="Needs Work" />)</span>
                :
                  <span>Types ({this.props.types.length})</span>
                }
              </span>
              { createButtons &&
                <Tooltip title={`Create New Type`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ _ => {this.setState({redirectTo:`/type/create`})}}>
                    <Add/>
                  </Fab>
                </Tooltip> 
              }
            </Grid>
            { this.props.indexExpandedPanel === "TYPES" &&
              <Grid item>
                <List style={{ maxWidth: "380px" }}>
                  {
                    this.props.types.map((type, i) => {
                      return (
                        <ListItem key={i}>
                          <Grid container spacing={1} direction="row">
                            <Grid item xs={8}>
                              <Tooltip title={`Details for ${type.Name}`}>
                                <Button 
                                  fullWidth variant="contained" color="primary" 
                                  onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}>
                                  { type.NeedsWork &&
                                    <span><img style={{ height: "20px", marginBottom: "-4px" }} src={UnderConstructionWhite} alt="Needs Work" />&nbsp;</span>
                                  }
                                  {type.Name}
                                </Button>
                              </Tooltip>
                            </Grid>
                            { createButtons &&
                              <Grid item xs={2}>
                                <Tooltip title={`Create New ${type.Name}`}>
                                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                                    onClick={ _ => {this.setState({redirectTo:`/thing/create/type_id_${type._id}`})}}>
                                    <Add/>
                                  </Fab>
                                </Tooltip>
                              </Grid>
                            }
                            { createButtons &&
                              <Grid item xs={2}>
                                <Tooltip title={`Edit ${type.Name}`}>
                                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                                    onClick={ _ => {this.setState({redirectTo:`/type/edit/${type._id}`})}}>
                                    <Edit/>
                                  </Fab>
                                </Tooltip>
                              </Grid>
                            }
                          </Grid>
                        </ListItem>
                      );
                    })
                  }
                </List>
              </Grid>
            }
            { this.props.types.filter(t=>t.Major).map((type, i) => {
              const things = this.props.things.filter(thing => thing.TypeIDs.includes(type._id));
              return (
                <Grid key={i} item container spacing={1} direction="column">
                  <Grid item>
                    {this.props.indexExpandedPanel === type._id ? 
                      <Tooltip title={`Collapse ${type.PluralName === undefined || type.PluralName === "" ? `${type.Name}s` : type.PluralName}`}>
                        <Button 
                          onClick={_ => {this.handleChange(type._id)}}>
                          <KeyboardArrowDownIcon/>
                        </Button>
                      </Tooltip>
                      :
                      <Tooltip title={`Expand ${type.PluralName === undefined || type.PluralName === "" ? `${type.Name}s` : type.PluralName}`}>
                        <Button 
                          onClick={_ => {this.handleChange(type._id)}}>
                          <KeyboardArrowRightIcon/>
                        </Button>
                      </Tooltip>
                    }
                    <Tooltip title={`Details for ${type.Name}`}>
                      <Button variant="contained" color="primary" style={{ width: "220px" }}
                        onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}>
                        { things.filter(t => t.NeedsWork !== undefined && t.NeedsWork).length > 0 ?
                          <span>
                            { type.NeedsWork &&
                              <span><img style={{ height: "20px", marginBottom: "-4px" }} src={UnderConstructionWhite} alt="Needs Work" />&nbsp;</span>
                            }
                            {type.PluralName === undefined || type.PluralName === "" ? `${type.Name}s` : type.PluralName} 
                            ({things.length}) 
                            ({things.filter(t => t.NeedsWork !== undefined && t.NeedsWork).length} <img style={{ height: "20px", marginBottom: "-4px" }} src={UnderConstructionWhite} alt="Needs Work" />)
                          </span>
                        :
                          <span>
                            { type.NeedsWork &&
                              <span><img style={{ height: "20px", marginBottom: "-4px" }} src={UnderConstructionWhite} alt="Needs Work" />&nbsp;</span>
                            }
                            {type.PluralName === undefined || type.PluralName === "" ? `${type.Name}s` : type.PluralName} 
                            ({things.length})
                          </span>
                        }
                      </Button>
                    </Tooltip>
                    { createButtons &&
                      <span>
                        <Tooltip title={`Create New ${type.Name}`}>
                          <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                            onClick={ _ => {this.setState({redirectTo:`/thing/create/type_id_${type._id}`})}}>
                            <Add/>
                          </Fab>
                        </Tooltip>
                        <Tooltip title={`Edit ${type.Name}`}>
                          <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                            onClick={ _ => {this.setState({redirectTo:`/type/edit/${type._id}`})}}>
                            <Edit />
                          </Fab>
                        </Tooltip>
                      </span>
                    }
                  </Grid>
                  {this.props.indexExpandedPanel === type._id &&
                    <Grid item>
                      <List style={{ maxWidth: "380px" }}>
                        {
                          things.map((thing, j) => {
                            return (
                              <ListItem key={j}>
                                <Grid container spacing={1} direction="row">
                                  <Grid item xs={10}>
                                    <Tooltip title={`Details for ${thing.Name}`}>
                                      <Button 
                                        fullWidth variant="contained" color="primary" 
                                        onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}>
                                        { thing.NeedsWork &&
                                          <span><img style={{ height: "20px", marginBottom: "-4px" }} src={UnderConstructionWhite} alt="Needs Work" />&nbsp;</span>
                                        }
                                        {thing.Name}
                                      </Button>
                                    </Tooltip>
                                  </Grid>
                                  { createButtons &&
                                    <Grid item xs={2}>
                                      <Tooltip title={`Edit ${thing.Name}`}>
                                        <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                                          onClick={ _ => {this.setState({redirectTo:`/thing/edit/${thing._id}`})}}>
                                          <Edit/>
                                        </Fab>
                                      </Tooltip>
                                    </Grid>
                                  }
                                </Grid>
                              </ListItem>
                            );
                          })
                        }
                      </List>
                    </Grid>
                  }
                </Grid>
              );
            })}
            <Grid item>
              {this.props.indexExpandedPanel === "OTHER" ? 
                <Tooltip title={`Collapse Other Things`}>
                  <Button 
                    onClick={_ => {this.handleChange("OTHER")}}>
                    <KeyboardArrowDownIcon/>
                  </Button>
                </Tooltip>
              :
                <Tooltip title={`Expand Other Things`}>
                  <Button 
                    onClick={_ => {this.handleChange("OTHER")}}>
                    <KeyboardArrowRightIcon/>
                  </Button>
                </Tooltip>
              }
              <span className={"MuiTypography-root MuiListItemText-primary MuiTypography-body1"}>
                { majorless.filter(t => t.NeedsWork !== undefined && t.NeedsWork).length > 0 ?
                  <span>Other Things ({majorless.length}) ({majorless.filter(t => t.NeedsWork !== undefined && t.NeedsWork).length} <img style={{ height: "20px", marginBottom: "-4px" }} src={UnderConstruction} alt="Needs Work" />)</span>
                :
                  <span>Other Things ({majorless.length})</span>
                }
              </span>
              { createButtons &&
                <Tooltip title={`Create New Thing`}>
                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                    onClick={ _ => {this.setState({redirectTo:`/thing/create`})}}>
                    <Add/>
                  </Fab>
                </Tooltip>
              }
            </Grid>
            {this.props.indexExpandedPanel === "OTHER" &&
              <Grid item>
                <List style={{ maxWidth: "380px" }}>
                  {
                    majorless.map((thing, j) => {
                      return (
                        <ListItem key={j}>
                          <Grid container spacing={1} direction="row">
                            <Grid item xs={10}>
                              <Tooltip title={`Details for ${thing.Name}`}>
                                <Button 
                                  fullWidth variant="contained" color="primary" 
                                  onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}>
                                  { thing.NeedsWork &&
                                    <span><img style={{ height: "20px", marginBottom: "-4px" }} src={UnderConstructionWhite} alt="Needs Work" />&nbsp;</span>
                                  }
                                  {thing.Name}
                                </Button>
                              </Tooltip>
                            </Grid>
                            { createButtons &&
                              <Grid item xs={2}>
                                <Tooltip title={`Edit ${thing.Name}`}>
                                  <Fab size="small" color="primary" style={{marginLeft: "8px"}}
                                    onClick={ _ => {this.setState({redirectTo:`/thing/edit/${thing._id}`})}}>
                                    <Edit/>
                                  </Fab>
                                </Tooltip>
                              </Grid>
                            }
                          </Grid>
                        </ListItem>
                      );
                    })
                  }
                </List>
              </Grid>
            }
          </Grid>
        </div>
      );
    }
  }
}

const ThingIndex = connect(mapStateToProps, mapDispatchToProps)(Index);
export default ThingIndex;
