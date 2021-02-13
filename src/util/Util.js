class Util {
	constructor() {
		throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
	}
	// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	static getRandomInt(min, max) {
		if (min && !max) { max = min; min = 0}
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
	}
	static choose(arr) {
		if (!Array.isArray(arr) || arr.length < 1) return null;

		return arr[Util.getRandomInt(arr.length)];
	}
}
module.exports = Util;