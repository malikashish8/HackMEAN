var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var compression = require('compression');

var config = require('./config.json');
const environment = process.env.NODE_ENV || 'dev';
global.gConfig = config[environment];
var initLogger = require('./api/util/logger');
var app = express();

// check mongo connection
mongoose.Promise = global.Promise;
mongoose.connect(gConfig.mongoURL, { useCreateIndex: true, useNewUrlParser: true });

//allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var routes = require('./api/hackmean_routes');
if (environment !== 'test') app.use(morgan('dev'));
routes(app);
app.use(express.static('./public'));

app.listen(gConfig.listenPort);

gLogger.info('HackMEAN REST API listening on port ' + gConfig.listenPort);

// pre-populate db
require('./mock/populateMock').populateMock();
