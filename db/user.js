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
    // console.log(err);
    assert.equal(null, err);
  });
}
function close() {
  client.close();
}

function getUsersByText(respond, text) {
  const db = client.db(dbName);

  db.collection("user")
    .find({ $text: { $search: text } })
    .toArray(function(err, docs) {
      if (err) throw err;
      respond(docs);
    });
}

function getAllUsers(respond, text) {
  const db = client.db(dbName);

  db.collection("user")
    .find({})
    .toArray(function(err, docs) {
      if (err) throw err;
      respond(docs);
    });
}

function getUserByEmail(respond, email) {
  try {
    const db = client.db(dbName);

    db.collection("user")
      .find({ email: email })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}` });
        else if (docs == null || docs.length == 0) respond({ message: 'User not found' });
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(null);
  }
}

function getUserByName(respond, name) {
  try {
    const db = client.db(dbName);

    db.collection("user")
      .find({ username: name })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}` });
        else if (docs == null || docs.length == 0) respond({ message: 'User not found' });
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(null);
  }
}

function register(respond, user, code) {
  const db = client.db(dbName);

  db.collection("user").insertOne({
    username: user.username,
    email: user.email,
    password: user.password,
    followingWorlds: user.followingWorlds,
    confirmEmailCode: code,
    emailConfirmed: false
  });
  respond({ 
    message: `Registration successful for ${user.email}!  We've sent you an email with a link to confirm your account.  Please follow it.`, 
    confirmEmailCode: code
  });
}

function getUserByConfirmEmailCode(respond, code) {
  try {
    const db = client.db(dbName);

    db.collection("user")
      .find({ confirmEmailCode: code }, { _id: 1, email: 1 })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.` });
        else if (docs == null || docs.length == 0) respond({error: "User not found"});
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(null);
  }
}

function confirmEmail(respond, id) {
  const db = client.db(dbName);
  const r = db.collection("user").updateOne(
    { _id: ObjectID(id) },
    {
      $set: {
        emailConfirmed: true
      }
    }
  );
  respond({ message: `Your email has been confirmed.` });
}

function updateUser(respond, id, user) {
  const db = client.db(dbName);
  db.collection("user").updateOne(
    { _id: ObjectID(id) },
    {
      $set: {
        username: user.username,
        email: user.email,
        // password: user.password,
        followingWorlds: user.followingWorlds
      }
    }
  );
  respond({ message: `User ${user.email} updated!` });
}

function setResetPasswordCode(respond, email, code, expiration) {
  const db = client.db(dbName);
  const response = db.collection("user").updateOne(
    { email: email },
    {
      $set: {
        resetPasswordCode: code,
        passCodeExpiration: expiration
      }
    }
  );
  if (response.modifiedCount === 0) {
    respond({ error: "User not found" });
  }
  else {
    respond({ resetPasswordCode: code });
  }
}

function getUserByCode(respond, code) {
  try {
    const db = client.db(dbName);

    db.collection("user")
      .find({ resetPasswordCode: code }, { _id: 1, email: 1, passCodeExpiration: 1 })
      .toArray(function(err, docs) {
        if (err) respond({ error: `Error: ${err}.  Try registering.` });
        else if (docs == null || docs.length == 0) respond({error: "User not found"});
        else respond(docs[0]);
      });
  } catch (err) {
    console.log(err);
    respond(null);
  }
}

function updateUserPassword(respond, id, password) {
  const db = client.db(dbName);
  db.collection("user").updateOne(
    { _id: ObjectID(id) },
    {
      $set: {
        password: password,
        passCodeExpiration: new Date()
      }
    }
  );
  respond({ message: `User password updated!  Please try logging in.` });
}

module.exports = {
  open,
  close,
  getUserByEmail,
  getUserByName,
  getUsersByText,
  getAllUsers,
  register,
  getUserByConfirmEmailCode,
  confirmEmail,
  updateUser,
  setResetPasswordCode,
  getUserByCode,
  updateUserPassword
};
