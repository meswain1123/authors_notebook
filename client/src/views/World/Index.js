import React, { Component } from 'react';
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Add from "@material-ui/icons/Add";
import Edit from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Tooltip from '@material-ui/core/Tooltip';
// import { Fab } from "@material-ui/core";

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
    user: state.app.user
  };
};
function mapDispatchToProps(dispatch) {
  return {
  };
}
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedPanel: false,
      redirectTo: null
    };
  }

  componentDidMount() {
  }

  handleChange_old = panel => (event, isExpanded) => {
    this.setState({expandedPanel: isExpanded ? panel : false});
  };
  handleChange = panel => {
    this.setState({expandedPanel: this.state.expandedPanel === panel ? false : panel });
  };

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
              <Add/><ListItemText primary={`Create New ${type.Name}`} />
            </Button>
          </ListItem>
          {
            things.map((thing, i) => {
              return (
                <ListItem key={i}>
                  <Button 
                    fullWidth variant="contained" color="primary" 
                    onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}>
                    <ListItemText primary={thing.Name} className="marginLeft" />
                  </Button>
                </ListItem>
              );
            })
          }
        </List>
      </div>
    );
  }

  renderMajorTypelessThings() {
    const majorLess = this.props.things.filter(thing => thing.Types.filter(t=>t.Major).length === 0);
    return (
      <div className="Things">
        <List style={{ width: "240px" }}>
          <ListItem>
            <Button 
              fullWidth variant="contained" color="primary" 
              onClick={ _ => {this.setState({redirectTo:`/thing/create`})}}>
              <Add/><ListItemText primary={`Create New Thing`} />
            </Button>
          </ListItem>
          {
            majorLess.map((thing, i) => {
              return (
                <ListItem key={i}>
                  <Button 
                    fullWidth variant="contained" color="primary" 
                    onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}>
                    <ListItemText primary={thing.Name} className="marginLeft" />
                  </Button>
                </ListItem>
              );
            })
          }
        </List>
      </div>
    );
  }

  render_old() {
    const majorless = this.props.things.filter(thing => thing.Types.filter(t=>t.Major).length === 0);

    return (
      <div>
        <ExpansionPanel expanded={this.state.expandedPanel === "TYPES"} onChange={this.handleChange("TYPES")}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            Types ({this.props.types.length})
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List style={{ width: "240px" }}>
              <ListItem>
                <Button 
                  fullWidth variant="contained" color="primary" 
                  onClick={ _ => {this.setState({redirectTo:`/type/create`})}}>
                  <Add/><ListItemText primary={`Create New Type`} />
                </Button>
              </ListItem>
              {
                this.props.types.map((type, i) => {
                  return (
                    <ListItem key={i}>
                      <Button 
                        fullWidth variant="contained" color="primary" 
                        onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}>
                        <ListItemText primary={type.Name} className="marginLeft" />
                      </Button>
                    </ListItem>
                  );
                })
              }
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        { this.props.types.filter(t=>t.Major).map((type, i) => {
          const things = this.props.things.filter(thing => thing.TypeIDs.includes(type._id));
          return (
          <ExpansionPanel key={i} expanded={this.state.expandedPanel === type._id} onChange={this.handleChange(type._id)}>
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
            >
              {type.Name}s ({things.length})
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <List style={{ width: "240px" }}>
                  <ListItem>
                    <Button 
                      fullWidth variant="contained" color="primary" 
                      onClick={ _ => {this.setState({redirectTo:`/thing/create/type_id_${type._id}`})}}>
                      <Add/><ListItemText primary={`Create New ${type.Name}`} />
                    </Button>
                  </ListItem>
                  {
                    things.map((thing, i) => {
                      return (
                        <ListItem key={i}>
                          <Button 
                            fullWidth variant="contained" color="primary" 
                            onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}>
                            <ListItemText primary={thing.Name} className="marginLeft" />
                          </Button>
                        </ListItem>
                      );
                    })
                  }
                </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          );
        })}
        <ExpansionPanel expanded={this.state.expandedPanel === "OTHER"} onChange={this.handleChange("OTHER")}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
          >
            Other Things ({majorless.length})
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <List style={{ width: "240px" }}>
              <ListItem>
                <Button 
                  fullWidth variant="contained" color="primary" 
                  onClick={ _ => {this.setState({redirectTo:`/thing/create`})}}>
                  <Add/><ListItemText primary={`Create New Thing`} />
                </Button>
              </ListItem>
              {
                majorless.map((thing, i) => {
                  return (
                    <ListItem key={i}>
                      <Button 
                        fullWidth variant="contained" color="primary" 
                        onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}>
                        <ListItemText primary={thing.Name} className="marginLeft" />
                      </Button>
                    </ListItem>
                  );
                })
              }
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }

  render() {
    if (this.state.redirectTo !== null) {
      return <Redirect to={this.state.redirectTo} />;
    }
    else {
      const majorless = this.props.things.filter(thing => thing.Types.filter(t=>t.Major).length === 0);
      const editButtons = this.props.selectedWorld !== null && 
        this.props.user !== null && 
        (this.props.selectedWorld.Owner === this.props.user._id || 
          this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length > 0);
      const createButtons = this.props.selectedWorld !== null && 
        this.props.user !== null && 
        (this.props.selectedWorld.Owner === this.props.user._id || 
          this.props.selectedWorld.Collaborators.filter(c=>c.userID === this.props.user._id && c.type === "collab" && c.editPermission).length > 0);

      return (
        <div>
          <List>
            <ListItem>
              <Grid container spacing={1} direction="column">
                <Grid item>
                  {this.state.expandedPanel === "TYPES" ? 
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
                  <span className={"MuiTypography-root MuiListItemText-primary MuiTypography-body1"}>{`Types (${this.props.types.length})`}</span>
                  { createButtons ?
                    <Tooltip title={`Create New Type`}>
                      <Button 
                        onClick={ _ => {this.setState({redirectTo:`/type/create`})}}>
                        <Add/>
                      </Button>
                    </Tooltip> 
                  : "" }
                </Grid>
                {this.state.expandedPanel === "TYPES" ? 
                  <Grid item>
                    <List style={{ maxWidth: "300px" }}>
                      {
                        this.props.types.map((type, i) => {
                          return (
                            <ListItem key={i}>
                              <Tooltip title={`Details for ${type.Name}`}>
                                <Button 
                                  fullWidth variant="contained" color="primary" 
                                  onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}>
                                  <ListItemText primary={type.Name} className="marginLeft" />
                                </Button>
                              </Tooltip>
                              { createButtons ?
                                <Grid container spacing={0} direction="row">
                                  <Grid item xs={6}>
                                    <Tooltip title={`Create New ${type.Name}`}>
                                      <Button 
                                        onClick={ _ => {this.setState({redirectTo:`/thing/create/type_id_${type._id}`})}}>
                                        <Add/>
                                      </Button>
                                    </Tooltip>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Tooltip title={`Edit ${type.Name}`}>
                                      <Button 
                                        onClick={ _ => {this.setState({redirectTo:`/type/edit/${type._id}`})}}>
                                        <Edit/>
                                      </Button>
                                    </Tooltip>
                                  </Grid>
                                </Grid>
                              : "" }
                            </ListItem>
                          );
                        })
                      }
                    </List>
                  </Grid>
                : "" }
              </Grid>
            </ListItem>
            { this.props.types.filter(t=>t.Major).map((type, i) => {
              const things = this.props.things.filter(thing => thing.TypeIDs.includes(type._id));
              return (
                <ListItem key={i}>
                  <Grid container spacing={1} direction="column">
                    <Grid item>
                      {this.state.expandedPanel === type._id ? 
                        <Tooltip title={`Collapse ${type.Name}s`}>
                          <Button 
                            onClick={_ => {this.handleChange(type._id)}}>
                            <KeyboardArrowDownIcon/>
                          </Button>
                        </Tooltip>
                        :
                        <Tooltip title={`Expand ${type.Name}s`}>
                          <Button 
                            onClick={_ => {this.handleChange(type._id)}}>
                            <KeyboardArrowRightIcon/>
                          </Button>
                        </Tooltip>
                      }
                      <Tooltip title={`Details for ${type.Name}`}>
                        <Button 
                          onClick={ _ => {this.setState({redirectTo:`/type/details/${type._id}`})}}>
                          <ListItemText>{type.Name}s ({things.length})</ListItemText>
                        </Button>
                      </Tooltip>
                      { createButtons ?
                        <span>
                          <Tooltip title={`Create New ${type.Name}`}>
                            <Button 
                              onClick={ _ => {this.setState({redirectTo:`/thing/create/type_id_${type._id}`})}}>
                              <Add/>
                            </Button>
                          </Tooltip>
                          <Tooltip title={`Edit ${type.Name}`}>
                            <Button 
                              onClick={ _ => {this.setState({redirectTo:`/type/edit/${type._id}`})}}>
                              <Edit/>
                            </Button>
                          </Tooltip>
                        </span>
                      : "" }
                    </Grid>
                    {this.state.expandedPanel === type._id ? 
                      <Grid item>
                        <List style={{ maxWidth: "300px" }}>
                          {
                            things.map((thing, j) => {
                              return (
                                <ListItem key={j}>
                                  <Tooltip title={`Details for ${thing.Name}`}>
                                    <Button 
                                      fullWidth variant="contained" color="primary" 
                                      onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}>
                                      <ListItemText primary={thing.Name} className="marginLeft" />
                                    </Button>
                                  </Tooltip>
                                  { editButtons ?
                                  <Tooltip title={`Edit ${thing.Name}`}>
                                    <Button 
                                      onClick={ _ => {this.setState({redirectTo:`/thing/edit/${thing._id}`})}}>
                                      <Edit/>
                                    </Button>
                                  </Tooltip>
                                  : "" }
                                </ListItem>
                              );
                            })
                          }
                        </List>
                      </Grid>
                    : "" }
                  </Grid>
                </ListItem>
              );
            })}
            <ListItem>
              <Grid container spacing={1} direction="column">
                <Grid item>
                  {this.state.expandedPanel === "OTHER" ? 
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
                  <span className={"MuiTypography-root MuiListItemText-primary MuiTypography-body1"}>{`Other Things (${majorless.length})`}</span>
                  { createButtons ?
                  <Tooltip title={`Create New Thing`}>
                    <Button 
                      onClick={ _ => {this.setState({redirectTo:`/thing/create`})}}>
                      <Add/>
                    </Button>
                  </Tooltip>
                  : "" }
                </Grid>
                {this.state.expandedPanel === "OTHER" ? 
                  <Grid item>
                    <List style={{ maxWidth: "300px" }}>
                      {
                        majorless.map((thing, i) => {
                          return (
                            <ListItem key={i}>
                              <Tooltip title={`Details for ${thing.Name}`}>
                                <Button 
                                  fullWidth variant="contained" color="primary" 
                                  onClick={ _ => {this.setState({redirectTo:`/thing/details/${thing._id}`})}}>
                                  <ListItemText primary={thing.Name} className="marginLeft" />
                                </Button>
                              </Tooltip>
                              { editButtons ?
                              <Tooltip title={`Edit ${thing.Name}`}>
                                <Button 
                                  onClick={ _ => {this.setState({redirectTo:`/thing/edit/${thing._id}`})}}>
                                  <Edit/>
                                </Button>
                              </Tooltip>
                              : "" }
                            </ListItem>
                          );
                        })
                      }
                    </List>
                  </Grid>
                : "" }
              </Grid>
            </ListItem>
          </List>
        </div>
      );
    }
  }
}

const ThingIndex = connect(mapStateToProps, mapDispatchToProps)(Index);
export default ThingIndex;
