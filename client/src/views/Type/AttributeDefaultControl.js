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

import ChipInput from "material-ui-chip-input";
import { Multiselect } from "multiselect-react-dropdown";

const handleTextListChange = (e, props) => {
  const def = props.def;
  def.DefaultListValues = e;
  props.onChange(def);
};
const handleDefinedTypeChange = (e, props, respond) => {
  // const attr = props.attribute;
  // attr["DefinedType"] = e.target.value;
  if (e.target.value === "new") {
    function respond2(newThing) {
      // attr["DefinedType"] = newType._id;
      // props.onChange(attr);
      respond(newThing._id);
    }
    props.onNewThing(
      respond2,
      props.types.filter(t => t._id === props.attribute.DefinedType)[0]
    );
  } else {
    // props.onChange(attr);
    respond(e.target.value);
  }
};
const addOption = (selectedItem, props) => {
  const def = props.def;
  def.DefaultListValues.push(selectedItem.Name);
  props.onChange(def);
};
const removeOption = (selectedList, props) => {
  const def = props.def;
  def.DefaultListValues = [];
  selectedList.forEach(o => {
    def.DefaultListValues.push(o.Name);
  });
  props.onChange(def);
};
const addType = (selectedItem, props) => {
  if (selectedItem._id === "new") {
    function respond2(newThing) {
      const def = props.def;
      def.DefaultListValues.push(newThing._id);
      props.onChange(def);
    }
    props.onNewThing(
      respond2,
      props.types.filter(t => t._id === props.attribute.DefinedType)[0]
    );
  } else {
    const def = props.def;
    def.DefaultListValues.push(selectedItem._id);
    props.onChange(def);
  }
};
const removeType = (selectedList, props) => {
  const def = props.def;
  def.DefaultListValues = [];
  selectedList.forEach(o => {
    def.DefaultListValues.push(o._id);
  });
  props.onChange(def);
};

export default function AttributeDefaultControl(props) {
  // I'm passing in attribute and def.
  const [value, changeValue] = useState(props.def.DefaultValue);
  const attributeType = props.attribute.AttributeType === "" ? "Text" : props.attribute.AttributeType;
  
  const listOptions = [];
  const listOptionValues = [];
  if (attributeType === "List" && props.attribute.ListType === "Options") {
    props.attribute.Options.forEach(o => {
      listOptions.push({ Name: o });
    });
    props.def.DefaultListValues.forEach(o => {
      listOptionValues.push({ Name: o });
    });
  } else if (attributeType === "List" && props.attribute.ListType === "Type") {
    const definedType = props.types.filter(t => t._id === props.attribute.DefinedType)[0];
    listOptions.push({ Name: `+ Create New ${definedType.Name}`, _id: "new" });
    props.things
      .filter(t => t.TypeIDs.includes(props.attribute.DefinedType))
      .forEach(t => {
        listOptions.push({ Name: t.Name, _id: t._id });
      });
    listOptions
      .filter(t => props.def.DefaultListValues.includes(t._id))
      .forEach(t => {
        listOptionValues.push(t);
      });
  }

  return (
    <Grid container spacing={1} direction="row">
      <Grid item xs={12}>
        {attributeType === "Text" ? (
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="textField">{props.attribute.Name} Default Value</InputLabel>
            <OutlinedInput
              id="textField"
              name="textField"
              type="text"
              error={props.error}
              value={value}
              autoComplete="off"
              onChange={e => {
                changeValue(e.target.value);
              }}
              onBlur={e => {
                const def = props.def;
                def.DefaultValue = value;
                props.onChange(def);
              }}
              labelWidth={props.attribute.Name.length * 9 + 100}
              fullWidth
            />
            <FormHelperText>{props.message}</FormHelperText>
          </FormControl>
        ) : attributeType === "Number" ? (
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="numField">{props.attribute.Name} Default Value</InputLabel>
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
                const def = props.def;
                def.DefaultValue = value;
                props.onChange(def);
              }}
              labelWidth={props.attribute.Name.length * 9 + 100}
              fullWidth
            />
            <FormHelperText>{props.message}</FormHelperText>
          </FormControl>
        ) : attributeType === "True/False" ? (
          <FormControlLabel
            control={
              <Checkbox checked={props.def.DefaultValue==="True"} onChange={e => {
                const def = props.def;
                def.DefaultValue = e.target.checked ? "True" : "False";
                props.onChange(def);
              }}
              color="primary" />
            }
            label={`${props.attribute.Name} Default True`}
          />
        ) : attributeType === "Options" ? (
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="options-select" id="options-select-label">
              {props.attribute.Name} Default Value
            </InputLabel>
            <Select
              labelId="options-select-label"
              id="options-select"
              value={value}
              onChange={e => {
                changeValue(e.target.value);
              }}
              onBlur={e => {
                const def = props.def;
                def.DefaultValue = value;
                props.onChange(def);
              }}
              fullWidth
              labelWidth={props.attribute.Name.length * 9 + 100}
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
              {props.attribute.Name} Default Value
            </InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={value}
              onChange={e => {
                handleDefinedTypeChange(e, props, changeValue);
              }}
              onBlur={e => {
                const def = props.def;
                def.DefaultValue = value;
                props.onChange(def);
              }}
              fullWidth
              labelWidth={props.attribute.Name.length * 9 + 100}
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
                placeholder={`${props.attribute.Name} Default Values`}
                variant="outlined"
                defaultValue={props.def.DefaultListValues}
                onChange={chips => handleTextListChange(chips, props)}
              />
            ) : props.attribute.ListType === "Options" ? (
              <Multiselect
                placeholder={`${props.attribute.Name} Default Values`}
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
                placeholder={`${props.attribute.Name} Default Values`}
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
    </Grid>
  );
}
