"use strict";

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _uuid = require("uuid");

var _userService = _interopRequireDefault(require("./services/user-service.js"));

var _worldService = _interopRequireDefault(require("./services/world-service.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// import path from 'path';
// import express from 'express';
// const PORT = process.env.HTTP_PORT || 4001;
// const app = express();
// app.use(express.static(path.join(__dirname, 'client', 'build')));
// app.get('/', (req, res) => {
//   res.send('just gonna send it');
// });
// app.get('/flower', (req, res) => {
//   res.json({
//     name: 'Dandelion',
//     colour: 'Blue-ish'
//   });
// });
// app.listen(PORT, () => {
//   console.log(`Server listening at port ${PORT}.`);
// });
_dotenv["default"].config({
  silent: true
});

var app = (0, _express["default"])();
app.use(_bodyParser["default"].json()); // to support JSON-encoded bodies

app.use(_bodyParser["default"].urlencoded({
  // to support URL-encoded bodies
  extended: true
}));

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy

  app.use((0, _expressSession["default"])({
    genid: function genid(req) {
      return (0, _uuid.v1)(); // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    cookie: {
      // maxAge: 900000, // 15 minutes
      maxAge: 3600000,
      // 1 hour
      secure: true
    },
    resave: true,
    saveUninitialized: true
  }));
} else {
  app.use((0, _expressSession["default"])({
    genid: function genid(req) {
      return (0, _uuid.v1)(); // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    cookie: {
      // maxAge: 900000, // 15 minutes
      maxAge: 3600000 // 1 hour

    },
    // This is in milliseconds.  The example had 60000, which is 1 minute.  I'm going to make it 15 minutes.
    resave: true,
    saveUninitialized: true
  }));
} // let myEnv = process.env;
// process.env = {};


app.use(_express["default"]["static"](_path["default"].join(__dirname, 'client/build')));
app.use('/api/user', _userService["default"]);
app.use('/api/world', _worldService["default"]);
var port = process.env.SERVER_PORT || 5010;
var version = "0.0.1"; // API calls

app.route('/version').get(function (req, res) {
  console.log('version called');
  res.send({
    version: version
  });
}); // app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', function (req, res) {
  res.sendFile(_path["default"].join(__dirname + '/client/build/index.html'));
});
process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, exitCode) {
  if (options.exit) {
    console.log('closing');

    _userService["default"].close();

    _worldService["default"].close();

    process.exit();
  }
} //do something when app is closing


process.on('exit', exitHandler.bind(null, {
  cleanup: true
})); //catches ctrl+c event

process.on('SIGINT', exitHandler.bind(null, {
  exit: true
})); //catches uncaught exceptions
// process.on('uncaughtException', function(e){console.log(e)});

process.on('uncaughtException', exitHandler.bind(null, {
  exit: true
}));
app.listen(port, function () {
  return console.log("Listening on port ".concat(port));
});
