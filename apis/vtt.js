// vtt service module

var express = require("express");
// var uuid = require('uuid');
var db = require("../db/vtt");

var router = express.Router();

db.open();

router
  .get("/test", function(req, res) {
    res.send({ message: "Becky is hot!" });
  })
  .get("/getMaps/:userID", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(maps) {
        res.send({maps});
      }
      db.getMaps(respond, req.params.userID);
    // }
  })
  .post("/createMap", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(mapID) {
        res.send({ mapID });
      }
      // const map = req.body.map;
      // map.CreateDT = new Date();
      // map.EditDT = new Date();
      // map.EditUserID = req.session.userID;
      // db.createMap(respond, req.session.userID, req.body.map);
      db.createMap(respond, req.body.map);
    // }
  })
  .delete("/deleteMap", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } 
    // else {
      function respond(message) {
        res.send(message);
      }

      // db.deleteMap(respond, req.session.userID, req.body.mapID);
      db.deleteMap(respond, req.body.mapID);
    // }
  })
  .patch("/updateMap", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function gotMap(oldMap) {
        function respond(message) {
          res.send(message);
        }

        const map = {...oldMap,...req.body.map};
        // map.EditDT = new Date();
        // map.EditUserID = req.session.userID;
        // db.updateMap(respond, req.session.userID, map);
        db.updateMap(respond, map);
      }
      // db.getMap(gotMap, req.session.userID, req.body.map._id);
      db.getMap(gotMap, req.body.map._id);
    // }
  })
  .get("/getTokens/:userID", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(tokens) {
        res.send({tokens});
      }
      db.getTokens(respond, req.params.userID);
    // }
  })
  .post("/createToken", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(tokenID) {
        res.send({ tokenID });
      }
      // const token = req.body.token;
      // token.CreateDT = new Date();
      // token.EditDT = new Date();
      // token.EditUserID = req.session.userID;
      // db.createToken(respond, req.session.userID, req.body.token);
      db.createToken(respond, req.body.token);
    // }
  })
  .delete("/deleteToken", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } 
    // else {
      function respond(message) {
        res.send(message);
      }

      // db.deleteToken(respond, req.session.userID, req.body.tokenID);
      db.deleteToken(respond, req.body.tokenID);
    // }
  })
  .patch("/updateToken", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function gotToken(oldToken) {
        function respond(message) {
          res.send(message);
        }

        const token = {...oldToken,...req.body.token};
        // token.EditDT = new Date();
        // token.EditUserID = req.session.userID;
        // db.updateToken(respond, req.session.userID, token);
        db.updateToken(respond, token);
      }
      // db.getToken(gotToken, req.session.userID, req.body.token._id);
      db.getToken(gotToken, req.body.token._id);
    // }
  })
  .get("/getPlayMaps/:userID", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(playMaps) {
        res.send({playMaps});
      }
      db.getPlayMaps(respond, req.params.userID);
    // }
  })
  .get("/getPlayMap/:playMapID", function(req, res) {
    function gotPlayMap(playMap) {
      res.send(playMap);
    }
    db.getPlayMap(gotPlayMap, req.params.playMapID);
  })
  .post("/createPlayMap", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(playMapID) {
        res.send({ playMapID });
      }
      // const playMap = req.body.playMap;
      // playMap.CreateDT = new Date();
      // playMap.EditDT = new Date();
      // playMap.EditUserID = req.session.userID;
      // db.createPlayMap(respond, req.session.userID, req.body.playMap);
      db.createPlayMap(respond, req.body.playMap);
    // }
  })
  .delete("/deletePlayMap", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } 
    // else {
      function respond(message) {
        res.send(message);
      }

      // db.deletePlayMap(respond, req.session.userID, req.body.playMapID);
      db.deletePlayMap(respond, req.body.playMapID);
    // }
  })
  .patch("/updatePlayMap", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function gotPlayMap(oldPlayMap) {
        function respond(message) {
          res.send(message);
        }

        const playMap = {...oldPlayMap,...req.body.playMap};
        // playMap.EditDT = new Date();
        // playMap.EditUserID = req.session.userID;
        // db.updatePlayMap(respond, req.session.userID, playMap);
        db.updatePlayMap(respond, playMap);
      }
      // db.getPlayMap(gotPlayMap, req.session.userID, req.body.playMap._id);
      db.getPlayMap(gotPlayMap, req.body.playMap._id);
    // }
  })
  .get("/getFavoriteTokens/:userID", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(favoriteTokens) {
        res.send({favoriteTokens});
      }
      db.getFavoriteTokens(respond, req.params.userID);
    // }
  })
  .post("/createFavoriteToken", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(favoriteTokenID) {
        res.send({ favoriteTokenID });
      }
      // const favoriteToken = req.body.favoriteToken;
      // favoriteToken.CreateDT = new Date();
      // favoriteToken.EditDT = new Date();
      // favoriteToken.EditUserID = req.session.userID;
      // db.createToken(respond, req.session.userID, req.body.favoriteToken);
      db.createFavoriteToken(respond, req.body.favoriteToken);
    // }
  })
  .delete("/deleteFavoriteToken", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } 
    // else {
      function respond(message) {
        res.send(message);
      }

      // db.deleteToken(respond, req.session.userID, req.body.favoriteTokenID);
      db.deleteFavoriteToken(respond, req.body.favoriteTokenID);
    // }
  })
  .patch("/updateFavoriteToken", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function gotFavoriteToken(oldFavoriteToken) {
        function respond(message) {
          res.send(message);
        }

        const favoriteToken = {...oldFavoriteToken,...req.body.favoriteToken};
        // favoriteToken.EditDT = new Date();
        // favoriteToken.EditUserID = req.session.userID;
        // db.updateToken(respond, req.session.userID, favoriteToken);
        db.updateFavoriteToken(respond, favoriteToken);
      }
      // db.getToken(gotToken, req.session.userID, req.body.favoriteToken._id);
      db.getFavoriteToken(gotFavoriteToken, req.body.favoriteToken._id);
    // }
  });

function close() {
  db.close();
}

module.exports = router;
module.exports.close = close;
