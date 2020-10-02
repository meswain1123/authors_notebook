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
    // AddCampaign();
    // FixCampaigns();
    // AddPlayers();
    // FixPlayers();
    // AddMaps();
    // AddTokens();
    // FixLightMasks();
    // FixPlayMaps();
    // FixFavoriteTokens();
    // FixTokens();
    // FixMaps();
    // FixBru();
  });
}
function close() {
  client.close();
}

// function FixBru() {
//   function gotPlayMaps(playMaps) {
//     let pos = 0;
//     function respond(response) {
//       // pos++;
//       // if (pos < playMaps.length) {
//       //   const playMap2 = playMaps[pos];
//       //   updateToken(respond, playMap2);
//       // }
//     }
//     const playMap = playMaps[pos];
//     playMap.playTokens.forEach(t => {
//       t.x *= 2;
//       t.y *= 2;
//       t.size *= 2;
//     });
//     playMap.lightMasks.forEach(m => {
//       m.points.forEach(p => {
//         p.x *= 2;
//         p.y *= 2;
//       });
//     });
//     playMap.darkMasks.forEach(m => {
//       m.points.forEach(p => {
//         p.x *= 2;
//         p.y *= 2;
//       });
//     });
//     playMap.fogMasks.forEach(m => {
//       m.points.forEach(p => {
//         p.x *= 2;
//         p.y *= 2;
//       });
//     });
//     updatePlayMap(respond, playMap);
//   }

//   getPlayMaps(gotPlayMaps, 0);
// }

function FixTokens() {
  function gotTokens(tokens) {
    let pos = 0;
    function respond(response) {
      pos++;
      if (pos < tokens.length) {
        const token2 = tokens[pos];
        // token2.stealth = false;
        delete token2.stealth;
        updateToken(respond, token2);
      }
    }
    const token = tokens[pos];
    // token.stealth = false;
    delete token.stealth;
    updateToken(respond, token);
  }

  getTokens(gotTokens, 0);
}

// function FixMaps() {
//   function gotMaps(maps) {
//     let pos = 0;
//     function respond(response) {
//       pos++;
//       if (pos < maps.length) {
//         const map2 = maps[pos];
//         map2.category = "basic";
//         updateMap(respond, map2);
//       }
//     }
//     const map = maps[pos];
//     map.campaignID = "basic";
//     updateMap(respond, map);
//   }

//   getMaps(gotMaps, 0);
// }

// function FixFavoriteTokens() {
//   function gotFavoriteTokens(favoriteTokens) {
//     let pos = 0;
//     function respond(response) {
//       pos++;
//       if (pos < favoriteTokens.length) {
//         const favoriteToken2 = favoriteTokens[pos];
//         favoriteToken2.campaignID = "5f46ceeaa4e6a228c888965d";
//         updateFavoriteToken(respond, favoriteToken2);
//       }
//     }
//     const favoriteToken = favoriteTokens[pos];
//     favoriteToken.campaignID = "5f46ceeaa4e6a228c888965d";
//     updateFavoriteToken(respond, favoriteToken);
//   }

//   getFavoriteTokens(gotFavoriteTokens, 0);
// }

function FixPlayMaps() {
  function gotPlayMaps(playMaps) {
    playMaps = playMaps.filter(p => p.mapID === "5f6a1d23405ce419ac2a78db");
    let pos = 0;
    function respond(response) {
      pos++;
      if (pos < playMaps.length) {
        const playMap2 = playMaps[pos];
        playMap2.movingToken = null;
        playMap2.playTokens.forEach(t => {
          t.ownerID = null;
        });
        // playMap2.campaignID = "5f46ceeaa4e6a228c888965d";
        updatePlayMap(respond, playMap2);
      }
    }
    const playMap = playMaps[pos];
    playMap.movingToken = null;
    playMap.playTokens.forEach(t => {
      t.size = t.size * 2;
      t.x = t.x * 2;
      t.y = t.y * 2;
    });
    // playMap.campaignID = "5f46ceeaa4e6a228c888965d";
    updatePlayMap(respond, playMap);
  }

  getPlayMaps(gotPlayMaps, 0);
}

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

// function AddCampaign() {
//   function respond(response) {
//   }
//   const newCampaign = {
//     name: "Old AZ Friends",
//     selectedPlayMapID: -1
//   }
//   createCampaign(respond, newCampaign);
// }

function FixCampaigns() {
  function gotCampaigns(campaigns) {
    let pos = 0;
    function respond(response) {
      pos++;
      if (pos < campaigns.length) {
        const campaign2 = campaigns[pos];
        campaign2.lastUpdate = new Date().toString();
        updateCampaign(respond, campaign2);
      }
    }
    const campaign = campaigns[pos];
    campaign.lastUpdate = new Date().toString();
    updateCampaign(respond, campaign);
  }

  getCampaigns(gotCampaigns);
}

function AddPlayers() {
  const players = [
    {
      email: "meswain@gmail.com",
      username: "DM",
      password: "password",
      campaignID: "5f46ceeaa4e6a228c888965d"
    },
    // {
    //   email: "madmardegin@hotmail.com",
    //   username: "Breog",
    //   password: "password",
    //   campaignID: "5f46ceeaa4e6a228c888965d"
    // },
    // {
    //   email: "sirmattmadsen@gmail.com",
    //   username: "Kiroz",
    //   password: "password",
    //   campaignID: "5f46ceeaa4e6a228c888965d"
    // },
    // {
    //   email: "roblcode@gmail.com",
    //   username: "Ravt",
    //   password: "password",
    //   campaignID: "5f46ceeaa4e6a228c888965d"
    // }
  ];
  let pos = 0;
  function respond(response) {
    pos++;
    if (pos < players.length) {
      const newPlayer2 = {
        email: players[pos].email,
        username: players[pos].username,
        password: players[pos].password,
        campaignID: players[pos].campaignID,
        lastPing: new Date().toString()
      }
      createPlayer(respond, newPlayer2);
    }
  }
  const newPlayer = {
    email: players[pos].email,
    username: players[pos].username,
    password: players[pos].password,
    campaignID: players[pos].campaignID,
    lastPing: new Date().toString()
  }
  createPlayer(respond, newPlayer);
}

function FixPlayers() {
  function gotPlayers(players) {
    let pos = 0;
    function respond(response) {
      pos++;
      if (pos < players.length) {
        const player2 = players[pos];
        player2.refreshIndex = pos;
        updatePlayer(respond, player2);
      }
    }
    const player = players[pos];
    player.refreshIndex = pos;
    updatePlayer(respond, player);
  }

  getPlayers(gotPlayers);
}

function AddMaps() {
  const maps = [
    {
      name: "GraveyardPath",
      category: "graveyards",
      width: 22,
      height: 30
    },
    {
      name: "GraveyardPumpkinPatch",
      category: "graveyards",
      width: 35,
      height: 35
    },
    {
      name: "MausoleumCrypts",
      category: "graveyards",
      width: 30,
      height: 35
    },
  ];
  let pos = 0;
  function respond(response) {
    pos++;
    if (pos < maps.length) {
      const newMap2 = {
        name: maps[pos].name,
        fileName: maps[pos].name,
        category: maps[pos].category,
        gridWidth: maps[pos].width,
        gridHeight: maps[pos].height
      }
      createMap(respond, newMap2);
    }
  }
  const newMap = {
    name: maps[pos].name,
    fileName: maps[pos].name,
    category: maps[pos].category,
    gridWidth: maps[pos].width,
    gridHeight: maps[pos].height
  }
  createMap(respond, newMap);
}

function AddTokens() {
  const tokens = [
    { 
      name: "GhostWizard",
      category: "monster"
    },
    { 
      name: "GhostBlueWoman",
      category: "monster"
    },
    { 
      name: "GhostWhiteWoman",
      category: "monster"
    },
    { 
      name: "GhostHeartWoman",
      category: "monster"
    },
    { 
      name: "GhostLizardfolk",
      category: "monster"
    },
    { 
      name: "GhostScreaming",
      category: "monster"
    },
    { 
      name: "GhostSkeletal",
      category: "monster"
    },
    { 
      name: "Specter",
      category: "monster"
    },
    { 
      name: "Wraith",
      category: "monster"
    },
    { 
      name: "Wraith2",
      category: "monster"
    },
  ];
  let pos = 0;
  function respond(response) {
    pos++;
    if (pos < tokens.length) {
      const newToken2 = {
        name: tokens[pos].name,
        fileName: tokens[pos].name,
        category: tokens[pos].category
      }
      createToken(respond, newToken2);
    }
  }
  const newToken = {
    name: tokens[pos].name,
    fileName: tokens[pos].name,
    category: tokens[pos].category
  }
  createToken(respond, newToken);
}

// Player
function getPlayers(respond) {
  try {
    const db = client.db(dbName);
    db.collection("player")
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

function getPlayer(respond, playerID) {
  try {
    const db = client.db(dbName);
    db.collection("player")
      .find({ _id: ObjectID(playerID) })
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

function getPlayerByLogin(respond, email, password) {
  try {
    const db = client.db(dbName);
    db.collection("player")
      .find({ email, password })
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

function createPlayer(respond, player) {
  const db = client.db(dbName);

  db.collection("player").insertOne(
    player
  ).then(res => {
    respond(res.insertedId);
  });
}

function deletePlayer(respond, playerID) {
  const db = client.db(dbName);

  // db.collection("player")
  //   .find({ _id: ObjectID(playerID) })
  //   .toArray(function(err, docs) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (docs != null && docs.length > 0) {
        // db.collection("attribute").deleteMany({
        //   playerID: playerID
        // });

        // db.collection("thing").deleteMany({
        //   playerID: playerID
        // });

        // db.collection("type").deleteMany({
        //   playerID: playerID
        // });

        db.collection("player").deleteOne({
          _id: ObjectID(playerID)
        });
        respond({ message: `Player ${playerID} deleted!` });
    //   } else {
    //     respond({ error: `You don't own that player!` });
    //   }
    // });
}

function updatePlayer(respond, player) {
  const db = client.db(dbName);
  player._id = ObjectID(player._id);
  db.collection("player").updateOne(
    { 
      _id: player._id
    },
    { $set: player }
  );
  respond({ message: `Player ${player.name} updated!` });
}

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

// Campaign
function getCampaigns(respond, userID) {
  try {
    const db = client.db(dbName);
    db.collection("campaign")
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

function getCampaign(respond, campaignID) {
  try {
    const db = client.db(dbName);
    db.collection("campaign")
      .find({ _id: ObjectID(campaignID) })
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

function createCampaign(respond, campaign) {
  const db = client.db(dbName);

  db.collection("campaign").insertOne(
    campaign
  ).then(res => {
    respond(res.insertedId);
  });
}

function deleteCampaign(respond, campaignID) {
  const db = client.db(dbName);

  // db.collection("campaign")
  //   .find({ _id: ObjectID(campaignID) })
  //   .toArray(function(err, docs) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (docs != null && docs.length > 0) {
        // db.collection("attribute").deleteMany({
        //   campaignID: campaignID
        // });

        // db.collection("thing").deleteMany({
        //   campaignID: campaignID
        // });

        // db.collection("type").deleteMany({
        //   campaignID: campaignID
        // });

        db.collection("campaign").deleteOne({
          _id: ObjectID(campaignID)
        });
        respond({ message: `Campaign ${campaignID} deleted!` });
    //   } else {
    //     respond({ error: `You don't own that campaign!` });
    //   }
    // });
}

function updateCampaign(respond, campaign) {
  const db = client.db(dbName);
  campaign._id = ObjectID(campaign._id);
  db.collection("campaign").updateOne(
    { 
      _id: campaign._id
    },
    { $set: campaign }
  ).then(res => {
    respond({ message: `Campaign ${campaign.name} updated!` });
  });
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
  getPlayers,
  getPlayer,
  getPlayerByLogin,
  createPlayer,
  deletePlayer,
  updatePlayer,
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
  getCampaigns,
  getCampaign,
  createCampaign,
  deleteCampaign,
  updateCampaign,
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
