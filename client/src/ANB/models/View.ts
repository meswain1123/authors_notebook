
import {Type} from "./Type";
import {Thing} from "./Thing";
import {World} from "./World";

export class View {
  _id: string;
  objectID: string;
  objectType: string;
  userID: string;
  worldID: string;
  ViewDT: Date;
  object: Type | Thing | World;

  constructor(
    _id: string,
    objectID: string,
    objectType: string,
    userID: string,
    worldID: string,
    ViewDT: Date,
    object: Type | Thing | World) {
    this._id = _id;
    this.objectID = objectID;
    this.objectType = objectType;
    this.userID = userID;
    this.worldID = worldID;
    this.ViewDT = ViewDT;
    this.object = object;
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