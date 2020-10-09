// world service module

var express = require("express");
var uuid = require('uuid');
var db = require("../db/world");
var emailer = require("../services/email");

var router = express.Router();

db.open();

router
  .get("/test", function(req, res) {
    res.send({ message: "Becky is hot!" });
  })
  .get("/getWorldsForUser", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function respond(worlds) {
        res.send({worlds});
      }
      db.getWorldsForUser(respond, req.session.userID);
    }
  })
  .get("/getWorldIDByTypeID/:typeID", function(req, res) {
    function respond(type) {
      res.send({ worldID: type.worldID });
    }
    db.getTypeByID(respond, req.params.typeID);
  })
  .get("/getWorldIDByThingID/:thingID", function(req, res) {
    function respond(thing) {
      res.send({ worldID: thing.worldID });
    }
    db.getThingByID(respond, req.params.thingID);
  })
  .get("/getPublicWorlds", function(req, res) {
    function respond(worlds) {
      res.send({worlds});
    }
    db.getPublicWorlds(respond);
  })
  .post("/createWorld", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function respond(worldID) {
        res.send({ worldID });
      }
      const world = req.body.world;
      world.CreateDT = new Date();
      world.EditDT = new Date();
      world.EditUserID = req.session.userID;
      db.createWorld(respond, req.session.userID, world);
    }
  })
  .delete("/deleteWorld", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } 
    else {
      function respond(message) {
        res.send(message);
      }

      db.deleteWorld(respond, req.session.userID, req.body.worldID);
    }
  })
  .patch("/updateWorld", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(oldWorld) {
        function respond(message) {
          res.send(message);
        }

        const world = {...oldWorld,...req.body.world};
        world.EditDT = new Date();
        world.EditUserID = req.session.userID;
        db.updateWorld(respond, req.session.userID, world);
      }
      db.getWorld(gotWorld, req.session.userID, req.body.world._id);
    }
  })
  .patch("/generateCollabLink", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else if (req.body.worldID === null) {
      res.send({ error: "Invalid Call" });
    }
    else {
      function respond(world) {
        const collabID = uuid.v1();
        const collaborator = { 
          userID: -1, 
          email: "",
          collabID, 
          collabLink: `${process.env.ROOT_URL}/world/collaborate/${req.body.worldID}/${collabID}`,
          editPermission: false, 
          deletePermission: false,
          type: "invite" 
        };
        if (world.Collaborators === undefined) {
          world.Collaborators = [];
        }
        world.Collaborators.push(collaborator);
        function finalRespond(response) {
          res.send(collaborator);
        }
        db.updateWorldForCollab(finalRespond, world);
      }
      db.getWorld(respond, req.session.userID, req.body.worldID);
    }
  })
  .patch("/addNewCollaborator", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } 
    else {
      function respond(world) {
        const collabID = uuid.v1();
        const collaborator = { 
          userID: req.body.userID, 
          email: req.body.email,
          collabID, 
          collabLink: `${process.env.ROOT_URL}/world/collaborate/${req.body.worldID}/${collabID}`,
          editPermission: false, 
          deletePermission: false,
          type: "invite" 
        };
        
        if (world.Collaborators === undefined) {
          world.Collaborators = [];
        }
        world.Collaborators.push(collaborator);
        function updateRespond(response) {
          function finalRespond(_) {
            res.send(collaborator);
          }
          const message = `You've been invited to collaborate on the the ${world.Name} world.  If you wish to do so use <a href='${collaborator.collabLink}'>this link</a>.`;
          emailer.sendEmail(finalRespond, req.body.email, "Author's Notebook, Collaboration Invite", message);
        }
        db.updateWorldForCollab(updateRespond, world);
      }
      db.getWorld(respond, req.session.userID, req.body.worldID);
    }
  })
  .patch("/emailCollaborator", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } 
    else {
      function respond(world) {
        const collabID = uuid.v1();
        const collaborator = { 
          userID: -1, 
          email: req.body.email,
          collabID, 
          collabLink: `${process.env.ROOT_URL}/world/collaborate/${req.body.worldID}/${collabID}`,
          editPermission: false, 
          deletePermission: false,
          type: "invite" 
        };
        
        if (world.Collaborators === undefined) {
          world.Collaborators = [];
        }
        world.Collaborators.push(collaborator);
        function updateRespond(response) {
          function finalRespond(_) {
            res.send(collaborator);
          }
          const message = `You've been invited to collaborate on the the ${world.Name} world.  If you wish to do so use <a href='${collaborator.collabLink}'>this link</a>.`;
          emailer.sendEmail(finalRespond, req.body.email, "Author's Notebook, Collaboration Invite", message);
        }
        db.updateWorldForCollab(updateRespond, world);
      }
      db.getWorld(respond, req.session.userID, req.body.worldID);
    }
  })
  .patch("/requestToCollaborate", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } 
    else {
      function respond(world) {
        const collabID = uuid.v1();
        const collaborator = { 
          userID: req.session.userID, 
          email: "",
          collabID, 
          collabLink: ``,
          editPermission: false, 
          deletePermission: false,
          type: "request" 
        };
        
        if (world.Collaborators === undefined) {
          world.Collaborators = [];
        }
        world.Collaborators.push(collaborator);
        function updateRespond(response) {
          res.send(collaborator);
        }
        db.updateWorldForCollab(updateRespond, world);
      }
      db.getWorld(respond, req.session.userID, req.body.worldID);
    }
  })
  .delete("/deleteCollab", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || world.Owner !== req.session.userID) {
          res.send({ error: "Problem with deleting the Collaborator" });
        }
        else {
          function respond(message) {
            res.send(message);
          }

          world.Collaborators = world.Collaborators.filter(c=>c.collabID !== req.body.collabID);
          db.updateWorldForCollab(respond, world);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.worldID);
    }
  })
  .post('/checkCollabID', function (req, res) {
    function respond(response) {
      if (response.error !== undefined || response.Collaborators === undefined || response.Collaborators.filter(c=>c.collabID === req.body.collabID && c.type === "invite").length === 0) {
        res.send({error: "This code isn't good.  Please try again."});
      }
      else {
        res.send({message: "Code is valid.", world: {_id: response._id, Name: response.Name }});
      }
    };
    db.getWorldForCollab(respond, req.body.worldID);
  })
  .delete("/declineCollabInvite", function(req, res) {
    function gotWorld(world) {
      if (world === null) {
        res.send({ error: "Problem with declining the Collaborator Invite" });
      }
      else {
        function respond(message) {
          res.send({message: "Decline successful"});
        }

        world.Collaborators = world.Collaborators.filter(c=>c.collabID !== req.body.collabID);
        db.updateWorldForCollab(respond, world);
      }
    }
    db.getWorldForCollab(gotWorld, req.body.worldID);
  })
  .patch("/acceptCollabInvite", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } 
    else {
      function gotWorld(world) {
        if (world === null) {
          res.send({ error: "Problem with accepting the Collaborator Invite" });
        }
        else {
          function respond(message) {
            res.send({message: "Accept successful"});
          }
          const collab = world.Collaborators.filter(c=>c.collabID === req.body.collabID)[0];
          collab.userID = req.session.userID;
          collab.type = "collab";
          db.updateWorldForCollab(respond, world);
        }
      }
      db.getWorldForCollab(gotWorld, req.body.worldID);
    }
  })
  .patch("/acceptCollabRequest", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } 
    else {
      function gotWorld(world) {
        if (world === null) {
          res.send({ error: "Problem with accepting the Collaborator Invite" });
        }
        else {
          function respond(message) {
            res.send({message: "Accept successful"});
          }
          const collab = world.Collaborators.filter(c=>c.collabID === req.body.collabID)[0];
          collab.type = "collab";
          db.updateWorldForCollab(respond, world);
        }
      }
      db.getWorldForCollab(gotWorld, req.body.worldID);
    }
  })
  .patch("/updateCollaboratorPermission", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } 
    else {
      function gotWorld(world) {
        if (world === null) {
          res.send({ error: "Problem with updating permission" });
        }
        else {
          function respond(message) {
            res.send({message: "Update successful"});
          }
          const collab = world.Collaborators.filter(c=>c.collabID === req.body.collabID)[0];
          collab.editPermission = req.body.editPermission;
          db.updateWorldForCollab(respond, world);
        }
      }
      db.getWorld(gotWorld, req.session.userID, req.body.worldID);
    }
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
          res.send({ error: "There was a problem getting the world." });
        }
      }
      db.getWorld(respond, req.session.userID, req.body.worldID);
    }
  })
  .get("/getAttributesForWorld/:worldID", function(req, res) {
    function respond(attributes) {
      res.send({ attributes });
    }

    db.getAttributesForWorld(respond, req.params.worldID);
  })
  .post("/createAttribute", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || (world.Owner !== req.session.userID && world.Collaborators.filter(c=>c.userID === req.session.userID && c.editPermission).length === 0)) {
          res.send({ error: "Problem with creating the Attribute" });
        }
        else {
          function gotType(type) {
            if (type.error == undefined || type.error != "Attribute not found") {
              res.send({ error: "This world already has a Attribute by that name." });
            } else {
              function respond(typeID) {
                res.send({ typeID });
              }
        
              db.createType(respond, req.body.type);
            }
          }

          db.getAttributeByName(gotType, req.body.type.worldID, req.body.type.Name);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.type.worldID);
    }
  })
  .patch("/updateAttribute", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || (world.Owner !== req.session.userID && world.Collaborators.filter(c=>c.userID === req.session.userID && c.editPermission).length === 0)) {
          res.send({ error: "Problem with updating the Attribute" });
        }
        else {
          function respond(message) {
            res.send(message);
          }

          db.updateAttribute(respond, req.body.type.worldID, req.body.attribute);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.attribute.worldID);
    }
  })
  .patch("/upsertAttributes", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else if (req.body.attributes.length === 0) {
      res.send({ attributes: {} });
    } else {
      function gotWorld(world) {
        if (world === null || (world.Owner !== req.session.userID && world.Collaborators.filter(c=>c.userID === req.session.userID && c.editPermission).length === 0)) {
          res.send({ error: "Problem with updating the Attribute" });
        }
        else {
          let pos = 0;
          const returnAttributesHash = {};

          function respond(message) {
            returnAttributesHash[req.body.attributes[pos].Name] = message;
            pos++;
            if (pos === req.body.attributes.length) {
              res.send({ attributes: returnAttributesHash });
            }
            else {
              db.upsertAttribute(respond, req.body.worldID, req.body.attributes[pos]);
            } 
          }

          db.upsertAttribute(respond, req.body.worldID, req.body.attributes[pos]);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.worldID);
    }
  })
  .get("/getTypesForWorld/:worldID", function(req, res) {
    function respond(types) {
      res.send({ types });
    }

    db.getTypesForWorld(respond, req.params.worldID);
  })
  .get("/getType/:worldID/:typeID", function(req, res) {
    function respond(type) {
      if (type === null)
        res.send({ error: "Get Type Failed" });
      else
        res.send(type);
    }

    db.getType(respond, req.params.worldID, req.params.typeID);
  }) 
  .post("/createType", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || (world.Owner !== req.session.userID && world.Collaborators.filter(c=>c.userID === req.session.userID && c.editPermission).length === 0)) {
          res.send({ error: "Problem with creating the Type" });
        }
        else {
          function gotType(type) {
            if (type.error == undefined || type.error != "Type not found") {
              res.send({ error: "This world already has a Type by that name." });
            } else {
              function respond(typeID) {
                res.send({ typeID });
              }
              const createMe = req.body.type;
              createMe.CreateDT = new Date();
              createMe.EditDT = new Date();
              createMe.EditUserID = req.session.userID;
              db.createType(respond, createMe);
            }
          }

          db.getTypeByName(gotType, req.body.type.worldID, req.body.type.Name);
        }
      }
      db.getWorld(gotWorld, req.session.userID, req.body.type.worldID);
    }
  })
  .delete("/deleteType", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || (world.Owner !== req.session.userID && world.Collaborators.filter(c=>c.userID === req.session.userID && c.editPermission).length === 0)) {
          res.send({ error: "Problem with deleting the Type" });
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
  })
  .patch("/updateType", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || (world.Owner !== req.session.userID && world.Collaborators.filter(c=>c.userID === req.session.userID && c.editPermission).length === 0)) {
          res.send({ error: "Problem with updating the Type" });
        }
        else {
          function gotType(type) {
            function respond(message) {
              res.send(message);
            }

            const updateMe = {...type, ...req.body.type};
            updateMe.EditDT = new Date();
            updateMe.EditUserID = req.session.userID;
            db.updateType(respond, req.body.type.worldID, updateMe);
          }
          db.getTypeByID(gotType, req.body.type._id);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.type.worldID);
    }
  })
  .get("/getThingsForWorld/:worldID", function(req, res) {
    function respond(things) {
      res.send({ things });
    }

    db.getThingsForWorld(respond, req.session.userID, req.params.worldID);
  })
  .get("/getThing/:worldID/:thingID", function(req, res) {
    function respond(thing) {
      res.send(thing);
    }

    db.getThing(respond, req.params.worldID, req.params.thingID);
  })
  .post("/createThing", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || (world.Owner !== req.session.userID && world.Collaborators.filter(c=>c.userID === req.session.userID && c.editPermission).length === 0)) {
          res.send({ error: "Problem with creating the Thing" });
        }
        else {
          function gotThing(thing) {
            if (thing !== null) {
              res.send({ error: "There is already a Thing by that Name in this world." });
            }
            else {
              function respond(thingID) {
                res.send({ thingID });
              }

              const createMe = req.body.thing;
              createMe.CreateDT = new Date();
              createMe.EditDT = new Date();
              createMe.EditUserID = req.session.userID;
              db.createThing(respond, createMe);
            }
          }

          db.getThingByName(gotThing, req.body.thing.worldID, req.body.thing.Name);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.thing.worldID);
    }
  })
  .delete("/deleteThing", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || (world.Owner !== req.session.userID && world.Collaborators.filter(c=>c.userID === req.session.userID && c.editPermission).length === 0)) {
          res.send({ error: "Problem with deleting the Thing" });
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
  })
  .patch("/updateThing", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function gotWorld(world) {
        if (world === null || (world.Owner !== req.session.userID && world.Collaborators.filter(c=>c.userID === req.session.userID && c.editPermission).length === 0)) {
          res.send({ error: "Problem with creating the Thing" });
        }
        else {
          function gotThing(thing) {
            function respond(message) {
              res.send(message);
            }

            const updateMe = {...thing, ...req.body.thing};
            updateMe.EditDT = new Date();
            updateMe.EditUserID = req.session.userID;
            db.updateThing(respond, req.body.thing.worldID, updateMe);
          }
          db.getThingByID(gotThing, req.body.thing._id);
        }
      }

      db.getWorld(gotWorld, req.session.userID, req.body.thing.worldID);
    }
  })
  .post("/createTemplate", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else if (req.body.template.worldID != undefined) {
      function gotAttributes(attributes) {
        function gotTypes(types) {
          function gotThings(things) {
            const template = {
              Name: req.body.template.Name,
              Types: [],
              Things: [],
              Attributes: []
            };
            const typeMap = {
              // realID: {
              //   typeID: "template type id",
              //   Name: "The actual Type object in template"
              // }
            };
            const thingMap = {
              // realID: {
              //   typeID: "template thing id",
              //   Name: "The actual Thing object in template"
              // }
            };
            const attrMap = {
              // realID: {
              //   attrID: "template attr id",
              //   Name: "The actual Attribute object in template"
              // }
            };
            // TODO: It needs to do equivalent of dumb imports first
            // req.body.template comes with a list of typeIDs.  
            // add all those types into a template, along with their attributes.  
            // Utilize mappings for converting old ids to template ids
            req.body.template.typeIDs.forEach(id => {
              let type = types.filter(t => t._id.toString() === id);
              if (type.length > 0) {
                type = type[0];
                const templateType = {...type};
                delete templateType._id;
                delete templateType.worldID;
                delete templateType.ReferenceIDs;
                delete templateType.AttributesArr;
                templateType.typeID = uuid.v1();
                templateType.Attributes = [];
                // templateType.Defaults = [];
                type.Attributes.forEach(a => {
                  const attr = {...a};
                  if (attrMap[a.attrID] === undefined) {
                    let templateAttr = attributes.filter(a => a._id.toString() === attr.attrID);
                    if (templateAttr.length > 0) {
                      templateAttr = {...templateAttr[0]};
                      delete templateAttr._id;
                      delete templateAttr.worldID;
                      templateAttr.attrID = uuid.v1();
                      attr.attrID = templateAttr.attrID;
                      template.Attributes.push(templateAttr);
                      attrMap[a.attrID] = templateAttr;
                    }
                  } else {
                    attr.attrID = attrMap[a.attrID].attrID;
                  }
                  templateType.Attributes.push(attr);
                });
                template.Types.push(templateType);
                typeMap[id] = templateType;
              }
            });
            req.body.template.thingIDs.forEach(id => {
              let thing = things.filter(t => t._id.toString() === id);
              if (thing.length > 0) {
                thing = thing[0];
                const templateThing = {...thing};
                delete templateThing._id;
                delete templateThing.worldID;
                delete templateThing.ReferenceIDs;
                delete templateThing.AttributesArr;
                templateThing.thingID = uuid.v1();
                templateThing.Attributes = [];
                thing.Attributes.forEach(a => {
                  const attr = {...a};
                  if (attrMap[a.attrID] === undefined) {
                    let templateAttr = attributes.filter(a => a._id.toString() === attr.attrID);
                    if (templateAttr.length > 0) {
                      templateAttr = {...templateAttr[0]};
                      delete templateAttr._id;
                      delete templateAttr.worldID;
                      templateAttr.attrID = uuid.v1();
                      attr.attrID = templateAttr.attrID;
                      template.Attributes.push(templateAttr);
                      attrMap[a.attrID] = templateAttr;
                    }
                  } else {
                    attr.attrID = attrMap[a.attrID].attrID;
                  }
                  templateThing.Attributes.push(attr);
                });
                template.Things.push(templateThing);
                thingMap[id] = templateThing;
              }
            });
            template.Attributes.forEach(a => {
              if (a.AttributeType === "Type" || (a.AttributeType === "List" && a.ListType === "Type")) {
                a.DefinedType = typeMap[a.DefinedType].typeID;
              }
            });
            template.Things.forEach(t => {
              const TypeIDs = [];
              t.TypeIDs.forEach(s => {
                TypeIDs.push(typeMap[s].typeID.toString())
              });
              t.TypeIDs = TypeIDs;
              const Attributes = [];
              t.Attributes.forEach(d => {
                const newAttribute = {...d};
                
                let templateAttr = template.Attributes.filter(a => a.attrID === d.attrID);
                if (templateAttr.length > 0) {
                  templateAttr = templateAttr[0];
                  if (templateAttr.AttributeType === "Type") {
                    newAttribute.Value = thingMap[d.Value].thingID;
                  } else if (templateAttr.AttributeType === "List" && templateAttr.ListType === "Type") {
                    newAttribute.ListValues = [];
                    d.ListValues.forEach(v => {
                      newAttribute.ListValues.push(thingMap[v].thingID);
                    });
                  }
                }
                Attributes.push(newAttribute);
              });
              t.Attributes = Attributes;
            });
            template.Types.forEach(t => {
              const SuperIDs = [];
              t.SuperIDs.forEach(s => {
                SuperIDs.push(typeMap[s].typeID.toString())
              });
              t.SuperIDs = SuperIDs;
              const Defaults = [];
              t.Defaults.forEach(d => {
                const newDefault = {...d};
                
                let templateAttr = attrMap[d.attrID];
                if (templateAttr !== undefined) {
                  newDefault.attrID = templateAttr.attrID;
                  
                  if (templateAttr.AttributeType === "Type") {
                    newDefault.DefaultListValues = [];
                    const defThing = thingMap[d.DefaultValue];
                    if (defThing === undefined) {
                      newDefault.DefaultValue = "";
                    } else {
                      newDefault.DefaultValue = defThing.thingID.toString();
                    }
                  } else if (templateAttr.AttributeType === "List" && templateAttr.ListType === "Type") {
                    newDefault.DefaultValue = "";
                    newDefault.DefaultListValues = [];
                    d.DefaultListValues.forEach(v => {
                      const defThing = thingMap[v];
                      if (defThing !== undefined) {
                        newDefault.DefaultListValues.push(defThing.thingID.toString());
                      }
                    });
                  }
                }
                if (newDefault.DefaultValue !== "" || newDefault.DefaultListValues.length > 0) {
                  Defaults.push(newDefault);
                }
              });
              t.Defaults = Defaults;
            });
            function respond(message) {
              res.send(message);
            }
            // The Template is ready. Insert it.
            template.CreateDT = new Date();
            db.createTemplate(respond, template);
          }
          db.getThingsForWorld(gotThings, req.session.userID, req.body.template.worldID);
        }
        db.getTypesForWorld(gotTypes, req.body.template.worldID);
      }
      db.getAttributesForWorld(gotAttributes, req.body.template.worldID);
    } else {
      res.send({ error: "Invalid request" });
    }
  })
  .get("/getTemplates", function(req, res) {
    function respond(templates) {
      res.send({templates});
    }
    db.getTemplates(respond);
  })
  .get("/getComments/:worldID/:objectType/:objectID", function(req, res) {
    function respond(comments) {
      res.send({comments});
    }
    db.getComments(respond, req.params.worldID, req.params.objectType, req.params.objectID);
  })
  .post("/addComment", function(req, res) {
    if (req.session.userID == undefined || req.session.userID != req.body.comment.userID) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function respond(commentID) {
        res.send({ commentID });
      }
      const createMe = req.body.comment;
      createMe.CreateDT = new Date();
      createMe.EditDT = new Date();
      createMe.EditUserID = req.session.userID;
      db.addComment(respond, createMe);
    }
  })
  .patch("/updateComment", function(req, res) {
    if (req.session.userID == undefined) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function respond(message) {
        res.send(message);
      }
      delete req.body.comment.voteSum;
      const updateMe = req.body.comment;
      updateMe.EditDT = new Date();
      updateMe.EditUserID = req.session.userID;
      db.updateComment(respond, updateMe);
    }
  })
  .get("/getViews/:worldID/:userID", function(req, res) {
    function respond(views) {
      res.send(views);
    }
    db.getViews(respond, req.params.worldID, req.params.userID);
  })
  .post("/upsertView", function(req, res) {
    if (req.session.userID == undefined || req.session.userID != req.body.view.userID) {
      res.send({ error: "Session lost.  Please log in again." });
    } else {
      function respond(viewID) {
        res.send({ viewID });
      }
      db.upsertView(respond, req.body.view);
    }
  });

function close() {
  db.close();
}

module.exports = router;
module.exports.close = close;
