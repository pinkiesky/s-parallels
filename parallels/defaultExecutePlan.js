const {
    createExecutePlanChunked,
} = require('../math');

module.exports = function getPlan(dataRaw, chunkLimit = 10) {
    const dataRawPartLength = dataRaw.length / 10; // FIXME

    return createExecutePlanChunked([{
        name: 'm1',
        data: dataRaw.slice(0, dataRawPartLength),
        chunkLimit,
    }, {
        name: 'm2',
        data: dataRaw.slice(0, dataRawPartLength),
        chunkLimit,
    }, {
        name: 'm3',
        data: dataRaw,
        chunkLimit,
    }, {
        name: 'm4',
        data: dataRaw.slice(0, dataRawPartLength),
        chunkLimit,
    }]);
};
