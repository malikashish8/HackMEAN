var express = require('express'),
  app = express(),
  port = process.env.PORT || 8081,
  mongoose = require('mongoose'),
  user = require('./api/hackmean_model'),
  controller = require('./api/hackmean_controller'),
  bodyParser = require('body-parser');
var morgan = require('morgan');
var compression = require('compression');
var session = require('express-session');

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

app.use(morgan('short'));

var routes = require('./api/hackmean_routes');
if (environment !== 'test') app.use(morgan('dev'));
routes(app);
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
    controller.read_user_data(req.body.username, (err, userData) => {
      if(! err) {
        if(userData.username == req.body.username && userData.password == req.body.password){
          req.session.user = userData.username;
          res.json({"message":"Login Successful","type":"success"});
          // res.send();
          next();
        }
      }
    });
  } else {
    console.log("auth failed: username and password not recieved");
    res.status(401);
    res.json({"message":"username or password incorrect","type":"error"});
    // res.send();
    return;
  }
})
routes(app);

app.listen(gConfig.listenPort);

gLogger.info('HackMEAN REST API listening on port ' + gConfig.listenPort);

// pre-populate db
require('./mock/populateMock').populateMock();
