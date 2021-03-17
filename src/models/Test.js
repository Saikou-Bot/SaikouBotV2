const ModelModule = require('../structure/ModelModule');

class Test extends ModelModule {
    constructor() {
        super('test', {
            schema: {
                testing: Boolean
            }
        });
    }
}
module.exports = Test;