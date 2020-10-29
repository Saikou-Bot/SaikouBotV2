const shorten = require('../helpers/shorten');

module.exports = {
	name: 'shorten',
	construct(client) {
		return shorten;
	},
	shorten
};