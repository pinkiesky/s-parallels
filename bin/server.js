const net = require('net');
const _ = require('lodash');
const { Spinner } = require('clui');
const {
    prepareDataRaw,
    createExecutePlanChunked,
} = require('../math');


const countdown = new Spinner('waiting for clients...', ['|', '/', '—', '\\']);
countdown.update = () => {
    countdown.message(`clients count: ${clients.length}       `);
};

const address = process.env.PARALLEL_ADDRESS || '0.0.0.0';
const port = parseInt(process.env.PARALLEL_PORT) || 9000;

const clients = [];

var server = net.createServer(function (socket) {
    clients.push(socket);
    countdown.update();

    socket.once('close', () => {
        _.remove(clients, socket);
        countdown.update();
    });
});

process.stdin.once('data', () => {
    countdown.stop();

    if (!clients.length) {
        return process.exit(1);
    }

    console.info('[!] Start execute');
    console.debug('[*] Clients:');

    clients.forEach((socket, index) => {
        console.debug(`[*] ${index + 1}: ${socket.remoteAddress}`);
    });
});

server.listen(port, address, () => {
    console.info(`[i] Server is up: ${address}:${port}`);
    console.info(`[i] Execute command: ${process.argv}`);
    console.info("[!] Press 'CTRL+C' for exit, press 'Enter' for start execute");

    console.log(createExecutePlanChunked([{
        name: 'm1',
        data: prepareDataRaw(100),
        chunkLimit: 10,
    }]));

    // countdown.start();
});