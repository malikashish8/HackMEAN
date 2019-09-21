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
// app.use(function(req, res, next){
//   // allow bypass for login
//   if(req.path.match(/^\/login$/)) {
//     next()
//     return
//   }
//   if(req.session.user != null){
//     next();
//   }
//   else res.redirect('/login')
// })

var routes = require('./api/hackmean_routes');
routes(app);

app.listen(config.listenPort);
logger.info('HackMEAN application running at http://127.0.0.1:' + config.listenPort);

// pre-populate db
require('./mock/populateMock').populateMock();
