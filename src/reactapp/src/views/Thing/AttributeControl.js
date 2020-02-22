
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
// import Dropdown from "react-bootstrap/Dropdown";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import useAutocomplete from '@material-ui/lab/useAutocomplete';
// import CheckIcon from '@material-ui/icons/Check';
// import CloseIcon from '@material-ui/icons/Close';
// import Checkbox from "@material-ui/core/Checkbox";
// import Button from "@material-ui/core/Button";
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
// import TextField from '@material-ui/core/TextField';
// import DeleteForever from '@material-ui/icons/DeleteForever';
// import OptionsControl from "./OptionsControl";
// import IconButton from '@material-ui/core/IconButton';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import Visibility from '@material-ui/icons/Visibility';
// import VisibilityOff from '@material-ui/icons/VisibilityOff';
import FormHelperText from '@material-ui/core/FormHelperText';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import styled from 'styled-components';
// import Autocomplete from '@material-ui/lab/Autocomplete';
import AutoCompleteComboBox from '../../components/AutoCompleteComboBox';
// import ChipInput from 'material-ui-chip-input';


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

// const handleOptionChange = (e, props) => {
//   // // console.log(e);
//   // console.log(e.target.value);
//   const attr = props.attribute;
//   attr.Value = e.target.value;
//   props.onChange(attr);
// }

// const handleOptionsChange = (e, props) => {
//   // console.log(e);
//   const attr = props.attribute;
//   attr.Options = e;
//   props.onChange(attr);
// }

// const detailsChange = (e, props) => {
//   // console.log(e);
//   // const attr = props.attribute;
//   // attr["Type"] = e.target.value;
//   // props.onChange(attr);
// }

export default function AttributeControl(props) {
  // console.log(props);
  const [value, changeValue] = useState(props.attribute.Value);
  const type = props.attribute.Type === "" ? "Text" : props.attribute.Type;

  return (
    <div>
      <div className="row bottomMargin">
        { type === "Text" ?
        <div className="col-sm-12">
          <FormControl variant="outlined"
              fullWidth>
            <InputLabel htmlFor="Name">{ props.attribute.Name }</InputLabel>
            <OutlinedInput
              // disabled={props.attribute.FromTypes.length > 0}
              id="Name"
              name="Name"
              type="text"
              error={ props.error }
              value={ value }
              autoComplete="off"
              // onChange={ e => handleUserInput(e, props.onChange) }
              // onBlur={ e => inputBlur(e, props.onBlur) }
              // onChange={ e => { props.onChange(e); changeAttribute(e); } }
              onChange={ e => { changeValue(e.target.value) } }
              // onBlur={ e => { inputBlur(e, props) } }
              onBlur={ e => {
                  const attr = {
                    index: props.attribute.index, 
                    Name: props.attribute.Name, 
                    Type: props.attribute.Type, 
                    Options: props.attribute.Options, 
                    ListType: props.attribute.ListType,
                    FromTypes: props.attribute.FromTypes,
                    Value: value
                  };
                  props.onChange(attr);
                }
              }
              labelWidth={props.attribute.Name.length * 9}
              fullWidth
            />
            <FormHelperText>{ props.message }</FormHelperText>
          </FormControl>
        </div>
        : type === "Number" ?
        <div className="col-sm-12">
          <FormControl variant="outlined"
              fullWidth>
            <InputLabel htmlFor="Name">{ props.attribute.Name }</InputLabel>
            <OutlinedInput
              // disabled={props.attribute.FromTypes.length > 0}
              id="Name"
              name="Name"
              type="number"
              error={ props.error }
              value={ value }
              autoComplete="off"
              // onChange={ e => handleUserInput(e, props.onChange) }
              // onBlur={ e => inputBlur(e, props.onBlur) }
              // onChange={ e => { props.onChange(e); changeAttribute(e); } }
              onChange={ e => { changeValue(e.target.value) } }
              // onBlur={ e => { inputBlur(e, props) } }
              onBlur={ e => {
                  const attr = {
                    index: props.attribute.index, 
                    Name: props.attribute.Name, 
                    Type: props.attribute.Type, 
                    Options: props.attribute.Options, 
                    ListType: props.attribute.ListType,
                    FromTypes: props.attribute.FromTypes,
                    Value: value
                  };
                  props.onChange(attr);
                }
              }
              labelWidth={props.attribute.Name.length * 9}
              fullWidth
            />
            <FormHelperText>{ props.message }</FormHelperText>
          </FormControl>
        </div>
        : type === "Options" ?
        <div className="col-sm-12">
          {/* <Autocomplete
            id="ac_options"
            options={props.attribute.Options}
            value={value}
            onChange={(e, value) => { changeValue(value) }}
            onBlur={ e => {
                const attr = {
                  index: props.attribute.index, 
                  Name: props.attribute.Name, 
                  Type: props.attribute.Type, 
                  Options: props.attribute.Options, 
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value
                };
                props.onChange(attr);
              }
            }
            renderInput={params => (
              <TextField {...params} label={props.attribute.Name} variant="outlined" fullWidth />
            )}
          /> */}
          <AutoCompleteComboBox 
            value={value}
            Label={props.attribute.Name}
            // displayField="Name"
            options={props.attribute.Options}
            onChange={(e, value2) => { changeValue(value2) }}
            onBlur={ (_, value2) => {
                const attr = {
                  index: props.attribute.index, 
                  Name: props.attribute.Name, 
                  Type: props.attribute.Type, 
                  Options: props.attribute.Options, 
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value
                };
                // console.log(attr);
                // console.log(props);
                props.onChange(attr);
              }
            }
          />
        </div>
        : ""
        }
      </div>

    </div>
  );
}
