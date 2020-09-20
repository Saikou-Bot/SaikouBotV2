const specialChars = require('../jsonFiles/special.json');
const badwords = require('../jsonFiles/badwords.json');

const emoji = require('node-emoji');

function removeDuplicates(str) {
	return str.replace(/(?<=(.))\1/gi, '');
}

function filter(str) {
	str = removeDuplicates(str);
	str = emoji.unemojify(str);
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
		// message.delete();
		// message.channel.send('Got \'em');
		const autoModChannel = message.client.guilds.cache.get('704621852231729212').channels.cache.get('756956104281292882');
		if (autoModChannel) {
			autoModChannel.send(new MessageEmbed({
				author: {
					name: message.member ? message.member.displayName : message.author.username,
					iconURL: message.author.displayAvatarURL()
				},
				title: 'Swear filter triggered',
				description: `\`${message.cleanContent}\`\n[\[Jump to message\]](${message.url})`,
				color: colours.red,
				footer: {
					text: `User ID: ${message.author.id}`
				}
			}).setTimestamp());
		}
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