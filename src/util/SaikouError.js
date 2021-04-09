// https://github.com/discord-akairo/discord-akairo/blob/master/src/util/AkairoError.js

const Messages = {

};

/**
 * Represents an error for Saikou.
 * @param {string} key - Error key.
 * @param {...any} args - Arguments.
 * @extends {Error}
 */
class AkairoError extends Error {
    constructor(key, ...args) {
        if (Messages[key] == null) throw new TypeError(`Error key '${key}' does not exist`);
        const message = typeof Messages[key] === 'function'
            ? Messages[key](...args)
            : Messages[key];

        super(message);
        this.code = key;
    }

    get name() {
        return `SaikouError [${this.code}]`;
    }
}

module.exports = AkairoError;