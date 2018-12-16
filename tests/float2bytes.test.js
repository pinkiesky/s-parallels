const assert = require('assert');
const { f2b, b2f } = require('../parallels/float2bytes');


describe('float2bytes', () => {
    const original = [3.5, 0, 5, 10000, 0xffffff, 0, 0, 1, -1];

    it('f2b correct length', () => {
        assert.equal(f2b(original).length, original.length * 8);
    });

    it('b2f correct data', () => {
        const bytes = f2b(original);
        const originalFromBytes = b2f(bytes);

        assert.deepEqual(originalFromBytes, original);
    });

    it('b2f correct data from string', () => {
        const bytes = f2b(original).toString('binary');
        const originalFromBytes = b2f(bytes);

        assert.deepEqual(originalFromBytes, original);
    });
});
