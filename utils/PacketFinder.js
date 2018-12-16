const { b2f } = require('./float2bytes');


class PacketFinder {
    constructor() {
        this.buffer = '';
        this.endPattern = '<<< EndOfData\n';
    }

    addData(data) {
        if (typeof data === 'string') {
            this.buffer += data;
        } else if (data instanceof Buffer) {
            this.buffer += data.toString('binary');
        } else {
            throw new TypeError('Wrong data type');
        }
    }

    getAndRemove() {
        const packetIndex = this.buffer.indexOf(this.endPattern);
        if (packetIndex < 0) {
            return null;
        }

        const packet = this.buffer.substring(0, packetIndex);
        this.buffer = this.buffer.substring(packetIndex + this.endPattern.length);

        const [message, ...data] = packet.split(',');
        return {
            message,
            data: b2f(data.join(',')),
        };
    }

    clear() {
        this.buffer = '';
    }
}

module.exports = PacketFinder;
