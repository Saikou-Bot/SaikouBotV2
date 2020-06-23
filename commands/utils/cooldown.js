const extend = require('extend');
const ms = require('ms');

const { MessageEmbed } = require('discord.js');

const cooldownDefaults = {
	name: '',
	cooldown: 5000,
	roles: {
		'Server Booster': 0.5,
		'Omega Follower': 0.5,
	},
};

module.exports = class Cooldown {
	constructor(options = {}) {
		this.options = extend({}, cooldownDefaults, options);
		this.users = new Map();
	}
	add(member) {
		const roles = Object.keys(this.options.roles);
		const role = roles.find(roleName => {
			return member.roles.cache.some(r => r.name == roleName);
		});
		const roleEffect = role ? this.options.roles[role] : 1;
		this.users.set(member.id, Date.now() + this.options.cooldown * roleEffect);
	}
	has(userid) {
		const timestamp = this.users.get(userid);
		if (timestamp == undefined) { return false; }
		else if (timestamp < Date.now()) {
			this.users.delete(userid);
			return false;
		}
		else {
			return true;
		}
	}
	embed(userid) {
		const timestamp = this.users.get(userid);
		const leftMs = timestamp - Date.now();
		const left = ms(leftMs, { long: true });
		return new MessageEmbed({
			title: '🐌 Woah there, slow down!',
			description: `You must wait **${left}** before re-using this command.`,
		}).setColor(colours.red);
	}
};
