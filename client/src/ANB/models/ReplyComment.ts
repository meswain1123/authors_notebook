
// import {Type} from "./Type";
// import {Thing} from "./Thing";
// import {World} from "./World";

export class ReplyComment {
  parentID: string;
  userID: string;
  text: string;
  votes: any;
  replies: ReplyComment[];
  CreateDT: Date;
  EditDT: Date;

  constructor(
    parentID: string,
    userID: string,
    worldID: string,
    text: string,
    votes: any,
    replies: ReplyComment[],
    CreateDT: Date,
    EditDT: Date) {
    this.parentID = parentID;
    this.userID = userID;
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