// ***SERVER***
// variable that stores a function call
var express = require('express');
const app = express();
const port = process.env.PORT || 3000;
// start server listening at port 3000
const server = app.listen(port, () => {
    console.log(`Starting server at : ${port}`)
});
app.use(express.static('public'));

// ***SOCKETS***
let socket = require('socket.io');
let io = socket(server);

// EVENT NEW CONNECTION
io.sockets.on('connection', newConnection);

// ON NEW CONNECTION
function newConnection(socket) {
    console.log('new connection : ' + socket.id);

    socket.on('clientData', clientMsg);

    function clientMsg(data) {
        socket.broadcast.emit('clientData', data);
        // io.sockets.emit('clientData', data); // also includes client that sent the message
        console.log(data);
    }
}

