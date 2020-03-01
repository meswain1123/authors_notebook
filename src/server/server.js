
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import uuidv1 from 'uuid/v1';

dotenv.config({ silent: true });

const app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  app.use(session({
    genid: function (req) {
      return uuidv1() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    cookie: {
      maxAge: 60000,
      secure: true
    },
    resave: true,
    saveUninitialized: true
  }));
} else {
  app.use(session({
    genid: function (req) {
      return uuidv1() // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true
  }));
}
let myEnv = process.env;
process.env = {};

import userService from './services/user-service.js';
import worldService from './services/world-service.js';
app.use('/user', userService);
app.use('/world', worldService);
const port = process.env.SERVER_PORT || 5010;

const version = "0.0.1";

// API calls
app.route('/version')
  .get(function (req, res) {
    console.log('version called');
    res.send({ version: version });
  });

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, exitCode) {
  if (options.exit) {
    console.log('closing');
    userService.close();
    worldService.close();
    process.exit();
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

app.listen(port, () => console.log(`Listening on port ${port}`));
