const Filter = require('bad-words');
const filter = new Filter();

module.exports = (client, message) => {
	if(filter.isProfane(message.content)) {
		message.delete()
			.catch((err) => {
				console.error(err);
				message.channel.send('Bad Langauge');
			});
	}
};