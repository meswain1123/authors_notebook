/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  Grid,
  Button,
  List, ListItem,
  Checkbox, Tooltip
} from "@material-ui/core";


export default function TemplatesModal(props) {
  const [selectedTemplate, changeSelectedTemplate] = useState({});
  const [selectedTemplateIDs, changeSelectedTemplates] = useState(props.selectedTemplateIDs === undefined ? [] : props.selectedTemplateIDs);

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
            OK
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
