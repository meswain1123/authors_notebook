import React, { Component } from "react";
import { connect } from "react-redux";
import AttributeControl from "./AttributeControl";
import Grid from "@material-ui/core/Grid";
import { updateSelectedThing } from "../../redux/actions/index";

const mapStateToProps = state => {
  return {
    selectedThing: state.app.selectedThing,
    things: state.app.things,
    types: state.app.types
  };
};
function mapDispatchToProps(dispatch) {
  return {
    updateSelectedThing: thing => dispatch(updateSelectedThing(thing))
  };
}
class Control extends Component {

  componentDidMount() {
  }

  newAttribute = () => {
    const thing = this.props.selectedThing;
    thing.AttributesArr.push({
      index: thing.AttributesArr.length,
      Name: "",
      Type: "Text",
      Options: [],
      Type2: "",
      ListType: "",
      FromTypes: [],
      Value: "",
      ListValues: [],
    });
    this.props.updateSelectedThing(thing);
  };

  changeAttribute = value => {
    const thing = this.props.selectedThing;
    thing.AttributesArr[value.index] = {
      index: value.index,
      Name: value.Name,
      Type: value.Type,
      Options: value.Options,
      Type2: value.Type2,
      ListType: value.ListType,
      FromTypes: value.FromTypes,
      Value: value.Value,
      ListValues: value.ListValues,
    };
    this.props.updateSelectedThing(thing);
  };

  blurAttribute = e => {
  };

  deleteAttribute = value => {
    const thing = this.props.selectedThing;
    thing.AttributesArr.splice(value.index);
    this.props.updateSelectedThing(thing);
  };

  optionsChange = (e, props) => {
  }

  render() {
    return (
      <Grid item xs={12} container spacing={1} direction="column">
        <Grid item>Attributes</Grid>
        {this.props.selectedThing === null || this.props.selectedThing === undefined ? ""
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
          })
        }
      </Grid>
    );
  }
}

const AttributesControl = connect(mapStateToProps, mapDispatchToProps)(Control);
export default AttributesControl;
