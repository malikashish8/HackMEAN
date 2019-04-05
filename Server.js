var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var compression = require('compression');

var user = require('./api/hackmean_model');
var config = require('./config.json');

var app = express();
var port = config.listenPort;




//connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect (config.mongoURL);
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
app.use(morgan('dev'));
routes(app);
app.use(express.static('./public'));

app.listen(port);

console.log('HackMEAN user RESTful API server started on: '+ port);

//for testing purposes
require('./test/populateMock').populateMock();
