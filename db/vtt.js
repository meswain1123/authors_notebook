// import dotenv from "dotenv";
// dotenv.config({ silent: true });
// import { MongoClient, ObjectID } from "mongodb";
// import assert from "assert";

var dotenv = require("dotenv");
dotenv.config({ silent: true });
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var assert = require("assert");
// var uuid = require('uuid');


// const dbType = process.env.DB_TYPE;
const dbName = process.env.DB_NAME;
const url = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
function open() {
  console.log('opening');
  client.connect(function(err) {
    // console.log(err);
    assert.equal(null, err);
    // AddMaps();
    // AddTokens();
    // FixLightMasks();
    // FixPlayMaps();
  });
}
function close() {
  client.close();
}

// function FixPlayMaps() {
//   function gotPlayMaps(playMaps) {
//     let pos = 0;
//     function respond(response) {
//       pos++;
//       if (pos < playMaps.length) {
//         const playMap2 = playMaps[pos];
//         playMap2.darkMasks = [];
//         playMap2.fogMasks = [];
//         updatePlayMap(respond, playMap2);
//       }
//     }
//     const playMap = playMaps[pos];
//     playMap.darkMasks = [];
//     playMap.fogMasks = [];
//     updatePlayMap(respond, playMap);
//   }

//   getPlayMaps(gotPlayMaps, 0);
// }

// function FixLightMasks() {
//   function gotPlayMaps(playMaps) {
//     let pos = 0;
//     function respond(response) {
//       pos++;
//       if (pos < maps.length) {
//         const playMap2 = playMaps[pos];
//         playMap2.lightMasks.forEach(m => {
//           m.points.forEach(p => {
//             p.maskID = m.id;
//           });
//         });
//         updatePlayMap(respond, playMap2);
//       }
//     }
//     const playMap = playMaps[pos];
//     playMap.lightMasks.forEach(m => {
//       m.points.forEach(p => {
//         p.maskID = m.id;
//       });
//     });
//     updatePlayMap(respond, playMap);
//   }

//   getPlayMaps(gotPlayMaps, 0);
// }

// function AddMaps() {
//   const maps = [
//     // "BasementStudy",
//     // "CastleWall",
//     // "CaveLair",
//     // "Crossroads",
//     // "Farmstead",
//     // "ForestLair",
//     // "MonsterLair",
//     // "SnowVillage",
//     // "SwampLair",
//     // "Tavern",
//     // "UndergroundComplex",
//     // "UrbanLair",
//     // "WagonTrailandShrine",
//     // "WaterfallCavern"
//     "AbandonedWarehouse",
//     "DaggerAlley",
//     "UnderDaggerAlley",
//     "TrollSkullAlleyBasement",
//     "TrollSkullAlleyHouse",
//     "WeddingRing"
//   ];
//   let pos = 0;
//   function respond(response) {
//     pos++;
//     if (pos < maps.length) {
//       const newMap2 = {
//         name: maps[pos],
//         fileName: maps[pos],
//         gridWidth: 10,
//         gridHeight: 10
//       }
//       createMap(respond, newMap2);
//     }
//   }
//   const newMap = {
//     name: maps[0],
//     fileName: maps[0],
//     gridWidth: 10,
//     gridHeight: 10
//   }
//   createMap(respond, newMap);
// }

// function AddTokens() {
//   const tokens = [
//     // "Bald",
//     // "Bard",
//     // "BlondeHair",
//     // "BlondeWoman",
//     // "BlueSkin",
//     // "BlueSkin2",
//     // "DarkSkin",
//     // "DarkSkinF",
//     // "Dragonborn",
//     // "DragonbornFighter",
//     // "DwarfMale",
//     // "ElvenFemale",
//     // "ElvenFighter",
//     // "Eyebrows",
//     // "Eyebrows2",
//     // "Fedora",
//     // "GnomeMale",
//     // "GoliathBarb",
//     // "GreyHair",
//     // "HalflingMale",
//     // "Hood",
//     // "Hood2",
//     // "Human",
//     // "HumanFemale",
//     // "HumanFemale2",
//     // "HumanFighterF",
//     // "HumanFighterM",
//     // "HumanMale",
//     // "HumanMale2",
//     // "IDK",
//     // "Knight",
//     // "OldWoman",
//     // "OldWoman2",
//     // "RedHair",
//     // "RedSkin",
//     // "Samurai",
//     // "Scarf",
//     // "TieflingFemale",
//     // "Wizard"
//     "Rat",
//     "Wererat",
//     "Werewolf",
//     "RugOfSmothering",
//     "PitTrapWSpikes",
//   ];
//   let pos = 0;
//   function respond(response) {
//     pos++;
//     if (pos < tokens.length) {
//       const newToken2 = {
//         name: tokens[pos],
//         fileName: tokens[pos]
//       }
//       createToken(respond, newToken2);
//     }
//   }
//   const newToken = {
//     name: tokens[pos],
//     fileName: tokens[pos]
//   }
//   createToken(respond, newToken);
// }

// Map
function getMaps(respond, userID) {
  try {
    const db = client.db(dbName);
    db.collection("map")
      // .find({ Owner: userID })
      .find({ })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond([]);
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getMap(respond, mapID) {
  try {
    const db = client.db(dbName);
    db.collection("map")
      .find({ _id: ObjectID(mapID) })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond(null);
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function createMap(respond, map) {
  const db = client.db(dbName);

  db.collection("map").insertOne(
    map
  ).then(res => {
    respond(res.insertedId);
  });
}

function deleteMap(respond, mapID) {
  const db = client.db(dbName);

  // db.collection("map")
  //   .find({ _id: ObjectID(mapID) })
  //   .toArray(function(err, docs) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (docs != null && docs.length > 0) {
        // db.collection("attribute").deleteMany({
        //   mapID: mapID
        // });

        // db.collection("thing").deleteMany({
        //   mapID: mapID
        // });

        // db.collection("type").deleteMany({
        //   mapID: mapID
        // });

        db.collection("map").deleteOne({
          _id: ObjectID(mapID)
        });
        respond({ message: `Map ${mapID} deleted!` });
    //   } else {
    //     respond({ error: `You don't own that map!` });
    //   }
    // });
}

function updateMap(respond, map) {
  const db = client.db(dbName);
  map._id = ObjectID(map._id);
  db.collection("map").updateOne(
    { 
      _id: map._id
    },
    { $set: map }
  );
  respond({ message: `Map ${map.name} updated!` });
}

// Token
function getTokens(respond, userID) {
  try {
    const db = client.db(dbName);
    db.collection("token")
      // .find({ Owner: userID })
      .find({ })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond([]);
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getToken(respond, tokenID) {
  try {
    const db = client.db(dbName);
    db.collection("token")
      .find({ _id: ObjectID(tokenID) })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond(null);
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function createToken(respond, token) {
  const db = client.db(dbName);

  db.collection("token").insertOne(
    token
  ).then(res => {
    respond(res.insertedId);
  });
}

function deleteToken(respond, tokenID) {
  const db = client.db(dbName);

  // db.collection("token")
  //   .find({ _id: ObjectID(tokenID) })
  //   .toArray(function(err, docs) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (docs != null && docs.length > 0) {
        // db.collection("attribute").deleteMany({
        //   tokenID: tokenID
        // });

        // db.collection("thing").deleteMany({
        //   tokenID: tokenID
        // });

        // db.collection("type").deleteMany({
        //   tokenID: tokenID
        // });

        db.collection("token").deleteOne({
          _id: ObjectID(tokenID)
        });
        respond({ message: `Token ${tokenID} deleted!` });
    //   } else {
    //     respond({ error: `You don't own that token!` });
    //   }
    // });
}

function updateToken(respond, token) {
  const db = client.db(dbName);
  token._id = ObjectID(token._id);
  db.collection("token").updateOne(
    { 
      _id: token._id
    },
    { $set: token }
  );
  respond({ message: `Token ${token.fileName} updated!` });
}

// PlayMap
function getPlayMaps(respond, userID) {
  try {
    const db = client.db(dbName);
    db.collection("playMap")
      // .find({ Owner: userID })
      .find({ })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond([]);
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getPlayMap(respond, playMapID) {
  try {
    const db = client.db(dbName);
    db.collection("playMap")
      .find({ _id: ObjectID(playMapID) })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond(null);
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function createPlayMap(respond, playMap) {
  const db = client.db(dbName);

  db.collection("playMap").insertOne(
    playMap
  ).then(res => {
    respond(res.insertedId);
  });
}

function deletePlayMap(respond, playMapID) {
  const db = client.db(dbName);

  // db.collection("playMap")
  //   .find({ _id: ObjectID(playMapID) })
  //   .toArray(function(err, docs) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (docs != null && docs.length > 0) {
        // db.collection("attribute").deleteMany({
        //   playMapID: playMapID
        // });

        // db.collection("thing").deleteMany({
        //   playMapID: playMapID
        // });

        // db.collection("type").deleteMany({
        //   playMapID: playMapID
        // });

        db.collection("playMap").deleteOne({
          _id: ObjectID(playMapID)
        });
        respond({ message: `PlayMap ${playMapID} deleted!` });
    //   } else {
    //     respond({ error: `You don't own that playMap!` });
    //   }
    // });
}

function updatePlayMap(respond, playMap) {
  const db = client.db(dbName);
  playMap._id = ObjectID(playMap._id);
  db.collection("playMap").updateOne(
    { 
      _id: playMap._id
    },
    { $set: playMap }
  ).then(res => {
    respond({ message: `PlayMap ${playMap.name} updated!` });
  });
}

// FavoriteToken
function getFavoriteTokens(respond, userID) {
  try {
    const db = client.db(dbName);
    db.collection("favoriteToken")
      // .find({ Owner: userID })
      .find({ })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond([]);
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getFavoriteToken(respond, favoriteTokenID) {
  try {
    const db = client.db(dbName);
    db.collection("favoriteToken")
      .find({ _id: ObjectID(favoriteTokenID) })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond(null);
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function createFavoriteToken(respond, favoriteToken) {
  const db = client.db(dbName);

  db.collection("favoriteToken").insertOne(
    favoriteToken
  ).then(res => {
    respond(res.insertedId);
  });
}

function deleteFavoriteToken(respond, favoriteTokenID) {
  const db = client.db(dbName);

  // db.collection("favoriteToken")
  //   .find({ _id: ObjectID(favoriteTokenID) })
  //   .toArray(function(err, docs) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (docs != null && docs.length > 0) {
        // db.collection("attribute").deleteMany({
        //   favoriteTokenID: favoriteTokenID
        // });

        // db.collection("thing").deleteMany({
        //   favoriteTokenID: favoriteTokenID
        // });

        // db.collection("type").deleteMany({
        //   favoriteTokenID: favoriteTokenID
        // });

        db.collection("favoriteToken").deleteOne({
          _id: ObjectID(favoriteTokenID)
        });
        respond({ message: `FavoriteToken ${favoriteTokenID} deleted!` });
    //   } else {
    //     respond({ error: `You don't own that favoriteToken!` });
    //   }
    // });
}

function updateFavoriteToken(respond, favoriteToken) {
  const db = client.db(dbName);
  favoriteToken._id = ObjectID(favoriteToken._id);
  db.collection("favoriteToken").updateOne(
    { 
      _id: favoriteToken._id
    },
    { $set: favoriteToken }
  );
  respond({ message: `FavoriteToken ${favoriteToken.name} updated!` });
}

module.exports = {
  open,
  close,
  getMaps,
  getMap,
  createMap,
  deleteMap,
  updateMap,
  getTokens,
  getToken,
  createToken,
  deleteToken,
  updateToken,
  getPlayMaps,
  getPlayMap,
  createPlayMap,
  deletePlayMap,
  updatePlayMap,
  getFavoriteTokens,
  getFavoriteToken,
  createFavoriteToken,
  deleteFavoriteToken,
  updateFavoriteToken
};
