function intercept(stream, callback) {
	const write = stream.write;
	stream.write = function() {
		callback(...arguments);
		return write.apply(stream, arguments);
	};
}

module.exports = intercept;