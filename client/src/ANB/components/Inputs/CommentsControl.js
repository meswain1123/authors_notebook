/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import {
  FormControl,
  OutlinedInput,
  InputLabel,
  Grid,
  Button
} from "@material-ui/core";
import CommentControl from "./CommentControl";
import TextBox from "./TextBox";


/**
 * <p>First Reply <a href="/type/details/5e7694ce7fc0e1501c57f7cb" rel="noopener noreferrer" target="_blank">Completed Item</a></p><p><br></p>
 * gets translated to 
 * <p>First Reply <a href="/type/details/5e7694ce7fc0e1501c57f7cb" rel="noopener noreferrer" target="_blank">Completed Item</a></p>
 */
const cleanWYSIWYG = (str) => {
  if (str.endsWith("<p><br></p>")) {
    str = str.substring(0, str.length - 11);
  }
  return str;
}

const saveComment = (text, props, changeWaiting, comments, changeComments, changeValue) => {
  changeWaiting(true);
  const comment = {
    _id: null,
    time: new Date(),
    userID: props.user._id,
    worldID: props.world._id,
    objectType: props.objectType,
    objectID: props.object._id,
    text: cleanWYSIWYG(text),
    votes: {},
    replies: []
  };

  // Calls API
  props.api
    .addComment(comment)
    .then(res => {
      if (res.error === undefined) {
        comment._id = res.commentID;
        comment.user = props.user;
        comment.voteSum = 0;
        const newComments = [...comments];
        newComments.push(comment);
        changeComments(newComments);
        changeValue("");
      } else {
        console.log(res.error);
      }
      changeWaiting(false);
    })
    .catch(err => console.log(err));
};

const prepComment = (comment, allUsers) => {
  comment.user = allUsers.filter(u => u._id === comment.userID)[0];
  if (comment.user === undefined || comment.user === null) {
    comment.user = {
      _id: comment.userID,
      username: "Unknown"
    }
  }
  comment.time = new Date(comment.time);
  comment.voteSum = Object.values(comment.votes).reduce((total, vote) => total + vote, 0);
  comment.replies.forEach(r => {
    prepComment(r, allUsers);
  });
}

export default function CommentsControl(props) {
  const [value, changeValue] = useState("");
  const [waiting, changeWaiting] = useState(false);
  const [comments, changeComments] = useState([]);
  const [loadComments, changeLoadComments] = useState(true);
  
  if (loadComments && props.allUsers.length > 0) {
    changeLoadComments(false);
    setTimeout(() => {
      props.api.getComments(props.world._id, props.objectType, props.object._id).then(res => {
        res.comments.forEach(comment => {
          prepComment(comment, props.allUsers);
        });
        changeComments(res.comments);
      });
    }, 500);
  }

  return (
    <Grid container spacing={1} direction="column">
      { props.objectType !== "General" &&
        <Grid item>
          <b>Comments:</b>
        </Grid>
      }
      { comments.map((comment, key) => {
        return (
          <Grid item key={key} container spacing={1} direction="column">
            <CommentControl 
              comment={comment} 
              rootComment={comment}
              user={props.user} 
              world={props.world}
              object={props.object}
              objectType={props.objectType}
              allUsers={props.allUsers} 
              api={props.api} 
              changeComments={newComments => {
                changeComments(newComments);
              }} 
              changeWaiting={changeWaiting}
              suggestions={props.suggestions}
            />
          </Grid>
        );
      })}
      { props.objectType === "General" && comments.length === 0 ? 
        <Grid item>
          No discussions yet
        </Grid>
      : comments.length === 0 &&
        <Grid item>
          No comments yet
        </Grid>
      }
      { !waiting &&
        <Grid item>
          { (props.user !== null && (props.world.Owner === props.user._id || (props.world.Collaborators !== undefined && props.world.Collaborators.filter(c=> c.userID === props.user._id && c.type === "collab").length === 0))) ?
            <TextBox 
              Value={value} 
              fieldName="New Comment" 
              multiline={true}
              onChange={comment => {
                changeValue(comment);
              }}
              onBlur={comment => {
                changeValue(comment);
              }}
              options={props.suggestions}
              labelWidth={110}
            />
          : (props.user !== null && props.objectType === "General") ?
            <TextBox 
              Value={value} 
              fieldName="New Discussion" 
              multiline={true}
              onBlur={desc => {
                changeValue(desc);
              }}
              options={props.suggestions}
              labelWidth={110}
            />
          : (props.user === null && props.objectType === "General") ?
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="fake_comments_label">
                You have to log in to start a discussion
              </InputLabel>
              <OutlinedInput
                id="fake_comments_label"
                name="fake_comments_label"
                type="text"
                autoComplete="Off"
                disabled={true}
                fullWidth
              />
            </FormControl>
          :
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="fake_comments_label">
                You have to log in to leave comments
              </InputLabel>
              <OutlinedInput
                id="fake_comments_label"
                name="fake_comments_label"
                type="text"
                autoComplete="Off"
                disabled={true}
                fullWidth
              />
            </FormControl>
          }
        </Grid>
      }
      <Grid item>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          disabled={waiting || value === ""}
          onClick={_ => {
            saveComment(value, props, changeWaiting, comments, changeComments, changeValue);
          }}>
          {waiting ? "Please Wait" : "Submit"}
        </Button>
      </Grid>
    </Grid>
  );
}
