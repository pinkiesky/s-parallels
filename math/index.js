const {
    chunk,
    flatten,
} = require('lodash');


module.exports = {
    prepareDataRaw(length = 10 ** 5) {
        const array = new Array(length);
        for (let i = 0; i < array.length; i += 1) {
            array[i] = Math.random();
        }

        return array;
    },
    /**
     * @param {Array} modulesArray
     * @param {object} modulesArray[]
     * @param {string} modulesArray[].name
     * @param {Array} modulesArray[].data
     * @param {number} modulesArray[].chunkLimit
     */
    createExecutePlanChunked(modulesArray) {
        const tasks = modulesArray
            .map($module => chunk($module.data, $module.chunkLimit)
                .map(chunkPart => ({
                    module: $module,
                    chunk: chunkPart,
                })));

        return flatten(tasks);
    },
};
