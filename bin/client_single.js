const net = require('net');

function setupConnection(address, port, retryTimeout = 1000) {
    const client = new net.Socket();

    client.on('error', (error) => {
        console.error('connection error', error);
    });

    client.on('close', () => {
        console.info('connection closed');
        setTimeout(() => setupConnection(address, port, retryTimeout), retryTimeout);
    });

    client.connect(port, address, () => {
        console.info(`connection established to ${address}:${port}`);
    });
}


const address = process.env.PARALLEL_ADDRESS || 'localhost';
const port = parseInt(process.env.PARALLEL_PORT, 10) || 9000;
setupConnection(address, port);
