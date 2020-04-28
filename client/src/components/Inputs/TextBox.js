/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText
} from "@material-ui/core";
  

export default function TextBox(props) {
  const [value, changeValue] = useState(props.Value);
  
  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel htmlFor={`text_field_${props.fieldName}`}>{props.fieldName}</InputLabel>
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
          props.onBlur(value);
        }}
        labelWidth={props.labelWidth}
        fullWidth
      />
      <FormHelperText>
        {props.message}
      </FormHelperText>
    </FormControl>
  );
}
