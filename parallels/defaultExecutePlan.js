const {
    createExecutePlanChunked,
} = require('../math');

module.exports = function getPlan(dataRaw, chunkLimit = 10) {
    const dataRawPartLength = dataRaw.length / 10; // FIXME

    return createExecutePlanChunked([{
        name: 'm1',
        dataRaw: dataRaw.slice(0, dataRawPartLength),
        chunkLimit,
    }, {
        name: 'm2',
        dataRaw: dataRaw.slice(0, dataRawPartLength),
        chunkLimit,
    }, {
        name: 'm3',
        dataRaw,
        chunkLimit,
    }, {
        name: 'm4',
        dataRaw: dataRaw.slice(0, dataRawPartLength),
        chunkLimit,
    }]);
};
