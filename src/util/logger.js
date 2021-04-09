const debug = require('debug');

const logger = debug('bot');

logger.info = logger.extend('info');
logger.warn = logger.extend('warn');

module.exports = logger;