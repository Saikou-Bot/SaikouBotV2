const Axios = require('axios');
if (!discord) var discord = require('discord.js');

const defaultOptions = {
	apiEndpoint: 'https://api.blox.link/v1/user/',
	axiosOpts: {}
};

class NonOkStatus extends Error {
	constructor(data) {
		super('NonOkStatus');
		this.data = data;
	}
}

class Bloxlink {
	constructor(client, options = {}) {
		this.client = client;
		this.options = Object.assign({}, defaultOptions, options);
		this.axios = Axios.create(this.options.axiosOpts);
	}
	async resolve(user) {
		const userId = this.client.users.resolveID(user);

		if (!userId) throw new Error('Please specify user');

		return this.axios.get(this.options.apiEndpoint + userId)
			.then(async res => {
				if (!res.data) throw new Error('No data');
				if (res.data.status != 'ok') {
					if (res.data.error == 'This user is not linked to Bloxlink.') return;
					throw new NonOkStatus(res.data);
				}

				return res.data.primaryAccount;
			});
	}
}

module.exports = {
	name: 'bloxlink',
	construct(client) {
		return new Bloxlink(client);
	}
};