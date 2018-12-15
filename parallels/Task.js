const EventEmitter = require('events');


class Task extends EventEmitter {
    constructor(name, dataBuffer, socket) {
        super();

        this.name = name;
        this.dataBuffer = dataBuffer;
        this.socket = socket;

        this.state = 'init';

        this.$start();
    }

    $start() {
        this.socket.write(`${this.name},`);
        this.socket.write(this.dataBuffer);

        this.state = 'wait_ack';
    }
}

module.exports = Task;
