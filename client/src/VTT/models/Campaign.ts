
// import { Map } from "./Map";
// import { PlayToken } from "./PlayToken";
// import { Mask } from "./Mask";
// import { PlayMap } from "./PlayMap";

export class Campaign {
  _id: string;
  name: string;
  selectedPlayMapID: string;
  turnPlayerID: string | null; 
  lastUpdate: string;

  constructor(
    _id: string, 
    name: string,
    selectedPlayMapID: string,
    turnPlayerID: string | null,
    lastUpdate: string) {
    this._id = _id;
    this.name = name;
    this.selectedPlayMapID = selectedPlayMapID;
    this.turnPlayerID = turnPlayerID;
    this.lastUpdate = lastUpdate;
  }

  toDBObj = () => {
    return {
      _id: this._id,
      name: this.name,
      selectedPlayMapID: this.selectedPlayMapID,
      turnPlayerID: this.turnPlayerID
    };
  }
}