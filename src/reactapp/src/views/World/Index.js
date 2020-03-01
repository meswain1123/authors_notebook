import React, { Component } from 'react';
import { connect } from "react-redux";
import Add from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
    types: state.app.types
  };
};
function mapDispatchToProps(dispatch) {
  return {
    // selectPage: page => dispatch(selectPage(page)),
    // selectWorld: worldID => dispatch(selectWorld(worldID)),
    // setThings: things => dispatch(setThings(things)),
    // setThings: things => dispatch(setThings(things))
  };
}
class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedPanel: false
    };
  }

  componentDidMount() {
  }

  handleChange = panel => (event, isExpanded) => {
    this.setState({expandedPanel: isExpanded ? panel : false});
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
              href={`/thing/create/type_id_${type._id}`}>
              <Add/><ListItemText primary={`Create New ${type.Name}`} />
            </Button>
          </ListItem>
          {
            things.map((thing, i) => {
              return (
                <ListItem key={i}>
                  <Button 
                    fullWidth variant="contained" color="primary" 
                    href={`/thing/details/${thing._id}`}>
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
              href={`/thing/create`}>
              <Add/><ListItemText primary={`Create New Thing`} />
            </Button>
          </ListItem>
          {
            majorLess.map((thing, i) => {
              return (
                <ListItem key={i}>
                  <Button 
                    fullWidth variant="contained" color="primary" 
                    href={`/thing/details/${thing._id}`}>
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

  render() {
    // console.log(this.props);
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
                  href={`/type/create`}>
                  <Add/><ListItemText primary={`Create New Type`} />
                </Button>
              </ListItem>
              {
                this.props.types.map((type, i) => {
                  return (
                    <ListItem key={i}>
                      <Button 
                        fullWidth variant="contained" color="primary" 
                        href={`/type/details/${type._id}`}>
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
                      href={`/thing/create/type_id_${type._id}`}>
                      <Add/><ListItemText primary={`Create New ${type.Name}`} />
                    </Button>
                  </ListItem>
                  {
                    things.map((thing, i) => {
                      return (
                        <ListItem key={i}>
                          <Button 
                            fullWidth variant="contained" color="primary" 
                            href={`/thing/details/${thing._id}`}>
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
                  href={`/thing/create`}>
                  <Add/><ListItemText primary={`Create New Thing`} />
                </Button>
              </ListItem>
              {
                majorless.map((thing, i) => {
                  return (
                    <ListItem key={i}>
                      <Button 
                        fullWidth variant="contained" color="primary" 
                        href={`/thing/details/${thing._id}`}>
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
}

const ThingIndex = connect(mapStateToProps, mapDispatchToProps)(Index);
export default ThingIndex;
