
/* eslint-disable no-use-before-define */
import React from "react";

import {
  Grid,
  // Button,
  // List, ListItem,
  // Checkbox, Tooltip
} from "@material-ui/core";

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
  if (props.Attributes !== undefined) {
    dingus.Attributes = [...props.Attributes];
  }
  if (props.Types !== undefined) {
    dingus.Types = [...props.Types];
  }
  if (props.Things !== undefined) {
    dingus.Things = [...props.Things];
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
        <Grid item key={typeKey} container spacing={1} direction="row">
          <Grid item xs={12} sm={3}>
            {type.Name}
          </Grid>
          <Grid item xs={12} sm={9}>
            Attributes (
              { type.Attributes.map((a, aKey) => {
                return (
                  <span key={aKey}>{aKey > 0 && <span>,&nbsp;</span>}{dingus.Attributes.filter(attr => attr.attrID === a.attrID)[0].Name}</span>
                );
              })}
            )
          </Grid>
        </Grid>
      );
    })}
    { dingus.Things !== undefined && dingus.Things.length > 0 &&
      <Grid item container spacing={0} direction="column">
        <Grid item>
          Things:
        </Grid>
        { dingus.Things.map((thing, thingKey) => {
          return (
            <Grid item key={thingKey} container spacing={1} direction="row">
              <Grid item xs={12} sm={3}>
                {thing.Name}
              </Grid>
              <Grid item xs={12} sm={9}>
                Types (
                  { thing.TypeIDs.map((typeID, typeKey) => {
                    return (
                      <span key={typeKey}>{typeKey > 0 && <span>,&nbsp;</span>}{dingus.Types.filter(t => t._id === typeID)[0].Name}</span>
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
  );
}
