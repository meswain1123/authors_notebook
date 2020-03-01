// world service module

import express from "express";
import { NodeVM, VMScript } from "vm2";
import db from "../db/world-db";
var router = express.Router();
let myEnv = process.env;
process.env = {};

const vm = new NodeVM();
db.open();

// Test route
router
  .get("/test", function(req, res) {
    res.send({ message: "Becky is hot!" });
  })
  .get("/getWorldsForUser/:userID", function(req, res) {
    if (req.params.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(worlds) {
        res.send({worlds});
      }
      db.getWorldsForUser(respond, req.params.userID);
    }
  })
  .get("/getPublicWorlds", function(req, res) {
    function respond(worlds) {
      res.send({worlds});
    }
    db.getPublicWorlds(respond);
  })
  .post("/createWorld", function(req, res) {
    if (req.body.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(worldID) {
        res.send({ worldID });
      }
      db.createWorld(respond, req.body.userID, req.body.world);
    }
  })
  .delete("/deleteWorld", function(req, res) {
    function respond(message) {
      res.send({ message });
    }

    db.deleteWorld(respond, req.body.userID, req.body.worldID);
  })
  .patch("/updateWorld", function(req, res) {
    if (req.body.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(message) {
        res.send(message);
      }

      db.updateWorld(respond, req.body.userID, req.body.world);
    }
  })
  .post("/selectWorld", function(req, res) {
    if (req.body.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(world) {
        if (world != null) {
          res.send({ message: `Welcome to ${world.Name}!` });
        } else {
          res.send({ message: "There was a problem getting the world." });
        }
      }
      db.getWorld(respond, req.body.userID, req.body.worldID);
    }
  })
  .get("/getTypesForWorld/:userID/:worldID", function(req, res) {
    function respond(types) {
      res.send({ types });
    }

    db.getTypesForWorld(respond, req.params.userID, req.params.worldID);
  })
  .get("/getType/:worldID/:typeID", function(req, res) {
    function respond(type) {
      if (type === null)
        res.send({ message: "Get Type Failed" });
      else
        res.send(type);
    }

    db.getType(respond, req.params.worldID, req.params.typeID);
  })
  .post("/createType", function(req, res) {
    if (req.body.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function gotType(type) {
        if (type.message == undefined || type.message != "Type not found") {
          res.send({ message: "This world already has a Type by that name." });
        } else {
          function respond(typeID) {
            res.send({ typeID });
          }
    
          db.createType(respond, req.body.userID, req.body.type);
        }
      }

      db.getTypeByName(gotType, req.body.type.worldID, req.body.type.Name);
    }
  })
  .delete("/deleteType", function(req, res) {
    function respond(message) {
      res.send(message);
    }

    db.deleteType(respond, req.body.userID, req.body.worldID, req.body.typeID);
  })
  .patch("/updateType", function(req, res) {
    function respond(message) {
      res.send(message);
    }

    db.updateType(respond, req.body.userID, req.body.type);
  })
  .get("/getThingsForWorld/:userID/:worldID", function(req, res) {
    function respond(things) {
      res.send({ things });
    }

    db.getThingsForWorld(respond, req.params.userID, req.params.worldID);
  })
  .get("/getThing/:thingID", function(req, res) {
    function respond(thing) {
      res.send(thing);
    }

    db.getThing(respond, req.params.thingID);
  })
  .post("/createThing", function(req, res) {
    function respond(thingID) {
      res.send({ thingID });
    }

    db.createThing(
      respond,
      req.body.userID,
      req.body.thing
    );
  })
  .delete("/deleteThing", function(req, res) {
    function respond(message) {
      res.send(message);
    }

    db.deleteThing(
      respond,
      req.body.userID,
      req.body.thingID
    );
  })
  .patch("/updateThing", function(req, res) {
    function respond(message) {
      res.send(message);
    }

    db.updateThing(
      respond,
      req.body.userID,
      req.body.thing
    );
  });

function close() {
  db.close();
}

module.exports = router;
module.exports.close = close;
