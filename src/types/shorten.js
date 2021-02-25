const { shorten } = require('../util/Util');

module.exports = function shorten(len, end) {
	return function typeFn(message, phrase) {
		return shorten(phrase, len, end);
	}
} 