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
  const valid = props.types.filter((t) => t.Name === value).length === 0;
  changeMessage(valid ? "" : "This Type Name is already in use");
};

const saveNewType = (value, props, changeName, changeMessage, changeWaiting) => {
  // if (props.onSave !== undefined && props.onSave !== null)
  //   props.onSave();

  const type = {
    _id: null,
    Name: value.trim(),
    Description: "",
    SuperIDs: [],
    AttributesArr: [],
    Attributes: [],
    worldID: props.selectedWorldID,
    Major: false,
  };

  // Calls API
  props.api
    .createType(type)
    .then((res) => {
      if (res.typeID !== undefined) {
        type._id = res.typeID;
        type.Supers = [];
        // Adds to redux
        if (props.addType) props.addType(type);
        // Calls respond back to Attribute to set the type

        changeWaiting(false);
        if (props.onSave) {
          // setTimeout(() => {
          changeName("");
          props.onSave(type);
          // }, 500);
        }
        // this.state.modalSubmit(type);
        // this.setState({
        //   waiting: false,
        //   typeModalOpen: false
        // });
      } else if (res.error !== undefined) {
        // this.setState({
        //   waiting: false,
        //   message: res.error
        // });
        changeWaiting(false);
        changeMessage(res.error);
      }
    })
    .catch((err) => console.log(err));
};

export default function NewTypeModal(props) {
  const [name, changeName] = useState("");
  const [message, changeMessage] = useState("");
  const [waiting, changeWaiting] = useState(false);

  return (
    <Grid container spacing={1} direction="column">
      <Grid item>Just give the new Type a name.</Grid>
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
              saveNewType(name, props, changeName, changeMessage, changeWaiting);
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
