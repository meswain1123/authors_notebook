// user service module

import express from 'express';
import db from '../db/user-db';
var router = express.Router();
let myEnv = process.env;
process.env = {};

db.open();

// User routes
router.get('/getUsersByText/:text', function (req, res) {
  function respond(docs) {
    res.send({ message: 'I love when you use me!', users: docs });
  };

  db.getUsersByText(respond, req.params.text);
}).post('/login', function (req, res) {
  function respond(user) {
    if (user != null && user.password == req.body.password) {
      req.session.userID = user._id;
      const pwdStripped = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      };
      res.send({ message: `Welcome to World Building, ${user.firstName}!  Let's make a World!`, user: pwdStripped });
    } else {
      console.log(`Login error: ${user}`);
      res.send({ message: 'There was a problem with your credentials.', user: null });
    }
  };

  db.getUserByEmail(respond, req.body.email);
}).post('/logout', function (req, res) {
  req.session.userID = null;
  res.send({ message: 'Logout Success' });
}).post('/register', function (req, res) {
  function respond(messageObj) {
    res.send(messageObj);
  };
  db.register(respond, req.body);
});

function close() {
  db.close();
}

module.exports = router;
module.exports.close = close; 
