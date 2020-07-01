// *** SERVER *** //

var blobs = []; // all of the blobs that are currently connected

// CONSTRUCTION FUNCTION
function Blob(id, color, x, y, s, d, ig) {
    this.id = id;
    this.color = color;
    this.x = x;
    this.y = y;
    this.s = s;
    this.d = d;
    this.ig = ig;
}


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

setInterval(heartbeat, 33);

function heartbeat() {
    io.sockets.emit('heartbeat', blobs); // message with array
}

// EVENT NEW CONNECTION
// callback function to run when we hahve a new
// individual connection
io.sockets.on('connection', newConnection);


// ON NEW CONNECTION
function newConnection(socket) {
    console.log('new connection : ' + socket.id);

    // CREATE NEW BLOB OBJECT
    socket.on('start', start)
    function start(data) {
        console.log(socket.id + ' ' + data.color + ' ' + data.x + ' ' + data.y + ' ' + data.s);

        // list of connected clients
        var blob = new Blob(socket.id, data.color, data.x, data.y, data.s, data.d, data.ig);
        blobs.push(blob);
    }

    // UPDATE THE ARRAY OF BLOBS
    socket.on('update', clientMsg);
    function clientMsg(data) {
        var blob;
        for (var i = 0; i < blobs.length; i++) {
            if (socket.id == blobs[i].id) {
                blob = blobs[i];
            }
        }

        // UPDATE BLOB PROPERTIES
        blob.color = data.color;
        blob.x = data.x;
        blob.y = data.y;
        blob.s = data.s;
        blob.d = data.d;
        blob.ig = data.ig;
    }
    /*
        socket.on('disconect', () => {
    
            blobs.forEach((blob) => {
                if (blob.id === socket.id) {
                    for (const key in blob) {
                        console.log('user ' + socket.id + 'has diconnected');
                        delete blob[key];
                    }
                }
            })
        })
        */

}

    //socket.broadcast.emit('update', data);
    // io.sockets.emit('clientData', data); // also includes client that sent the message
    //console.log(data);



