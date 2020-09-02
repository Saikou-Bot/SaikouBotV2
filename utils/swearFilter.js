const specialChars = require('../jsonFiles/special.json');
const badwords = require('../jsonFiles/badwords.json');

function removeDuplicates(str) {
	return str.replace(/(?<=(.))\1/gi, '');
}

function filter(str) {
	str = removeDuplicates(str);
	str = str.replace(/[^a-zA-Z0-9- ]/g, '');
	return str;
}

function swearFilter (message) {
	const filtered = filter(message.content);
	const specialFilter = filter(message.content.split('').map((item) => specialChars[item] || item).join(''));
	if (badwords.some((badword) => {
		const badwordReg = new RegExp(`\\b${badword.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
		return badwordReg.test(filtered) || badwordReg.test(specialFilter);
	})) {
		message.delete();
		message.channel.send('Got \'em');
		return true;
	}
	else return false;
}

module.exports = {
	name: 'swearFilter',
	construct(client) {
		return swearFilter;
	}
}