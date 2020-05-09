/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  Grid,
  FormControl,
  OutlinedInput,
  InputLabel,
  FormHelperText,
  // Modal,
  Button,
} from "@material-ui/core";

// const getModalStyle = () => {
//   const top = Math.round(window.innerHeight / 2) - 100;
//   const left = Math.round(window.innerWidth / 2) - 200;

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(${left}px, ${top}px)`,
//   };
// };

const validate = (value, props, changeMessage) => {
  const valid = props.things.filter((t) => t.Name === value).length === 0;
  changeMessage(valid ? "" : "This Thing Name is already in use");
};

const saveNewThing = (value, props, changeName, changeMessage, changeWaiting) => {
  // if (props.onSave !== undefined && props.onSave !== null)
  //   props.onSave();

  changeWaiting(true);
  const thing = {
    _id: null,
    Name: value.trim(),
    Description: "",
    TypeIDs: props.newThingType === undefined ? [] : [props.newThingType._id],
    // AttributesArr: this.props.selectedThing.AttributesArr,
    Attributes: [],
    worldID: props.selectedWorldID,
    ReferenceIDs: []
  };

  // Calls API
  props.api
    .createThing(thing)
    .then((res) => {
      if (res.thingID !== undefined) {
        thing._id = res.thingID;
        thing.Types = props.newThingType === undefined ? [] : [props.newThingType];
        thing.AttributesArr = [];
        // Adds to props 
        props.addThing(thing);
        // Calls respond back to Attribute to set the thing
        changeName("");
        changeWaiting(false);
        props.onSave(thing);

        // this.state.modalSubmit(thing);
        // this.setState({
        //   waiting: false, 
        //   thingModalOpen: false,
        //   Name: ""
        // });
      }
      else if (res.error !== undefined) {
        // this.setState({
        //   waiting: false, 
        //   message: res.error 
        // });
        changeMessage(res.error);
        changeWaiting(false);
      }
    })
    .catch(err => console.log(err));
};

export default function NewThingModal(props) {
  const [name, changeName] = useState("");
  const [message, changeMessage] = useState("");
  const [waiting, changeWaiting] = useState(false);

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>Just give the new {props.newThingType.Name === undefined ? "Thing" : props.newThingType.Name} a name.</Grid>
      <Grid item>(You can do the rest later.)</Grid>
      <Grid item>
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="name">Name</InputLabel>
          <OutlinedInput
            id="name"
            name="Name"
            type="text"
            autoComplete="Off"
            error={message !== ""}
            value={name}
            onChange={(e) => {
              changeName(e.target.value);
            }}
            onBlur={(e) => {
              validate(name, props, changeMessage);
            }}
            labelWidth={43}
            fullWidth
          />
          <FormHelperText>{message}</FormHelperText>
        </FormControl>
      </Grid>
      <Grid item container spacing={1} direction="row">
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={waiting}
            onClick={(e) => {
              changeWaiting(true);
              saveNewThing(name, props, changeName, changeMessage, changeWaiting);
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
