/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText
} from "@material-ui/core";
// import TextInput from 'react-autocomplete-input';
// import AutocompleteTextField from "./AutocompleteTextField";
import AutocompleteTextField from 'react-autocomplete-input';
import 'react-autocomplete-input/dist/bundle.css';


export default function TextBox(props) {
  const [value, changeValue] = useState(props.Value === undefined || props.Value === null ? "" : props.Value);
  const displayName = props.displayName === undefined ? props.fieldName : props.displayName;
  
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor={`text_field_${props.fieldName}`}>{displayName}</InputLabel>
      { props.multiline !== undefined && props.multiline && props.options !== undefined ?
        <AutocompleteTextField
          id={`text_field_${props.fieldName}`}
          name={`text_field_${props.fieldName}`}
          type="text"
          autoComplete="Off"
          // multiline
          // error={props.message !== undefined && props.message !== ""}
          multiline="multiline"
          error={props.message}
          value={value}
          onChange={e => {
            changeValue(e);
            if (props.onChange !== undefined) {
              props.onChange(e);
            }
          }}
          onKeyPress={e => {
            if (props.onKeyPress !== undefined) {
              props.onKeyPress(e);
            }
          }}
          onBlur={e => {
            if (props.onBlur !== undefined) {
              props.onBlur(value.trim());
            }
          }}
          // labelWidth={props.labelWidth}
          // fullWidth
          options={props.options}
        />
      : props.options !== undefined ?
        <AutocompleteTextField
          id={`text_field_${props.fieldName}`}
          name={`text_field_${props.fieldName}`}
          type="text"
          autoComplete="Off"
          error={props.message}
          // error={props.message !== undefined && props.message !== ""}
          value={value}
          onChange={e => {
            changeValue(e);
            if (props.onChange !== undefined) {
              props.onChange(e);
            }
          }}
          onKeyPress={e => {
            if (props.onKeyPress !== undefined) {
              props.onKeyPress(e);
            }
          }}
          onBlur={e => {
            if (props.onBlur !== undefined) {
              props.onBlur(value.trim());
            }
          }}
          // labelWidth={props.labelWidth}
          // fullWidth
          options={props.options}
        />
      : props.multiline !== undefined && props.multiline ?
        <OutlinedInput
          id={`text_field_${props.fieldName}`}
          name={`text_field_${props.fieldName}`}
          type="text"
          autoComplete="Off"
          multiline
          error={props.message !== undefined && props.message !== ""}
          value={value}
          onChange={e => {
            changeValue(e.target.value);
          }}
          onBlur={e => {
            props.onBlur(value.trim());
          }}
          labelWidth={props.labelWidth}
          fullWidth
        />
      :
        <OutlinedInput
          id={`text_field_${props.fieldName}`}
          name={`text_field_${props.fieldName}`}
          type="text"
          autoComplete="Off"
          error={props.message !== undefined && props.message !== ""}
          value={value}
          onChange={e => {
            changeValue(e.target.value);
          }}
          onBlur={e => {
            props.onBlur(value.trim());
          }}
          labelWidth={props.labelWidth}
          fullWidth
        />
      }
      <FormHelperText>
        {props.message}
      </FormHelperText>
    </FormControl>
  );
}
