const { Octokit } = require('@octokit/rest');
const { createAppAuth } = require('@octokit/auth-app');

module.exports = {
	name: 'octokit',
	async construct(client) {
		const octokit = new Octokit({
			authStrategy: createAppAuth,
			auth: {
				id: process.env.GITHUB_ID,
				privateKey: process.env.PRIVATE_KEY,
				installationId: parseInt(process.env.INSTALLATION),
			}
		});

		return octokit;
	}
};