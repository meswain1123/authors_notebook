import React, { Component } from "react";
import { connect } from "react-redux";
import AttributeControl from "./AttributeControl";
import styled from "styled-components";
// import Button from "@material-ui/core/Button";
// import Add from "@material-ui/icons/Add";
import { updateSelectedThing } from "../../redux/actions/index";

const Label = styled("label")`
  padding: 0 0 4px;
  line-height: 1.5;
  display: block;
`;
// import Navbar from "react-bootstrap/lib/Navbar";
// import { Button } from "reactstrap";
// import {
//   Form,
//   FormGroup,
//   FormControl,
//   ControlLabel,
//   Checkbox,
// } from "react-bootstrap";

// It will let you add and remove attributes.
// Each needs to have a unique name as part of validation.
// Each also needs to have a valid type.
// The type can be string, integer, double, enum, any Type
// already defined for this world, or a list of any of the
// other types.
// In future versions I will add support for additional types:
// Color, DateTime, Schedule.

const mapStateToProps = state => {
  // // console.log(state);
  return {
    selectedThing: state.app.selectedThing,
    // attributesArr: state.app.attributesArr,
    things: state.app.things,
    types: state.app.types
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedThing: thing => dispatch(updateSelectedThing(thing))
    // updateAttributesArr: arr => dispatch(updateAttributesArr(arr))
  };
}
class Control extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     attributes:
  //   };
  // }

  componentDidMount() {
    // // console.log(this.props);
  }

  newAttribute = () => {
    // // console.log(this.props);
    const thing = this.props.selectedThing;
    thing.AttributesArr.push({
      index: thing.AttributesArr.length,
      Name: "",
      Type: "Text",
      Options: [],
      Type2: "Text",
      ListType: "",
      FromTypes: [],
      Value: "",
      AttributeTypes: ["Text", "Number", "True/False", "Options", "Type"]
    });
    this.props.updateSelectedThing(thing);
    // const arr = this.props.attributesArr;
    // arr.push({Name: "", Type: ""});
    // this.props.updateAttributesArr(arr);
    // I need to put it into state and do setstate.
    // Actually, I may need to put the active thing into the main state.
  };

  changeAttribute = value => {
    // console.log(value);
    // const name = e.target.name;
    // const value = (e.target.type === "checkbox" ? e.target.checked : e.target.value);
    // // console.log(value);
    const thing = this.props.selectedThing;
    // thing.AttributesArr.push({Name: "", Type: ""});
    thing.AttributesArr[value.index] = {
      index: value.index,
      Name: value.Name,
      Type: value.Type,
      Options: value.Options,
      Type2: value.Type2,
      ListType: value.ListType,
      // Default: value.Default
      FromTypes: value.FromTypes,
      Value: value.Value,
      AttributeTypes: ["Text", "Number", "True/False", "Options", "Type"]
    };
    // console.log(thing);
    this.props.updateSelectedThing(thing);
    // this.setState({ [name]: value });
  };

  blurAttribute = e => {
    // // console.log(e);
    // const name = e.target.name;
    // const value = (e.target.type === "checkbox" ? e.target.checked : e.target.value);
    // // console.log(value);
    // this.setState({ [name]: value });
  };

  deleteAttribute = value => {
    // console.log(value);
    const thing = this.props.selectedThing;
    // console.log(thing);
    thing.AttributesArr.splice(value.index);
    this.props.updateSelectedThing(thing);
  };

  optionsChange = (e, props) => {
    // console.log(e);
    // console.log(props);
  }

  render() {
    // console.log(this.props);
    return (
      <div className="Attributes">
        <Label>Attributes</Label>
        {this.props.selectedThing === null ||
        this.props.selectedThing === undefined
          ? ""
          : this.props.selectedThing.AttributesArr.map((attribute, i) => {
              return (
                <AttributeControl
                  key={i}
                  thingID={this.props.selectedThing._id}
                  attribute={attribute}
                  onChange={this.changeAttribute}
                  onDelete={this.deleteAttribute}
                  onBlur={this.blurAttribute}
                  things={this.props.things}
                  types={this.props.types}
                />
              );
            })}
      </div>
    );
  }
}

const AttributesControl = connect(mapStateToProps, mapDispatchToProps)(Control);
export default AttributesControl;
