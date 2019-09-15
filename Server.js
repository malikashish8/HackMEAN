var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  user = require('./api/hackmean_model'),
  controller = require('./api/hackmean_controller'),
  bodyParser = require('body-parser');
var morgan = require('morgan');
var compression = require('compression');
var session = require('express-session');

var logger = require('./config/logger');
const config = require('config')

// check mongo connection
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoURL, { useCreateIndex: true, useNewUrlParser: true });

//allow cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(compression());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(morgan(config.morganFormat));

app.use(express.static('./public'));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}))

// authentication
app.use(function(req, res, next){
  console.debug("Checking authentication");
  if(req.session.user != null){
    next();
  }
  else if(req.body.username && req.body.password){
    controller.login({username: req.body.username, password: req.body.password}, (err, success) => {
      if(err) {
        logger.debug(err)
        res.status(401)
        res.json({"error": err.message})
      } 
      else {
        req.session.user = req.body.username;
        res.json({"message":"Login Successful","type":"success"});
        next();
      }
    });
  } else {
    console.log("auth failed: username and password not recieved");
    res.status(401);
    res.json({"message":"username or password incorrect","type":"error"});
  }
})

var routes = require('./api/hackmean_routes');
routes(app);

app.listen(config.listenPort);
logger.info('HackMEAN REST API listening on port ' + config.listenPort);

// pre-populate db
require('./mock/populateMock').populateMock();
