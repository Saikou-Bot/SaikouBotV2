const { AkairoModule } = require('discord-akairo');

class ModelModule extends AkairoModule {
    constructor(id, {
        category,
        model,
        schema = {},
        name
    } = {}) {
        super(id, {
            category
        });

        this.name = name;

        this._model = model;
        this._schema = schema;
    }
}
module.exports = ModelModule;