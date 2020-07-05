class BaseFetcher {
	constructor(noblox) {
		this.noblox = noblox;
	}
	get token() {
        try {
			return this.noblox.options.jar.session;
		}
		catch(err) {
			return undefined;
		}
    }
}

module.exports = BaseFetcher;
