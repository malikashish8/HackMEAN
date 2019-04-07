var winston = require('winston');

winston.loggers.add('consoleLogger', {
  level: 'info',
  format: winston.format.cli(),
  transports: [ new winston.transports.Console() ]
});

global.gLogger = winston.loggers.get('consoleLogger');