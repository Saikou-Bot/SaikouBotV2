module.exports = function (message, phrase) {
	if (!phrase) return null;

	// console.log(this);

	return this.categories.get(phrase.toLowerCase()) || null;
}