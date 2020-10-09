
import { Token } from "./Token";

export class FavoriteToken {
  _id: string;
  campaignID: string;
  name: string;
  token: Token;
  size: number;

  constructor(
    _id: string, 
    campaignID: string,
    name: string,
    token: Token,
    size: number) {
    this._id = _id;
    this.campaignID = campaignID;
    this.name = name;
    this.token = token;
    this.size = size;
  }


  toDBObj = () => {
    return {
      _id: this._id,
      campaignID: this.campaignID,
      name: this.name,
      tokenID: this.token._id,
      size: this.size
    };
  }
}