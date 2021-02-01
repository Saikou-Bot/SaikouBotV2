const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');

const credits = {
	bot: {
		'229142187382669312': 'Head Developer',
		'670588428970098708': 'Developer'
	},
	other: {
		'341317140655243266': 'Helper/Tester',
		'216266838156378114': 'Tester',
		'670080884249985085': 'Tester',
		'202547908015423488': 'Tester',
		'697864119302225952': 'Tester',
		'458023820129992716': 'Tester'
	}
}

function fetchCredits(userManager, credit) {
	// const entries = Object.entries(userIDs);
	// const promises = [];

	// for (let i = 0; i < entries.length; i++) {
	// 	const entry = entries[i];

	// 	promises.push(userManager.fetch(entry[0]).then(u => { user: u, title: entry[1] }));
	// }

	return Promise.allSettled(Object.entries(credit)
			.map(e => userManager.fetch(e[0])
				.then(u => { return { user: u, title: e[1] } })))
			.then(results => results
				.filter(r => r.status === 'fulfilled')
				.map(r => r.value));
}

function stringifyCredits(users) {
	return users
		.map(d => `**${d.user.tag}** \`[${d.title}]\``);
}

class Credits extends Command {
	constructor() {
		super('credits', {
			aliases: ['credits', 'creds'],
			description: {
				content: 'Lists all the people who have made Saikou a reality, thank you!!'
			}
		});
	}
	async exec(message) {
		const botUsers = await fetchCredits(this.client.users, credits.bot);
		const otherUsers = await fetchCredits(this.client.users, credits.other);

		const embed = new SaikouEmbed()
			.setTitle('📄 Credits')
			.setDescription('Big thanks to the following people who have helped Saikou bot become a reality, without them the bot wouldn\'t be where it is today.')
			.addField('→ Bot Developers:', stringifyCredits(botUsers))
			.addField('→ Contributors:', stringifyCredits(otherUsers));

		message.util.send(embed);
	}
}
module.exports = Credits;