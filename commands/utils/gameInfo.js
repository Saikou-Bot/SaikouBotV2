const extend = require('extend');
const axios = require('axios');

function noError(enabled, promise, def) {
    if (enabled) {
        return promise.catch(() => def);
    } else {
        return promise;
    }
}

class Scraper {
    constructor(noblox) {
        this.noblox = noblox;
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
    get token() {
        try {
			return this.noblox.options.jar.session;
		}
		catch(err) {
			return undefined;
		}
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
}

module.exports = Scraper;
