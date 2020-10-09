
export class Attribute {
  _id: string;
  Name: string;
  AttributeType: string;
  Options: string[];
  DefinedType: string;
  ListType: string;
  worldID: string;

  constructor(
    _id: string,
    Name: string,
    AttributeType: string,
    Options: string[],
    DefinedType: string,
    ListType: string,
    worldID: string) {
    this._id = _id;
    this.Name = Name;
    this.AttributeType = AttributeType;
    this.Options = Options;
    this.DefinedType = DefinedType;
    this.ListType = ListType;
    this.worldID = worldID;
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