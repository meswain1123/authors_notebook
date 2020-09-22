
import { Token } from "./Token";
import { Player } from "./Player";

export class PlayToken {
  id: number;
  name: string;
  token: Token | null;
  x: number;
  y: number;
  size: number;
  stealth: boolean;
  moving: boolean;
  owner: Player | null;

  constructor(
    id: number, 
    name: string,
    token: Token | null,
    x: number,
    y: number,
    size: number,
    stealth: boolean,
    moving: boolean,
    owner: Player | null) {
    this.id = id;
    this.name = name;
    this.token = token;
    this.x = x;
    this.y = y;
    this.size = size;
    this.stealth = stealth;
    this.moving = moving;
    this.owner = owner;
  }

  toDBObj = () => {
    return {
      id: this.id,
      name: this.name,
      tokenID: this.token ? this.token._id : null,
      x: this.x,
      y: this.y,
      size: this.size,
      stealth: this.stealth,
      moving: this.moving,
      ownerID: this.owner ? this.owner._id : null
    };
  }
}