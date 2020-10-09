/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  Grid,
  Button,
  List, ListItem,
  Checkbox,
  Box
} from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import TextBox from "../Inputs/TextBox";
import TypeSummary from "../Displays/TypeSummary";
import ThingSummary from "../Displays/ThingSummary";


const validate = (value, props, changeMessage) => {
  const valid = props.templates.filter((t) => t.Name === value).length === 0;
  changeMessage(valid ? "" : "This Template Name is already in use");
  return valid;
};

const saveTemplate = (templateName, selected, props, changeMessage, changeWaiting) => {
  changeWaiting(true);
  const template = {
    _id: null,
    Name: templateName.trim(),
    typeIDs: selected.typeIDs,
    thingIDs: selected.thingIDs,
    worldID: props.world._id
  };

  // Calls API
  props.api
    .createTemplate(template)
    .then(res => {
      if (res.error === undefined) {
        changeMessage("Success");
        setTimeout(() => {
          changeWaiting(false);
          props.onSave();
        }, 500);
      } else {
        changeMessage(res.error);
        changeWaiting(false);
      }
    })
    .catch(err => console.log(err));
};

// const addTypeToList = (type, types, attributesByID, typeIDs) => {
//   if (!typeIDs.includes(type._id)) {
//     typeIDs.push(type._id);
//     for (let i = 0; i < type.SuperIDs.length; i++) {
//       let superType = types.filter(t => t._id === type.SuperIDs[i]);
//       if (superType.length > 0){
//         superType = superType[0];
//         typeIDs = addTypeToList(superType, types, attributesByID, typeIDs);
//       }
//     }
//     for (let i = 0; i < type.Attributes.length; i++) {
//       let attr = attributesByID[type.Attributes[i].attrID];
//       if (attr.AttributeType === "Type" || (attr.AttributeType === "List" && attr.ListType === "Type")) {
//         let attrType = types.filter(t => t._id === attr.DefinedType);
//         if (attrType.length > 0) {
//           attrType = attrType[0];
//           typeIDs = addTypeToList(attrType, types, attributesByID, typeIDs);
//         }
//       }
//     }
//   }
//   return typeIDs;
// };

// const removeTypeFromList = (type, types, attributesByID, typeIDs) => {
//   const index = typeIDs.indexOf(type._id);
//   if (index > -1) {
//     typeIDs.splice(index, 1);
//     const subTypes = types.filter(t=>t.SuperIDs.includes(type._id));
//     for (let i = 0; i < subTypes.length; i++) {
//       let subType = subTypes[i];
//       if (subType.length > 0){
//         subType = subType[0];
//         typeIDs = removeTypeFromList(subType, types, attributesByID, typeIDs);
//       }
//     }
//     const references = types.filter(t=>t.ReferenceIDs !== undefined && t.ReferenceIDs.includes(type._id));
//     for (let i = 0; i < references.length; i++) {
//       let reference = references[i];
//       typeIDs = removeTypeFromList(reference, types, attributesByID, typeIDs);
//     }
//   }
//   return typeIDs;
// };

/**
 * finished
 */
const addType = (type, types, things, attributesByID, selected) => {
  let newSelected = {...selected};
  if (!newSelected.typeIDs.includes(type._id)) {
    newSelected.typeIDs.push(type._id);
    for (let i = 0; i < type.SuperIDs.length; i++) {
      if (!newSelected.typeIDs.includes(type.SuperIDs[i])) {
        let superType = types.filter(t => t._id === type.SuperIDs[i]);
        if (superType.length > 0){
          superType = superType[0];
          newSelected = addType(superType, types, things, attributesByID, newSelected);
        }
      }
    }
    for (let i = 0; i < type.Attributes.length; i++) {
      let attr = attributesByID[type.Attributes[i].attrID];
      if (attr !== undefined) {
        if (attr.AttributeType === "Type" || (attr.AttributeType === "List" && attr.ListType === "Type")) {
          if (!newSelected.typeIDs.includes(attr.DefinedType)) {
            let attrType = types.filter(t => t._id === attr.DefinedType);
            if (attrType.length > 0) {
              attrType = attrType[0];
              newSelected = addType(attrType, types, things, attributesByID, newSelected);
            }
          }
        }
      }
    }
    if (type.Defaults !== undefined && type.Default !== null) {
      for (let i = 0; i < type.Defaults.length; i++) {
        let attr = attributesByID[type.Defaults[i].attrID];
        if (attr.AttributeType === "Type") {
          if (!newSelected.thingIDs.includes(type.Defaults[i].DefaultValue)) {
            let defaultThing = things.filter(t => t._id === type.Defaults[i].DefaultValue);
            if (defaultThing.length > 0) {
              defaultThing = defaultThing[0];
              newSelected = addThing(defaultThing, types, things, attributesByID, newSelected);
            }
          }
        } else if (attr.AttributeType === "List" && attr.ListType === "Type") {
          for (let j = 0; j < type.Defaults[i].DefaultListValues.length; j++) {
            if (!newSelected.thingIDs.includes(type.Defaults[i].DefaultListValues[j])) {
              let defaultThing = things.filter(t => t._id === type.Defaults[i].DefaultListValues[j]);
              if (defaultThing.length > 0) {
                defaultThing = defaultThing[0];
                newSelected = addThing(defaultThing, types, things, attributesByID, newSelected);
              }
            }
          }
        }
      }
    }
  }
  return newSelected;
};

/**
 * finished, dependant on removeThing
 */
const removeType = (type, types, things, attributesByID, selected) => {
  let newSelected = {...selected};
  const index = newSelected.typeIDs.indexOf(type._id);
  if (index > -1) {
    newSelected.typeIDs.splice(index, 1);
    const subTypes = types.filter(t=>t.SuperIDs.includes(type._id));
    for (let i = 0; i < subTypes.length; i++) {
      let subType = subTypes[i];
      if (subType.length > 0){
        subType = subType[0];
        newSelected = removeType(subType, types, things, attributesByID, newSelected);
      }
    }
    const references = types.filter(t=>t.ReferenceIDs !== undefined && t.ReferenceIDs.includes(type._id));
    for (let i = 0; i < references.length; i++) {
      let reference = references[i];
      newSelected = removeType(reference, types, things, attributesByID, newSelected);
    }
    const removeUs = things.filter(t => t.TypeIDs.includes(type._id));
    for (let i = 0; i < removeUs.length; i++) {
      let removeMe = removeUs[i];
      newSelected = removeThing(removeMe, types, things, attributesByID, newSelected);
    }
  }
  return newSelected;
};

/**
 * finished
 */
const addThing = (thing, types, things, attributesByID, selected) => {
  let newSelected = {...selected};
  if (!newSelected.thingIDs.includes(thing._id)) {
    newSelected.thingIDs.push(thing._id);
    for (let i = 0; i < thing.TypeIDs.length; i++) {
      const typeID = thing.TypeIDs[i];
      if (!newSelected.typeIDs.includes(typeID)) {
        let type = types.filter(t => t._id === typeID);
        if (type.length > 0) {
          type = type[0];
          newSelected = addType(type, types, things, attributesByID, newSelected);
        }
      }
    }
    for (let i = 0; i < thing.Attributes.length; i++) {
      const attr = attributesByID[thing.Attributes[i].attrID];
      if (attr.AttributeType === "Type" || (attr.AttributeType === "List" && attr.ListType === "Type")) {
        if (!newSelected.typeIDs.includes(attr.DefinedType)) {
          let attrType = types.filter(t => t._id === attr.DefinedType);
          if (attrType.length > 0) {
            attrType = attrType[0];
            newSelected = addType(attrType, types, things, attributesByID, newSelected);
          }
        }
      }
      if (attr.AttributeType === "Type") {
        const thingAttr = thing.Attributes[i];
        if (!newSelected.thingIDs.includes(thingAttr.Value)) {
          let attrThing = things.filter(t => t._id === thingAttr.Value);
          if (attrThing.length > 0) {
            attrThing = attrThing[0];
            newSelected = addThing(attrThing, types, things, attributesByID, newSelected);
          }
        }
      } else if (attr.AttributeType === "List" && attr.ListType === "Type") {
        const thingAttr = thing.Attributes[i];
        for (let j = 0; j < thingAttr.ListValues.length; j++) {
          if (!newSelected.thingIDs.includes(thingAttr.ListValues[j])) {
            let attrThing = things.filter(t => t._id === thingAttr.ListValues[j]);
            if (attrThing.length > 0) {
              attrThing = attrThing[0];
              newSelected = addThing(attrThing, types, things, attributesByID, newSelected);
            }
          }
        }
      }
    }
  }
  return newSelected;
};

/**
 * finished
 */
const removeThing = (thing, types, things, attributesByID, selected) => {
  let newSelected = {...selected};
  const index = newSelected.thingIDs.indexOf(thing._id);
  if (index > -1) {
    newSelected.thingIDs.splice(index, 1);
    const typesWithDefault = types.filter(t=>t.Defaults.filter(d => d.DefaultValue === thing._id || d.DefaultListValues.includes(thing._id)).length > 0);
    for (let i = 0; i < typesWithDefault.length; i++) {
      let typeWithDefault = typesWithDefault[i];
      newSelected = removeType(typeWithDefault, types, things, attributesByID, newSelected);
    }
    const references = things.filter(t=>t.ReferenceIDs !== undefined && t.ReferenceIDs.includes(thing._id));
    for (let i = 0; i < references.length; i++) {
      let reference = references[i];
      newSelected = removeThing(reference, types, things, attributesByID, newSelected);
    }
  }
  return newSelected;
};

export default function TemplateModal(props) {
  const valid = props.templates.filter((t) => t.Name === props.world.Name).length === 0;
  const [name, changeName] = useState(props.world.Name);
  const [message, changeMessage] = useState("");
  const [nameMessage, changeNameMessage] = useState(valid ? "" : "This Template Name is already in use");
  const [waiting, changeWaiting] = useState(false);
  const [selected, changeSelected] = useState({ typeIDs: [], thingIDs: [] });
  const [nameValid, changeValid] = useState(valid);
  const [expandedPanel, changeExpanded] = useState("");
  const [selectedType, changeSelectedType] = useState({});
  const [selectedThing, changeSelectedThing] = useState({});

  const typeless = props.things.filter(thing => thing.Types.length === 0);
  const selectedTypeless = typeless.filter(thing => selected.thingIDs.includes(thing._id));
  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        Create a template for use in other projects based on this one.
        The template will be usable by any user.
      </Grid>
      <Grid item>
        <TextBox 
          Value={name} 
          fieldName="Template Name" 
          message={nameMessage}
          onBlur={n => {
            changeName(n);
            changeValid(validate(n, props, changeNameMessage));
          }}
          labelWidth={110}/>
      </Grid>
      <Grid item style={{color: "red"}}>
        {message}
      </Grid>
      <Grid item>
        Choose which data you want to include in the template.  
        Dependencies will automatically be checked/unchecked as appropriate.
      </Grid>
      <Grid item container spacing={1} direction="row">
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            disabled={waiting}
            onClick={_ => {
              changeWaiting(true);
              let newSelected = {...selected};
              for (let i = 0; i < props.types.length; i++) {
                newSelected = addType(props.types[i], props.types, props.things, props.attributesByID, newSelected);
              }
              changeSelected(newSelected);
              changeWaiting(false);
            }}
          >
            { waiting ? 
              <span>Please Wait</span> 
            : 
              <span><Checkbox disabled checked="checked" color="default" /> All Types</span>
            }
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            color="primary"
            disabled={waiting}
            onClick={_ => {
              changeWaiting(true);
              const typeIDs = [];
              props.types.forEach(t => {
                typeIDs.push(t._id);
              });
              const thingIDs = [];
              props.things.forEach(t => {
                thingIDs.push(t._id);
              });
              const newSelected = {
                typeIDs,
                thingIDs
              };
              changeSelected(newSelected);
              changeWaiting(false);
            }}
          >
            { waiting ? 
              <span>Please Wait</span> 
            : 
              <span><Checkbox disabled checked="checked" color="default" /> All</span>
            }
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            style={{ marginLeft: "4px"}}
            variant="contained"
            color="primary"
            disabled={waiting}
            onClick={_ => {
              changeSelected({ typeIDs: [], thingIDs: [] });
            }}
          >
            { waiting ? 
              <span>Please Wait</span> 
            : 
              <span><Checkbox color="default" disabled /> All</span>
            }
          </Button>
        </Grid>
      </Grid>
      <Grid item container spacing={1} direction="row">
        <Grid item xs={6}>
          <Box style={{ height: "300px", overflowY: "scroll", overflowX: "hidden" }}>
            <Grid container spacing={1} direction="column">
              { props.types.map((type, i) => {
                const things = props.things.filter(thing => thing.TypeIDs.includes(type._id));
                const selectedThings = things.filter(thing => selected.thingIDs.includes(thing._id));
                return (
                  <Grid key={i} item container spacing={0} direction="column">
                    <Grid item>
                      {expandedPanel === type._id ? 
                        <Button 
                          onClick={_ => {changeExpanded("")}}>
                          <KeyboardArrowDownIcon/>
                        </Button>
                      :
                        <Button 
                          onClick={_ => {changeExpanded(type._id)}}>
                          <KeyboardArrowRightIcon/>
                        </Button>
                      }
                      <Checkbox
                        checked={selected.typeIDs.includes(type._id)}
                        onChange={ e => {
                          if (!waiting) {
                            changeWaiting(true);
                            let newSelected = {...selected};
                            if (e.target.checked) {
                              newSelected = addType(type, props.types, props.things, props.attributesByID, newSelected);
                            } else {
                              newSelected = removeType(type, props.types, props.things, props.attributesByID, newSelected);
                            }
                            changeSelected(newSelected);

                            changeWaiting(false);
                          }
                        }}
                        name={`include_type_${type._id}`}
                        color="primary"
                      />
                      <Button 
                        // fullWidth 
                        style={{ width: "200px" }}
                        variant="contained" 
                        color="primary" 
                        onClick={ _ => {
                          changeSelectedType(type);
                          changeSelectedThing({});
                        }}>
                        {`${type.Name} (${selectedThings.length}/${things.length})`}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={waiting}
                        style={{ marginLeft: "4px" }}
                        onClick={_ => {
                          changeWaiting(true);
                          let newSelected = {...selected};
                          things.forEach(t => {
                            newSelected = addThing(t, props.types, props.things, props.attributesByID, newSelected);
                          });
                          changeSelected(newSelected);
                          changeWaiting(false);
                        }}
                      >
                        { waiting ? 
                          <span>Please Wait</span> 
                        : 
                          <span><Checkbox disabled checked="checked" color="default" /> All</span>
                        }
                      </Button>
                    </Grid>
                    {expandedPanel === type._id &&
                      <Grid item>
                        <List style={{ marginLeft: "50px", maxWidth: "380px" }}>
                          {
                            things.map((thing, j) => {
                              return (
                                <ListItem key={j}>
                                  <Checkbox
                                    checked={selected.thingIDs.includes(thing._id)}
                                    onChange={ e => {
                                      if (!waiting) {
                                        changeWaiting(true);
                                        let newSelected = {...selected};
                                        if (e.target.checked) {
                                          newSelected = addThing(thing, props.types, props.things, props.attributesByID, newSelected);
                                        } else {
                                          newSelected = removeThing(thing, props.types, props.things, props.attributesByID, newSelected);
                                        }
                                        changeSelected(newSelected);

                                        changeWaiting(false);
                                      }
                                    }}
                                    name={`include_thing_${thing._id}`}
                                    color="primary"
                                  />
                                  <Button 
                                    style={{ width: "200px" }}
                                    variant="contained" 
                                    color="primary" 
                                    onClick={ _ => {
                                      changeSelectedType({});
                                      changeSelectedThing(thing);
                                      // changeSelectedTemplate(template);
                                    }}>
                                    {`${thing.Name}`}
                                  </Button>
                                </ListItem>
                              );
                            })
                          }
                        </List>
                      </Grid>
                    }
                  </Grid>
                );
              })}
              { typeless.length > 0 &&
                <Grid item>
                  {expandedPanel === "OTHER" ? 
                    <Button 
                      onClick={_ => {changeExpanded("")}}>
                      <KeyboardArrowDownIcon/>
                    </Button>
                  :
                    <Button 
                      onClick={_ => {changeExpanded("OTHER")}}>
                      <KeyboardArrowRightIcon/>
                    </Button>
                  }
                  <span className={"MuiTypography-root MuiListItemText-primary MuiTypography-body1"}>
                    {`Other Things (${selectedTypeless.length}/${typeless.length})`}
                  </span>
                </Grid>
              }
              {expandedPanel === "OTHER" &&
                <Grid item>
                  <List style={{ maxWidth: "380px" }}>
                    {
                      typeless.map((thing, j) => {
                        return (
                          <ListItem key={j}>
                            <Grid container spacing={1} direction="row">
                              <Grid item xs={10}>
                                <Button 
                                  fullWidth variant="contained" color="primary" 
                                  onClick={ _ => {
                                    changeSelectedType({});
                                    changeSelectedThing(thing);
                                  }}>
                                  {thing.Name}
                                </Button>
                              </Grid>
                            </Grid>
                          </ListItem>
                        );
                      })
                    }
                  </List>
                </Grid>
              }
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box style={{ height: "300px", overflowY: "scroll", overflowX: "hidden" }}>
            { selectedType._id !== undefined ? 
              <TypeSummary type={selectedType} types={props.types} things={props.things} attributesByID={props.attributesByID} />
            : selectedThing._id !== undefined &&
              <ThingSummary thing={selectedThing} types={props.types} things={props.things} attributesByID={props.attributesByID} />
            }
          </Box>
        </Grid>
      </Grid>
      <Grid item container spacing={1} direction="row">
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={waiting || !nameValid || selected.typeIDs.length === 0}
            onClick={_ => {
              changeWaiting(true);
              saveTemplate(name, selected, props, changeMessage, changeWaiting);
            }}
          >
            {waiting ? "Please Wait" : "Submit"}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={(e) => {
              if (props.onCancel !== undefined && props.onCancel !== null)
                props.onCancel();
            }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
