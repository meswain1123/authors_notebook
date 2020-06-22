/* eslint-disable no-use-before-define */
import React, { useState } from "react";

import { makeStyles } from '@material-ui/core/styles';
import {
  // FormControl,
  // OutlinedInput,
  // InputLabel,
  Grid,
  // Button,
  Typography,
  Card, CardContent, CardActions,
  IconButton, 
  // Tooltip
} from "@material-ui/core";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ReplyIcon from '@material-ui/icons/Reply';
import TextBox from "./TextBox";

const useStyles = makeStyles({
  root: {
    // maxWidth: 345,
  },
});

const vote = (comment, theVote, props) => {
  if (props.user === null) {
    return;
  }
  props.changeWaiting(true);
  if (comment.votes[props.user._id] !== undefined && comment.votes[props.user._id] !== theVote) {
    delete comment.votes[props.user._id];
  } else {
    comment.votes[props.user._id] = theVote;
  }

  const updatedComment = {...props.rootComment};
  delete updatedComment.user;
  // updatedComment.replies.forEach(r => {
  //   cleanReply(r);
  // });
  updatedComment.replies = [];
  props.rootComment.replies.forEach(r => {
    updatedComment.replies.push(cleanReply(r));
  });
  // Calls API
  props.api
    .updateComment(updatedComment)
    .then(res => {
      if (res.error === undefined) {
        props.api.getComments(props.world._id, props.objectType, props.object._id).then(res => {
          res.comments.forEach(comment => {
            prepComment(comment, props);
          });
          props.changeComments(res.comments);
          props.changeWaiting(false);
        });
      } else {
        console.log(res.error);
      }
      props.changeWaiting(false);
    })
    .catch(err => console.log(err));
};

const reply = (text, props, changeReplying, changeValue) => {
  if (props.user === null) {
    return;
  }
  props.changeWaiting(true);

  const rootComment = {...props.rootComment};
  // Need to search for the right comment
  // Actually in theory, adding it to props.comment should put it in the right place
  const comment = props.comment;
  // Then add the reply
  comment.replies.push({
    time: new Date(),
    user: props.user,
    userID: props.user._id,
    text,
    votes: {},
    voteSum: 0,
    replies: []
  });
  changeValue("");
  changeReplying(false);
  props.changeWaiting(true);

  const updatedComment = {...rootComment};
  delete updatedComment.user;
  updatedComment.replies = [];
  rootComment.replies.forEach(r => {
    updatedComment.replies.push(cleanReply(r));
  });
  // updatedComment.replies.forEach(r => {
  //   cleanReply(r);
  // });
  
  // Calls API
  props.api
    .updateComment(updatedComment)
    .then(res => {
      if (res.error === undefined) {
        props.api.getComments(props.world._id, props.objectType, props.object._id).then(res => {
          res.comments.forEach(comment => {
            prepComment(comment, props);
          });
          props.changeComments(res.comments);
          props.changeWaiting(false);
        });
      } else {
        console.log(res.error);
      }
      props.changeWaiting(false);
    })
    .catch(err => console.log(err));
};

const cleanReply = (reply) => {
  const newReply = {...reply};
  delete newReply.user;
  delete newReply.voteSum;
  newReply.replies = [];
  for (let i = 0; i < reply.replies.length; i++) {
    newReply.replies.push(cleanReply(reply.replies[i]));
  }
  return newReply;
}

const prepComment = (comment, props) => {
  comment.user = props.allUsers.filter(u => u._id === comment.userID)[0];
  comment.time = new Date(comment.time);
  comment.voteSum = Object.values(comment.votes).reduce((total, vote) => total + vote, 0);
  comment.replies.forEach(r => {
    prepComment(r, props);
  });
}

export default function CommentControl(props) {
  const classes = useStyles();

  const [value, changeValue] = useState("");
  // const [waiting, changeWaiting] = useState(false);
  const [replying, changeReplying] = useState(false);
  
  return (
    <Grid container spacing={0} direction="column">
      <Grid item>
        <Card className={classes.root}>
          <CardContent>
            <Typography variant="body2" color="textSecondary">
              {props.comment.user.username}: {props.comment.time.toLocaleDateString()} {props.comment.time.toLocaleTimeString()}
            </Typography>
            <Typography component="p">
              {props.comment.text}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            { props.user === null || props.comment.votes[props.user._id] !== 1 ?
              <IconButton 
                aria-label="upvote comment"
                onClick={_ => {
                  if (props.user !== null && (props.world.Owner === props.user._id || (props.world.Collaborators !== undefined && props.world.Collaborators.filter(c=> c.userID === props.user._id && c.type === "collab").length === 0))) {
                    vote(props.comment, 1, props);
                  }
                }}>
                <ArrowUpwardIcon />
              </IconButton>
            :
              <IconButton 
                aria-label="upvote comment"
                color="primary"
                // style={{ color: "green" }}
                onClick={_ => {
                  // vote(comment, 1, props);
                }}>
                <ArrowUpwardIcon />
              </IconButton>
            }
            <span style={{ fontWeight: "bold", color: props.user === null || props.comment.votes[props.user._id] === undefined ? "black" : props.comment.votes[props.user._id] === 1 ? "blue" : props.comment.votes[props.user._id] === -1 ? "red" : "black" }}>{props.comment.voteSum}</span>
            { props.user === null || props.comment.votes[props.user._id] !== -1 ?
              <IconButton 
                aria-label="downvote comment"
                onClick={_ => {
                  if (props.user !== null && (props.world.Owner === props.user._id || (props.world.Collaborators !== undefined && props.world.Collaborators.filter(c=> c.userID === props.user._id && c.type === "collab").length === 0))) {
                    vote(props.comment, -1, props);
                  }
                }}>
                <ArrowDownwardIcon />
              </IconButton>
            :
              <IconButton 
                aria-label="downvote comment"
                color="secondary"
                onClick={_ => {
                  // vote(comment, -1, props);
                }}>
                <ArrowDownwardIcon />
              </IconButton>
            }
            <IconButton style={{ marginLeft: "auto" }}
              onClick={_ => {
                if (props.user !== null && (props.world.Owner === props.user._id || (props.world.Collaborators !== undefined && props.world.Collaborators.filter(c=> c.userID === props.user._id && c.type === "collab").length === 0))) {
                  // Open a reply box under the card
                  changeReplying(!replying);
                }
              }}
              aria-label="reply">
              <ReplyIcon />
            </IconButton>
          </CardActions>
        </Card>
      </Grid>

      { props.comment.replies.length > 0 &&
        <Grid item container spacing={0} direction="row">
          <Grid item xs={2}>&nbsp;</Grid>
          <Grid item xs={10} container spacing={0} direction="column">
            {props.comment.replies.map((reply, key) => {
              return (
                <Grid item key={key} style={{ marginTop: "4px" }}>
                  <CommentControl 
                    comment={reply} 
                    user={props.user} 
                    world={props.world}
                    object={props.object}
                    objectType={props.objectType}
                    api={props.api}
                    rootComment={props.rootComment}
                    allUsers={props.allUsers} 
                    changeComments={newComments => {
                      props.changeComments(newComments);
                    }} 
                    changeWaiting={newWaiting => {
                      props.changeWaiting(newWaiting);
                    }}
                    suggestions={props.suggestions}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      }
      { replying &&
        <Grid item>
          {/* <FormControl variant="outlined" fullWidth>
            <InputLabel htmlFor={`text_field_reply`}>New Reply</InputLabel>
            <OutlinedInput
              id={`text_field_reply`}
              name={`text_field_reply`}
              type="text"
              autoComplete="Off"
              multiline
              value={value}
              onChange={e => {
                changeValue(e.target.value);
              }}
              onKeyPress={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  reply(value,  
                    props, changeReplying, 
                    changeValue);
                }
              }}
              labelWidth={80}
              fullWidth
            />
          </FormControl> */}
          <TextBox 
            Value={value} 
            fieldName="New Reply" 
            multiline={true}
            onChange={e => {
              changeValue(e.target.value);
            }}
            // onBlur={reply => {
            //   changeValue(reply);
            // }}
            onKeyPress={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                reply(value,  
                  props, changeReplying, 
                  changeValue);
              }
            }}
            options={props.suggestions}
            labelWidth={110}
          />
        </Grid>
      }
    </Grid>
  );
}
