/* eslint-disable no-use-before-define */
import React, { Component } from "react";
import { connect } from "react-redux";

import {
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText
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
      value: ""
    };
  }

  render() {
    // const [value, changeValue] = useState(props.Value === undefined || props.Value === null ? "" : props.Value);
    const displayName = this.props.displayName === undefined ? this.props.fieldName : this.props.displayName;
    
    return (
      <FormControl variant="outlined" fullWidth>
        <InputLabel htmlFor={`text_field_${this.props.fieldName}`}>{displayName}</InputLabel>
        { this.props.multiline !== undefined && this.props.multiline && this.props.options !== undefined ?
          <AutocompleteTextField
            id={`text_field_${this.props.fieldName}`}
            name={`text_field_${this.props.fieldName}`}
            type="text"
            autoComplete="Off"
            multiline
            error={this.props.message !== undefined && this.props.message !== ""}
            // multiline="multiline"
            // error={this.props.message}
            value={this.state.value}
            onChange={e => {
              this.setState({ value: e });
              if (this.props.onChange !== undefined) {
                this.props.onChange(e);
              }
            }}
            onKeyPress={e => {
              if (this.props.onKeyPress !== undefined) {
                this.props.onKeyPress(e);
              }
            }}
            onBlur={e => {
              if (this.props.onBlur !== undefined) {
                this.props.onBlur(this.state.value.trim());
              }
            }}
            labelWidth={this.props.labelWidth}
            fullWidth
            options={this.props.options}
          />
        : this.props.options !== undefined ?
          <AutocompleteTextField
            id={`text_field_${this.props.fieldName}`}
            name={`text_field_${this.props.fieldName}`}
            type="text"
            autoComplete="Off"
            error={this.props.message !== undefined && this.props.message !== ""}
            // error={this.props.message}
            value={this.state.value}
            onChange={e => {
              this.setState({ value: e });
              if (this.props.onChange !== undefined) {
                this.props.onChange(e);
              }
            }}
            onKeyPress={e => {
              if (this.props.onKeyPress !== undefined) {
                this.props.onKeyPress(e);
              }
            }}
            onBlur={e => {
              if (this.props.onBlur !== undefined) {
                this.props.onBlur(this.state.value.trim());
              }
            }}
            labelWidth={this.props.labelWidth}
            fullWidth
            options={this.props.options}
          />
        : this.props.multiline !== undefined && this.props.multiline ?
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

const TextBox = connect(mapStateToProps, mapDispatchToProps)(Control);
export default TextBox;