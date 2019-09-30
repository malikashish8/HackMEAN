var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  user = require('./api/hackmean_model'),
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
mongoose.connect(config.mongoURL, { useCreateIndex: true, useNewUrlParser: true });

//allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
process.env.key = new nodeRSA({b: 512, format: 'pkcs8'}).exportKey('pkcs8');
app.use(function(req, res, next) {
  // allow bypass for login
  if(req.path.match(/^\/(login|logout)$/)) {
    next();
    return;
  }
  if(req.headers.authorization && jwt.verify(req.headers.authorization, process.env.key)) {
    next();
  }
  else res.redirect('/login');
})

var routes = require('./api/hackmean_routes');
routes(app);

app.listen(config.listenPort);
logger.info('HackMEAN application running at http://127.0.0.1:' + config.listenPort);

// pre-populate db
require('./mock/populateMock').populateMock();
