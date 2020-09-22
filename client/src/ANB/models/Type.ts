
import {Attribute} from "./Attribute";
import {TypeAttribute} from "./TypeAttribute";
import {DefaultAttribute} from "./DefaultAttribute";

export class Type {
  _id: string;
  Name: string;
  Description: string;
  SuperIDs: string[];
  worldID: string;
  Major: boolean;
  ReferenceIDs: string[];
  DefaultReferenceIDs: string[];
  loaded: boolean;
  Attributes: TypeAttribute[];
  Defaults: DefaultAttribute[];
  // CreateDT: Date;
  // EditDT: Date;
  // EditUserID: string;

  constructor(
    _id: string,
    Name: string,
    Description: string,
    SuperIDs: string[],
    worldID: string,
    Major: boolean,
    ReferenceIDs: string[],
    DefaultReferenceIDs: string[],
    loaded: boolean,
    Attributes: TypeAttribute[],
    Defaults: DefaultAttribute[]) {
    this._id = _id;
    this.Name = Name;
    this.Description = Description;
    this.SuperIDs = SuperIDs;
    this.worldID = worldID;
    this.Major = Major;
    this.ReferenceIDs = ReferenceIDs;
    this.DefaultReferenceIDs = DefaultReferenceIDs;
    this.loaded = loaded;
    this.Attributes = Attributes;
    this.Defaults = Defaults;
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