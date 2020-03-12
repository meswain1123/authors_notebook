import React, { Component } from 'react';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import {
  updateTreeItems
} from "../../redux/actions/index";
import MyTreeItem from './MyTreeItem';

/* 
  This component is a tree control.  It takes a list of items as parameters which it uses to 
  create tree items for display and navigation.  Most of the logic is in the MyTreeItem component, 
  but I want to have the collapse and expand logic here because I plan to add a search filter eventually.
  The search filter will be able to work with the tree and will hide things that don't fit the search,
  but the things that fit the search may be child items, in which case I want to show the ancestors of 
  the ones that fit, but expand them to show the ones that fit.  It's also possible for something that
  fits to have children which don't fit, in which case I want to show the children, but collapse them.

  Types always stays, but it doesn't change its state, and it's chidren get filtered to only those which are shown.

  Example from Harry Potter World:
  
  Start:
  Types - collapsed: [Character (Major), Witch or Wizard, Animagus, Spell (Major)]
  Characters - collapsed: [Harry Potter, Ron Weasley, Hermione Granger, Voldemort]
  Spells - collapsed: [Wingardium Leviosa, Levicorpus, Expeliarmus, Alohamora, Reducto, Sectum Sempra, Crucio, Imperio, Avada Kadavra]

  With Search Term: 'Avada'
  Types - collapsed: [Spell (Major)]
  Spells - expanded: [Avada Kadavra]
  
  Search Term: 'Spell'
  Types - collapsed: [Spell (Major)]
  Spells - collapsed: [Wingardium Leviosa, Levicorpus, Expeliarmus, Alohamora, Reducto, Sectum Sempra, Crucio, Imperio, Avada Kadavra]

  Search Term: 'Harry'
  Types - collapsed: [Character (Major), Witch or Wizard]
  Characters - collapsed: [Harry Potter]

*/
const mapStateToProps = state => {
  return { 
    things: state.app.things,
    types: state.app.types,
    treeItems: state.app.treeItems
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateTreeItems: treeItems => dispatch(updateTreeItems(treeItems)),
  };
}
class Tree extends Component {
  // constructor(props) {
  //   super(props);
  //   console.log(props);
  //   this.state = {
  //     rootItems: [...props.rootItems]
  //   };
  //   console.log(this.state);
  // }

  componentDidMount() {
  }

  collapse = (e) => {
    console.log(e);
    e.expanded = false;
    this.props.updateTreeItems(this.props.treeItems);
  }

  expand = (e) => {
    console.log(e);
    e.expanded = true;
    this.props.updateTreeItems(this.props.treeItems);
  }

  render() {
    // console.log(this.state.rootItems);
    return (
      <Grid item container spacing={1} direction="column">
        <Grid item>
          {
            this.props.treeItems.map((item, i) => {
              return (
                <MyTreeItem key={i} 
                  item={item} 
                  collapse={e => {this.collapse(e)}} 
                  expand={e => {this.expand(e)}}
                />
              );
            })
          }
        </Grid>
      </Grid>
    );
  }
}

const MyTree = connect(mapStateToProps, mapDispatchToProps)(Tree);
export default MyTree;
