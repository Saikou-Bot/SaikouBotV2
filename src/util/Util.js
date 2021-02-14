const { Collection } = require('discord.js');
const { MENTION_REG } = require('./Constants');

class Util {
	constructor() {
		throw new Error(`The ${this.constructor.name} class may not be instantiated.`);
	}
	// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	static getRandomInt(min, max) {
		if (min && !max) { max = min; min = 0}
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
	}
	static choose(arr) {
		if (!Array.isArray(arr) || arr.length < 1) return null;

		return arr[Util.getRandomInt(arr.length)];
	}
	static mutualGuilds(guilds, user) {
		if (!user) return null;

		const mutualGuilds = new Collection();

		console.log(guilds);
		for (const entry of guilds) {
			const guild = entry[1]
			const member = guild.members.resolve(user);
			// member should always defined, but just checking
			if (member) mutualGuilds.set(guild.id, guild);
		};
		return mutualGuilds;
	}
	static bestGuild(guilds, user) {
		let bestGuild;
		// console.log(guilds);
		guilds = guilds.filter(g => g.members.resolve(user))
		if (guilds.size === 1) bestGuild = guilds.first();
		else if (guilds.size > 0) bestGuild = guilds.sort((a, b) => b.memberCount - a.memberCount).first();

		return bestGuild ? bestGuild : null;
	}
	memberFromMutualGuilds(guilds, user) {
		const bestGuild = Util.bestGuild(guilds, user);

		return bestGuild ? bestGuild.members.resolve(user) : null;
	}
	static resolveMember(text, members, caseSensitive = false, wholeWord = false) {
		const member = Util.resolveMention(text, members);
		if (member) return member;

		return members.find(member => checkMember(text, member, caseSensitive, wholeWord));
	}
	static resolveUser(text, users, caseSensitive = false, wholeWord = false) {
		const user = Util.resolveMention(text, users);
		if (user) return user;

		return users.find(user => this.checkUser(text, user, caseSensitive, wholeWord))
	}
	static resolveMutualMember(user, guilds, caseSensitive = false, wholeWord = false) {
		if (!user) return null;
		const mutualGuilds = Util.mutualGuilds(guilds, user);
		const bestGuild = Util.bestGuild(mutualGuilds, user);
		if (!bestGuild) return null;

		return bestGuild.members.resolve(user) || null;
	}
	static resolveMention(text, collection) {
		const match = text.match(MENTION_REG);
		if (match) {
			const target = collection.get(match[1]);
			if (target) return user;
		}
		return null;
	}
	static checkUser(text, user, caseSensitive = false, wholeWord = false) {
		text = caseSensitive ? text : text.toLowerCase();
		const username = caseSensitive ? user.username : user.username.toLowerCase();
		const discrim = user.discriminator;

		if (!wholeWord) {
			return username.includes(text) ||
				(username.includes(text.split('#')[0]) && discrim.includes(text.split('#')[1]));
		}

		return username === text ||
			(username === text.split('#')[0] && discrim === text.split('#')[1]);
	}
	static checkMember(text, member, caseSensitive = false, wholeWord = false) {
        text = caseSensitive ? text : text.toLowerCase();
        const username = caseSensitive ? member.user.username : member.user.username.toLowerCase();
        const displayName = caseSensitive ? member.displayName : member.displayName.toLowerCase();
        const discrim = member.user.discriminator;

        if (!wholeWord) {
            return displayName.includes(text)
            || username.includes(text)
            || ((username.includes(text.split('#')[0]) || displayName.includes(text.split('#')[0])) && discrim.includes(text.split('#')[1]));
        }

        return displayName === text
        || username === text
        || ((username === text.split('#')[0] || displayName === text.split('#')[0]) && discrim === text.split('#')[1]);
	}
	humanReadableNumber() {
		;(function() {
		    
		    
		    function getExponent(n) {
		        if (n === 0) {
		            return 0;
		        }
		        return Math.floor(Math.log10(Math.abs(n)));
		    }
		    
		    function precise(n) {
		        return Number.parseFloat(n.toPrecision(3));
		    }
		    
		    function toHumanString(sn) {
		        var n = precise(Number.parseFloat(sn));
		        var e = Math.max(Math.min(3 * Math.floor(getExponent(n) / 3), 24), -24);
		        return precise(n / Math.pow(10, e)).toString() + PREFIXES[e];
		    }
		    
		    // the module exports
		    var HRNumbers = {
		        toHumanString: toHumanString
		    };

		    // define the module as AMD, commonJS or global
		    if (typeof define == 'function' && define.amd) {
		        define([], function() {
		            return HRNumbers;
		        });
		    } else if (typeof exports != 'undefined') {
		        exports = module.exports = HRNumbers;
		    } else {
		        this.HRNumbers = HRNumbers;
		    }

		}.call(this));
	}
}
module.exports = Util;