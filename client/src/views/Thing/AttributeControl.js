/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  Grid,
  FormControl,
  OutlinedInput,
  InputLabel,
  FormControlLabel,
  FormHelperText,
  Select,
  MenuItem,
  Checkbox
} from "@material-ui/core";
import InfoIcon from '@material-ui/icons/Info';

import ChipInput from "material-ui-chip-input";
import { Multiselect } from "multiselect-react-dropdown";

const handleTextListChange = (e, props) => {
  const attr = props.attribute;
  attr.ListValues = e;
  props.onChange(attr);
};
const handleDefinedTypeChange = (e, props, respond) => {
  // const attr = props.attribute;
  // attr["DefinedType"] = e.target.value;
  if (e.target.value === "new") {
    // function respond2(newThing) {
    //   // attr["DefinedType"] = newType._id;
    //   // props.onChange(attr);
    //   respond(newThing._id);
    // }
    // props.onNewThing(
    //   // respond2,
    //   props.types.filter(t => t._id === props.attribute.DefinedType)[0]
    // );
    const attr = props.attribute;
    props.onNewThing(attr);
  } else {
    // props.onChange(attr);
    respond(e.target.value);
  }
};
const addOption = (selectedItem, props) => {
  const attr = props.attribute;
  attr.ListValues.push(selectedItem.Name);
  props.onChange(attr);
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
  if (selectedItem._id === "new") {
    // function respond2(newThing) {
    //   const attr = props.attribute;
    //   attr.ListValues.push(newThing._id);
    //   props.onChange(attr);
    // }
    
    setTimeout(() => {
      const attr = props.attribute;
      props.onNewThing(attr);
    }, 500);
    // props.onNewThing(
    //   // respond2,
    //   // props.types.filter(t => t._id === props.attribute.DefinedType)[0]
    //   props.attribute
    // );
  } else {
    const attr = props.attribute;
    attr.ListValues.push(selectedItem._id);
    props.onChange(attr);
  }
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
  const attributeType = props.attribute.AttributeType === "" ? "Text" : props.attribute.AttributeType;

  const listOptions = [];
  const listOptionValues = [];
  if (attributeType === "List" && props.attribute.ListType === "Options") {
    props.attribute.Options.forEach(o => {
      listOptions.push({ Name: o });
    });
    props.attribute.ListValues.forEach(o => {
      listOptionValues.push({ Name: o });
    });
  } else if (attributeType === "List" && props.attribute.ListType === "Type") {
    const definedType = props.types.filter(t => t._id === props.attribute.DefinedType)[0];
    if (definedType !== undefined) {
      listOptions.push({ Name: `+ Create New ${definedType.Name}`, _id: "new" });
      props.things
        .filter(t => t.TypeIDs.includes(props.attribute.DefinedType))
        .forEach(t => {
          listOptions.push({ Name: t.Name, _id: t._id });
        });
      listOptions
        .filter(t => props.attribute.ListValues.includes(t._id))
        .forEach(t => {
          listOptionValues.push(t);
        });
    }
  }

  return (
    <Grid item container spacing={1} direction="row">
      <Grid item xs={11}>
        {attributeType === "Text" ? (
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor={`attribute_name_${props.attribute.attrID}`}>{props.attribute.Name}</InputLabel>
            <OutlinedInput
              id={`attribute_name_${props.attribute.attrID}`}
              name={`attribute_name_${props.attribute.attrID}`}
              type="text"
              error={props.error}
              value={value}
              autoComplete="off"
              onChange={e => {
                changeValue(e.target.value);
              }}
              onBlur={e => {
                const attr = {
                  index: props.attribute.index,
                  attrID: props.attribute.attrID,
                  Name: props.attribute.Name,
                  AttributeType: props.attribute.AttributeType,
                  Options: props.attribute.Options,
                  DefinedType: props.attribute.DefinedType,
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value,
                  ListValues: props.attribute.ListValues
                };
                props.onChange(attr);
              }}
              labelWidth={props.attribute.Name.length * 9}
              fullWidth
            />
            <FormHelperText>{props.message}</FormHelperText>
          </FormControl>
        ) : attributeType === "Number" ? (
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="numField">{props.attribute.Name}</InputLabel>
            <OutlinedInput
              id="numField"
              name="numField"
              type="number"
              error={props.error}
              value={value}
              autoComplete="off"
              onChange={e => {
                changeValue(e.target.value);
              }}
              onBlur={e => {
                const attr = {
                  index: props.attribute.index,
                  attrID: props.attribute.attrID,
                  Name: props.attribute.Name,
                  AttributeType: props.attribute.AttributeType,
                  Options: props.attribute.Options,
                  DefinedType: props.attribute.DefinedType,
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value,
                  ListValues: props.attribute.ListValues
                };
                props.onChange(attr);
              }}
              labelWidth={props.attribute.Name.length * 9}
              fullWidth
            />
            <FormHelperText>{props.message}</FormHelperText>
          </FormControl>
        ) : attributeType === "True/False" ? (
          <FormControlLabel
            control={
              <Checkbox checked={props.attribute.Value==="True"} onChange={e => {
                const attr = props.attribute;
                attr.Value = e.target.checked ? "True" : "False";
                props.onChange(attr);
              }}
              color="primary" />
            }
            label={props.attribute.Name}
          />
        ) : attributeType === "Options" ? (
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="options-select" id="options-select-label">
              {props.attribute.Name}
            </InputLabel>
            <Select
              labelId="options-select-label"
              id="options-select"
              value={value}
              onChange={e => {
                changeValue(e.target.value);
              }}
              onBlur={e => {
                const attr = {
                  index: props.attribute.index,
                  attrID: props.attribute.attrID,
                  Name: props.attribute.Name,
                  AttributeType: props.attribute.AttributeType,
                  Options: props.attribute.Options,
                  DefinedType: props.attribute.DefinedType,
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value,
                  ListValues: props.attribute.ListValues
                };
                props.onChange(attr);
              }}
              fullWidth
              labelWidth={props.attribute.Name.length * 9}
            >
              {props.attribute.Options.map((option, i) => {
                return (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        ) : attributeType === "Type" ? (
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="type-select" id="type-select-label">
              {props.attribute.Name}
            </InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={value}
              onChange={e => {
                handleDefinedTypeChange(e, props, changeValue);
              }}
              onBlur={e => {
                const attr = {
                  index: props.attribute.index,
                  attrID: props.attribute.attrID,
                  Name: props.attribute.Name,
                  AttributeType: props.attribute.AttributeType,
                  Options: props.attribute.Options,
                  DefinedType: props.attribute.DefinedType,
                  ListType: props.attribute.ListType,
                  FromTypes: props.attribute.FromTypes,
                  Value: value,
                  ListValues: props.attribute.ListValues
                };
                props.onChange(attr);
              }}
              fullWidth
              labelWidth={props.attribute.Name.length * 9}
            >
              <MenuItem value="new">
                + Create New{" "}
                {props.types.filter(t => t._id === props.attribute.DefinedType)[0].Name}
              </MenuItem>
              {props.things
                .filter(t => t.TypeIDs.includes(props.attribute.DefinedType))
                .map((thing, i) => {
                  return (
                    <MenuItem key={i} value={thing._id}>
                      {thing.Name}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        ) : attributeType === "List" ? (
          <span>
            {props.attribute.ListType === "Text" ? (
              <ChipInput
                placeholder={props.attribute.Name}
                variant="outlined"
                defaultValue={props.attribute.ListValues}
                onChange={chips => handleTextListChange(chips, props)}
              />
            ) : props.attribute.ListType === "Options" ? (
              <Multiselect
                placeholder={props.attribute.Name}
                options={listOptions}
                selectedValues={listOptionValues}
                onSelect={(_, selectedItem) => {
                  addOption(selectedItem, props);
                }}
                onRemove={(selectedList, _) => {
                  removeOption(selectedList, props);
                }}
                displayValue="Name"
              />
            ) : props.attribute.ListType === "Type" ? (
              <Multiselect
                placeholder={props.attribute.Name}
                options={listOptions}
                selectedValues={listOptionValues}
                onSelect={(_, selectedItem) => {
                  addType(selectedItem, props);
                }}
                onRemove={(selectedList, _) => {
                  removeType(selectedList, props);
                }}
                displayValue="Name"
              />
            ) : (
              ""
            )}
          </span>
        ) : (
          ""
        )}
      </Grid>
      <Grid item xs={1}>
        <InfoIcon
          style={{ cursor: "pointer" }}
          onClick={ _ => {
            props.infoModal(props.attribute);
          }} 
        />
      </Grid>
    </Grid>
  );
}
