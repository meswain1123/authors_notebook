/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText
} from "@material-ui/core";
  

export default function TextBox(props) {
  const [value, changeValue] = useState(props.Value === undefined || props.Value === null ? "" : props.Value);
  const displayName = props.displayName === undefined ? props.fieldName : props.displayName;
  
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor={`text_field_${props.fieldName}`}>{displayName}</InputLabel>
      { props.multiline !== undefined && props.multiline ?
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
