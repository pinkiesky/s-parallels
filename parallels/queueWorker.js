const Queue = require('better-queue');
const Task = require('./Task');
const STATE = require('./state');


module.exports = function createQueueWorker(clients) {
    // eslint-disable-next-line prefer-arrow-callback
    const q = new Queue(function worker({ chunk }, cb) {
        const client = clients.find(c => !c.$busy && (!c.$errors || c.$errors < 2));
        client.$busy = true;

        const task = new Task(chunk.module.name, chunk.chunk, client);
        task.once(STATE.FINISHED, (state) => {
            const success = state === STATE.SUCCESS;

            client.$errors = success ? 0 : (client.$errors || 0) + 1;
            client.$busy = false;

            cb(success ? null : new Error('Task failed'), task.result);
        });

        task.$start();
    }, { concurrent: clients.length, maxRetries: 10, retryDelay: 250 });

    return q;
};
