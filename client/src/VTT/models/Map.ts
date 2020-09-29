
import BasementStudy from "../assets/img/maps/basic/Basement-Study.jpg";
import CastleWall from "../assets/img/maps/basic/Castle-Wall.jpg";
import CaveLair from "../assets/img/maps/basic/Cave-Lair.jpg";
import Crossroads from "../assets/img/maps/basic/Crossroads.jpg";
import Farmstead from "../assets/img/maps/basic/Farmstead.jpg";
import ForestLair from "../assets/img/maps/basic/Forest-Lair.jpg";
import MonsterLair from "../assets/img/maps/basic/Monster-Lair.jpg";
import SnowVillage from "../assets/img/maps/basic/Snow-Village.jpg";
import SwampLair from "../assets/img/maps/basic/Swamp-Lair.jpg";
import Tavern from "../assets/img/maps/basic/Tavern.jpg";
import UndergroundComplex from "../assets/img/maps/basic/Underground-Complex.jpg";
import UrbanLair from "../assets/img/maps/basic/Urban-Lair.jpg";
import WagonTrailandShrine from "../assets/img/maps/basic/Wagon-Trail-and-Shrine.jpg";
import WaterfallCavern from "../assets/img/maps/basic/Waterfall-Cavern.jpg";

import AbandonedWarehouse from "../assets/img/maps/drawn/Abandoned Warehouse.png";
import DaggerAlley from "../assets/img/maps/drawn/DaggerAlley.png";
import UnderDaggerAlley from "../assets/img/maps/drawn/UnderDaggerAlley.png";
import TrollSkullAlleyBasement from "../assets/img/maps/drawn/TrollSkullAlleyBasement.png";
import TrollSkullAlleyHouse from "../assets/img/maps/drawn/TrollSkullAlleyHouse.png";
import WeddingRing from "../assets/img/maps/drawn/WeddingRing.png";

import CragmawCastle from "../assets/img/maps/phandelver/cragmaw castle.jpg";
import CragmawHideout from "../assets/img/maps/phandelver/cragmaw hideout.jpg";
import Phandalin from "../assets/img/maps/phandelver/phandalin.jpg";
import RedbrandHideout from "../assets/img/maps/phandelver/redbrand hideout.jpg";
import RuinsOfThundertree from "../assets/img/maps/phandelver/ruins of thundertree.jpg";
import SwordCoast from "../assets/img/maps/phandelver/sword coast.jpg";
import WaveEchoCave from "../assets/img/maps/phandelver/wave echo cave.jpg";

import Waterdeep from "../assets/img/maps/waterdeep/Waterdeep.jpg";
import WaterdeepWithWards from "../assets/img/maps/waterdeep/waterdeep_with_wards.jpg";

import Restaurant from "../assets/img/maps/city_buildings/restaurant.jpg";
import CrimsonBrush from "../assets/img/maps/city_buildings/CrimsonBrush.png";

interface IHash {
  [details: string] : string;
} 
const MapFile: IHash = {
  BasementStudy: BasementStudy,
  CastleWall: CastleWall,
  CaveLair: CaveLair,
  Crossroads: Crossroads,
  Farmstead: Farmstead,
  ForestLair: ForestLair,
  MonsterLair: MonsterLair,
  SnowVillage: SnowVillage,
  SwampLair: SwampLair,
  Tavern: Tavern,
  UndergroundComplex: UndergroundComplex,
  UrbanLair: UrbanLair,
  WagonTrailandShrine: WagonTrailandShrine,
  WaterfallCavern: WaterfallCavern,
  AbandonedWarehouse: AbandonedWarehouse,
  DaggerAlley: DaggerAlley,
  UnderDaggerAlley: UnderDaggerAlley,
  TrollSkullAlleyBasement: TrollSkullAlleyBasement,
  TrollSkullAlleyHouse: TrollSkullAlleyHouse,
  WeddingRing: WeddingRing,
  CragmawCastle: CragmawCastle,
  CragmawHideout: CragmawHideout,
  Phandalin: Phandalin,
  RedbrandHideout: RedbrandHideout,
  RuinsOfThundertree: RuinsOfThundertree,
  SwordCoast: SwordCoast,
  WaveEchoCave: WaveEchoCave,
  Waterdeep: Waterdeep,
  WaterdeepWithWards: WaterdeepWithWards,

  Restaurant: Restaurant,
  CrimsonBrush: CrimsonBrush
};

export class Map {
  _id: string;
  name: string;
  category: string;
  file: string;
  gridWidth: number;
  gridHeight: number;

  constructor(
    _id: string, 
    name: string,
    category: string,
    fileName: string, 
    width: number, 
    height: number) {
    this._id = _id;
    this.name = name;
    this.category = category;
    this.file = MapFile[fileName];
    this.gridWidth = width;
    this.gridHeight = height;
  }
}