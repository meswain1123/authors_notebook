/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  Grid,
  Button,
  List, ListItem,
  Checkbox, Tooltip
} from "@material-ui/core";
// import TextBox from "../Inputs/TextBox";


// const validate = (value, props, changeMessage) => {
//   const valid = props.templates.filter((t) => t.Name === value).length === 0;
//   changeMessage(valid ? "" : "This Template Name is already in use");
//   return valid;
// };

// const saveTemplate = (templateName, typeIDs, props, changeMessage, changeWaiting) => {
//   changeWaiting(true);
//   const template = {
//     _id: null,
//     Name: templateName.trim(),
//     typeIDs: typeIDs,
//     worldID: props.world._id
//   };

//   // Calls API
//   props.api
//     .createTemplate(template)
//     .then(res => {
//       if (res.error === undefined) {
//         changeMessage("Success");
//         setTimeout(() => {
//           changeWaiting(false);
//           props.onSave();
//         }, 500);
//       } else {
//         changeMessage(res.error);
//         changeWaiting(false);
//       }
//     })
//     .catch(err => console.log(err));
// };

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
//     typeIDs.splice(index);
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

export default function TemplatesModal(props) {
  const [selectedTemplate, changeSelectedTemplate] = useState({});
  const [selectedTemplateIDs, changeSelectedTemplates] = useState([]);

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>
        Click a template to view its contents.
        Select the templates you want to import into your world.
        Any which have types or attributes with the same names 
        (either with each other or with what you already have in your world), 
        we will try to merge them if possible.  
        If it's not, then we will append the names of them with 
        the names of the templates they came from, and you can 
        resolve it yourself afterward.
      </Grid>
      <Grid item container spacing={1} direction="row">
        <Grid item xs={3}>
          Templates:
          <List>
            { props.templates.map((template, key) => {
              return (
                <ListItem key={key}>
                  <Checkbox
                    checked={selectedTemplateIDs.includes(template._id)}
                    onChange={ _ => {
                      const newSelectedTemplateIDs = [...selectedTemplateIDs];
                      newSelectedTemplateIDs.push(template._id);
                      changeSelectedTemplates(newSelectedTemplateIDs);
                    }}
                    name={`include_template_${template._id}`}
                    color="primary"
                  />
                  <Tooltip title={`Details for ${template.Name}`}>
                    <Button 
                      fullWidth variant="contained" color="primary" 
                      onClick={ _ => {
                        changeSelectedTemplate(template);
                      }}>
                      {template.Name}
                    </Button>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        </Grid>
        { selectedTemplate._id !== undefined && 
          <Grid item xs={9} container spacing={1} direction="column">
            <Grid item>
              {selectedTemplate.Name}
            </Grid>
            <Grid item>
              Types:
            </Grid>
            { selectedTemplate.Types.map((type, typeKey) => {
              return (
                <Grid item key={typeKey} container spacing={1} direction="row">
                  <Grid item xs={12} sm={3}>
                    {type.Name}
                  </Grid>
                  <Grid item xs={12} sm={9}>
                    Attributes (
                      { type.Attributes.map((a, aKey) => {
                        return (
                          <span key={aKey}>{aKey > 0 && <span>,&nbsp;</span>}{selectedTemplate.Attributes.filter(attr => attr.attrID === a.attrID)[0].Name}</span>
                        );
                      })}
                    )
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
        }
      </Grid>
      <Grid item container spacing={1} direction="row">
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={selectedTemplateIDs.length === 0}
            onClick={_ => {
              props.onSubmit(selectedTemplateIDs);
            }}
          >
            Submit
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
