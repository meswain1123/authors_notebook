import React, { Component } from 'react';
import { connect } from "react-redux";
import Add from "@material-ui/icons/Add";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
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

  edit = () => {
    console.log(this.props);
  }

  new = () => {
    console.log(this.props);
  }

  // delete = () => {
  //   console.log(this.props);
  // }

  render() {
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item>
          {
            this.props.item.children === null || this.props.item.children === undefined ?
            "" :
            this.props.item.expanded ? 
            <ChevronRightIcon 
              style={{cursor: "pointer"}} 
              onClick={_ => {this.props.collapse(this.props.item)}} 
              // onClick={e => console.log(e)} 
              /> : 
            <ExpandMoreIcon 
              style={{cursor: "pointer"}} 
              onClick={_ => {this.props.expand(this.props.item)}} 
              // onClick={e => console.log(e)} 
              />
          }
          { this.props.item.navigateTo === null ?
          this.props.item.Name :
          <span 
            style={{cursor:"pointer"}} 
            onClick={_ => {this.navigate()}}>
              {this.props.item.Name}
          </span>
          }
          { this.props.item.editTo === null ?
          "" :
          <span 
            style={{cursor:"pointer"}} 
            onClick={_ => {this.edit()}}>
              edit
          </span>
          }
          { this.props.item.newTo === null ?
          "" :
          <span 
            style={{cursor:"pointer"}} 
            onClick={_ => {this.new()}}>
              new
          </span>
          }
          {/* { this.props.item.deleteTo === null ?
          "" :
          <span 
            style={{cursor:"pointer"}} 
            onClick={_ => this.delete()}>
              delete
          </span>
          } */}
        </Grid>
        <Grid item>
          {
            this.props.item.expanded ?
              this.props.item.children.map((item, i) => {
                return (
                  <MyTreeItem key={i} 
                    item={item} 
                    collapse={e => {this.props.collapse(e)}} 
                    expand={e => {this.props.expand(e)}}
                  />
                );
              })
            : 
            ""
          }
        </Grid>
      </Grid>
    );
  }
}

const MyTreeItem = connect(mapStateToProps, mapDispatchToProps)(Item);
export default MyTreeItem;
