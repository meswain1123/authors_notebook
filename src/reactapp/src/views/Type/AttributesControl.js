import React, { Component } from "react";
import { connect } from "react-redux";
import AttributeControl from "./AttributeControl";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Add from "@material-ui/icons/Add";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  updateSelectedType,
  updateAttributesArr
} from "../../redux/actions/index";

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;

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
    attributesArr: state.app.attributesArr,
    types: state.app.types
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedType: type => dispatch(updateSelectedType(type)),
    updateAttributesArr: arr => dispatch(updateAttributesArr(arr))
  };
}
class Control extends Component {
  componentDidMount() {
  }

  newAttribute = () => {
    const type = this.props.selectedType;
    type.AttributesArr.push({
      index: type.AttributesArr.length,
      Name: "",
      Type: "Text",
      Options: [],
      Type2: "",
      ListType: "",
      FromSupers: [],
      AttributeTypes: ["Text", "Number", "True/False", "Options", "Type", "List"]
    });
    this.props.updateSelectedType(type);
  };

  changeAttribute = value => {
    const type = this.props.selectedType;
    type.AttributesArr[value.index] = {
      index: value.index,
      Name: value.Name,
      Type: value.Type,
      Options: value.Options,
      Type2: value.Type2,
      ListType: value.ListType,
      FromSupers: value.FromSupers,
      AttributeTypes: ["Text", "Number", "True/False", "Options", "Type", "List"]
    };
    this.props.updateSelectedType(type);
  };

  blurAttribute = e => {
  };

  deleteAttribute = value => {
    const type = this.props.selectedType;
    const attributesArr = [];
    type.AttributesArr.forEach(t => {
      if (t.index !== value.index) {
        if (t.index > value.index)
          t.index--;
        attributesArr.push(t);
      }
    });
    type.AttributesArr = [];
    this.props.updateSelectedType(type);
    setTimeout(() => {
      type.AttributesArr = attributesArr;
      this.props.updateSelectedType(type);
    }, 500);
  };

  render() {
    return (
      <Grid item xs={12} container spacing={0} direction="column">
        <Grid item>
          <Label>Attributes</Label>
        </Grid>
        <Grid item>
          <List>
            <ListItem>
              <Button variant="contained" color="primary" onClick={this.newAttribute}>
                <Add />
                <ListItemText primary={"Create New"} />
              </Button>
            </ListItem>
            {this.props.selectedType === null ||
            this.props.selectedType === undefined
              ? ""
              : this.props.selectedType.AttributesArr.map((attribute, i) => {
                  return (
                    <ListItem key={i}>
                      <AttributeControl
                        typeID={this.props.selectedType._id}
                        attribute={attribute}
                        onChange={this.changeAttribute}
                        onDelete={this.deleteAttribute}
                        onBlur={this.blurAttribute}
                        types={this.props.types}
                      />
                    </ListItem>
                  );
                })}
          </List>
        </Grid>
      </Grid>
    );
  }
}

const AttributesControl = connect(mapStateToProps, mapDispatchToProps)(Control);
export default AttributesControl;
