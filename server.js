
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


import path from 'path';
import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import {v1 as uuidv1} from 'uuid';

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
      // maxAge: 900000, // 15 minutes
      maxAge: 3600000, // 1 hour
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
    cookie: { 
      // maxAge: 900000, // 15 minutes
      maxAge: 3600000, // 1 hour
    }, // This is in milliseconds.  The example had 60000, which is 1 minute.  I'm going to make it 15 minutes.
    resave: true,
    saveUninitialized: true
  }));
}
// let myEnv = process.env;
// process.env = {};

import userService from './services/user-service.js';
import worldService from './services/world-service.js';
app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/api/user', userService);
app.use('/api/world', worldService);
const port = process.env.SERVER_PORT || 4001;

const version = "0.0.1";

// API calls
app.route('/version')
  .get(function (req, res) {
    console.log('version called');
    res.send({ version: version });
  });
// app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
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
// process.on('uncaughtException', function(e){console.log(e)});
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

app.listen(port, () => console.log(`Listening on port ${port}`));

