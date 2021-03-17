const { AkairoClient, CommandHandler, ListenerHandler } = require('discord-akairo');
const { ModelHandler } = require('../structure/ModelHandler');
const { Mongoose } = require('mongoose');

class SaikouBot extends AkairoClient {
	constructor(options) {
		options = Object.assign({}, {
			ownerID: ['670588428970098708', '229142187382669312'],
			intents: 513,
			prefix: '.'
		}, options);

		super(options);
		this.token = options.token;
		this.prefix = options.prefix;

		this.mongoose = new Mongoose();

		this.modelHandler = new ModelHandler({
			directory: __dirname + '/../models/',
			mongoose: this.mongoose,
			automateCategories: true
		});

		this.models = this.modelHandler.models;

		this.commandHandler = new CommandHandler(this, {
			directory: __dirname + '/../commands',
			automateCategories: true,
			commandUtil: true,
			prefix: this.prefix,
			commandUtil: true,
			handleEdits: true
		});

		this.listenerHandler = new ListenerHandler(this, {
			directory: __dirname + '/../listeners',
			automateCategories: true
		})
	}
	init() {
		this.commandHandler.useListenerHandler(this.listenerHandler);

		this.modelHandler.loadAll();
		this.listenerHandler.loadAll();
		this.commandHandler.loadAll();
		
		// this.commandHandler.categories.each(category => {
		// 	const displayName = categoryDisplayNames[category.id];
		// 	if (displayName) category.displayName = displayName;
		// });
		// Add types
		this.commandHandler.resolver.addType('category', require('../types/category'));
		this.commandHandler.resolver.addType('userGuild', require('../types/userGuild')());
		this.commandHandler.resolver.addType('mutualMember', require('../types/mutualMember')());
		this.commandHandler.resolver.addType('shorten', require('../types/shorten')());
		// this.commandHandler.resolver.addType('user', require('../types/user')());
		
		// this.commandHandler.resolver.addType('userGuild', require('../types/userGuild'));
	}
	login(token) {
		super.login(this.token || token);
	}
}
module.exports = SaikouBot;