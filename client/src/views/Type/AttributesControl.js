import React, { Component } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import uuid from 'react-uuid';
import {
  updateSelectedType,
  addType,
  addThing
} from "../../redux/actions/index";
import AttributeControl from "./AttributeControl";
import AttributeDefaultControl from "./AttributeDefaultControl";
import API from "../../smartAPI";

// It will let you add and remove attributes.
// Each needs to have a unique name as part of validation.
// Each also needs to have a valid type.
// The type can be string, integer, double, enum, any Type
// already defined for this world, or a list of any of the
// other types.
// In future versions I will add support for additional types:
// Color, DateTime, Schedule.

const mapStateToProps = state => {
  return {
    selectedType: state.app.selectedType,
    // attributesArr: state.app.attributesArr,
    types: state.app.types,
    things: state.app.things,
    selectedWorldID: state.app.selectedWorldID
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedType: type => dispatch(updateSelectedType(type)),
    // updateAttributesArr: arr => dispatch(updateAttributesArr(arr)),
    addType: type => dispatch(addType(type)),
    addThing: thing => dispatch(addThing(thing))
  };
}
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      waiting: false,
      defaultsMode: false
    };
    this.api = API.getInstance();
  }

  componentDidMount() {
  }

  newAttribute = () => {
    const type = this.props.selectedType;
    type.AttributesArr.push({
      index: type.AttributesArr.length,
      attrID: `null_${uuid()}`,
      Name: "",
      AttributeType: "Text",
      Options: [],
      DefinedType: "",
      ListType: ""
    });
    this.props.updateSelectedType(type);
  }

  changeAttribute = value => {
    const type = this.props.selectedType;
    type.AttributesArr[value.index] = {
      index: value.index,
      attrID: value.attrID,
      Name: value.Name,
      AttributeType: value.AttributeType,
      Options: value.Options,
      DefinedType: value.DefinedType,
      ListType: value.ListType,
    };
    this.props.updateSelectedType(type);
  }

  changeDefault = value => {
    const type = this.props.selectedType;
    type.DefaultsHash[value.attrID] = {
      attrID: value.attrID,
      DefaultValue: value.DefaultValue,
      DefaultListValues: value.DefaultListValues,
      FromTypeIDs: value.FromTypeIDs
    };
    this.props.updateSelectedType(type);
  }

  blurAttribute = e => {
  }

  deleteAttribute = value => {
    const type = this.props.selectedType;
    const attributes = [];
    type.AttributesArr.forEach(t => {
      if (t.index !== value.index) {
        if (t.index > value.index)
          t.index--;
        attributes.push(t);
      }
    });
    type.AttributesArr = [];
    let defaults = {...type.DefaultsHash};
    if (defaults[value.attrID] !== undefined) {
      delete defaults[value.attrID];
    }
    type.DefaultsHash = {};
    this.props.updateSelectedType(type);
    setTimeout(() => {
      type.AttributesArr = attributes;
      type.DefaultsHash = defaults;
      this.props.updateSelectedType(type);
    }, 500);
  }

  addNewType = (attribute) => {
    this.props.addNewType(attribute);
  }

  addNewThing = (attribute) => {
    this.props.addNewThing(attribute);
  }

  render() {
    // I should move this somewhere else so it's not happening on every render.
    const inheritedAttributes = [];
    this.props.selectedType.SuperIDs.forEach(s => {
      let superType = this.props.types.filter(t => t._id === s);
      if (superType.length > 0) {
        superType = superType[0];
        superType.AttributesArr.forEach(attribute => {
          let inheritedAttribute = inheritedAttributes.filter(a=>a.attrID === attribute.attrID);
          if (inheritedAttribute.length === 0) {
            attribute.FromTypeIDs = [superType._id];
            inheritedAttributes.push(attribute);
          }
          else {
            inheritedAttribute = inheritedAttribute[0];
            inheritedAttribute.FromTypeIDs.push(superType._id);
          }
        });
      }
    });
    return (
      <Grid item xs={12} container spacing={0} direction="column">
        <Grid item>
          <List>
            { this.props.selectedType !== null && this.props.selectedType !== undefined &&
              inheritedAttributes.map((attribute, i) => {
                let def = this.props.selectedType.DefaultsHash[attribute.attrID];
                if (def === undefined)
                  def = { attrID: attribute.attrID, DefaultValue: "", DefaultListValues: [] };
                return (
                  <ListItem key={i}>
                    { this.props.defaultsMode ? 
                      <AttributeDefaultControl
                        typeID={this.props.selectedType._id}
                        attribute={attribute}
                        def={def}
                        onChange={this.changeDefault}
                        // onBlur={this.blurAttribute}
                        types={this.props.types}
                        things={this.props.things}
                        onNewThing={this.addNewThing}
                      /> : 
                      <AttributeControl
                        typeID={this.props.selectedType._id}
                        disabled={true}
                        attribute={attribute}
                        // onChange={this.changeAttribute}
                        // onDelete={this.deleteAttribute}
                        // onBlur={this.blurAttribute}
                        types={this.props.types}
                        things={this.props.things}
                        onNewType={this.addNewType}
                      /> 
                    }
                  </ListItem>
                );
              })
            }
            { this.props.selectedType !== null && this.props.selectedType !== undefined &&
              this.props.selectedType.AttributesArr.map((attribute, i) => {
                let def = this.props.selectedType.DefaultsHash[attribute.attrID];
                if (def === undefined)
                  def = { attrID: attribute.attrID, DefaultValue: "", DefaultListValues: [] };
                
                return (
                  <ListItem key={i}>
                    { this.props.defaultsMode ? 
                      <AttributeDefaultControl
                        typeID={this.props.selectedType._id}
                        attribute={attribute}
                        def={def}
                        onChange={this.changeDefault}
                        onBlur={this.blurAttribute}
                        types={this.props.types}
                        things={this.props.things}
                        onNewThing={this.addNewThing}
                      /> : 
                      <AttributeControl
                        typeID={this.props.selectedType._id}
                        attribute={attribute}
                        onChange={this.changeAttribute}
                        onDelete={this.deleteAttribute}
                        onBlur={this.blurAttribute}
                        types={this.props.types}
                        things={this.props.things}
                        onNewType={this.addNewType}
                      /> 
                    }
                  </ListItem>
                );
              })
            }
          </List>
        </Grid>
      </Grid>
    );
  }
}

const AttributesControl = connect(mapStateToProps, mapDispatchToProps)(Control);
export default AttributesControl;
