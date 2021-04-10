const { AkairoHandler } = require('discord-akairo');
const ModelModule = require('./ModelModule');
const { Collection } = require('discord.js');

class ModelHandler extends AkairoHandler {
	constructor(client, {
		directory,
		classToHandle = ModelModule,
		extensions = ['js', 'ts'],
		automateCategories,
		loadFilter,
		mongoose = require('mongoose')
	} = {}) {
		if (!(classToHandle.prototype instanceof ModelModule || classToHandle === ModelModule)) {
            throw new AkairoError('INVALID_CLASS_TO_HANDLE', classToHandle.name, ModelModule.name);
        }
		super(client, {
			directory,
			classToHandle,
			extensions,
			automateCategories,
			loadFilter
		});

		this.mongoose = mongoose;

		this.models = new Collection();
	}
	register(modelModule, filepath) {
		super.register(modelModule, filepath);

		if (modelModule._model && modelModule._model instanceof this.mongoose.Model) {
			modelModule.model = modelModule._model;
			modelModule.schema = modelModule.mode.schema;
		}
		else if (modelModule._schema) {
			if (modelModule._schema instanceof this.mongoose.Schema) {
				modelModule.schema = modelModule._schema;
			}
			else {
				modelModule.schema = new this.mongoose.Schema(modelModule._schema);
			}
			modelModule.model = this.mongoose.model(modelModule.name, modelModule.schema);
		}

		if (modelModule.model) this.models.set(modelModule.id, modelModule.model);
	}
}
module.exports = ModelHandler;