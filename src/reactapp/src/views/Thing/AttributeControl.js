
/* eslint-disable no-use-before-define */
import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import FormControl from '@material-ui/core/FormControl';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ChipInput from 'material-ui-chip-input';
import { Multiselect } from 'multiselect-react-dropdown';

const handleTextListChange = (e, props) => {
  const attr = props.attribute;
  attr.ListValues = e;
  props.onChange(attr);
};
const handleType2Change = (e, props, respond) => {
  // const attr = props.attribute;
  // attr["Type2"] = e.target.value;
  if (e.target.value === "new") {
    function respond2(newType) {
      // attr["Type2"] = newType._id;
      // props.onChange(attr);
      respond(newType._id);
    }
    props.onNewType(respond2);
  }
  else {
    // props.onChange(attr);
    respond(e.target.value);
  }
};
const addOption = (selectedItem, props) => {
  if (selectedItem._id === "new") {
    function respond2(newType) {
      const attr = props.attribute;
      attr.ListValues.push(newType.Name);
      props.onChange(attr);
    }
    props.onNewType(respond2);
  }
  else {
    const attr = props.attribute;
    attr.ListValues.push(selectedItem.Name);
    props.onChange(attr);
  }
};
const removeOption = (selectedList, props) => {
  const attr = props.attribute;
  attr.ListValues = [];
  selectedList.forEach(o => {
    attr.ListValues.push(o.Name);
  });
  props.onChange(attr);
};
const addType = (selectedItem, props) => {
  const attr = props.attribute;
  attr.ListValues.push(selectedItem._id);
  props.onChange(attr);
};
const removeType = (selectedList, props) => {
  const attr = props.attribute;
  attr.ListValues = [];
  selectedList.forEach(o => {
    attr.ListValues.push(o._id);
  });
  props.onChange(attr);
};

export default function AttributeControl(props) {
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
    const type2 = props.types.filter(t=>t._id === props.attribute.Type2)[0];
    listOptions.push({Name: `+ Create New ${type2.Name}`, _id: "new"});
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
            id="Name"
            name="Name"
            type="text"
            error={ props.error }
            value={ value }
            autoComplete="off"
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
            id="Name"
            name="Name"
            type="number"
            error={ props.error }
            value={ value }
            autoComplete="off"
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
            onChange={ e => { handleType2Change(e, props, changeValue) } }
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
            <MenuItem value="new">+ Create New {props.types.filter(t=>t._id === props.attribute.Type2)[0].Name}</MenuItem>
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
              options={listOptions}
              selectedValues={listOptionValues}
              onSelect={(_, selectedItem) => {addOption(selectedItem, props)}}
              onRemove={(selectedList, _) => {removeOption(selectedList, props)}}
              displayValue="Name"
            />
          : props.attribute.ListType === "Type" ?
            <Multiselect
              placeholder={props.attribute.Name}
              options={listOptions}
              selectedValues={listOptionValues}
              onSelect={(_, selectedItem) => {addType(selectedItem, props)}}
              onRemove={(selectedList, _) => {removeType(selectedList, props)}}
              displayValue="Name"
            />
          : ""
          }
        </span>
      : ""
      }
    </Grid>
  );
}
