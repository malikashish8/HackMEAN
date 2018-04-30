var express = require('express'),
  app = express(),
  port = process.env.PORT || 8081,
  mongoose = require('mongoose'),
  user = require('./api/hackmean_model'),
  bodyParser = require('body-parser');
var morgan = require('morgan');
var compression = require('compression')

//connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect ('mongodb://localhost/mydb');
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
mock = require('./test/initMock');
//mock.initMock();
