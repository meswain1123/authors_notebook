
import { Token } from "./Token";

export class PlayToken {
  id: number;
  name: string;
  token: Token | null;
  x: number;
  y: number;
  size: number;
  stealth: boolean;
  moving: boolean;

  constructor(
    id: number, 
    name: string,
    token: Token | null,
    x: number,
    y: number,
    size: number,
    stealth: boolean,
    moving: boolean) {
    this.id = id;
    this.name = name;
    this.token = token;
    this.x = x;
    this.y = y;
    this.size = size;
    this.stealth = stealth;
    this.moving = moving;
  }

  toDBObj = () => {
    return {
      id: this.id,
      name: this.name,
      tokenID: this.token === null ? null : this.token._id,
      x: this.x,
      y: this.y,
      size: this.size,
      stealth: this.stealth,
      moving: this.moving
    };
  }
}