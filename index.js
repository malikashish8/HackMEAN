var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  {User} = require('./api/hackmean_model'),
  controller = require('./api/hackmean_controller'),
  bodyParser = require('body-parser');
var morgan = require('morgan');
var compression = require('compression');
var nodeRSA = require('node-rsa');
var jwt = require('jsonwebtoken');

var logger = require('./config/logger');
const config = require('config')

// check mongo connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURL, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true});

//allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if(req.method === 'OPTIONS') {
    res.status(200).json(null);
  } else
    next();
});

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(morgan(config.morganFormat));

app.use(express.static('./public'));
app.set('trust proxy', 1) // trust first proxy

// authentication
let keypair = new nodeRSA({b: 512, format: 'pkcs8'})
process.env.public_key = keypair.exportKey('pkcs8-public-pem');
process.env.private_key = keypair.exportKey('pkcs8-private-pem');
logger.debug('\n' + process.env.public_key);
logger.debug('\n' + process.env.private_key);
app.use(function(req, res, next) {
  // allow bypass for login
  if(req.path.match(/^\/(login|logout)$/) || req.method === 'OPTIONS') {
    next();
    return;
  }
  else if(req.path.match(/^\/post/) && req.method === 'GET') {
    if(req.headers.authorization && req.headers.authorization.split(' ')[1]) {
      jwt.verify(
        req.headers.authorization.split(' ')[1], 
        process.env.public_key, 
        {algorithm: 'RS256'},
        (err, decoded) => {
          if(!err) {
            req.user = decoded.sub;
          }
        }
      );
    }
    next();
    return;
  }
  if(req.headers.authorization && req.headers.authorization.split(' ')[1]) {
    jwt.verify(
      req.headers.authorization.split(' ')[1], 
      process.env.public_key, 
      {algorithm: 'RS256'},
      (err, decoded) => {
        if(err) {
          res.status(401).json({"message": "unauthorized"});
          logger.warn('JWT verification error: ' + err.message);
          return;
        } else {
          req.user = decoded.user;
          next();
        }
      }
    );
  }
  else {
    res.status(401).json({"message": "unauthorized"});
  }
})

var routes = require('./api/hackmean_routes');
routes(app);

app.listen(config.listenPort);
logger.info('HackMEAN application running at http://127.0.0.1:' + config.listenPort);

// populate dummy data in db from ./mock
User.findOne((err, res) => {
  if(!res) {
    require('./mock/populateMock').populateMock();
  }
  if(err) {
    logger.error("unable to connect to the DB to populate mock");
    process.exit(1);
  }
})
