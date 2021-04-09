const debug = require('debug');

const logger = debug('bot');
logger.log = console.log.bind(console);

logger.info = logger.extend('info');
logger.warn = logger.extend('warn');

module.exports = logger;