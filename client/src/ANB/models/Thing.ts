
import {Attribute} from "./Attribute";
import {ThingAttribute} from "./ThingAttribute";

export class Thing {
  _id: string;
  Name: string;
  Description: string;
  TypeIDs: string[];
  worldID: string;
  ReferenceIDs: string[];
  Attributes: ThingAttribute[];
  // CreateDT: Date;
  // EditDT: Date;
  // EditUserID: string;

  constructor(
    _id: string,
    Name: string,
    Description: string,
    TypeIDs: string[],
    worldID: string,
    ReferenceIDs: string[],
    Attributes: ThingAttribute[]) {
    this._id = _id;
    this.Name = Name;
    this.Description = Description;
    this.TypeIDs = TypeIDs;
    this.worldID = worldID;
    this.ReferenceIDs = ReferenceIDs;
    this.Attributes = Attributes;
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