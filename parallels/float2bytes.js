module.exports = {
    f2b(floatArray) {
        return Buffer.from(new Float64Array(floatArray).buffer);
    },
    b2f(byteArray) {
        const uint = new Uint8Array(Buffer.from(byteArray, 'binary'));
        return new Float64Array(uint.buffer, 0, uint.buffer.length);
    },
};
