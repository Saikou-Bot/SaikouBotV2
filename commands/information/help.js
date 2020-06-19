/* eslint-disable space-before-function-paren */
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const colours = require('../../jsonFiles/colours.json');
const prefix = process.env.PREFIX;

module.exports = {
	config: {
		name: 'help',
		description: 'Gain a list of all saikou\'s commands!',
		usage: '.help || .help <commandName>',
		accessableby: 'Followers+',
		aliases: ['commands', 'cmds', 'saikou'],
		channel: 'bot-commands'
	},
	run: async (bot, message, args) => {

		if (!args[0]) {

			const embed = new MessageEmbed()
				.setTitle(`:book: ${bot.user.username} Commands`)
				.setDescription(`The prefix for ${bot.user.username} is \`${prefix}\` \nCurrently featuring ${bot.commands.size} commands!`)
				.addField('💵 Currency', `\`${prefix}help currency\``, true)
				.addField('🎲 Fun', `\`${prefix}help fun\``, true)
				.addField('<:ban:701729757909352538> Moderation', `\`${prefix}help moderation\``, true)
				.addField('ℹ️ Information', `\`${prefix}help information\``, true)
				.addField('🎮 Games', `\`${prefix}help games\``, true)
				.addField('⚙️ General', `\`${prefix}help general\``, true)
				.setFooter('This will timeout in 60 seconds.')
				.setColor(colours.blurple);

			message.author.send(embed).then(() => {
				message.channel.send(new MessageEmbed()
					.setDescription(`📬 A message has been sent to your DM's ${message.author.username}`)
					.setColor(colours.green));

			}).catch(() => {
				return message.channel.send(new MessageEmbed()
					.setDescription('Unable to send DM, please make sure your DM\'s are enabled.')
					.setColor(colours.red));
			});


			message.author.createDM().then(e => {
				const collector = e.createMessageCollector(u2 => u2.author.id === message.author.id, { time: 60000 });
				collector.on('collect', m => {

					if (m.content.toLowerCase() === `${prefix}help currency`) {
						const economy = fs.readdirSync('./commands/economy/');

						for (let i = 0; i < economy.length; i++) {
							economy[i] = economy[i].replace(/.js/g, '');
							economy[i] = prefix + economy[i];
						}
						const embed2 = new MessageEmbed()
							.setTitle('💵 Currency Commands')
							.setColor(colours.blurple)
							.setDescription(`${bot.user.username} currently features ${economy.length} currency commands!\n\n**${economy.join(',  ')}**`);

						message.author.send(embed2);
					}
					else if (m.content.toLowerCase() === `${prefix}help fun`) {
						const fun = fs.readdirSync('./commands/fun/');

						for (let i = 0; i < fun.length; i++) {
							fun[i] = fun[i].replace(/.js/g, '');
							fun[i] = prefix + fun[i];
						}
						const embed3 = new MessageEmbed()
							.setTitle('🎲 Fun Commands')
							.setColor(colours.blurple)
							.setDescription(`${bot.user.username} currently features ${fun.length} fun commands!\n\n**${fun.join(',  ')}**`);

						message.author.send(embed3);

					}

					else if (m.content.toLowerCase() === `${prefix}help moderation`) {
						const moderation = fs.readdirSync('./commands/moderation/');

						for (let i = 0; i < moderation.length; i++) {
							moderation[i] = moderation[i].replace(/.js/g, '');
							moderation[i] = prefix + moderation[i];
						}
						const embed3 = new MessageEmbed()
							.setTitle('<:ban:701729757909352538> Moderation Commands')
							.setColor(colours.blurple)
							.setDescription(`${bot.user.username} currently features ${moderation.length} moderation commands!\n\n**${moderation.join(',  ')}**`);

						message.author.send(embed3);

					}

					else if (m.content.toLowerCase() === `${prefix}help information`) {
						const information = fs.readdirSync('./commands/information/');

						for (let i = 0; i < information.length; i++) {
							information[i] = information[i].replace(/.js/g, '');
							information[i] = prefix + information[i];
						}
						const embed3 = new MessageEmbed()
							.setTitle('ℹ️ Information Commands')
							.setColor(colours.blurple)
							.setDescription(`${bot.user.username} currently features ${information.length} information commands!\n\n**${information.join(',  ')}**`);

						message.author.send(embed3);

					}

					else if (m.content.toLowerCase() === `${prefix}help games`) {
						const games = fs.readdirSync('./commands/games/');

						for (let i = 0; i < games.length; i++) {
							games[i] = games[i].replace(/.js/g, '');
							games[i] = prefix + games[i];
						}
						const embed3 = new MessageEmbed()
							.setTitle('🎮 Game Commands')
							.setColor(colours.blurple)
							.setDescription(`${bot.user.username} currently features ${games.length} game commands!\n\n**${games.join(',  ')}**`);

						message.author.send(embed3);

					}

					else if (m.content.toLowerCase() === `${prefix}help general`) {
						const general = fs.readdirSync('./commands/general/');

						for (let i = 0; i < general.length; i++) {
							general[i] = general[i].replace(/.js/g, '');
							general[i] = prefix + general[i];
						}
						const embed3 = new MessageEmbed()
							.setTitle('⚙️ General Commands')
							.setColor(colours.blurple)
							.setDescription(`${bot.user.username} currently features ${general.length} game commands!\n\n**${general.join(',  ')}**`);

						message.author.send(embed3);

					}


				});
			});

		}
		else {


			let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase());

			if (!command) {

				const Invalid = new MessageEmbed()
					.setTitle('📂 Invalid command!')
					.setDescription(`The command you are trying to find doesn't exist.\nYou can do ${prefix}help for a list of commands!`)
					.setColor(colours.red);

				return message.channel.send(Invalid);
			}

			command = command.config;

			const cmdEmbed = new MessageEmbed()
				.setTitle(`${prefix}${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)} information`)
				.addField('Command Description:', `${command.description || 'No Description.'}`)
				.addField('Usage:', `${command.usage ? `\`${command.usage}\`` : 'No Usage'}`)
				.addField('Aliases:', `${command.aliases ? command.aliases.join(', ') : 'N/A'}`)
				.addField('Accessible to:', `${command.accessableby || 'N/A'}`)
				.setColor(colours.blurple);

			return message.channel.send(cmdEmbed);

		}


	},

};