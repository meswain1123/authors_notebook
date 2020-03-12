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
// import TreeView from '@material-ui/lab/TreeView';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import TreeItem from '@material-ui/lab/TreeItem';
import MyTree from './MyTree';

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
    console.log(this.props.things);
    const majorless = this.props.things.filter(thing => thing.Types.filter(t=>t.Major).length === 0);
    const treeItems = [
      {
        _id: null, 
        Name: "Types", 
        navigateTo: null, 
        editTo: null, 
        expanded: false,
        newTo: `/type/create`, 
        children: this.props.types.map((type, i) => { 
          return {
            _id: type._id, 
            Name: type.Name, 
            navigateTo: `/type/details/${type._id}`, 
            editTo: `/type/edit/${type._id}`, 
            newTo: `/thing/create/type_id_${type._id}`
          }; 
        })
      }
    ];
    this.props.types.filter(t=>t.Major).forEach(t => {
      const things = this.props.things.filter(thing => thing.TypeIDs.includes(t._id));
      treeItems.push({
        _id: t._id, 
        Name: t.Name, 
        navigateTo: `/type/details/${t._id}`, 
        editTo: `/type/edit/${t._id}`, 
        expanded: false,
        newTo: `/thing/create/type_id_${t._id}`, 
        children: things.map((thing, i) => { 
          return {
            _id: thing._id, 
            Name: thing.Name, 
            navigateTo: `/thing/details/${thing._id}`, 
            editTo: `/thing/edit/${thing._id}`, 
            newTo: null
          }; 
        })
      });
    });
    treeItems.push({
      _id: null, 
      Name: "Other Things", 
      navigateTo: null, 
      editTo: null, 
      expanded: false,
      newTo: `/thing/create`, 
      children: majorless.map((thing, i) => { 
        return {
          _id: thing._id, 
          Name: thing.Name, 
          navigateTo: `/thing/details/${thing._id}`, 
          editTo: `/thing/edit/${thing._id}`, 
          newTo: null
        }; 
      })
    });
    console.log(treeItems);

    return (
      <div>
        <MyTree rootItems={treeItems}>
        </MyTree>
        {/* <TreeView
          // className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <TreeItem nodeId="1" label={`Types (${this.props.types.length})`}>
            <TreeItem nodeId="2" label="Calendar" />
            <TreeItem nodeId="3" label="Chrome" />
            <TreeItem nodeId="4" label="Webstorm" />
          </TreeItem>
          <TreeItem nodeId="5" label="Documents">
            <TreeItem nodeId="10" label="OSS" />
            <TreeItem nodeId="6" label="Material-UI">
              <TreeItem nodeId="7" label="src">
                <TreeItem nodeId="8" label="index.js" />
                <TreeItem nodeId="9" label="tree-view.js" />
              </TreeItem>
            </TreeItem>
          </TreeItem>
        </TreeView> */}
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
