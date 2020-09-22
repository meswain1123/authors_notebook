
// import { Map } from "./Map";
// import { PlayToken } from "./PlayToken";
// import { Mask } from "./Mask";
import { Campaign } from "./Campaign";

export class Player {
  _id: string;
  email: string;
  username: string;
  password: string;
  campaign: Campaign | null;
  lastPing: Date;

  constructor(
    _id: string, 
    email: string,
    username: string,
    password: string,
    campaign: (Campaign | null),
    lastPing: Date) {
    this._id = _id;
    this.email = email;
    this.username = username;
    this.password = password;
    this.campaign = campaign;
    this.lastPing = lastPing;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      email: this.email,
      username: this.username,
      password: this.password,
      campaignID: (this.campaign ? this.campaign._id : null)
    };
  }
}