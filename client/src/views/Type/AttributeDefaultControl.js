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
  const attr = props.attribute;
  attr.DefaultListValues = e;
  props.onChange(attr);
};
const handleType2Change = (e, props, respond) => {
  // const attr = props.attribute;
  // attr["Type2"] = e.target.value;
  if (e.target.value === "new") {
    function respond2(newThing) {
      // attr["Type2"] = newType._id;
      // props.onChange(attr);
      respond(newThing._id);
    }
    props.onNewThing(
      respond2,
      props.types.filter(t => t._id === props.attribute.Type2)[0]
    );
  } else {
    // props.onChange(attr);
    respond(e.target.value);
  }
};
const addOption = (selectedItem, props) => {
  const attr = props.attribute;
  attr.DefaultListValues.push(selectedItem.Name);
  props.onChange(attr);
};
const removeOption = (selectedList, props) => {
  const attr = props.attribute;
  attr.DefaultListValues = [];
  selectedList.forEach(o => {
    attr.DefaultListValues.push(o.Name);
  });
  props.onChange(attr);
};
const addType = (selectedItem, props) => {
  if (selectedItem._id === "new") {
    function respond2(newThing) {
      const attr = props.attribute;
      attr.DefaultListValues.push(newThing._id);
      props.onChange(attr);
    }
    props.onNewThing(
      respond2,
      props.types.filter(t => t._id === props.attribute.Type2)[0]
    );
  } else {
    const attr = props.attribute;
    attr.DefaultListValues.push(selectedItem._id);
    props.onChange(attr);
  }
};
const removeType = (selectedList, props) => {
  const attr = props.attribute;
  attr.DefaultListValues = [];
  selectedList.forEach(o => {
    attr.DefaultListValues.push(o._id);
  });
  props.onChange(attr);
};

export default function AttributeDefaultControl(props) {
  const [value, changeValue] = useState(props.attribute.DefaultValue);
  const type = props.attribute.Type === "" ? "Text" : props.attribute.Type;

  const listOptions = [];
  const listOptionValues = [];
  if (type === "List" && props.attribute.ListType === "Options") {
    props.attribute.Options.forEach(o => {
      listOptions.push({ Name: o });
    });
    props.attribute.DefaultListValues.forEach(o => {
      listOptionValues.push({ Name: o });
    });
  } else if (type === "List" && props.attribute.ListType === "Type") {
    const type2 = props.types.filter(t => t._id === props.attribute.Type2)[0];
    listOptions.push({ Name: `+ Create New ${type2.Name}`, _id: "new" });
    props.things
      .filter(t => t.TypeIDs.includes(props.attribute.Type2))
      .forEach(t => {
        listOptions.push({ Name: t.Name, _id: t._id });
      });
    listOptions
      .filter(t => props.attribute.DefaultListValues.includes(t._id))
      .forEach(t => {
        listOptionValues.push(t);
      });
  }

  return (
    <Grid container spacing={1} direction="row">
    <Grid item xs={12}>
      {type === "Text" ? (
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
              const attr = props.attribute;
              attr.DefaultValue = value;
              props.onChange(attr);
            }}
            labelWidth={props.attribute.Name.length * 9 + 100}
            fullWidth
          />
          <FormHelperText>{props.message}</FormHelperText>
        </FormControl>
      ) : type === "Number" ? (
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
              const attr = props.attribute;
              attr.DefaultValue = value;
              props.onChange(attr);
            }}
            labelWidth={props.attribute.Name.length * 9 + 100}
            fullWidth
          />
          <FormHelperText>{props.message}</FormHelperText>
        </FormControl>
      ) : type === "True/False" ? (
        <FormControlLabel
          control={
            <Checkbox checked={props.attribute.DefaultValue==="True"} onChange={e => {
              const attr = props.attribute;
              attr.DefaultValue = e.target.checked ? "True" : "False";
              props.onChange(attr);
            }}
            color="primary" />
          }
          label={`${props.attribute.Name} Default True`}
        />
      ) : type === "Options" ? (
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
              const attr = props.attribute;
              attr.DefaultValue = value;
              props.onChange(attr);
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
      ) : type === "Type" ? (
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="type-select" id="type-select-label">
            {props.attribute.Name} Default Value
          </InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            value={value}
            onChange={e => {
              handleType2Change(e, props, changeValue);
            }}
            onBlur={e => {
              const attr = props.attribute;
              attr.DefaultValue = value;
              props.onChange(attr);
            }}
            fullWidth
            labelWidth={props.attribute.Name.length * 9 + 100}
          >
            <MenuItem value="new">
              + Create New{" "}
              {props.types.filter(t => t._id === props.attribute.Type2)[0].Name}
            </MenuItem>
            {props.things
              .filter(t => t.TypeIDs.includes(props.attribute.Type2))
              .map((thing, i) => {
                return (
                  <MenuItem key={i} value={thing._id}>
                    {thing.Name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
      ) : type === "List" ? (
        <span>
          {props.attribute.ListType === "Text" ? (
            <ChipInput
              placeholder={`${props.attribute.Name} Default Values`}
              variant="outlined"
              defaultValue={props.attribute.DefaultListValues}
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
