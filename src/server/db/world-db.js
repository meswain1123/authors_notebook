import dotenv from "dotenv";
dotenv.config({ silent: true });
import { MongoClient, ObjectID } from "mongodb";
import assert from "assert";
const dbType = process.env.DB_TYPE;
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
  // // console.log('closing');
  client.close();
}

function getWorldsForUser(respond, userID) {
  try {
    const db = client.db(dbName);
    db.collection("world")
      .find({ Owner: userID }) // I'll add collaborators later
      .toArray(function(err, docs) {
        if (err) respond({ message: `Error: ${err}.` });
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
        // console.log(docs);
        if (err) respond({ message: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond([]);
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getWorld(respond, userID, worldID) {
  // // console.log(`Getting world: ${worldID}`);
  // // console.log(userID);
  // respond(email);
  try {
    const db = client.db(dbName);
    db.collection("world")
      .find({ $or: [ { Public: true }, { Owner: userID }], _id: worldID }) // I'll add collaborators later
      .toArray(function(err, docs) {
        // // console.log(docs);
        if (err) respond({ message: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond(null);
        else respond(docs[0]);
      });
  } catch (err) {
    // console.log('error 61');
    console.log(err);
    respond(err);
  }
}

function createWorld(respond, userID, world) {
  // // console.log(userID);
  // // console.log(world);
  const db = client.db(dbName);

  db.collection("world")
    .find({ Owner: userID, Name: world.Name })
    .toArray(function(err, docs) {
      if (err) {
        throw err;
      }
      if (docs != null && docs.length > 0) {
        respond({ message: `You already have a world named ${world.Name}.` });
      } else {
        db.collection("world").insertOne({
          // world
          Owner: userID,
          Name: world.Name,
          Public: world.Public
        }).then(res => {
          respond(res.insertedId);
        });
      }
    });
}

function deleteWorld(respond, userID, worldID) {
  // // console.log(`Registering user: ${user.email}`);
  const db = client.db(dbName);

  db.collection("world")
    .find({ Owner: userID, _id: worldID })
    .toArray(function(err, docs) {
      if (err) {
        throw err;
      }
      if (docs != null && docs.length > 0) {
        db.collection("thing").deleteMany({
          WorldID: worldID
        });

        db.collection("type").deleteMany({
          WorldID: worldID
        });

        db.collection("world").deleteOne({
          _id: worldID
        });
        respond({ message: `World ${worldID} deleted!` });
      } else {
        respond({ message: `You don't own that world!` });
      }
    });
}

function updateWorld(respond, userID, world) {
  // // console.log(`Updating user: ${user.email}`);
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
              Public: world.Public
            }
          }
        );
        respond({ message: `World ${world.Name} updated!` });
      } else {
        respond({ message: `You don't own that world!` });
      }
    });
}

function getTypesForWorld(respond, userID, worldID) {
  // console.log(worldID);
  const db = client.db(dbName);
  db.collection("type")
    .find({ WorldID: worldID })
    .toArray(function(err, docs) {
      if (err) respond({ message: `Error: ${err}.` });
      else {
        // console.log(docs);
        respond(docs);
      }
    });
}

function getType(respond, worldID, typeID) {
  try {
    const db = client.db(dbName);
    db.collection("type")
      .findOne({ WorldID: worldID, _id: ObjectID(typeID) })
      .then(doc => {
        // console.log(doc);
        respond(doc);
      });
  } catch (err) {
    // console.log("Get Type Error");
    console.err(err);
    respond(err);
  }
}

function getTypeByName(respond, worldID, Name) {
  const db = client.db(dbName);
  db.collection("type")
    .find({ WorldID: worldID, Name: Name })
    .toArray(function(err, docs) {
      if (err) {
        // console.log("Get Type By Name Error");
        respond({ message: "Get Type By Name Error", err: err });
      }
      else if (docs != null && docs.length > 0) {
        respond(docs[0]);
      } else {
        respond({ message: "Type not found" });
      }
    });
}

function createType(respond, worldID, type) {
  // I put this here to show all the fields that will be on the type collection.
  // const type1 = {
  //   _id: auto generated,
  //   WorldID: worldID,
  //   Name: type.Name, // str
  //   Description: type.Description, // str
  //   Supers: type.Supers, // List<ObjectID>
  //   Attributes: type.Attributes, // List<str> names of the attributes
  //   AttributeTypes: type.Attributes, // List<str> names of the types
  //   TypeForRelationship: type.TypeForRelationship, // str: <_id>_<Name> if this has a value then it's a Relationship Type, and is meant to represent Relationships between two Things of the given Type.
  //   ReversalName: type.ReversalName, // str only valid if it's a Relationship Type.  If it has a value then the second Thing in the Relationship will show this as their Relationship with the first Thing.  Example: Husband and Wife.
  //   Defaults: type.Defaults // List<T>
  // };
  // // I may choose to do things this way as a security precaution.
  // // I'm not going to code it now, but if I choose to go this way
  // // then I'll need to do the same for World and Thing.
  // const type1 = {
  //   WorldID: worldID,
  //   Name: type.Name,
  //   Description: type.Description
  // };
  // if (type.Supers != undefined)
  //   type1.Supers = type.Supers;
  // if (type.Attributes != undefined)
  //   type1.Attributes = type.Attributes;
  // if (type.TypeForRelationship != undefined){
  //   type1.TypeForRelationship = type.TypeForRelationship;
  //   if (type.ReversalName != undefined)
  //     type1.ReversalName = type.ReversalName;
  // }
  // if (type.Defaults != undefined)
  //   type1.Defaults = type.Defaults;
  const db = client.db(dbName);
  // console.log(type);
  db.collection("type").insertOne(type
  ).then(res => {
    respond(res.insertedId);
  }).catch(err => {
    // console.log("Create Type Error");
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
function deleteType(respond, userID, worldID, typeID) {
  // // console.log(`Registering user: ${user.email}`);
  const db = client.db(dbName);

  // Remove it from SuperIDs in Types
  db.collection("type").updateMany({ 
    WorldID: worldID,
    SuperIDs: { $all: [typeID] }
  }, { $pull: { SuperIDs: typeID }});

  // Remove it from AttributesArr.FromSupers in Types
  db.collection("type").updateMany({ 
    WorldID: worldID,
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
  // // console.log(`Registering user: ${user.email}`);
  const db = client.db(dbName);

  db.collection("type").deleteOne({
    _id: ObjectID(typeID)
  });
  respond({ message: `Type ${typeID} deleted!` });
}

function updateType(respond, userID, type) {
  const db = client.db(dbName);
  type._id = ObjectID(type._id);
  db.collection("type").updateOne(
    { 
      _id: type._id
    },
    { $set: type }
  );
  respond({ message: `Type ${type.Name} updated!` });
}

function getThingsForWorld(respond, userID, worldID) {
  try {
    const db = client.db(dbName);
    db.collection("thing")
      .find({ WorldID: worldID }, { _id: 1, Name: 1, Types: 1 })
      .toArray(function(err, docs) {
        if (err) respond({ message: `Error: ${err}.` });
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function getThing(respond, thingID) {
  try {
    const db = client.db(dbName);
    db.collection("thing")
      .findOne({ _id: ObjectID(thingID) }).then(doc => {
        respond(doc);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function createThing(respond, userID, thing) {
  const db = client.db(dbName);
  // console.log(thing);
  db.collection("thing")
    .find({ WorldID: thing.WorldID, Name: thing.Name })
    .toArray(function(err, docs) {
      if (err) {
        throw err;
      }
      else if (docs != null && docs.length > 0) {
        respond({
          message: `You already have a Thing named ${thing.Name} on this world.`
        });
      } else {
        db.collection("thing").insertOne(
          thing
        ).then(res => {
          respond(res.insertedId);
        });
      }
    });
}

function deleteThing(respond, userID, thingID) {
  const db = client.db(dbName);
  db.collection("thing").deleteOne({
    // WorldID: worldID, 
    _id: ObjectID(thingID)
  });
  respond({ message: `Thing ${thingID} deleted!` });
}

function updateThing(respond, userID, thing) {
  const db = client.db(dbName);
  // console.log(thing);

  thing._id = ObjectID(thing._id);
  db.collection("thing").updateOne(
    { 
      WorldID: thing.WorldID, 
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
  createWorld,
  deleteWorld,
  updateWorld,
  getTypesForWorld,
  getType,
  getTypeByName,
  createType,
  deleteType,
  deleteTypeSimple,
  updateType,
  getThingsForWorld,
  getThing,
  createThing,
  deleteThing,
  updateThing
};
