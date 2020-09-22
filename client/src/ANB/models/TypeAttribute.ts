
import {Attribute} from "./Attribute";

export class TypeAttribute {
  attrID: string;
  index: number;
  attribute: Attribute;

  constructor(
    attrID: string,
    index: number,
    attribute: Attribute) {
    this.attrID = attrID;
    this.index = index;
    this.attribute = attribute;
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