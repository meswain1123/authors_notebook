
export class MaskPoint {
  id: number;
  maskID: number;
  maskType: string;
  x: number;
  y: number;

  constructor(
    id: number, 
    maskID: number,
    maskType: string,
    x: number,
    y: number,) {
    this.id = id;
    this.maskID = maskID;
    this.maskType = maskType;
    this.x = x;
    this.y = y;
  }

  toClipPathPoint = (gridWidth: number, gridHeight: number) => {
    // I still need to put some more translation code into this.  
    // It shouldn't need to worry about pan and zoom from what I've seen.
    // I think it's just going to be multiplying by 50, and adding some things to it.
    let x = (this.x + gridWidth/2) * 50 - 50;
    let y = (this.y + gridHeight/2) * 50 - 25;
    return `${x},${y}`;
  }

  toDBObj = () => {
    return {
      id: this.id,
      x: this.x,
      y: this.y
    };
  }
}

export class Mask {
  id: number;
  maskType: string;
  points: MaskPoint[];

  constructor(
    id: number, 
    maskType: string,
    points: MaskPoint[]) {
    this.id = id;
    this.maskType = maskType;
    this.points = points;
  }

  toClipPath = (gridWidth: number, gridHeight: number) => {
    let clipPath = "";
    this.points.forEach(point => {
      clipPath += point.toClipPathPoint(gridWidth, gridHeight) + " ";
    });
    return clipPath;
  }

  toDBObj = () => {
    const points: any[] = [];
    this.points.forEach(p => {
      points.push(p.toDBObj());
    });
    return {
      id: this.id,
      points
    };
  }
}