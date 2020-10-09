"use strict";

var _path = _interopRequireDefault(require("path"));

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _uuid = require("uuid");

var _user = _interopRequireDefault(require("./apis/user.js"));

var _world = _interopRequireDefault(require("./apis/world.js"));

var _vtt = _interopRequireDefault(require("./apis/vtt.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
app.use('/api/user', _user["default"]);
app.use('/api/world', _world["default"]);
app.use('/api/vtt', _vtt["default"]);
var port = process.env.SERVER_PORT || 4001;
var version = "0.0.1"; // API calls

app.route('/version').get(function (req, res) {
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

    _user["default"].close();

    _world["default"].close();

    _vtt["default"].close();

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
