
export class User {
  _id: string;
  username: string;
  email: string;
  // password: string;
  followingWorlds: string[];

  constructor(
    _id: string, 
    username: string,
    email: string,
    // password: string,
    followingWorlds: string[]) {
    this._id = _id;
    this.username = username;
    this.email = email;
    this.followingWorlds = followingWorlds;
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