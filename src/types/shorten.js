const Util = require('../util/Util');

module.exports = function shorten(len, end) {
	return function typeFn(message, phrase) {
		return Util.shorten(phrase, len, end);
	}
} 