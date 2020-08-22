const responses = [
	'bro cringe, more like saikou bot v2',
	'you prop ment saikou bot v2',
	'nah saikou bot v2 way better'
];

const regex = /skv1|sk1|saikou bot v1/i;

module.exports = (client, message) => {
	if (message.author.bot) return;

	if (regex.test(message.content)) {
		message.reply(responses[Math.floor(Math.random() * responses.length)]);
	}
};