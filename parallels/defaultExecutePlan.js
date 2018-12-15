const {
    prepareDataRaw,
    createExecutePlanChunked,
} = require('../math');

module.exports = function getPlan(dataRaw, chunkLimit=10) {
    const dataRawPartLength = dataRaw.length / 10; // FIXME

    return [{
        name: 'm1',
        dataRaw: dataRaw,
        chunkLimit
    }, {

    }, {

    }, {

    }]
};
