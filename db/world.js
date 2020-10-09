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
    // fixAttributes(); 
    // testUpdate();
    // deleteDuplicateAttributes();
    // fixCreateEditDT();
  });
}
function close() {
  client.close();
}

// function fixCreateEditDT() {
//   try {
//     const db = client.db(dbName);
//     db.collection("thing").updateMany({ },
//       { $set: { "CreateDT" : new Date(), "EditDT": new Date() }
//       }
//     );
//   } catch (err) {
//     console.log(err);
//     respond(err);
//   }
// }

// function testUpdate() {
//   const db = client.db(dbName);
//   const typeID = "pizza";
//   db.collection("thing").updateMany(
//     {
//       TypeIDs: { "$in": [typeID]}
//     },
//     { $set: { "Attributes.$[element].FromTypeID" : null },
//       // $set: { "Defaults.$[element2].FromTypeID" : null },
//       $pull: { TypeIDs: typeID }
//     },
//     {
//       arrayFilters: [ 
//         { "element.FromTypeID": typeID }, 
//         // { "element2.FromTypeID": typeID } 
//       ]
//     }
//   );
// }

// function deleteDuplicateAttributes() {
//   function gotWorlds(worlds) {
//     for (let i = 0; i < worlds.length; i++) {
//       const world = worlds[i];
//       function gotTypes(types) {
//         console.log(`Fixing Types for ${world.Name}`);
//         for (let j = 0; j < types.length; j++) {
//           const type = types[j];
//           let inheritedAttributes = []; 
//           type.SuperIDs.forEach(s => {
//             let superType = types.filter(t => t._id.toString() === s);
//             if (superType.length > 0) {
//               superType = superType[0];
//               console.log(superType);
//               inheritedAttributes = inheritedAttributes.concat(superType.Attributes.map(a => a.attrID));
//             }
//           });
//           console.log(inheritedAttributes);
//           type.Attributes = type.Attributes.filter(a => !inheritedAttributes.includes(a.attrID));
          
//           updateType2(world._id.toString(), type);
//         }
//       }
//       getTypesForWorld(gotTypes, world._id.toString());
//     }
//     console.log(`Finished Fixing Attributes`);
//   }

//   getWorldsForUser(gotWorlds, "5e2f89edc25e5c2ed0a1d294");
// }

// function fixDefaults() {
//   function gotWorlds(worlds) {
//     for (let i = 0; i < worlds.length; i++) {
//       const world = worlds[i];
//       function gotTypes(types) {
//         console.log(`Fixing Defaults for ${world.Name}`);

//         for (let j = 0; j < types.length; j++) {
//           const type = types[j];
//           // type.Attributes = [];
//           type.Defaults = [];
//           for (let k = 0; k < type.AttributesArr.length; k++) {
//             const attribute = type.AttributesArr[k];
//             if ((attribute.DefaultValue !== undefined &&
//               attribute.DefaultValue !== null &&
//               attribute.DefaultValue !== "") ||
//               (attribute.DefaultListValues !== undefined &&
//               attribute.DefaultListValues !== null &&
//               attribute.DefaultListValues.length > 0)){
//               type.Defaults.push({ 
//                 attrID: attribute.attrID, 
//                 DefaultValue: attribute.DefaultValue, 
//                 DefaultListValues: attribute.DefaultListValues
//               });
//             }
//           }
//           updateType2(world._id.toString(), type);
//         }
//       }
//       getTypesForWorld(gotTypes, world._id.toString());
//     }
//     console.log(`Finished Fixing Defaults`);
//   }

//   getWorldsForUser(gotWorlds, "5e2f89edc25e5c2ed0a1d294");
// }

// function fixAttributes() {
//   function gotWorlds(worlds) {
//     for (let i = 0; i < worlds.length; i++) {
//       const world = worlds[i];
//       function gotTypes(types) {
//         console.log(`Fixing Types for ${world.Name}`);
//         const attrMap = {};
//         let allAttributes = [];
//         for (let j = 0; j < types.length; j++) {
//           const type = types[j];
//           allAttributes = allAttributes.concat(type.AttributesArr);
//         }

//         let pos = 0;

//         function respond(message) {
//           console.log(message);
//           if (message !== null)
//             attrMap[allAttributes[pos].Name] = message.toString();
//           pos++;
//           if (pos === allAttributes.length) {
//             for (let j = 0; j < types.length; j++) {
//               const type = types[j];
//               type.Attributes = [];
//               type.Defaults = [];
//               for (let k = 0; k < type.AttributesArr.length; k++) {
//                 const attribute = type.AttributesArr[k];
//                 if (attribute.FromSupers === undefined || 
//                   attribute.FromSupers === null || 
//                   attribute.FromSupers.length === 0) {
//                   type.Attributes.push({ 
//                     attrID: attrMap[attribute.Name], 
//                     index: k 
//                   });
//                 }
//                 if ((attribute.DefaultValue !== undefined &&
//                   attribute.DefaultValue !== null &&
//                   attribute.DefaultValue !== "") ||
//                   (attribute.DefaultListValues !== undefined &&
//                   attribute.DefaultListValues !== null &&
//                   attribute.DefaultListValues !== [])){
//                   type.Defaults.push({ 
//                     attrID: attrMap[attribute.Name], 
//                     DefaultValue: attribute.DefaultValue, 
//                     DefaultListValues: attribute.DefaultListValues
//                   });
//                   // type.Defaults.push({ 
//                   //   attrID: attribute.attrID, 
//                   //   DefaultValue: attribute.DefaultValue, 
//                   //   DefaultListValues: attribute.DefaultListValues
//                   // });
//                 }
//               }
//               updateType2(world._id.toString(), type);
//             }
            
//             function gotThings(things) {
//               console.log(`Fixing Things for ${world.Name}`);
//               // console.log(things);
//               for (let j = 0; j < things.length; j++) {
//                 const thing = things[j];
//                 thing.Attributes = [];
//                 for (let k = 0; k < thing.AttributesArr.length; k++) {
//                   thing.Attributes.push({ 
//                     attrID: attrMap[thing.AttributesArr[k].Name], 
//                     index: k,
//                     Value: thing.AttributesArr[k].Value,
//                     ListValues: thing.AttributesArr[k].ListValues
//                   });
//                 }
//                 updateThing2(world._id.toString(), thing);
//               }
//             }

//             getThingsForWorld(gotThings, "5e2f89edc25e5c2ed0a1d294", world._id.toString());
//           }
//           else if (attrMap[allAttributes[pos].Name] !== undefined) {
//             respond(null);
//           }
//           else {
//             const attr = allAttributes[pos];
//             const newAttr = {
//               _id: null,
//               Name: attr.Name,
//               AttributeType: attr.Type,
//               Options: attr.Options,
//               DefinedType: attr.Type2,
//               ListType: attr.ListType
//             };
//             upsertAttribute(respond, world._id.toString(), newAttr);
//           }
//         }

//         const attr1 = allAttributes[pos];
//         const newAttr1 = {
//           _id: null,
//           Name: attr1.Name,
//           AttributeType: attr1.Type,
//           Options: attr1.Options,
//           DefinedType: attr1.Type2,
//           ListType: attr1.ListType
//         };
//         upsertAttribute(respond, world._id.toString(), newAttr1);
//       }
//       getTypesForWorld(gotTypes, world._id.toString());
//     }
//     console.log(`Finished Fixing Attributes`);
//   }

//   getWorldsForUser(gotWorlds, "5e2f89edc25e5c2ed0a1d294");
// }

// function updateType2(worldID, type) {
//   const db = client.db(dbName);

//   db.collection("type").updateOne(
//     { 
//       _id: type._id, worldID: worldID
//     },
//     { $set: type }
//   );
// }
// function updateThing2(worldID, thing) {
//   const db = client.db(dbName);
//   // console.log(worldID);
//   // console.log(thing);

//   const response = db.collection("thing").updateOne(
//     { 
//       worldID: worldID, 
//       _id: thing._id
//     },
//     { $set: thing }
//   );
//   // console.log(response);
// }

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

function getTypeByID(respond, typeID) {
  try {
    const db = client.db(dbName);
    db.collection("type")
      .find({ _id: ObjectID(typeID) })
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

function getThingByID(respond, thingID) {
  try {
    const db = client.db(dbName);
    db.collection("thing")
      .find({ _id: ObjectID(thingID) })
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
  world.Collaborators = [];

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
          Description: world.Description,
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
        db.collection("attribute").deleteMany({
          worldID: worldID
        });

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
              Description: world.Description,
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

function getAttributesForWorld(respond, worldID) {
  const db = client.db(dbName);
  db.collection("attribute")
    .find({ worldID: worldID })
    .toArray(function(err, docs) {
      if (err) respond({ error: `Error: ${err}.` });
      else {
        respond(docs);
      }
    });
}

function getAttributeByName(respond, worldID, Name) {
  const db = client.db(dbName);
  db.collection("attribute")
    .find({ worldID: worldID, Name: Name })
    .toArray(function(err, docs) {
      if (err) {
        respond({ error: "Get Attribute By Name Error", err: err });
      }
      else if (docs != null && docs.length > 0) {
        respond(docs[0]);
      } else {
        respond({ error: "Attribute not found" });
      }
    });
}

function createAttribute(respond, attribute) {
  const db = client.db(dbName);
  db.collection("attribute").insertOne(attribute
  ).then(res => {
    respond(res.insertedId);
  }).catch(err => {
    console.log(err);
  });
}

// This will only be allowed when it's not referenced anywhere, 
// and maybe not even then
function deleteAttribute(respond, userID, attrID) {
  const db = client.db(dbName);

  db.collection("attribute").deleteOne({
    _id: ObjectID(attrID)
  });
  respond({ message: `Attribute ${attrID} deleted!` });
}

function updateAttribute(respond, worldID, attribute) {
  const db = client.db(dbName);
  attribute._id = ObjectID(attribute._id);
  db.collection("attribute").updateOne(
    { 
      _id: attribute._id, worldID: worldID
    },
    { $set: attribute }
  );
  respond({ message: `Attribute ${attribute.Name} updated!` });
}

function upsertAttribute(respond, worldID, attribute) {
  attribute.worldID = worldID;
  const db = client.db(dbName);
  if (attribute._id !== undefined && attribute._id !== null && !attribute._id.includes("null")) {
    attribute._id = ObjectID(attribute._id);
    db.collection("attribute").updateOne(
      { 
        _id: attribute._id, worldID: worldID
      },
      { $set: 
        {
          Name: attribute.Name.trim(),
          AttributeType: attribute.AttributeType,
          Options: attribute.Options,
          DefinedType: attribute.DefinedType,
          ListType: attribute.ListType,
          worldID: worldID
        } 
      }
    ).then(res => {
      // console.log(res);
      respond(attribute._id.toString());
    });
  }
  else {
    attribute._id = null;
    db.collection("attribute").insertOne(
      attribute
    ).then(res => {
      respond(res.insertedId);
    });
  }
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
  }, { $pull: { SuperIDs: typeID }}).then(res => {
    // console.log(res);
  });

  // Remove it from TypeIDs in Things
  db.collection("thing").updateMany({ 
    worldID: worldID,
    TypeIDs: { $all: [typeID] }
  }, { $pull: { TypeIDs: typeID }}).then(res => {
    // console.log(res);
  });

  db.collection("type").deleteOne({
    _id: ObjectID(typeID)
  }).then(res => {
    // console.log(res);
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

function getTemplates(respond) {
  try {
    const db = client.db(dbName);
    db.collection("template").find()
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

function createTemplate(respond, template) {
  const db = client.db(dbName);
  db.collection("template").insertOne(
    template
  ).then(res => {
    respond(res.insertedId);
  });
}

function getComments(respond, worldID, objectType, objectID) {
  try {
    const db = client.db(dbName);
    db.collection("comment")
      .find({ worldID, objectType, objectID })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function addComment(respond, comment) {
  const db = client.db(dbName);
  db.collection("comment").insertOne(
    comment
  ).then(res => {
    respond(res.insertedId);
  });
}

function updateComment(respond, comment) {
  const db = client.db(dbName);

  comment._id = ObjectID(comment._id);
  db.collection("comment").updateOne(
    { 
      worldID: comment.worldID, 
      _id: comment._id
    },
    { $set: comment }
  );
  respond({ message: `Comment updated!` });
}

function getViews(respond, worldID, userID) {
  try {
    const db = client.db(dbName);
    db.collection("view")
      .find({ worldID, userID })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else respond(docs);
      });
  } catch (err) {
    console.log(err);
    respond(err);
  }
}

function upsertView(respond, view) {
  const db = client.db(dbName);

  db.collection("view").updateOne(
    { 
      userID: view.userID,
      worldID: view.worldID,
      objectType: view.objectType,
      objectID: view.objectID
    },
    { $set: { ViewDT : `${new Date()}` } },
    { upsert: true }
  );
  respond({ message: `View updated!` });
}

module.exports = {
  open,
  close,
  getWorldsForUser,
  getPublicWorlds,
  getWorld,
  getTypeByID,
  getThingByID,
  getWorldForCollab,
  createWorld,
  deleteWorld,
  updateWorld,
  updateWorldForCollab,
  getAttributesForWorld,
  getAttributeByName,
  createAttribute,
  // deleteAttribute,
  updateAttribute,
  upsertAttribute,
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
  updateThing,
  getTemplates,
  createTemplate,
  getComments,
  addComment,
  updateComment,
  getViews,
  upsertView
};
