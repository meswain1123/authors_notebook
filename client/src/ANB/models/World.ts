
export class World {
  _id: string;
  Name: string;
  Description: string;
  Public: boolean;
  AcceptingCollaborators: boolean;

  constructor(
    _id: string,
    Name: string,
    Description: string,
    Public: boolean,
    AcceptingCollaborators: boolean) {
    this._id = _id;
    this.Name = Name;
    this.Description = Description;
    this.Public = Public;
    this.AcceptingCollaborators = AcceptingCollaborators;
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