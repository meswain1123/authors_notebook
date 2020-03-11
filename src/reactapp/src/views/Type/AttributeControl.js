/* eslint-disable no-use-before-define */
import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import DeleteForever from "@material-ui/icons/DeleteForever";
import Button from "@material-ui/core/Button";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ChipInput from "material-ui-chip-input";

const handleTypeChange = (e, props) => {
  const attr = props.attribute;
  attr["Type"] = e.target.value;
  props.onChange(attr);
};

const handleType2Change = (e, props) => {
  const attr = props.attribute;
  attr["Type2"] = e.target.value;
  if (e.target.value === "new") {
    function respond(newType) {
      console.log(newType);
    }
    props.onNewType(respond);
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
  const type =
    props.attribute.Type === "" ? attributeTypes[0] : props.attribute.Type;

  const listTypes = [
    "Text",
    "Options", 
    "Type"
  ];

  return (
    <Grid container spacing={1} direction="row">
      <Grid item sm={3} xs={12}>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="AttrName">Name</InputLabel>
          <OutlinedInput
            disabled={props.attribute.FromSupers.length > 0}
            id="AttrName"
            name="AttrName"
            type="text"
            error={props.error}
            value={name}
            autoComplete="off"
            onChange={e => {
              changeName(e.target.value);
            }}
            onBlur={e => {
              const attr = {
                index: props.attribute.index,
                Name: name,
                Type: props.attribute.Type,
                Options: props.attribute.Options,
                ListType: props.attribute.ListType,
                FromSupers: props.attribute.FromSupers,
                Type2: props.attribute.Type2,
                AttributeTypes: props.attribute.AttributeTypes
              };
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
            disabled={props.attribute.FromSupers.length > 0} 
            value={props.attribute.Type}
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
        {type === "Options" ? (
          <ChipInput
            variant="outlined"
            disabled={props.attribute.FromSupers.length > 0}
            defaultValue={props.attribute.Options}
            onChange={chips => handleOptionsChange(chips, props)}
          />
        ) : type === "Type" ? (
          <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor="type2" id="type2-label">
              Defined Type
            </InputLabel>
            <Select
              labelId="type2-label"
              id="type2"
              disabled={props.attribute.FromSupers.length > 0} 
              value={props.attribute.Type2}
              onChange={e => {handleType2Change(e, props)}}
              fullWidth
              labelWidth={100}
            >
              <MenuItem value="new">+ Create New Type</MenuItem>
              {props.types.map((type, i) => {
                return (<MenuItem key={i} value={type._id}>{type.Name}</MenuItem>);
              })}
            </Select>
          </FormControl>
        ) : type === "List" ? (
          <Grid container spacing={1} direction="column">
            <Grid item>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="list-type" id="list-type-label">
                  List Type
                </InputLabel>
                <Select
                  labelId="list-type-label"
                  id="list-type"
                  disabled={props.attribute.FromSupers.length > 0} 
                  value={props.attribute.ListType}
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
                    <InputLabel htmlFor="type2" id="type2-label">
                      Defined Type
                    </InputLabel>
                    <Select
                      labelId="type2-label"
                      id="type2"
                      disabled={props.attribute.FromSupers.length > 0} 
                      value={props.attribute.Type2}
                      onChange={e => {handleType2Change(e, props)}}
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
                    disabled={props.attribute.FromSupers.length > 0}
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
      <Grid item sm={3} xs={12}>
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
