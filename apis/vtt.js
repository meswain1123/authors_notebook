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
  .get("/getPlayers", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(players) {
        res.send({players});
      }
      db.getPlayers(respond);
    // }
  })
  .post("/createPlayer", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(playerID) {
        res.send({ playerID });
      }
      // const player = req.body.player;
      // player.CreateDT = new Date();
      // player.EditDT = new Date();
      // player.EditUserID = req.session.userID;
      // db.createPlayer(respond, req.session.userID, req.body.player);
      db.createPlayer(respond, req.body.player);
    // }
  })
  .delete("/deletePlayer", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } 
    // else {
      function respond(message) {
        res.send(message);
      }

      // db.deletePlayer(respond, req.session.userID, req.body.playerID);
      db.deletePlayer(respond, req.body.playerID);
    // }
  })
  .patch("/updatePlayer", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function gotPlayer(oldPlayer) {
        function respond(message) {
          res.send(message);
        }

        const player = {...oldPlayer,...req.body.player};
        // player.EditDT = new Date();
        // player.EditUserID = req.session.userID;
        // db.updatePlayer(respond, req.session.userID, player);
        db.updatePlayer(respond, player);
      }
      // db.getPlayer(gotPlayer, req.session.userID, req.body.player._id);
      db.getPlayer(gotPlayer, req.body.player._id);
    // }
  })
  .post("/login", function(req, res) {
    function gotPlayer(player) {
      if (player) {
        function respond(message) {
          res.send(player);
        }

        player.lastPing = new Date().toString(); 
        db.updatePlayer(respond, player);
      } else {
        res.send(null);
      }
    }
    db.getPlayerByLogin(gotPlayer, req.body.email, req.body.password);
  })
  .post("/playerPing", function(req, res) {
    function gotPlayer(player) {
      if (player) {
        function respond(message) {
          res.send(player);
        }

        player.lastPing = new Date().toString(); 
        db.updatePlayer(respond, player);
      } else {
        res.send(null);
      }
    }
    db.getPlayer(gotPlayer, req.body.playerID);
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
  .get("/getCampaigns/:userID", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(campaigns) {
        res.send({campaigns});
      }
      db.getCampaigns(respond, req.params.userID);
    // }
  })
  .post("/getCampaign", function(req, res) {
    function gotCampaign(campaign) {
      if (req.body.userID === -1 || req.body.userID === "-1") {
        if (req.body.lastUpdate.toString() !== campaign.lastUpdate.toString()) {
          res.send(campaign);
        } else {
          res.send({ noChanges: true });
        }
      } else {
        function gotPlayer(player) {
          if (player) {
            function respond(message) {
              if (req.body.lastUpdate.toString() !== campaign.lastUpdate.toString()) {
                res.send(campaign);
              } else {
                res.send({ noChanges: true });
              }
            }

            player.lastPing = new Date().toString(); 
            db.updatePlayer(respond, player);
          } else {
            res.send(campaign);
          }
        }
        db.getPlayer(gotPlayer, req.body.userID);
      }
    }
    
    db.getCampaign(gotCampaign, req.body.campaignID);
  })
  .post("/createCampaign", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function respond(campaignID) {
        res.send({ campaignID });
      }
      // const campaign = req.body.campaign;
      // campaign.CreateDT = new Date();
      // campaign.EditDT = new Date();
      // campaign.EditUserID = req.session.userID;
      // db.createCampaign(respond, req.session.userID, req.body.campaign);
      db.createCampaign(respond, req.body.campaign);
    // }
  })
  .delete("/deleteCampaign", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } 
    // else {
      function respond(message) {
        res.send(message);
      }

      // db.deleteCampaign(respond, req.session.userID, req.body.campaignID);
      db.deleteCampaign(respond, req.body.campaignID);
    // }
  })
  .patch("/updateCampaign", function(req, res) {
    // if (req.session.userID == undefined) {
    //   res.send({ error: "Session lost.  Please log in again." });
    // } else {
      function gotCampaign(oldCampaign) {
        const lastUpdate = new Date().toString();
        function respond(message) {
          res.send({ message, lastUpdate });
        }

        const campaign = {...oldCampaign,...req.body.campaign};
        campaign.lastUpdate = lastUpdate;
        // campaign.EditDT = new Date();
        // campaign.EditUserID = req.session.userID;
        // db.updateCampaign(respond, req.session.userID, campaign);
        db.updateCampaign(respond, campaign);
      }
      // db.getCampaign(gotCampaign, req.session.userID, req.body.campaign._id);
      db.getCampaign(gotCampaign, req.body.campaign._id);
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
          // res.send(message);
          function gotCampaign(oldCampaign) {
            const lastUpdate = new Date().toString();
            function respond(campaignMessage) {
              res.send({ message, lastUpdate });
            }
    
            const campaign = {...oldCampaign,...req.body.campaign};
            campaign.lastUpdate = lastUpdate;
            
            db.updateCampaign(respond, campaign);
          }
          
          db.getCampaign(gotCampaign, req.body.playMap.campaignID);
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
