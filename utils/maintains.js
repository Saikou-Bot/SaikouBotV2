const { EventEmitter } = require('events');

const { Collection } = discord;

class MaintainManager extends EventEmitter {
	constructor(model) {
		super();
		this.MaintainModel = model;
		this.cache = new Collection();
		this.ttl = 10 * 60 * 1000;
	}
	isCacheExpired(item) {
		return (item.expiry.getTime() + this.ttl) < Date.now();
	}
	async getData() {
		const data = await this.MaintainModel.find({});

		data.forEach(this.updateCache, this);
		return this.cache;
	}
	updateCache(item) {
		item.expiry = new Date();
		this.cache.set(item.name, item);
	}
	async maintained(name) {
		return (await this.fetch(name)).maintained;
	}
	async fetch(name) {
		let item = this.cache.get(name);
		if (!item || this.isCacheExpired(item)) {
			item = await this.MaintainModel.findOne({ name });
			if (!item) {
				item = new this.MaintainModel({
					name
				});
				await item.save();
			}
			this.updateCache(item);
		}
		return item;
	}
	async setMaintain(name, status) {
		const item = await this.fetch(name);
		item.maintained = status;
		await item.save();
		this.updateCache(item);
		return item;
	}
}

module.exports = {
	name: 'maintains',
	construct(client) {
		const maintains = new MaintainManager(client.databases.maintainData);
		maintains.getData();
		return maintains;
	}
}
