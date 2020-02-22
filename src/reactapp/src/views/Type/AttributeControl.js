/* eslint-disable no-use-before-define */
import React, { useState } from "react";
// import Dropdown from "react-bootstrap/Dropdown";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import useAutocomplete from '@material-ui/lab/useAutocomplete';
// import CheckIcon from '@material-ui/icons/Check';
// import CloseIcon from '@material-ui/icons/Close';
// import Checkbox from "@material-ui/core/Checkbox";
// import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
// import TextField from '@material-ui/core/TextField';
import DeleteForever from "@material-ui/icons/DeleteForever";
import Button from "@material-ui/core/Button";
// import IconButton from '@material-ui/core/IconButton';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
// import List from "@material-ui/core/List";
// import ListItem from "@material-ui/core/ListItem";
// import ListItemText from "@material-ui/core/ListItemText";
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import styled from 'styled-components';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import AutoCompleteComboBox from "../../components/AutoCompleteComboBox";
import ChipInput from "material-ui-chip-input";

// const inputBlur = (e, props) => {
//   // // console.log(e);
//   const name = e.target.name;
//   const value = (e.target.type === "checkbox" ? e.target.checked : e.target.value);
//   // // console.log(value);
//   // // console.log(props);
//   const attribute = props.attribute;
//   attribute[name] = value;
//   props.onBlur(attribute);
// }

// const typeChange = (e, value, props, respond) => {
//   // // console.log(value);
//   // // console.log(props);
//   // // console.log(respond);
//   respond(value);
// }

const handleTypeChange = (value, props) => {
  // For Autocomplete // (e, props) => { // For Select
  console.log(props);
  console.log(value);
  const attr = props.attribute;
  attr["Type"] = value; // For Autocomplete // e.target.value; // For Select //
  props.onChange(attr);
};

const handleOptionsChange = (e, props) => {
  // console.log(e);
  const attr = props.attribute;
  attr.Options = e;
  props.onChange(attr);
};

// const detailsChange = (e, props) => {
//   // console.log(e);
//   // const attr = props.attribute;
//   // attr["Type"] = e.target.value;
//   // props.onChange(attr);
// }

export default function AttributeControl(props) {
  // console.log(props);
  const [name, changeName] = useState(props.attribute.Name);
  // const typeDetails = props.attribute.TypeDetails;
  const attributeTypes = [
    "Text",
    "Number",
    "True/False",
    "Options" //, "Type" //, "List"
  ];
  const type =
    props.attribute.Type === "" ? attributeTypes[0] : props.attribute.Type;
  // const attributeTypes2 = [
  //   "Text", "Number", "True/False", "Options", "Type"
  // ];

  return (
    <Grid container spacing={1} direction="row">
      <Grid item xs={3}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="Name">Name</InputLabel>
          <OutlinedInput
            disabled={props.attribute.FromSupers.length > 0}
            id="Name"
            name="Name"
            type="text"
            error={props.error}
            value={name}
            autoComplete="off"
            // onChange={ e => handleUserInput(e, props.onChange) }
            // onBlur={ e => inputBlur(e, props.onBlur) }
            // onChange={ e => { props.onChange(e); changeAttribute(e); } }
            onChange={e => {
              changeName(e.target.value);
            }}
            // onBlur={ e => { inputBlur(e, props) } }
            onBlur={e => {
              const attr = {
                index: props.attribute.index,
                Name: name,
                Type: props.attribute.Type,
                Options: props.attribute.Options,
                ListType: "",
                FromSupers: props.attribute.FromSupers
              };
              props.onChange(attr);
            }}
            labelWidth={43}
            fullWidth
          />
          <FormHelperText>{props.message}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item xs={3}>
        {/* <Autocomplete
          id={`ac_types_${props.attribute.index}`}
          disabled={props.attribute.FromSupers.length > 0}
          options={attributeTypes}
          value={type}
          onChange={(e, value) => {
            handleTypeChange(value, props);
          }}
          onBlur={e => {
            const attr = {
              index: props.attribute.index,
              Name: name,
              Type: type,
              Options: props.attribute.Options,
              ListType: "",
              FromSupers: props.attribute.FromSupers
            };
            props.onChange(attr);
          }}
          // getOptionLabel={option => option.title}
          // style={{ width: 300 }}
          // fullWidth
          renderInput={params => (
            <TextField {...params} label="Type" variant="outlined" fullWidth />
          )}
        /> */}
        {/* <div className="MyBorder">
            <div className="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-fullWidth MuiInputBase-formControl MyPadding">
              <select className="MuiInputBase-input MuiInputBase-root MuiInputBase-formControl MuiInputBase-fullWidth MyPadding" 
                disabled={props.attribute.FromSupers.length > 0}
                value={type} onChange={e => { handleTypeChange(e, props) }}>
                {attributeTypes.map((type,i) => {
                  return (
                    <option key={i}>{type}</option>
                  );
                })}
              </select>
            </div>
          </div> */}
        <AutoCompleteComboBox 
            Label="Type"
            disabled={props.attribute.FromSupers.length > 0} 
            value={props.attribute.Type}
            attribute={props.attribute}
            displayField="Name"
            options={props.attribute.AttributeTypes}
            onChange={ (_, value) => handleTypeChange(value, props) }
          />
      </Grid>
      <Grid item xs={3}>
        {type === "Options" ? (
          <ChipInput
            variant="outlined"
            disabled={props.attribute.FromSupers.length > 0}
            defaultValue={props.attribute.Options}
            onChange={chips => handleOptionsChange(chips, props)}
          />
        ) : type === "Type" ? (
          "Type"
        ) : (
          ""
        )}
      </Grid>
      <Grid item xs={3}>
        <Button
          variant="contained" color="primary"
          className="w200" fullWidth
          disabled={props.attribute.FromSupers.length > 0}
          onClick={_ => props.onDelete(props.attribute)}
          type="submit"
        >
          <DeleteForever />
        </Button>
      </Grid>
    </Grid>
  );
}
