const extend = require('extend');
const ms = require('ms');

const {
	MessageEmbed
} = require('discord.js');

const cooldownDefaults = {
	name: '',
	cooldown: 5000,
	roles: {
		'Server Booster': 0.5,
		'Omega Follower': 0.5,
	},
};

function ceilSecond(timestamp) {
	return Math.ceil(timestamp / 1000) * 1000;
}

class Cooldown {
	constructor(options = {}) {
		this.options = extend({}, cooldownDefaults, options);
		this.users = new Map();
	}
	cooldownEnd({ timestamp, roleEffect }) {
		return timestamp + this.options.cooldown * roleEffect;
	}
	add(member) {
		const roles = Object.keys(this.options.roles);
		const role = roles.find(roleName => {
			return member.roles.cache.some(r => r.name == roleName);
		});
		const roleEffect = role ? this.options.roles[role] : 1;
		const timestamp = Date.now();
		this.users.set(member.id, {
			timestamp,
			role,
			roleEffect,
			end: this.cooldownEnd({ timestamp, roleEffect })
		});
	}
	has(userid) {
		const user = this.users.get(userid);
		if (!user) return false;
		const { end } = user;
		if (Date.now() > end) {
			this.users.delete(userid);
			return false;
		}
		else {
			return true;
		}
	}
	embed(userid) {
		const user = this.users.get(userid);
		const { timestamp, role, roleEffect, end } = this.users.get(userid);
		const leftMs = ceilSecond(end - Date.now());
		const left = ms(leftMs, {
			long: true
		});
		return new MessageEmbed({
			title: '🐌 Woah there, slow down!',
			description: `You must wait **${left}** before re-using this command.`,
		}).setColor(colours.red);
	}
}

module.exports = {
	name: 'cooldown',
	construct(client) {
		return Cooldown;
	}
};
