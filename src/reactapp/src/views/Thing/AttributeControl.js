
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
// import Dropdown from "react-bootstrap/Dropdown";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import useAutocomplete from '@material-ui/lab/useAutocomplete';
// import CheckIcon from '@material-ui/icons/Check';
// import CloseIcon from '@material-ui/icons/Close';
// import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import styled from 'styled-components';
// import Autocomplete from '@material-ui/lab/Autocomplete';
// import AutoCompleteComboBox from '../../components/AutoCompleteComboBox';
import ChipInput from 'material-ui-chip-input';
import { Multiselect } from 'multiselect-react-dropdown';


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

const handleTextListChange = (e, props) => {
  console.log(e);
  const attr = props.attribute;
  attr.ListValues = e;
  props.onChange(attr);
};
const addOption = (selectedItem, props) => {
  // console.log(selectedList);
  // console.log(selectedItem);
  // console.log(props);
  const attr = props.attribute;
  attr.ListValues.push(selectedItem.Name);
  props.onChange(attr);
};
const removeOption = (selectedList, props) => {
  // console.log(selectedList);
  // console.log(removedItem);
  // console.log(props);
  const attr = props.attribute;
  attr.ListValues = [];
  selectedList.forEach(o => {
    attr.ListValues.push(o.Name);
  });
  props.onChange(attr);
};
const addType = (selectedItem, props) => {
  // console.log(selectedList);
  // console.log(selectedItem);
  // console.log(props);
  const attr = props.attribute;
  attr.ListValues.push(selectedItem._id);
  props.onChange(attr);
};
const removeType = (selectedList, props) => {
  // console.log(selectedList);
  // console.log(removedItem);
  // console.log(props);
  const attr = props.attribute;
  attr.ListValues = [];
  selectedList.forEach(o => {
    attr.ListValues.push(o._id);
  });
  props.onChange(attr);
};

export default function AttributeControl(props) {
  console.log(props);
  const [value, changeValue] = useState(props.attribute.Value);
  const type = props.attribute.Type === "" ? "Text" : props.attribute.Type;

  const listOptions = [];
  const listOptionValues = [];
  if (type === "List" && props.attribute.ListType === "Options") {
    props.attribute.Options.forEach(o => {
      listOptions.push({Name: o});
    });
    props.attribute.ListValues.forEach(o => {
      listOptionValues.push({Name: o});
    });
  }
  else if (type === "List" && props.attribute.ListType === "Type") {
    props.things.filter(t=>t.TypeIDs.includes(props.attribute.Type2)).forEach(t => {
      listOptions.push({Name: t.Name, _id: t._id});
    });
    listOptions.filter(t=>props.attribute.ListValues.includes(t._id)).forEach(t => {
      listOptionValues.push(t);
    });
  }

  return (
    <Grid item>
      { type === "Text" ?
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
                  Type2: props.attribute.Type2,
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value,
                  ListValues: props.attribute.ListValues
                };
                props.onChange(attr);
              }
            }
            labelWidth={props.attribute.Name.length * 9}
            fullWidth
          />
          <FormHelperText>{ props.message }</FormHelperText>
        </FormControl>
      : type === "Number" ?
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
                  Type2: props.attribute.Type2,
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value,
                  ListValues: props.attribute.ListValues
                };
                props.onChange(attr);
              }
            }
            labelWidth={props.attribute.Name.length * 9}
            fullWidth
          />
          <FormHelperText>{ props.message }</FormHelperText>
        </FormControl>
      : type === "True/False" ?
        "T/F"
      : type === "Options" ?
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="options-select" id="options-select-label">
            {props.attribute.Name}
          </InputLabel>
          <Select
            labelId="options-select-label"
            id="options-select"
            value={value}
            onChange={ e => { changeValue(e.target.value) } }
            onBlur={ e => {
                const attr = {
                  index: props.attribute.index, 
                  Name: props.attribute.Name, 
                  Type: props.attribute.Type, 
                  Options: props.attribute.Options, 
                  Type2: props.attribute.Type2,
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value,
                  ListValues: props.attribute.ListValues
                };
                props.onChange(attr);
              }
            }
            fullWidth
            labelWidth={props.attribute.Name.length * 9}
          >
            {props.attribute.Options.map((option, i) => {
              return (<MenuItem key={i} value={option}>{option}</MenuItem>);
            })}
          </Select>
        </FormControl>
      : type === "Type" ?
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="type-select" id="type-select-label">
            {props.attribute.Name}
          </InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={value}
            onChange={ e => { changeValue(e.target.value) } }
            onBlur={ e => {
                const attr = {
                  index: props.attribute.index, 
                  Name: props.attribute.Name, 
                  Type: props.attribute.Type, 
                  Options: props.attribute.Options, 
                  Type2: props.attribute.Type2,
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value,
                  ListValues: props.attribute.ListValues
                };
                props.onChange(attr);
              }
            }
            fullWidth
            labelWidth={props.attribute.Name.length * 9}
          >
            {props.things.filter(t=>t.TypeIDs.includes(props.attribute.Type2)).map((thing, i) => {
              return (<MenuItem key={i} value={thing._id}>{thing.Name}</MenuItem>);
            })}
          </Select>
        </FormControl>
      : type === "List" ?
        <span> 
          { props.attribute.ListType === "Text" ?
            <ChipInput
              placeholder={props.attribute.Name}
              variant="outlined"
              defaultValue={props.attribute.ListValues}
              onChange={chips => handleTextListChange(chips, props)}
            />
          : props.attribute.ListType === "Options" ?
            <Multiselect
              placeholder={props.attribute.Name}
              options={listOptions} // Options to display in the dropdown
              selectedValues={listOptionValues} // Preselected value to persist in dropdown
              onSelect={(_, selectedItem) => {addOption(selectedItem, props)}} // Function will trigger on select event
              onRemove={(selectedList, _) => {removeOption(selectedList, props)}} // Function will trigger on remove event
              displayValue="Name" // Property name to display in the dropdown options
            />
          : props.attribute.ListType === "Type" ?
            <Multiselect
              placeholder={props.attribute.Name}
              options={listOptions} // Options to display in the dropdown
              selectedValues={listOptionValues} // Preselected value to persist in dropdown
              onSelect={(_, selectedItem) => {addType(selectedItem, props)}} // Function will trigger on select event
              onRemove={(selectedList, _) => {removeType(selectedList, props)}} // Function will trigger on remove event
              displayValue="Name" // Property name to display in the dropdown options
            />
          : ""
          }
        </span>
      : ""
      }
    </Grid>
  );
}
