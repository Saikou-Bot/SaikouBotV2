const { Command } = require('discord-akairo');
const SaikouEmbed = require('../../structure/SaikouEmbed');
const Missions = require('../../util/Missions').concat().filter(m => typeof m === 'function');
const { choose } = require('../../util/Util');

class Mission extends Command {
	constructor() {
		super('mission', {
			aliases: ['mission']
		});
	}
	async exec(message) {
		const missionGen = choose(Missions);

		let mission = missionGen(message);
		if (mission && typeof mission.then === 'function') mission = await mission;

		if (typeof mission !== 'string') throw new Error('Mission not a string');

		const embed = new SaikouEmbed()
			.setTitle('Here\'s your mission Soldier...')
			.setDescription(mission)
			.setColor(message.member.displayHexColor)
			.setTimestamp()
			.setFooter('Your mission')
			.setThumbnail(message.author.displayAvatarURL({ size: 512 }));

		return message.util.send(embed);
	}
}
module.exports = Mission;