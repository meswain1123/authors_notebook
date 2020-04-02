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


// const dbType = process.env.DB_TYPE;
const dbName = process.env.DB_NAME;
const url = process.env.DB_CONNECTION_STRING;
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
function open() {
  console.log('opening');
  client.connect(function(err) {
    assert.equal(null, err);
  });
}
function close() {
  client.close();
}

function getWorldsForUser(respond, userID) {
  try {
    const db = client.db(dbName);
    db.collection("world")
      .find({ $or: [ {"Collaborators.userID": userID, "Collaborators.type": "collab"}, { Owner: userID }] })
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

function getPublicWorlds(respond) {
  try {
    const db = client.db(dbName);
    db.collection("world")
      .find({ Public: true })
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

function getWorld(respond, userID, worldID) {
  try {
    const db = client.db(dbName);
    db.collection("world")
      .find({ $or: [ { Public: true }, {"Collaborators.userID": userID, "Collaborators.type": "collab"}, { Owner: userID }], _id: ObjectID(worldID) })
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

function getWorldForCollab(respond, worldID) {
  try {
    const db = client.db(dbName);
    db.collection("world")
      .find({ _id: ObjectID(worldID) })
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

function createWorld(respond, userID, world) {
  const db = client.db(dbName);

  db.collection("world")
    .find({ Owner: userID, Name: world.Name })
    .toArray(function(err, docs) {
      if (err) {
        throw err;
      }
      if (docs != null && docs.length > 0) {
        respond({ error: `You already have a world named ${world.Name}.` });
      } else {
        db.collection("world").insertOne({
          Owner: userID,
          Name: world.Name,
          Public: world.Public,
          AcceptingCollaborators: world.AcceptingCollaborators,
          Collaborators: []
        }).then(res => {
          respond(res.insertedId);
        });
      }
    });
}

function deleteWorld(respond, userID, worldID) {
  const db = client.db(dbName);

  db.collection("world")
    .find({ Owner: userID, _id: ObjectID(worldID) })
    .toArray(function(err, docs) {
      if (err) {
        throw err;
      }
      if (docs != null && docs.length > 0) {
        db.collection("thing").deleteMany({
          worldID: worldID
        });

        db.collection("type").deleteMany({
          worldID: worldID
        });

        db.collection("world").deleteOne({
          _id: ObjectID(worldID)
        });
        respond({ message: `World ${worldID} deleted!` });
      } else {
        respond({ error: `You don't own that world!` });
      }
    });
}

function updateWorld(respond, userID, world) {
  const db = client.db(dbName);

  db.collection("world")
    .find({ Owner: userID, _id: ObjectID(world._id) })
    .toArray(function(err, docs) {
      if (err) {
        throw err;
      }
      if (docs != null && docs.length > 0) {
        db.collection("world").updateOne(
          { _id: ObjectID(world._id) },
          {
            $set: {
              Name: world.Name,
              Owner: world.Owner,
              Public: world.Public,
              AcceptingCollaborators: world.AcceptingCollaborators
            }
          }
        );
        respond({ message: `World ${world.Name} updated!` });
      } else {
        respond({ error: `You don't own that world!` });
      }
    });
}

function updateWorldForCollab(respond, world) {
  const db = client.db(dbName);

  db.collection("world").updateOne(
    { _id: ObjectID(world._id) },
    {
      $set: {
        Collaborators: world.Collaborators
      }
    }
  );
  respond({ message: `World ${world.Name} updated!` });
}

function getTypesForWorld(respond, worldID) {
  const db = client.db(dbName);
  db.collection("type")
    .find({ worldID: worldID }, { _id: 1, Name: 1, SuperIDs: 1, ReferenceIDs: 1 })
    .toArray(function(err, docs) {
      if (err) respond({ error: `Error: ${err}.` });
      else {
        respond(docs);
      }
    });
}

function getType(respond, worldID, typeID) {
  try {
    const db = client.db(dbName);
    db.collection("type")
      .findOne({ worldID: worldID, _id: ObjectID(typeID) })
      .then(doc => {
        respond(doc);
      });
  } catch (err) {
    console.err(err);
    respond(err);
  }
}

function getTypeByName(respond, worldID, Name) {
  const db = client.db(dbName);
  db.collection("type")
    .find({ worldID: worldID, Name: Name })
    .toArray(function(err, docs) {
      if (err) {
        respond({ error: "Get Type By Name Error", err: err });
      }
      else if (docs != null && docs.length > 0) {
        respond(docs[0]);
      } else {
        respond({ error: "Type not found" });
      }
    });
}

function createType(respond, type) {
  const db = client.db(dbName);
  db.collection("type").insertOne(type
  ).then(res => {
    respond(res.insertedId);
  }).catch(err => {
    console.log(err);
  });
}

// Deleting a Type is complicated because they can be referenced in
// Types and Things.
// I don't want to delete all the referenced items.
// Instead I will remove it from
// all Supers in Types, all Types in Things,
// and change all Attributes of that Type to str
// and Lists of that Type to List<str>.
// TypeForRelationship I'll just remove the TypeForRelationship field.
// I shouldn't need to do anything for Defaults.
// I may wish to change to having deletes just change a field to say it's inactive.
function deleteType(respond, worldID, typeID) {
  const db = client.db(dbName);

  // Remove it from SuperIDs in Types
  db.collection("type").updateMany({ 
    worldID: worldID,
    SuperIDs: { $all: [typeID] }
  }, { $pull: { SuperIDs: typeID }});

  // Remove it from AttributesArr.FromSupers in Types
  db.collection("type").updateMany({ 
    worldID: worldID,
  }, { $pull: { "AttributesArr.$[].FromSupers": typeID }});


  // Also need to change all links to it in Posts and Descriptions to 
  // something else, but I'm not sure I like that.  
  // Maybe I really should just go with an inactive flag.  Then I 
  // can leave everything alone, and maybe just have all the things that
  // I would have changed (other than Forum Thread Posts) to be marked
  // as to do items for the user.
  // I'll switch to that after I get the other stuff working.
  
  db.collection("type").deleteOne({
    _id: ObjectID(typeID)
  });
  respond({ message: `Type ${typeID} deleted!` });
}

function deleteTypeSimple(respond, userID, typeID) {
  const db = client.db(dbName);

  db.collection("type").deleteOne({
    _id: ObjectID(typeID)
  });
  respond({ message: `Type ${typeID} deleted!` });
}

function updateType(respond, worldID, type) {
  const db = client.db(dbName);
  type._id = ObjectID(type._id);
  db.collection("type").updateOne(
    { 
      _id: type._id, worldID: worldID
    },
    { $set: type }
  );
  respond({ message: `Type ${type.Name} updated!` });
}

function getThingsForWorld(respond, userID, worldID) {
  try {
    const db = client.db(dbName);
    db.collection("thing")
      .find({ worldID: worldID }, { _id: 1, Name: 1, TypeIDs: 1, ReferenceIDs: 1 })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getThing(respond, worldID, thingID) {
  try {
    const db = client.db(dbName);
    db.collection("thing")
      .findOne({ _id: ObjectID(thingID), worldID: worldID }).then(doc => {
        respond(doc);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getThingByName(respond, worldID, name) {
  try {
    const db = client.db(dbName);
    db.collection("thing")
      .findOne({ Name: name, worldID: worldID }).then(doc => {
        respond(doc);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function createThing(respond, thing) {
  const db = client.db(dbName);
  db.collection("thing").insertOne(
    thing
  ).then(res => {
    respond(res.insertedId);
  });
}

function deleteThing(respond, worldID, thingID) {
  const db = client.db(dbName);
  db.collection("thing").deleteOne({
    _id: ObjectID(thingID), worldID: worldID
  });
  respond({ message: `Thing ${thingID} deleted!` });
}

function updateThing(respond, worldID, thing) {
  const db = client.db(dbName);

  thing._id = ObjectID(thing._id);
  db.collection("thing").updateOne(
    { 
      worldID: worldID, 
      _id: thing._id
    },
    { $set: thing }
  );
  respond({ message: `Thing ${thing.Name} updated!` });
}

module.exports = {
  open,
  close,
  getWorldsForUser,
  getPublicWorlds,
  getWorld,
  getWorldForCollab,
  createWorld,
  deleteWorld,
  updateWorld,
  updateWorldForCollab,
  getTypesForWorld,
  getType,
  getTypeByName,
  createType,
  deleteType,
  deleteTypeSimple,
  updateType,
  getThingsForWorld,
  getThing,
  getThingByName,
  createThing,
  deleteThing,
  updateThing
};
