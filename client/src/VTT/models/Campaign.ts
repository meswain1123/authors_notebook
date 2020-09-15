
// import { Map } from "./Map";
// import { PlayToken } from "./PlayToken";
// import { Mask } from "./Mask";
// import { PlayMap } from "./PlayMap";

export class Campaign {
  _id: string;
  name: string;
  selectedPlayMapID: string;

  constructor(
    _id: string, 
    name: string,
    selectedPlayMapID: string) {
    this._id = _id;
    this.name = name;
    this.selectedPlayMapID = selectedPlayMapID;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      selectedPlayMapID: this.selectedPlayMapID
    };
  }
}