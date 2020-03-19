// world service module

// import express from "express";
// import db from "../db/world-db";
var express = require("express");
var db = require("../db/world-db");

var router = express.Router();

db.open();

// Test route
router
  .get("/test", function(req, res) {
    res.send({ message: "Becky is hot!" });
  })
  .get("/getWorldsForUser", function(req, res) {
    console.log(req.session);
    // console.log(`${Date.now()}: ${req.session.userID}`);
    if (req.session.userID == undefined) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(worlds) {
        res.send({worlds});
      }
      db.getWorldsForUser(respond, req.session.userID);
    }
    // res.send({message: 'Testing'});
  })
  .get("/getPublicWorlds", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    function respond(worlds) {
      res.send({worlds});
    }
    db.getPublicWorlds(respond);
    // res.send({message: 'Testing'});
  })
  .post("/createWorld", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    if (req.session.userID == undefined) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(worldID) {
        res.send({ worldID });
      }
      db.createWorld(respond, req.session.userID, req.body.world);
    }
    
    // res.send({message: 'Testing'});
  })
  .delete("/deleteWorld", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    if (req.session.userID == undefined) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } 
    else {
      function respond(message) {
        res.send({ message });
      }

      db.deleteWorld(respond, req.session.userID, req.body.worldID);
    }
    // res.send({message: 'Testing'});
  })
  .patch("/updateWorld", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    if (req.session.userID == undefined) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(message) {
        res.send(message);
      }

      db.updateWorld(respond, req.session.userID, req.body.world);
    }
    // res.send({message: 'Testing'});
  })
  .post("/selectWorld", function(req, res) {
    if (req.body.worldID === null) {
      req.session.worldID = undefined;
    }
    else {
      function respond(world) {
        if (world != null) {
          req.session.worldID = req.body.worldID;
          res.send({ message: `Welcome to ${world.Name}!` });
        } else {
          res.send({ message: "There was a problem getting the world." });
        }
      }
      db.getWorld(respond, req.session.userID, req.body.worldID);
    }
    // res.send({message: 'Testing'});
  })
  .get("/getTypesForWorld/:worldID", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}, ${req.session.worldID}`);
    // if (req.params.worldID == undefined) {
    //   console.log(req.session);
    //   res.send({ message: "Session lost.  Please log in again." });
    // } else {
      function respond(types) {
        res.send({ types });
      }

      db.getTypesForWorld(respond, req.params.worldID);
    // }
    // res.send({message: 'Testing'});
  })
  .get("/getType/:worldID/:typeID", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    // if (req.session.worldID === undefined) {
    //   console.log(req.session);
    //   res.send({ message: "Session lost.  Please log in again." });
    // }
    // else {
    function respond(type) {
      if (type === null)
        res.send({ message: "Get Type Failed" });
      else
        res.send(type);
    }

    db.getType(respond, req.params.worldID, req.params.typeID);
    // }
    // res.send({message: 'Testing'});
  })
  .post("/createType", function(req, res) {
    // console.log(`${Date.now()}`);
    // console.log(req.session);
    // console.log(req.body.type);
    if (req.session.userID == undefined) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        // console.log(world);
        if (world === null || world.Owner !== req.session.userID) {
          res.send({ message: "Problem with creating the Type" });
        }
        else {
          function gotType(type) {
            if (type.message == undefined || type.message != "Type not found") {
              res.send({ message: "This world already has a Type by that name." });
            } else {
              function respond(typeID) {
                res.send({ typeID });
              }
        
              db.createType(respond, req.body.type);
            }
          }

          db.getTypeByName(gotType, req.body.type.worldID, req.body.type.Name);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.type.worldID);
    }
    // res.send({message: 'Testing'});
  })
  .delete("/deleteType", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    if (req.session.userID == undefined) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        // console.log(world);
        if (world === null || world.Owner !== req.session.userID) {
          res.send({ message: "Problem with deleting the Type" });
        }
        else {
          function respond(message) {
            res.send(message);
          }

          db.deleteType(respond, req.body.worldID, req.body.typeID);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.worldID);
    }
    // res.send({message: 'Testing'});
  })
  .patch("/updateType", function(req, res) {
    // console.log(req.body.type);
    if (req.session.userID == undefined) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || world.Owner !== req.session.userID) {
          res.send({ message: "Problem with updating the Type" });
        }
        else {
          function respond(message) {
            res.send(message);
          }

          db.updateType(respond, req.body.type.worldID, req.body.type);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.type.worldID);
    }
    // res.send({message: 'Testing'});
  })
  .get("/getThingsForWorld/:worldID", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    // if (req.session.worldID == undefined) {
    //   console.log(req.session);
    //   res.send({ message: "Session lost.  Please log in again." });
    // } else {
      function respond(things) {
        res.send({ things });
      }

      db.getThingsForWorld(respond, req.session.userID, req.params.worldID);
    // }
    // res.send({message: 'Testing'});
  })
  .get("/getThing/:worldID/:thingID", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    // if (req.session.worldID == undefined) {
    //   console.log(req.session);
    //   res.send({ message: "Session lost.  Please log in again." });
    // } else {
      function respond(thing) {
        // console.log(thing);
        res.send(thing);
      }

      db.getThing(respond, req.params.worldID, req.params.thingID);
    // }
    // res.send({message: 'Testing'});
  })
  .post("/createThing", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    if (req.session.userID == undefined) { // || req.session.worldID == undefined || req.session.worldID !== req.body.thing.WorldID) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || world.Owner !== req.session.userID) {
          res.send({ message: "Problem with creating the Thing" });
        }
        else {
          function gotThing(thing) {
            if (thing !== null) {
              res.send({ message: "There is already a Thing by that Name in this world." });
            }
            else {
              function respond(thingID) {
                res.send({ thingID });
              }

              db.createThing(
                respond,
                req.body.thing
              );
            }
          }

          db.getThingByName(gotThing, req.body.thing.worldID, req.body.thing.Name);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.thing.worldID);
    }
    // res.send({message: 'Testing'});
  })
  .delete("/deleteThing", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    if (req.session.userID == undefined) { // || req.session.worldID == undefined) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || world.Owner !== req.session.userID) {
          res.send({ message: "Problem with deleting the Thing" });
        }
        else {
          function respond(message) {
            res.send(message);
          }

          db.deleteThing(
            respond,
            req.body.worldID,
            req.body.thingID
          );
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.worldID);
    }
    // res.send({message: 'Testing'});
  })
  .patch("/updateThing", function(req, res) {
    // console.log(`${Date.now()}: ${req.session.userID}`);
    if (req.session.userID == undefined) { // || req.session.worldID == undefined || req.session.worldID !== req.body.thing.WorldID) {
      console.log(req.session);
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || world.Owner !== req.session.userID) {
          res.send({ message: "Problem with creating the Thing" });
        }
        else {
          function respond(message) {
            res.send(message);
          }

          db.updateThing(
            respond,
            req.body.thing.worldID,
            req.body.thing
          );
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.thing.worldID);
    }
    // res.send({message: 'Testing'});
  });

function close() {
  db.close();
}

module.exports = router;
module.exports.close = close;
