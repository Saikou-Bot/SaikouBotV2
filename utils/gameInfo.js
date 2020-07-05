const extend = require('extend');
const axios = require('axios');
const { EventEmitter } = require('events');
const BaseFetcher = require('../helpers/robloxFetcher');

function noError(enabled, promise, def) {
    if (enabled) {
        return promise.catch(() => def);
    } else {
        return promise;
    }
}

function applyData(t, data) {
	Object.keys(data).forEach(dataName => {
		t[dataName] = data[dataName];
	});
}

class GameInfo {
	constructor(fetcher, )
}

class GameData extends EventEmitter {
	constructor(scraper, data) {
		super();
		this.scraper = scraper;
		applyData(this, data);
		this.emit('update');
		if (!this.partail) this.partail = false;
	}
	fetch() {
		return this.scraper.getOne(this.placeId)
		.then(data => {
			applyData(this, data);
			this.emit('update');
			return this;
		});
	}
	fetchIcon() {
		return this.scraper.fetchIcon(this.universeId)
		.then((url) => {
			this.imageUrl = url;
			this.emit('update');
			return url;
		});
	}
	fetchFaves() {
		return this.scraper.fetchFaves(this.universeId)
			.then(res => {
				this.favoritesCount = res;
				this.emit('update');
				return this;
			});
	}
	fetchVotes() {
		return this.scraper.fetchVote(this.universeId)
			.then(res => {
				this.upVotes = res.upVotes;
				this.downVotes = res.downVotes;
				this.emit('update');
				return this;
			});
	}
}

class GameInfoFetcher extends BaseFetcher {
    constructor() {
        super(...arguments);
    }
    searchGame(opts = {}) {
        opts = extend({}, {
            keyword: '',
            limit: 1,
            noError: false
        }, opts);

        let prom = axios.get(`https://games.roblox.com/v1/games/list?model.maxRows=${opts.limit}&model.keyword=${opts.keyword}`).then(async (res) => {
            if (!res.data || !res.data.games) throw Error('Game not found');
            return res.data.games;
        });

        return noError(opts.noError, prom, []);
    }
    multiGet(opts = {}) {
        opts = extend({}, {
            placeIds: [],
            settled: false,
            noError: false
        }, opts);
        if (typeof opts.placeIds != 'array') opts.placeIds = [opts.placeIds];

        let prom = axios.get('https://games.roblox.com/v1/games/multiget-place-details?' + opts.placeIds.map(id => `placeIds=${id}`).join('&'), {
            headers: {
                'Cookie': '.ROBLOSECURITY=' + this.token
            }
        }).then(async (res) => {
            if (!Array.isArray(res.data)) throw TypeError('Invallid response');

            return res.data;
        });

        return noError(opts.noError, prom, []);
    }
	getOne(gameId) {
		return this.multiGet({
			placeIds: gameId
		})
		.then(datas => datas[0])
		.then(data => {
			return new GameData(this, data);
		});
	}
	async get(searchQuery = '', opts = {}) {
		if (!isNaN(searchQuery)) {
			return this.multiGet({
				placeIds: searchQuery,
				...opts
			})
			.then(datas => {
				const data = datas[0] || {}
				return new GameData(this, data);
			});
		} else {
			return this.searchGame({
				keyword: searchQuery,
				...opts
			})
			.then(datas => {
				const data = datas[0] || {}
				return new GameData(this, {
					name: data.name,
					placeId: data.placeId,
					builder: data.creatorName,
					builderId: data.creatorId,
					imageToken: data.imageToken,
					universeId: data.universeId,
					partail: true
				})
			});
		}
	}
	fetchIcon(universeId = '') {
		return axios.get(`https://thumbnails.roblox.com/v1/games/icons?returnPolicy=PlaceHolder&size=256x256&format=Png&isCircular=true&universeIds=${universeId}`)
			.then(res => {
				return res.data.data[0].imageUrl;
			});
	}
	fetchFaves(universeId = '') {
		return axios.get(`https://games.roblox.com/v1/games/${universeId}/favorites/count`)
			.then(res => {
				return res.data.favoritesCount;
			});
	}
	fetchVoting(universeIds = []) {
		return axios.get(`https://games.roblox.com/v1/games/votes?universeIds=${universeIds.join(',')}`)
			.then(res => {
				return res.data.data;
			});
	}
	fetchVote(universeId = '') {
		return this.fetchVoting([universeId])
			.then(res => {
				return res[0];
			});
	}
}

module.exports = {
	name: 'gameInfo',
	construct(client) {
		return new GameInfoFetcher(client.noblox);
	}
};
