
import {Type} from "./Type";
import {Thing} from "./Thing";
import {World} from "./World";
import {ReplyComment} from "./ReplyComment";

export class Comment {
  _id: string;
  userID: string;
  worldID: string;
  objectType: string;
  objectID: string;
  text: string;
  object: Type | Thing | World;
  votes: any;
  replies: ReplyComment[];
  CreateDT: Date;
  EditDT: Date;

  constructor(
    _id: string,
    userID: string,
    worldID: string,
    objectType: string,
    objectID: string,
    object: Type | Thing | World,
    text: string,
    votes: any,
    replies: ReplyComment[],
    CreateDT: Date,
    EditDT: Date) {
    this._id = _id;
    this.userID = userID;
    this.worldID = worldID;
    this.objectType = objectType;
    this.objectID = objectID;
    this.object = object;
    this.text = text;
    this.votes = votes;
    this.replies = replies;
    this.CreateDT = CreateDT;
    this.EditDT = EditDT;
  }

  toDBObj = () => {
    return this;
    // return {
    //   _id: this._id,
    //   username: this.username,
    //   followingWorlds: this.followingWorlds
    // };
  }
}