
/* eslint-disable no-use-before-define */
import React from "react";

import {
  Grid,
  // Button,
  // List, ListItem,
  // Checkbox, Tooltip
} from "@material-ui/core";

/**
 * This control displays everything for the thing which is passed to it.
 */

export default function ThingSummary(props) {
  let types = props.types.filter(t => props.thing.TypeIDs.includes(t.typeID));
  const thing = props.thing;
  const things = props.things;
  if (thing.typeID === undefined) {
    thing.thingID = thing._id;
  }
  types.forEach(t => {
    if (t.typeID === undefined) {
      t.typeID = t._id;
    }
  });
  things.forEach(t => {
    if (t.thingID === undefined) {
      t.thingID = t._id;
    }
  });

  return (
    <Grid item container spacing={1} direction="column">
      <Grid item>
        {thing.Name}
      </Grid>
      { types.length > 0 &&
        <Grid item>
          Types (
            { types.map((t, key) => {
              return (
                <span key={key}>
                  {key > 0 && <span>,&nbsp;</span>}
                  {t.Name}
                </span>
              );
            })}
          )
        </Grid>
      }
      <Grid item>
        Attributes (
          { thing.Attributes.map((a, aKey) => {
            const attribute = props.attributesByID[a.attrID];
            let attributeValue = ""; 
            if (attribute.AttributeType === "Type") {
              attributeValue = things.filter(t => t.thingID === a.Value)[0].Name;
            } else if (attribute.AttributeType === "List") {
              for (let i = 0; i < a.ListValues.length; i++) {
                if (i > 0) {
                  attributeValue += ", ";
                }
                if (attribute.ListType === "Type") {
                  attributeValue += things.filter(t => t.thingID === a.ListValues[i])[0].Name;
                } else {
                  attributeValue += a.ListValues[i];
                }
              }
            } else {
              attributeValue = a.Value;
            }
            return (
              <span key={aKey}>
                {aKey > 0 && <span>,&nbsp;</span>}
                {attribute.Name}&nbsp;({attributeValue})
              </span>
            );
          })}
        )
      </Grid>
    </Grid>
  );
}
