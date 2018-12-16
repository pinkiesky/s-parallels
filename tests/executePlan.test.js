const assert = require('assert');
const {
    createExecutePlanChunked,
} = require('../math');


describe('executePlan', () => {
    const module = {
        name: 'test',
        data: [1, 2, 3, 4, 5],
        chunkLimit: 2,
    };

    const module2 = {
        name: 'test2',
        data: [0.8],
        chunkLimit: 100,
    };

    it('should return correct tasks length', () => {
        const tasks = createExecutePlanChunked([module, module2]);
        assert.equal(
            tasks.length,
            Math.ceil(module.data.length / module.chunkLimit)
                + Math.ceil(module2.data.length / module2.chunkLimit),
        );
    });

    it('should return correct tasks', () => {
        const tasks = createExecutePlanChunked([module, module2]);

        assert.deepEqual(tasks[0], {
            module,
            chunk: [1, 2],
        });
        assert.deepEqual(tasks[1], {
            module,
            chunk: [3, 4],
        });
        assert.deepEqual(tasks[2], {
            module,
            chunk: [5],
        });
        assert.deepEqual(tasks[3], {
            module: module2,
            chunk: [0.8],
        });
    });
});
