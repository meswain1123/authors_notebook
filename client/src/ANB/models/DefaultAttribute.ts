
import {Attribute} from "./Attribute";

export class DefaultAttribute {
  attrID: string;
  index: number;
  DefaultValue: string;
  DefaultListValues: string[];
  attribute: Attribute;

  constructor(
    attrID: string,
    index: number,
    DefaultValue: string,
    DefaultListValues: string[],
    attribute: Attribute) {
    this.attrID = attrID;
    this.index = index;
    this.DefaultValue = DefaultValue;
    this.DefaultListValues = DefaultListValues;
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