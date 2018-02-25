console.log("Starting server")
var express = require('express'),
  app = express(),
  port = process.env.PORT || 8081,
  mongoose = require('mongoose'),
  user = require('./api/hackmean_model')
  bodyParser = require('body-parser');

//connect to mongoose
mongoose.Promise = global.Promise;
mongoose.connect ('mongodb://localhost/mydb');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var routes = require('./api/hackmean_routes');
routes(app);

app.listen(port);

console.log('HackMEAN user RESTful API server started on: '+ port);
