function shorten(str, length = 2048, endStr = '...') {
	return str.length < length ? str.substring(0, length - endStr.length) + endStr : str;
}

module.exports = {
	name: 'shorten',
	construct(client) {
		return shorten;
	}
};