
/* eslint-disable no-use-before-define */
import React from "react";

import {
  Grid,
  // Button,
  // List, ListItem,
  // Checkbox, Tooltip
} from "@material-ui/core";

/**
 * This control displays everything for the type which is passed to it.
 */

export default function TypeSummary(props) {
  const type = props.type;
  const types = props.types;
  const things = props.things;
  if (type.typeID === undefined) {
    type.typeID = type._id;
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
  console.log(type.Defaults);
  let defaults = type.Defaults.filter(d => d.DefaultValue !== "" || d.DefaultListValues.length > 0);
  let superTypes = types.filter(t => type.SuperIDs.includes(t.typeID));
  return (
    <Grid item container spacing={1} direction="column">
      <Grid item>
        {type.Name}
      </Grid>
      { superTypes.length > 0 &&
        <Grid item>
          <div style={{ marginLeft: "10px" }}>
            Super Types (
              { superTypes.map((t, key) => {
                return (
                  <span key={key}>
                    {key > 0 && <span>,&nbsp;</span>}
                    {t.Name}
                  </span>
                );
              })}
            )
          </div>
        </Grid>
      }
      { type.Attributes.length > 0 &&
        <Grid item>
          <div style={{ marginLeft: "10px" }}>
            Attributes (
              { type.Attributes.map((a, aKey) => {
                const attribute = props.attributesByID[a.attrID];
                if (attribute !== undefined) {
                  let attributeType = ""; 
                  if (attribute.AttributeType === "Type") {
                    attributeType = `Type - ${types.filter(t => t.typeID === attribute.DefinedType)[0].Name}`;
                  } else if (attribute.AttributeType === "List") {
                    if (attribute.ListType === "Type") {
                      attributeType = `List: Type - ${types.filter(t => t.typeID === attribute.DefinedType)[0].Name}`;
                    } else {
                      attributeType = `List: ${attribute.ListType}`;
                    }
                  } else {
                    attributeType = attribute.AttributeType;
                  }
                  return (
                    <span key={aKey}>
                      {aKey > 0 && <span>,&nbsp;</span>}
                      {attribute.Name}&nbsp;({attributeType})
                    </span>
                  );
                } else {
                  return (
                    <span key={aKey}></span>
                  );
                }
              })}
            )
          </div>
        </Grid>
      }
      { defaults !== undefined && defaults.length > 0 &&
        <Grid item>
          <div style={{ marginLeft: "10px" }}>
            Defaults (
              { defaults.map((d, dKey) => {
                const attribute = props.attributesByID[d.attrID];
                if (attribute !== undefined) {
                  let defaultValue = ""; 
                  if (attribute.AttributeType === "Type") {
                    defaultValue = props.thing.filter(t => t.thingID === d.DefaultValue)[0].Name;
                  } else if (attribute.AttributeType === "List") {
                    for (let i = 0; i < d.DefaultListValues.length; i++) {
                      if (attribute.ListType === "Type") {
                        const defThing = things.filter(t => t.thingID === d.DefaultListValues[i])[0];
                        if (defThing !== undefined) {
                          if (i > 0) {
                            defaultValue += ", ";
                          }
                          defaultValue += defThing.Name;
                        }
                      } else {
                        if (i > 0) {
                          defaultValue += ", ";
                        }
                        defaultValue += d.DefaultListValues[i];
                      }
                    }
                  } else {
                    defaultValue = d.DefaultValue;
                  }
                  return (
                    <span key={dKey}>
                      {dKey > 0 && <span>,&nbsp;</span>}
                      {attribute.Name}&nbsp;({defaultValue})
                    </span>
                  );
                } else {
                  return (
                    <span key={dKey}></span>
                  );
                }
              })}
            )
          </div>
        </Grid>
      }
    </Grid>
  );
}
