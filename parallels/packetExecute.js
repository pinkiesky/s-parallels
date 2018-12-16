const modules = require('../math/modules');

/**
 * @param {string} message
 * @param {Float64Array} data
 */
module.exports = function packetExecute(name, data) {
    const module = modules[name];
    if (!module) {
        throw new ReferenceError(`Wrong module: ${name}`);
    }

    return module(data);
};
