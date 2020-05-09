/* eslint-disable no-use-before-define */
import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import {Delete} from "@material-ui/icons";
import {Fab, Tooltip} from "@material-ui/core";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ChipInput from "material-ui-chip-input";

const handleTypeChange = (e, props) => {
  const attr = props.attribute;
  attr["AttributeType"] = e.target.value;
  props.onChange(attr);
};

const handleDefinedTypeChange = (e, props) => {
  const attr = props.attribute;
  attr["DefinedType"] = e.target.value;
  if (e.target.value === "new") {
    // function respond(newType) {
    //   attr["DefinedType"] = newType._id;
    //   props.onChange(attr);
    // }
    // props.onNewType(respond);
    props.onNewType(attr);
  }
  else 
    props.onChange(attr);
};

const handleListTypeChange = (e, props) => {
  const attr = props.attribute;
  attr["ListType"] = e.target.value;
  props.onChange(attr);
};

const handleOptionsChange = (e, props) => {
  const attr = props.attribute;
  attr.Options = e;
  props.onChange(attr);
};

export default function AttributeControl(props) {
  const [name, changeName] = useState(props.attribute.Name);

  const attributeTypes = [
    "Text",
    "Number",
    "True/False",
    "Options", 
    "Type", 
    "List"
  ];
  const listTypes = [
    "Text",
    "Options", 
    "Type"
  ];

  const selectedType =
    props.attribute.AttributeType === undefined || props.attribute.AttributeType === null || props.attribute.AttributeType === "" ? attributeTypes[0] : props.attribute.AttributeType;

  const selectedListType =
    props.attribute.ListType === undefined || props.attribute.ListType === "" ? listTypes[0] : props.attribute.ListType;

  const selectedDefinedType =
    props.attribute.DefinedType === undefined || props.attribute.DefinedType === "" ? "" : props.attribute.DefinedType;

  let fromTypes = props.attribute.FromTypeIDs === undefined ? [] : props.types.filter(t=> props.attribute.FromTypeIDs.includes(t._id));

  return (
    <Grid container spacing={1} direction="row">
      <Grid item sm={3} xs={12}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor={`AttrName_${props.attribute.attrID}_${props.attribute.index}`}>Name</InputLabel>
          <OutlinedInput
            disabled={props.disabled}
            id={`AttrName_${props.attribute.attrID}_${props.attribute.index}`}
            name={`AttrName_${props.attribute.attrID}_${props.attribute.index}`}
            type="text"
            error={props.error}
            value={name}
            autoComplete="off"
            onChange={e => {
              changeName(e.target.value);
            }}
            onBlur={e => {
              const attr = props.attribute;
              attr.Name = name;
              // const attr = {
              //   index: props.attribute.index,
              //   Name: name,
              //   Type: props.attribute.AttributeType,
              //   Options: props.attribute.Options,
              //   ListType: props.attribute.ListType,
              //   FromSupers: props.attribute.FromSupers,
              //   DefinedType: props.attribute.DefinedType,
              //   AttributeTypes: props.attribute.AttributeTypes,
              //   DefaultValue: defaultValue,
              //   DefaultListValues: defaultListValues
              // };
              props.onChange(attr);
            }}
            labelWidth={43}
            fullWidth
          />
          <FormHelperText>{props.message}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item sm={3} xs={12}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="attribute-type" id="attribute-type-label">
            Attribute Type
          </InputLabel>
          <Select
            labelId="attribute-type-label"
            id="attribute-type"
            disabled={props.disabled}
            // disabled={props.attribute.FromSupers.length > 0} 
            value={selectedType}
            onChange={e => {handleTypeChange(e, props)}}
            fullWidth
            labelWidth={100}
          >
            {attributeTypes.map((type, i) => {
              return (<MenuItem key={i} value={type}>{type}</MenuItem>);
            })}
          </Select>
        </FormControl>
      </Grid>
      <Grid item sm={3} xs={12}>
        {selectedType === "Options" ? (
          <ChipInput
            variant="outlined"
            disabled={props.disabled}
            // disabled={props.attribute.FromSupers.length > 0}
            defaultValue={props.attribute.Options}
            onChange={chips => handleOptionsChange(chips, props)}
          />
        ) : selectedType === "Type" ? (
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="definedType" id="definedType-label">
              Defined Type
            </InputLabel>
            <Select
              labelId="definedType-label"
              id="definedType"
              disabled={props.disabled}
              // disabled={props.attribute.FromSupers.length > 0} 
              value={selectedDefinedType}
              onChange={e => {handleDefinedTypeChange(e, props)}}
              fullWidth
              labelWidth={100}
            >
              <MenuItem value="new">+ Create New Type</MenuItem>
              {props.types.map((type, i) => {
                return (<MenuItem key={i} value={type._id}>{type.Name}</MenuItem>);
              })}
            </Select>
          </FormControl>
        ) : selectedType === "List" ? (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="list-type" id="list-type-label">
                  List Type
                </InputLabel>
                <Select
                  labelId="list-type-label"
                  id="list-type"
                  disabled={props.disabled}
                  // disabled={props.attribute.FromSupers.length > 0} 
                  value={selectedListType}
                  onChange={e => {handleListTypeChange(e, props)}}
                  fullWidth
                  labelWidth={70}
                >
                  {listTypes.map((type, i) => {
                    return (<MenuItem key={i} value={type}>{type}</MenuItem>);
                  })}
                </Select>
              </FormControl>
            </Grid>
            { props.attribute.ListType === "Type" ? 
              (
                <Grid item>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel htmlFor="definedType" id="definedType-label">
                      Defined Type
                    </InputLabel>
                    <Select
                      labelId="definedType-label"
                      id="definedType"
                      disabled={props.disabled}
                      // disabled={props.attribute.FromSupers.length > 0} 
                      value={selectedDefinedType}
                      onChange={e => {handleDefinedTypeChange(e, props)}}
                      fullWidth
                      labelWidth={100}
                    >
                      <MenuItem value="new">+ Create New Type</MenuItem>
                      {props.types.map((type, i) => {
                        return (<MenuItem key={i} value={type._id}>{type.Name}</MenuItem>);
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              ) : props.attribute.ListType === "Options" ?
              (
                <Grid item>
                  <ChipInput
                    variant="outlined"
                    disabled={props.disabled}
                    // disabled={props.attribute.FromSupers.length > 0}
                    defaultValue={props.attribute.Options}
                    onChange={chips => handleOptionsChange(chips, props)}
                  />
                </Grid>
              ) : ""
            }
          </Grid>
        ) : (
          ""
        )}
      </Grid>
      <Grid item xs={3}>
        { fromTypes.length === 1 ? 
          `From Type: ${fromTypes[0].Name}`
        : fromTypes.length > 1 ?
          <span>
            From Types: 
            { fromTypes.map((type, i) => {
              return (<span key={i}>{i > 0 && ", "}{type.Name}</span>)
            })}
          </span>
        : 
          <Tooltip title={`Delete Attribute`}>
            <Fab size="small"
              color="primary"
              // disabled={props.disabled}
              // disabled={props.attribute.FromSupers.length > 0}
              onClick={_ => props.onDelete(props.attribute)}
            >
              <Delete />
            </Fab>
          </Tooltip>
        }
      </Grid>
    </Grid>
  );
}
