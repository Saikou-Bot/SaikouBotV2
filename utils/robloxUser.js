const axios = require('axios');

const BaseFetcher = require('../helpers/robloxFetcher');

class User {
	constructor(fetcher, userId) {
		this.fetcher = fetcher;
		this.userId;
	}
	fetchHeadshot() {
		return this.fetcher.fetchHeadshot(this.userId)
	}
}

class UserFetcher extends BaseFetcher {
	constructor() {
		super(...arguments);
		this.cache = new discord.Collection();
	};
	fetchHeadshots(userIds) {
		return axios.get(`https://thumbnails.roblox.com/v1/users/avatar-headshot?size=150x150&format=Png&isCircular=false&userIds=${userIds.join(',')}`)
			.then(res => {
				return res.data.data;
			});
	}
	fetchHeadshot(userId) {
		return this.fetchHeadshots([userId])
		.then(data => {
			return data[0];
		})
	}
	getUser(userId) {
		let cachedUser = this.cache.get(userId);
		if (!cachedUser) {
			cachedUser = new User(this, userId);
			this.cache.set(userId, cachedUser);
		}
		return cachedUser;
	}
}

module.exports = {
	name: 'robloxUser',
	construct(client) {
		return new UserFetcher(client.noblox);
	}
}
