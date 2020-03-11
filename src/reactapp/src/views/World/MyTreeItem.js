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
import TreeView from '@material-ui/lab/TreeView';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

/* 
  This is a specialized Tree Item control.  It takes a Type in
  its props, and if expanded it will show all sub types 
  (as Tree Items) and all Things of that type under the sub types.
  The Tree Items have 4 places which can be clicked.  
  First is the Expand Icon, which shows/hides the children under it.
  Second is the Name, which navigates to the details for the Type.
  Then to the right of the Name is 2 more icon buttons.  
  First is New Sub Type, and second is New Thing.
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
class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  componentDidMount() {
  }

  navigate = () => {
    console.log(this.props);
  }

  render() {
    return (
      <Grid item container spacing={0} direction="column">
        <Grid item>
          {
            this.props.expanded ? 
            <ChevronRightIcon 
              style={{cursor: "pointer"}} 
              onClick={this.props.collapse(this.props.type)} /> : 
            <ExpandMoreIcon 
              style={{cursor: "pointer"}} 
              onClick={this.props.expand(this.props.type)} />
          }
          <span 
            style={{cursor:"pointer"}} 
            onClick={this.navigate()}>
              {this.props.type.Name}
          </span>
        </Grid>
        {
          this.props.expanded ?
            this.props.types.filter(t=>t.SuperIDs.includes(this.props.type._id)).map((type, i) => {
              return (
                <MyTreeItem key={i} 
                  type={type} 
                  collapse={e => {this.props.collapse(e)}} 
                  expand={e => {this.props.expand(e)}}
                />
              );
            })
          : 
          ""
        }

      </Grid>
    );
  }
}

const MyTreeItem = connect(mapStateToProps, mapDispatchToProps)(Item);
export default MyTreeItem;
