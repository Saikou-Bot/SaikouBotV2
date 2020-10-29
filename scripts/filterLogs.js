// Filters out logs for only for certain type

const type = 'Warn';

const logs = require('./out.json');

const fs = require('fs');

const filteredLogs = logs.filter(l => l.type == type);

fs.writeFileSync('./warnlogs.json', JSON.stringify(filteredLogs, null, '	'));

console.log('Filtered', logs.length - filteredLogs.length, 'logs');