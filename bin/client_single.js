const net = require('net');
const packetExecute = require('../parallels/packetExecute');
const PacketFinder = require('../utils/PacketFinder');
const packetSender = require('../utils/packetSender');


function info(message) {
    console.info(`${process.pid}: ${message}`);
}

function error(message) {
    console.error(`${process.pid}: ${message}`);
}

function setupConnection(address, port, retryTimeout = 1000) {
    const client = new net.Socket();

    client.on('error', () => {
        error('connection error');
    });

    client.on('close', () => {
        info('connection closed');
        setTimeout(() => setupConnection(address, port, retryTimeout), retryTimeout);
    });

    client.connect(port, address, () => {
        info(`connection established to ${address}:${port}`);
        info('wait for task...');
    });

    const finder = new PacketFinder();
    client.on('data', (buffer) => {
        finder.addData(buffer);

        let data = finder.getAndRemove();
        while (data) {
            info(`execute new task: ${data.message}/${data.data.length}`);
            try {
                const result = packetExecute(data.message, data.data);

                info(`task ${data.message} success: ${result}`);
                packetSender(client, 'ok', [result]);
            } catch (e) {
                error(e);
                packetSender(client, 'error', [1]);
            }

            data = finder.getAndRemove();
        }
    });
}


const address = process.env.PARALLEL_ADDRESS || 'localhost';
const port = parseInt(process.env.PARALLEL_PORT, 10) || 9000;
setupConnection(address, port);
