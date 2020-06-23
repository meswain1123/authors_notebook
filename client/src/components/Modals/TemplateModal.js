/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  Grid,
  Button,
  List, ListItem,
  Checkbox, FormControlLabel
} from "@material-ui/core";
import TextBox from "../Inputs/TextBox";


const validate = (value, props, changeMessage) => {
  const valid = props.templates.filter((t) => t.Name === value).length === 0;
  changeMessage(valid ? "" : "This Template Name is already in use");
  return valid;
};

const saveTemplate = (templateName, typeIDs, props, changeMessage, changeWaiting) => {
  changeWaiting(true);
  const template = {
    _id: null,
    Name: templateName.trim(),
    typeIDs: typeIDs,
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

const addTypeToList = (type, types, attributesByID, typeIDs) => {
  if (!typeIDs.includes(type._id)) {
    typeIDs.push(type._id);
    for (let i = 0; i < type.SuperIDs.length; i++) {
      let superType = types.filter(t => t._id === type.SuperIDs[i]);
      if (superType.length > 0){
        superType = superType[0];
        typeIDs = addTypeToList(superType, types, attributesByID, typeIDs);
      }
    }
    for (let i = 0; i < type.Attributes.length; i++) {
      let attr = attributesByID[type.Attributes[i].attrID];
      if (attr.AttributeType === "Type" || (attr.AttributeType === "List" && attr.ListType === "Type")) {
        let attrType = types.filter(t => t._id === attr.DefinedType);
        if (attrType.length > 0) {
          attrType = attrType[0];
          typeIDs = addTypeToList(attrType, types, attributesByID, typeIDs);
        }
      }
    }
  }
  return typeIDs;
};

const removeTypeFromList = (type, types, attributesByID, typeIDs) => {
  const index = typeIDs.indexOf(type._id);
  if (index > -1) {
    typeIDs.splice(index);
    const subTypes = types.filter(t=>t.SuperIDs.includes(type._id));
    for (let i = 0; i < subTypes.length; i++) {
      let subType = subTypes[i];
      if (subType.length > 0){
        subType = subType[0];
        typeIDs = removeTypeFromList(subType, types, attributesByID, typeIDs);
      }
    }
    const references = types.filter(t=>t.ReferenceIDs !== undefined && t.ReferenceIDs.includes(type._id));
    for (let i = 0; i < references.length; i++) {
      let reference = references[i];
      typeIDs = removeTypeFromList(reference, types, attributesByID, typeIDs);
    }
  }
  return typeIDs;
};

export default function TemplateModal(props) {
  const valid = props.templates.filter((t) => t.Name === props.world.Name).length === 0;
  const [name, changeName] = useState(props.world.Name);
  const [message, changeMessage] = useState("");
  const [nameMessage, changeNameMessage] = useState(valid ? "" : "This Template Name is already in use");
  const [waiting, changeWaiting] = useState(false);
  const [typeIDs, changeTypeIDs] = useState([]);
  const [nameValid, changeValid] = useState(valid);

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        Create a template for use in other worlds based on this one.
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
        Choose which types you want to include in the template.  
        Dependent Types will automatically be checked/unchecked as appropriate.
        <List>
          <ListItem>
            <Button
              variant="contained"
              color="primary"
              disabled={waiting || typeIDs.length === props.types.length}
              onClick={_ => {
                changeWaiting(true);
                const newTypeIDs = [];
                props.types.forEach(t => {
                  newTypeIDs.push(t._id);
                });
                changeTypeIDs(newTypeIDs);
                changeWaiting(false);
              }}
            >
              {waiting ? "Please Wait" : "Check All"}
            </Button>
            <Button
              style={{ marginLeft: "4px"}}
              variant="contained"
              color="primary"
              disabled={waiting || typeIDs.length === 0}
              onClick={_ => {
                changeTypeIDs([]);
              }}
            >
              {waiting ? "Please Wait" : "Uncheck All"}
            </Button>
          </ListItem>
          { props.types.map((type, key) => {
            return (
              <ListItem key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={typeIDs.includes(type._id)}
                      onChange={ e => {
                        if (!waiting) {
                          changeWaiting(true);
                          let newTypeIDs = [...typeIDs];
                          if (e.target.checked) {
                            newTypeIDs = addTypeToList(type, props.types, props.attributesByID, newTypeIDs);
                            changeTypeIDs(newTypeIDs);
                          } else {
                            newTypeIDs = removeTypeFromList(type, props.types, props.attributesByID, newTypeIDs);
                            changeTypeIDs(newTypeIDs);
                          }
                          changeWaiting(false);
                        }
                      }}
                      name={`include_type_${type._id}`}
                      color="primary"
                    />
                  }
                  label={type.Name}
                />
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <Grid item container spacing={1} direction="row">
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={waiting || !nameValid || typeIDs.length === 0}
            onClick={_ => {
              changeWaiting(true);
              saveTemplate(name, typeIDs, props, changeMessage, changeWaiting);
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
