/* eslint-disable no-use-before-define */
import React, { Component } from "react";
import { connect } from "react-redux";

import {
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  Grid,
  // Box
} from "@material-ui/core";
// import TextInput from 'react-autocomplete-input';
import AutocompleteTextField from "./AutocompleteTextField";
// import AutocompleteTextField from 'react-autocomplete-input';
// import 'react-autocomplete-input/dist/bundle.css';


const mapStateToProps = state => {
  return {
    // selectedPage: state.app.selectedPage,
    // selectedType: state.app.selectedType,
    // selectedWorld: state.app.selectedWorld,
    // selectedWorldID: state.app.selectedWorldID,
    // types: state.app.types,
    // things: state.app.things,
    // user: state.app.user,
    // attributesByID: state.app.attributesByID,
    // attributesByName: state.app.attributesByName,
    // fromLogin: state.app.fromLogin,
    // typeSuggestions: state.app.typeSuggestions,
    // thingSuggestions: state.app.thingSuggestions
  };
};
function mapDispatchToProps(dispatch) {
  return {
    // updateSelectedType: type => dispatch(updateSelectedType(type)),
    // addType: type => dispatch(addType(type)),
    // updateType: type => dispatch(updateType(type)),
    // addAttributes: attrs => dispatch(addAttributes(attrs)),
    // setAttributes: attrs => dispatch(setAttributes(attrs)),
    // setTypes: types => dispatch(setTypes(types)),
    // setThings: things => dispatch(setThings(things)),
    // notFromLogin: () => dispatch(notFromLogin({})),
    // addThing: thing => dispatch(addThing(thing)),
    // toggleLogin: () => dispatch(toggleLogin({})),
    // logout: () => dispatch(logout({}))
  };
}
class Control extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // value: "<a href=\"type_5e75999efb4bae172d3fa0ef\" rel=\"noopener noreferrer\" target=\"_blank\">pizza</a> <span id='type_5e75999efb4bae172d3fa0ef' style=\"color: blue\">y/Component</span> <em>lasagna</em> "
      value: props.Value
    };
  }
  // 0123456789112345678921234567893123456789412345678951234567896123456789712345678981234567899123456789
  // pizza <span id='type_5e75999efb4bae172d3fa0ef' style="color: blue">y/Component</span> lasagna 

  getValue = () => {
    return this.state.value;
  }
  
  render() {
    // const [value, changeValue] = useState(props.Value === undefined || props.Value === null ? "" : props.Value);
    const displayName = this.props.displayName === undefined ? this.props.fieldName : this.props.displayName;
    
    if (this.props.options !== undefined) {
      return (
        <Grid container spacing={1} direction="column">
          <Grid item>
            <InputLabel htmlFor={`text_field_${this.props.fieldName}`}>{displayName}</InputLabel>
          </Grid>
          <Grid item>
            <AutocompleteTextField
              id={`text_field_${this.props.fieldName}`}
              name={`text_field_${this.props.fieldName}`}
              type="text"
              autoComplete="Off"
              // multiline
              // error={this.props.message !== undefined && this.props.message !== ""}
              // multiline="multiline"
              error={this.props.message}
              value={this.state.value}
              onChange={e => {
                this.setState({ value: e });
                if (this.props.onChange !== undefined) {
                  this.props.onChange(e);
                }
                // if (this.props.onBlur !== undefined) {
                //   this.props.onBlur(e);
                // }
              }}
              onKeyDown={e => {
                if (this.props.onKeyPress !== undefined) {
                  this.props.onKeyPress(e);
                }
              }}
              onBlur={e => {
                console.log(e);
                if (this.props.onBlur !== undefined) {
                  this.props.onBlur(this.state.value);
                }
              }}
              // labelWidth={this.props.labelWidth}
              // fullWidth
              options={this.props.options}
            />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor={`text_field_${this.props.fieldName}`}>{displayName}</InputLabel>
          { this.props.multiline !== undefined && this.props.multiline ?
            <OutlinedInput
              id={`text_field_${this.props.fieldName}`}
              name={`text_field_${this.props.fieldName}`}
              type="text"
              autoComplete="Off"
              multiline
              error={this.props.message !== undefined && this.props.message !== ""}
              value={this.state.value}
              onChange={e => {
                this.setState({ value: e.target.value });
              }}
              onBlur={e => {
                this.props.onBlur(this.state.value.trim());
              }}
              labelWidth={this.props.labelWidth}
              fullWidth
            />
          :
            <OutlinedInput
              id={`text_field_${this.props.fieldName}`}
              name={`text_field_${this.props.fieldName}`}
              type="text"
              autoComplete="Off"
              error={this.props.message !== undefined && this.props.message !== ""}
              value={this.state.value}
              onChange={e => {
                this.setState({ value: e.target.value });
              }}
              onBlur={e => {
                this.props.onBlur(this.state.value.trim());
              }}
              labelWidth={this.props.labelWidth}
              fullWidth
            />
          }
          <FormHelperText>
            {this.props.message}
          </FormHelperText>
        </FormControl>
      );
    }
  }
}

const TextBox = connect(mapStateToProps, mapDispatchToProps)(Control);
export default TextBox;