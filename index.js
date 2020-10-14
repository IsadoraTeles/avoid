// *** SERVER *** //
// VERSION 1
/*
var blobs = []; // all of the blobs that are currently connected

// CONSTRUCTION FUNCTION
function Blob(id, color, x, y, s, d, ig, bg, bo) {
    this.id = id;
    this.color = color;
    this.x = x;
    this.y = y;
    this.s = s;
    this.d = d;
    this.ig = ig;
    this.bg = bg;
    this.bo = bo;
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
io.sockets.on('connection', newConnection); // if I have a new connection


// ON NEW CONNECTION
function newConnection(socket) {
    console.log('new connection : ' + socket.id); // id of the ne connection

    // CREATE NEW BLOB OBJECT
    socket.on('start', start)
    function start(data) {
        console.log(socket.id + ' ' + data.color + ' ' + data.x + ' ' + data.y + ' ' + data.s);

        // list of connected clients
        var blob = new Blob(socket.id, data.color, data.x, data.y, data.s, data.d, data.ig, data.bg, data.bo);
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
        blob.bg = data.bg;
        blob.bo = data.bo;
    }

    
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
        

}

    //socket.broadcast.emit('update', data);
    // io.sockets.emit('clientData', data); // also includes client that sent the message
    //console.log(data);

*/


// VERSION 2

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
 */
app.use("/", express.static(__dirname + "/public"));

/**
* List of connected users
*/
var users = [];

io.on('connection', function (socket) {

    /**
     * Utilisateur connecté à la socket
     */
    var loggedUser;

    /**
   * Emission d'un événement "user-login" pour chaque utilisateur connecté
   */
    for (i = 0; i < users.length; i++) {
        socket.emit('user-login', users[i]);
    }


    /**
     * Log de connexion d'un utilisateur (avant login)
     */
    console.log('a user connected');


    /**
     * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
     */
    /**
   * Déconnexion d'un utilisateur
   */
    socket.on('disconnect', function () {
        if (loggedUser !== undefined) {
            // Broadcast d'un 'service-message'
            var serviceMessage = {
                text: 'User "' + loggedUser.username + '" disconnected',
                type: 'logout'
            };
            socket.broadcast.emit('service-message', serviceMessage);
            // Suppression de la liste des connectés
            var userIndex = users.indexOf(loggedUser);
            if (userIndex !== -1) {
                users.splice(userIndex, 1);
            }
            // Emission d'un 'user-logout' contenant le user
            io.emit('user-logout', loggedUser);
        }
    });

    /**
   * Connexion d'un utilisateur via le formulaire :
   */
    socket.on('user-login', function (user, callback) {
        // Vérification que l'utilisateur n'existe pas
        var userIndex = -1;
        for (i = 0; i < users.length; i++) {
            if (users[i].username === user.username) {
                userIndex = i;
            }
        }
        if (user !== undefined && userIndex === -1) { // S'il est bien nouveau
            // Sauvegarde de l'utilisateur et ajout à la liste des connectés
            loggedUser = user;
            users.push(loggedUser);
            // Envoi des messages de service
            var userServiceMessage = {
                text: 'You logged in as "' + loggedUser.username + '"',
                type: 'login'

            };
            var broadcastedServiceMessage = {
                text: 'User "' + loggedUser.username + '" logged in',
                type: 'login'
            };
            socket.emit('service-message', userServiceMessage);
            socket.broadcast.emit('service-message', broadcastedServiceMessage);
            // Emission de 'user-login' et appel du callback
            io.emit('user-login', loggedUser);
            callback(true);
        } else {
            callback(false);
        }
    });

    /**
     * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
     */
    socket.on('chat-message', function (message) {
        message.username = loggedUser.username;
        io.emit('chat-message', message);
        console.log('Message de : ' + loggedUser.username);
    });
});

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
server.listen(3000, function () {
    console.log('Server is listening on *:3000');
});

/*
function User(socketId) {

    this.id = socketId;
    this.status = "online";
    this.username = "bob";

    this.getId = function () {
        return this.id;
    };

    this.getName = function () {
        return this.username;
    };

    this.getStatus = function () {
        return this.status;
    };

    this.setStatus = function (newStatus) {
        this.status = newStatus;
    }
}
*/

//var userMap = new Map();

/**
 * Once a connection has been opened this will be called.
 */
//io.on('connection', function (socket) {

  //  var user;

/**
 * When a user has entered there username and password we create a new entry within the userMap.
 */
/*
socket.on('registerUser', function (data) {

    userMap.set(data.name, new User(socket.id));

    //Lets make the user object available to all other methods to make our code DRY.
    user = userMap.get(data.name);
});

socket.on('loginUser', function (data) {
    if (userMap.has(data.name)) {
        //user has been found

        user = userMap.get(data.name);
    } else {
        //Let the client know that no account was found when attempting to sign in.
        socket.emit('noAccountFound', {
            msg: "No account was found"
        });
    }
});

socket.on('disconnect', function () {
    //Let's set this users status to offline.
    user.setStatus("offline");
});
*/
/**
 * Dummy server event that represents a client looking to send a message to another user.
 */
/* socket.on('sendAnotherUserAMessage', function (data) {

     //Make note here that by checking to see if the user exists within the map we can be sure that when
     // retrieving the value after && that we won't have any unexpected errors.
     if (userMap.has(data.name) && userMap.get(data.name).getStatus() !== "offline") {
         var OtherUser = userMap.get(data.name);
     } else {
         //We use a return here so further code isn't executed, you could replace this with some for of
         //error handling or a different event back to the user.
         return;
     }

     //Lets send our message to the user.
     io.to(OtherUser.getId()).emit('recMessage', {
         msg: "Nice code!"
     })
 });


});
*/

/*
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile('index.html', { root: __dirname });
})

app.get('/json', function (req, res) {
    res.status(200).json({ "message": "ok" });
})

// établissement de la connexion
io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    // émission d'un évènement
    socket.on('message-from-client-to-server', (msg) => {
        console.log(msg);
    })
    socket.emit('message-from-server-to-client', 'Hello World!');
})

// on change app par server
server.listen(3000, function () {
    console.log('Votre app est disponible sur localhost:3000 !')
})
*/

// émettre un message ou des données à tous les utilisateurs sauf à celui qui a fait la demande :
/*
var io = require('socket.io')(80);
io.on('connection', function (socket) {
  socket.broadcast.emit('user connected');
});
*/

// émettre un message à toutes les connexions possibles
/*
var io = require('socket.io')(80) // 80 is the HTTP port
io.on('connection', function (socket) {
      //Callback when a socket connects
    );
io.sockets.emit('callbackFunction',data);
*/

// écouter des événéments internes
/*
// COTE SERVEUR
var io = require('socket.io')(80);

io.on('connection', function (mysocket) {

  //custom event called `private message`
  mysocket.on('private message', function (from, msg) {
    console.log('I received a private message by ', from, ' saying ', msg);
  });

  //internal `disconnect` event fired, when a socket disconnects
  mysocket.on('disconnect', function () {
    console.log('user disconnected');
  });
});
 */