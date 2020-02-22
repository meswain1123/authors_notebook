// world service module

import express from "express";
import { NodeVM, VMScript } from "vm2";
// import session from 'express-session';
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
  .get("/getWorldsForUser", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(worlds) {
        res.send({worlds});
      }
      db.getWorldsForUser(respond, req.session.userID);
    }
  })
  .get("/getPublicWorlds", function(req, res) {
    function respond(worlds) {
      res.send({worlds});
    }
    db.getPublicWorlds(respond);
  })
  .post("/createWorld", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(worldID) {
        res.send({ worldID });
      }
      db.createWorld(respond, req.session.userID, req.body);
    }
  })
  .delete("/deleteWorld", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(message) {
        res.send({ message });
      }

      db.deleteWorld(respond, req.session.userID, req.body);
    }
  })
  .patch("/updateWorld", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(message) {
        console.log(message);
        res.send(message);
      }

      db.updateWorld(respond, req.session.userID, req.body);
    }
  })
  .post("/selectWorld", function(req, res) {
    // // console.log(req.session);
    if (req.session.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function respond(world) {
        if (world != null) {
          // req.session.worldID = world._id;
          // // console.log(req.session);
          res.send({ message: `Welcome to ${world.Name}!` });
        } else {
          res.send({ message: "There was a problem getting the world." });
        }
      }
      db.getWorld(respond, req.session.userID, req.body.worldID);
    }
  })
  .get("/getTypesForWorld/:worldID", function(req, res) {
    function respond(types) {
      // // console.log(types);
      res.send({ types });
    }
    // // console.log(req.params);
    // // console.log(req.session);

    db.getTypesForWorld(respond, req.session.userID, req.params.worldID);
  })
  .get("/getType/:worldID/:typeID", function(req, res) {
    function respond(type) {
      // console.log(type);
      if (type === null)
        res.send({ message: "Get Type Failed" });
      else
        res.send(type);
    }
    // console.log(req.params);

    db.getType(respond, req.params.worldID, req.params.typeID);
  })
  .post("/createType", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ message: "Session lost.  Please log in again." });
    } else {
      function gotType(type) {
        if (type.message == undefined || type.message != "Type not found") {
          res.send({ message: "This world already has a Type by that name." });
        } else {
          function respond(typeID) {
            res.send({ typeID });
          }
    
          db.createType(respond, req.session.userID, req.body);
        }
      }

      db.getTypeByName(gotType, req.body.worldID, req.body.Name);
    }
  })
  .delete("/deleteType", function(req, res) {
    function respond(message) {
      res.send(message);
    }

    db.deleteType(respond, req.session.userID, req.body);
  })
  .patch("/updateType", function(req, res) {
    function respond(message) {
      res.send(message);
    }

    db.updateType(respond, req.session.userID, req.body);
  })
  .get("/getThingsForWorld/:worldID", function(req, res) {
    function respond(things) {
      res.send({ things });
    }

    db.getThingsForWorld(respond, req.session.userID, req.params.worldID);
  })
  .get("/getThing/:thingID", function(req, res) {
    function respond(thing) {
      // console.log(thing);
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
      req.session.userID,
      req.body
    );
  })
  .delete("/deleteThing", function(req, res) {
    function respond(message) {
      res.send(message);
    }

    db.deleteThing(
      respond,
      req.session.userID,
      req.body
    );
  })
  .patch("/updateThing", function(req, res) {
    function respond(message) {
      res.send(message);
    }

    db.updateThing(
      respond,
      req.session.userID,
      req.body
    );
  });

function close() {
  db.close();
}

module.exports = router;
module.exports.close = close;
