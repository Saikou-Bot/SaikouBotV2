const { Command, Argument, Category } = require('discord-akairo');
const CategoryType = require('../../types/category');
const SaikouEmbed = require('../../structure/SaikouEmbed');

const categoryDisplayNames = {
	'info': 'ℹ️ Information'
}

class Help extends Command {
	constructor() {
		super('help', {
			aliases: ['help'],
			description: {
				content: 'Gain a list of all saikou\'s commands!',
				usage: '.help <resource>'
			}
			args: [{
				id: 'resource',
				type: Argument.union('category', 'commandAlias'),
				match: 'rest'
			}]
		})
	}
	async exec(message, args) {
		let dm;
		if (message.channel.type === 'DM') dm = message.channel
		else dm = await message.author.createDM();

		const prefix = await this.handler.prefix

		if (!args.resource) {

			const helpEmbed = new SaikouEmbed()
				.setTitle('📖 Saikou Commands')
				.setDescription(`The prefix for Saikou is \`${prefix}\`
Currently featuring ${this.handler.modules.size} commands!`);

			this.handler.categories.each(category => {
				helpEmbed.addField(categoryDisplayNames[category.id] || category.id, `\`${prefix}help ${category.id}\``);
			});

			dm.send(helpEmbed);
		}
		else {
			if (args.resource instanceof Category) {
				const category = args.resource;

				const categoryEmbed = new SaikouEmbed()
					.setTitle(`${categoryDisplayNames[category.id] || category.id} Commands`)
					.setDescription(`Saikou currently features ${category.size} ${category.id} commands!\n\n**${category.map(m => `${prefix}${m.aliases[0]}`).join(', ')}**`);

				dm.send(categoryEmbed);
			}
			else if (args.resource instanceof Command) {
				const command = args.resource;

				const aliases = command.aliases.concat();
				const name = aliases.shift();

				const commandEmbed = new SaikouEmbed()
					.setTitle(`${prefix}${name} Information`)
					.addField('Command Description:', `${command.description ? command.description.content : undefined || 'No Description.'}`)
					.addField('Usage:', `${command.description && command.description.usage ? `\`${commandConfig.usage}\`` : 'No Usage'}`)
					.addField('Aliases:', `${aliases.length ? aliases.join(', ') : 'N/A'}`);
					// .addField('Accessible to:', `${commandConfig.accessableby || 'N/A'}`)

				dm.send(commandEmbed);
			}
		}
	}
}
module.exports = Help;