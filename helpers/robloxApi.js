const axios = require('axios');

class RobloxError extends Error {
	constructor(error, reason) {
		super(typeof error == 'string' ? error : error.message);
		this.name = 'RobloxError';
		this.reason = reason || error.reason;
	}
}

class RobloxManager {
	constructor(noblox) {
		this.noblox = noblox;
		this.users = new UserManager(this);
		this.games = new GameManager(this);
	}
	get token() {
		try {
			return this.noblox.options.jar.session;
		}
		catch(err) {
			return undefined;
		}
	}
	axios() {
		return axios.create({
			headers: {
				'Cookie': `.ROBLOSECURITY=${this.token}`
			}
		});
	}
}

class UserManager {
	constructor(manager) {
		this.manager = manager;
		this.apiEndpoints = {
			'/v1/users/avatar-headshot': (userIds) => `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds.join(',')}&size=48x48&format=Png&isCircular=false`,
			'/v1/users/search': (options) => `https://users.roblox.com/v1/users/search?${Object.entries(options).map(entry => `${entry[0]}=${entry[1]}`).join('&')}`,
			'/v1/users/': (userId) => `https://users.roblox.com/v1/users/${userId}`,
			'/v1/users/status': (userId) => `https://users.roblox.com/v1/users/${userId}/status`,
			'/v1/users/avatar': (userIds, options) => `https://thumbnails.roblox.com/v1/users/avatar?${[`userIds=${userIds.join(',')}`, ...Object.entries(options).map(entry => `${entry[0]}=${entry[1]}`)].join('&')}`
		};
	}
	avatars(userIds = [], options = {}) {
		if (!Array.isArray(userIds)) Promise.reject(new Error('userIds not array'));
		if (typeof options != 'object') return Promise.reject(new TypeError('options not object'));

		return axios.get(this.apiEndpoints['/v1/users/avatar'](userIds, options))
			.then(res => {
				return res.data.data;
			})
			.catch(async res => {
				throw new RobloxError(res.response.data.errors[0]);
			});
	}
	avatar(userId = '', options = {}) {
		if (!userId || !['string', 'number'].includes(typeof userId)) return Promise.reject(new TypeError('User id is not a string or number'));
		if (typeof options != 'object') return Promise.reject(new TypeError('options not object'));

		return this.avatars([userId], options)
			.then(avatars => {
				if (avatars.length < 1) throw new Error('avatar not found');
				return avatars[0];
			});
	}
	headshots(userIds = []) {
		if (!Array.isArray(userIds)) Promise.reject(new Error('userIds not array'));

		return axios.get(this.apiEndpoints['/v1/users/avatar-headshot'](userIds))
			.then(res => {
				if (!Array.isArray(res.data.data)) throw new Error('Unexpected response');
				return res.data.data.map(d => d.imageUrl);
			})
			.catch(async res => {
				if (res && res.response && res.response.status == 400 && res.response.data.errors) {
					res.response.data.error.forEach(error => {
						switch (error.reason) {
						case 1: throw new Error('There are too many requested Ids.');
						case 2: throw new Error('The requested image format is invalid. Please see documentation for valid thumbnail format parameter name and values.');
						case 3: throw new Error('The requested size is invalid. Please see documentation for valid thumbnail size parameter name and format.');
						case 4: throw new Error('The requested Ids are invalid, of an invalid type or missing.');
						case 10: throw new Error('Circular thumbnail requests are not allowed');
						default: throw new RobloxError(error);
						}
					});
				}
				throw res;
			});
	}
	headshot(userId = '') {
		return this.headshots([userId])
			.then(headshots => {
				if (headshots.length < 1) throw new Error('headshot not found');
				return headshots[0];
			});
	}
	search(options = {}) {
		if (typeof options != 'object') return Promise.reject(new TypeError('options not object'));

		return axios.get(this.apiEndpoints['/v1/users/search'](options))
			.then(res => {
				return res.data.data;
			})
			.catch(async res => {
				throw new RobloxError(res.response.data.errors[0]);
			});
	}
	fetch(userId = '') {
		if (!userId || !['string', 'number'].includes(typeof userId)) return Promise.reject(new TypeError('User id is not a string or number'));

		return axios.get(this.apiEndpoints['/v1/users/'](userId))
			.then(res => {
				return res.data;
			})
			.catch(async res => {
				return new RobloxError(res.response.data.errors[0]);
			});
	}
	getStatus(userId) {
		if (!userId || !['string', 'number'].includes(typeof userId)) return Promise.reject(new TypeError('User id is not a string or number'));

		return axios.get(this.apiEndpoints['/v1/users/status'](userId))
			.then(res => {
				return res.data.status;
			})
			.catch(res => {
				return new RobloxError(res.response.data.errors[0]);
			});
	}
}

class GameData {
	constructor(manager, opts) {
		this.manager = manager;

		this.name = opts.name;
		this.placeId = opts.placeId;
		this.description = opts.description;
		this.url = opts.url;
		this.builder = opts.builder;
		this.builderId = opts.builderId;
		this.isPlayable = opts.isPlayable;
		this.reasonProhibited = opts.reasonProhibited;
		this.universeId = opts.universeId;
		this.universeRootPlaceId = opts.universeRootPlaceId;
		this.price = opts.price;
		this.imageToken = opts.imageToken;
	}
	get() {
		return this.manager.get(this.universeId.toString());
	}
	fetchGame() {
		return this.manager.fetchGame(this.universeId.toString());
	}
	favoritesCount() {
		return this.manager.favoritesCount(this.universeId.toString());
	}
	votes() {
		return this.manager.votes(this.universeId.toString());
	}
	icon() {
		return this.manager.icon(this.universeId.toString());
	}
}

class GameManager {
	constructor(manager) {
		this.manager = manager;
		this.apiEndpoints = {
			'/v1/games': (universeIds) => `https://games.roblox.com/v1/games?universeIds=${universeIds.join(',')}`,
			'/v1/games/multiget-place-details': (placeIds) => `https://games.roblox.com/v1/games/multiget-place-details?${placeIds.map(p => `placeIds=${p}`).join('&')}`,
			'/v1/games/favorites/count': (universeId) => `https://games.roblox.com/v1/games/${universeId}/favorites/count`,
			'/v1/games/votes': (universeIds) => `https://games.roblox.com/v1/games/votes?universeIds=${universeIds.join(',')}`,
			'/v1/games/icons': (universeIds) => `https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeIds.join(',')}&returnPolicy=PlaceHolder&size=128x128&format=Png&isCircular=true`,
			'/v1/games/list': (options) => `https://games.roblox.com/v1/games/list?${Object.entries(options).map(entry => `model.${entry[0]}=${entry[1]}`).join('&')}`
		};
	}
	fetchGames(universeIds = []) {
		if (!Array.isArray(universeIds)) return Promise.reject(new TypeError('universeIds not array'));
		return axios.get(this.apiEndpoints['/v1/games'](universeIds))
			.then(response => {
				if (!Array.isArray(response.data.data)) throw new Error('response not array');

				return response.data.data;
			})
			.catch(async response => {
				if (response.statusCode == 400 && response.data.errors) {
					response.data.errors.forEach(error => {
						switch (error.reason) {
						case 8: throw new ReferenceError('No universe IDs were specified.');
						case 9: throw new RangeError('Too many universe IDs were requested.');
						default: throw new RobloxError(error);
						}
					});
				}
				else {
					return Promise.reject(response);
				}
			});
	}
	fetchGame(universeId = '') {
		if (typeof universeId != 'string') return Promise.reject(new TypeError('universeId not string'));
		return this.fetchGames([universeId])
			.then(async datas => {
				if (datas.length < 1) throw new ReferenceError('Array empty');

				return datas[0];
			});
	}
	multiGet(placeIds = []) {
		if (!Array.isArray(placeIds)) return Promise.reject(new TypeError('placeIds not array'));
		return this.manager.axios().get(this.apiEndpoints['/v1/games/multiget-place-details'](placeIds))
			.then(res => {
				if (!Array.isArray(res.data)) return Promise.reject(new Error('Unexpected response'));
				return res.data.map(data => new GameData(this, data));
			})
			.catch(async res => {
				if (res && res.response && res.response.status == 401 && res.response.data.errors) {
					res.response.data.errors.forEach(error => {
						switch(error.reason) {
						case 0: throw new Error('Authorization has been denied for this request.');
						default: throw new RobloxError(error);
						}
					});
				}
				throw res;
			});
	}
	get(placeId = '') {
		return this.multiGet([placeId])
			.then(async games => {
				if (games.length < 1) throw new ReferenceError('Game does not exist');
				return games[0];
			});
	}
	favoritesCount(universeId = '') {
		return axios.get(this.apiEndpoints['/v1/games/favorites/count'](universeId))
			.then(async res => {
				if (typeof res.data.favoritesCount != 'number') throw Error('Unexpected response');
				return res.data.favoritesCount;
			})
			.catch(async res => {
				if (res && res.response && res.response.data.errors) {
					res.response.data.errors.forEach(error => {
						switch (res.response.status) {
						case 400: if (error.reason == 3) throw new Error('The universe\'s root place is invalid.'); break;
						case 404: if (error.reason == 4) throw new Error('The requested universe does not exist.'); break;
						default: throw new RobloxError(error);
						}
					});
				}
				throw res;
			});
	}
	votings(universeIds = []) {
		if (!Array.isArray(universeIds)) return Promise.reject(new TypeError('universeIds not array'));
		return axios.get(this.apiEndpoints['/v1/games/votes'](universeIds))
			.then(async res => {
				if (!Array.isArray(res.data.data)) throw new Error('response not array');
				return res.data.data;
			})
			.catch(async res => {
				if (res && res.response && res.response.data.errors) {
					res.response.data.errors.forEach(error => {
						switch (res.response.status) {
						case 400:
							switch (error.reason) {
							case 3: throw new Error('The asset is not voteable.');
							case 8: throw new Error('No universe IDs were specified.');
							case 9: throw new Error('Too many universe IDs were requested.');
							} break;
						case 429: if (error.reason == 10) throw new Error('Internal service busy. Please try again later.'); break;
						case 500: if (error.reason == 0) throw new Error('An unknown error occurred.'); break;
						default: throw new RobloxError(error);
						}
					});
				}
				throw res;
			});
	}
	votes(universeId = '') {
		return this.votings([universeId])
			.then(async datas => {
				if (datas.length < 1) throw new Error('game not found');
				return datas[0];
			});
	}
	icons(universeIds = []) {
		if (!Array.isArray(universeIds)) return Promise.reject(new TypeError('universeIds not array'));

		return axios.get(this.apiEndpoints['/v1/games/icons'](universeIds))
			.then(async res => {
				if (!Array.isArray(res.data.data)) throw new Error('response not array');
				return res.data.data.map(d => d.imageUrl);
			})
			.catch(res => {
				if (res && res.response && res.response.data.errors) {
					res.response.data.errors.forEach(error => {
						switch (res.response.status) {
						case 400: switch(error.reason) {
						case 1: throw new Error('There are too many requested Ids.');
						case 2: throw new Error('The requested image format is invalid. Please see documentation for valid thumbnail format parameter name and values.');
						case 3: throw new Error('The requested size is invalid. Please see documentation for valid thumbnail size parameter name and format.');
						case 4: throw new Error('The requested Ids are invalid, of an invalid type or missing.');
						case 8: throw new Error('The requested return policy is invalid (must be PlaceHolder, AutoGenerated or ForceAutoGenerated).');
						} break;
						case 403: if (error.reason == 9) throw new Error('User not authorized to use AutoGenerated or ForceAutoGenerated return policies.');
							break;
						default: throw new RobloxError(error);
						}
					});
				}
				throw res;
			});
	}
	icon(universeId = '') {
		return this.icons([universeId])
			.then(icons => {
				if (icons.length < 1) throw new Error('game not found');
				return icons[0];
			});
	}
	gameList(options = {}) {
		if (typeof options != 'object') return Promise.reject(new TypeError('options not object'));

		return axios.get(this.apiEndpoints['/v1/games/list'](options))
			.then(async res => {
				if (res.data.filteredKeyword) throw new RobloxError('The keyword was filtered.');
				if (!Array.isArray(res.data.games)) throw new Error('response not array');
				return res.data.games.map(gameOpts => new GameData(this, gameOpts));
			});
	}
}

module.exports = {
	RobloxManager,
	UserManager,
	GameData,
	GameManager
};