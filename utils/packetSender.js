const { f2b } = require('../utils/float2bytes');


module.exports = function packetSender(socket, cmd, floats) {
    socket.write(cmd);
    socket.write(',');
    socket.write(f2b(floats));
    socket.write('<<< EndOfData\n');
};
