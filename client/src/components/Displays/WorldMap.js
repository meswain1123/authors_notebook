
/* eslint-disable no-use-before-define */
import React from "react";

import {
  Grid,
  // Button,
  // List, ListItem,
  // Checkbox, Tooltip
} from "@material-ui/core";
import TypeSummary from "./TypeSummary";
import ThingSummary from "./ThingSummary";

/**
 * This control displays everything for the world or template which
 * is passed to it.
 * 
 * Types:
 * Type Name - Attributes: Attribute1 Name, Attribute2 Name, etc. - Defaults: etc.
 * 
 * Things:
 * Thing Name - Types: Type1Name, etc.
 */

export default function WorldMap(props) {
  const dingus = {...props.dingus};
  const attributesByID = {};
  if (props.Attributes !== undefined) {
    dingus.Attributes = [...props.Attributes];
  }
  dingus.Attributes.forEach(a => {
    if (a.attrID === undefined) {
      a.attrID = a._id;
    }
    attributesByID[a.attrID] = a;
  });
  if (props.Types !== undefined) {
    dingus.Types = [...props.Types];
    dingus.Types.forEach(t => {
      if (t.typeID === undefined) {
        t.typeID = t._id;
      }
    });
  }
  if (dingus.Types === undefined) {
    dingus.Types = [];
  }
  if (props.Things !== undefined) {
    dingus.Things = [...props.Things];
    dingus.Things.forEach(t => {
      if (t.thingID === undefined) {
        t.thingID = t._id;
      }
    });
  } 
  if (dingus.Things === undefined) {
    dingus.Things = [];
  }
  return (
    <Grid item xs={9} container spacing={1} direction="column">
      <Grid item>
        {dingus.Name}
      </Grid>
      <Grid item>
        Types:
      </Grid>
      { dingus.Types.map((type, typeKey) => {
        return (
          <TypeSummary 
            key={typeKey} 
            type={type} 
            types={dingus.Types} 
            things={dingus.Things} 
            attributesByID={attributesByID} 
          />
        );
      })}
      { dingus.Things !== undefined && dingus.Things.length > 0 &&
        <Grid item container spacing={0} direction="column">
          <Grid item>
            Things:
          </Grid>
          { dingus.Things.map((thing, thingKey) => {
            return (
              <ThingSummary 
                key={thingKey} 
                thing={thing} 
                types={dingus.Types} 
                things={dingus.Things} 
                attributesByID={attributesByID} 
              />
              // <Grid item key={thingKey} container spacing={1} direction="row">
              //   <Grid item xs={12} sm={3}>
              //     {thing.Name}
              //   </Grid>
              //   <Grid item xs={12} sm={9}>
              //     Types (
              //       { thing.TypeIDs.map((typeID, typeKey) => {
              //         console.log(typeID);
              //         return (
              //           <span key={typeKey}>{typeKey > 0 && <span>,&nbsp;</span>}{dingus.Types.filter(t => t.typeID === typeID)[0].Name}</span>
              //         );
              //       })}
              //     )
              //   </Grid>
              // </Grid>
            );
          })}
        </Grid>
      }
    </Grid>
  );
}
