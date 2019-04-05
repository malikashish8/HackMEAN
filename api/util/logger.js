var winston = require('winston');

winston.loggers.add('myLogger', {
  level: 'info',
  format: winston.format.cli(),
  transports: [ new winston.transports.Console() ]
});