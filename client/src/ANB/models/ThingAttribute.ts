
import {Attribute} from "./Attribute";

export class ThingAttribute {
  attrID: string;
  index: number;
  Value: string;
  ListValues: string[];
  attribute: Attribute;

  constructor(
    attrID: string,
    index: number,
    Value: string,
    ListValues: string[],
    attribute: Attribute) {
    this.attrID = attrID;
    this.index = index;
    this.Value = Value;
    this.ListValues = ListValues;
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