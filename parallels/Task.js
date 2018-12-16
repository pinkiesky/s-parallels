const EventEmitter = require('events');
const STATE = require('./state');
const packetSender = require('../utils/packetSender');
const PacketFinder = require('../utils/PacketFinder');


class Task extends EventEmitter {
    constructor(name, dataBuffer, socket) {
        super();

        this.name = name;
        this.dataBuffer = dataBuffer;
        this.socket = socket;

        this.finder = new PacketFinder();
    }

    $start() {
        packetSender(this.socket, this.name, this.dataBuffer);
        this.socket.once('data', this.$handleNewData.bind(this));

        this.state = STATE.EXEC;
    }

    $handleNewData(buffer) {
        this.finder.addData(buffer);

        const data = this.finder.getAndRemove();
        if (!data) {
            this.socket.once('data', this.$handleNewData.bind(this));
            return;
        }

        this.result = data.data;
        switch (data.message) {
        case 'ok':
            this.state = STATE.SUCCESS;
            break;
        case 'failed':
            this.state = STATE.FAILED;
            break;
        default:
            this.state = STATE.FAILED;
        }

        // FIXME
    }

    get state() {
        return this.$state || STATE.INIT;
    }

    set state(value) {
        this.$state = value;
        this.emit(this.state, this);

        const isFinished = this.state === STATE.SUCCESS || this.state === STATE.FAILED;
        this.emit(STATE.STATE_CHANGE, isFinished, this);

        if (isFinished) {
            this.emit(STATE.FINISHED, this.state, this);
        }
    }
}

module.exports = Task;
