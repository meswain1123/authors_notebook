// user service module

// import express from 'express';
// import db from '../db/user-db';
var express = require("express");
var db = require("../db/user");
var emailer = require("../services/email");
var router = express.Router();
var uuid = require('uuid');

db.open();

// User routes
router.get('/getUsersByText/:text', function (req, res) {
  function respond(docs) {
    res.send({ message: 'I love when you use me!', users: docs });
  };
  db.getUsersByText(respond, req.params.text);
  // res.send({message: 'Testing'});
}).get('/getAllUsers', function (req, res) {
  function respond(users) {
    const safeUsers = users.map(u => { return {_id: u._id, email: u.email, username: u.username};});
    res.send(safeUsers);
  };
  db.getAllUsers(respond);
}).get('/getUserByName/:name', function (req, res) {
  function respond(users) {
    const safeUsers = users.map(u => { return {_id: u._id, email: u.email, username: u.username};});
    res.send({ users: safeUsers });
  };
  db.getUserByName(respond, req.params.name);
}).post('/login', function (req, res) {
  function respond(user) {
    if (user != null && user.message == null && user.password == req.body.password) {
      req.session.userID = user._id;
      const pwdStripped = {
        _id: user._id,
        email: user.email,
        username: user.username,
        followingWorlds: user.followingWorlds
      };
      res.send({ message: `Welcome to World Building, ${user.username}!  Let's make a World!`, user: pwdStripped });
    } else {
      console.log(`Login error`);
      console.log(user);
      res.send({ error: 'There was a problem with your credentials.', user: null });
    }
  };

  db.getUserByEmail(respond, req.body.email);
}).post('/logout', function (req, res) {
  req.session.userID = null;
  res.send({ message: 'Logout Success' });
}).post('/register', function (req, res) {
  function getUserRespond(user) {
    if (user.error != null) {
      res.send({ error: user.error });
    }
    else if (user.message == null) {
      res.send({ error: "A user with this email already exists.  You may need to reset your password."})
    }
    else {
      function getUserNameRespond(user2) {
        if (user2.error != null) {
          res.send({ error: user2.error });
        }
        else if (user2.message == null) {
          res.send({ error: "A user with this email already exists.  You may need to reset your password."})
        }
        else {
          function respond(response) {
            function finalRespond(_) {
              res.send({message: response.message});
            }
        
            const message = `Welcome to Author's Notebook.  
              Use <a href='http://localhost:3000/User/confirmEmail/${response.confirmEmailCode}'>this link</a> to confirm your email.  It will be good for one hour.  
              If you did not register with Author's Notebook, please disregard this email.`;
            emailer.sendEmail(finalRespond, req.body.email, "Author's Notebook, Registration", message);
          };
          const myDate = new Date();
          myDate.setHours(myDate.getHours() + 1);
          db.register(respond, req.body, uuid.v1(), myDate);
        }
      };
    
      db.getUserByName(getUserNameRespond, req.body.username);
    }
  };

  db.getUserByEmail(getUserRespond, req.body.email);
}).patch('/confirmEmail', function (req, res) {
  function respond(response) {
    if (response.error !== undefined) {
      res.send({error: "This code isn't good.  Please try again."});
    }
    else {
      function finalRespond(finalResponse) {
        res.send(finalResponse);
      };
      db.confirmEmail(finalRespond, response._id);
    }
  };
  db.getUserByConfirmEmailCode(respond, req.body.code);
}).post('/sendReset', function (req, res) {
  function respond(response) {
    if (response.error !== undefined) {
      res.send({error: response.error});
    }
    else {
      function finalRespond(_) {
        res.send({message: "A link has been sent to your email to let you reset your password."});
      }

      const message = `You requested to reset your password.  
        Use <a href='http://localhost:3000/User/resetPassword/${response.resetPasswordCode}'>this link</a> to reset your password.  It will be good for one hour.  
        If you did not request this then just ignore this email.`;
      emailer.sendEmail(finalRespond, req.body.email, "Author's Notebook, Reset Password", message);
    }
  };
  const myDate = new Date();
  myDate.setHours(myDate.getHours() + 1);
  db.setResetPasswordCode(respond, req.body.email, uuid.v1(), myDate);
}).post('/checkResetPasswordCode', function (req, res) {
  function respond(response) {
    if (response.error !== undefined) {
      res.send({error: "This code isn't good.  Please try again."});
    }
    else {
      const myDate = new Date();
      if (response.passCodeExpiration < myDate) {
        res.send({error: "This code isn't good.  Please try again."});
      }
      else {
        res.send({message: "Code is valid."});
      }
    }
  };
  db.getUserByCode(respond, req.body.code);
}).patch('/resetPassword', function (req, res) {
  function respond(response) {
    if (response.error !== undefined) {
      res.send({error: "This code isn't good.  Please try again."});
    }
    else {
      const myDate = new Date();
      if (response.passCodeExpiration < myDate) {
        res.send({error: "This code isn't good.  Please try again."});
      }
      else {
        function finalRespond(finalResponse) {
          res.send(finalResponse);
        };
        db.updateUserPassword(finalRespond, response._id, req.body.newPassword);
      }
    }
  };
  db.getUserByCode(respond, req.body.code);
}).patch('/update', function (req, res) {
  if (req.session.userID !== req.body._id) {
    res.send({error: "Session lost.  Please log in again."});
  } 
  else {
    function respond(response) {
      res.send(response);
    };
    db.updateUser(respond, req.session.userID, req.body);
  }
}).post('/emailTest', function (req, res) {
  function respond(response) {
    res.send(response);
  };
  emailer.sendEmail(respond, req.body.email, "test subject", "test message")
});

function close() {
  db.close();
}

module.exports = router;
module.exports.close = close; 
