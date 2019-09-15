var winston = require('winston');
var config = require('config')

const logger = winston.createLogger({
  level: config.logLevel,
  format: winston.format.cli(),
  transports: [ new winston.transports.Console() ]
});

module.exports = logger