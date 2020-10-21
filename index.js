
/**
* SERVER SIDE - GESTION DES CONNEXIONS
*/

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);

/**
 * Gestion des requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
*/
// Routing
app.use(express.static(path.join(__dirname, 'public')));

/**
* List of connected users
*/
var blobsData = []; // list of data for blobs

// construction function
function Blob(id, color, x, y) {
    this.id = id;
    //this.username = username;
    this.color = color;
    this.x = x;
    this.y = y;
}

setInterval(heartbeat, 33);

// STILL USEFUL ???
function heartbeat() {
    io.sockets.emit('heartbeat', blobsData); // message with array of data
}

/*******************************/

io.on('connection', function (socket) {

    /**
     * Utilisateur connecté à la socket
     */
    var loggedBlob; // DATA NOT OBJECT

    /**
    * Log de connexion d'un utilisateur (avant login)
    */
    console.log('a user connected');

    /**
     * Connexion d'un utilisateur via le formulaire :
     */
    socket.on('user-login', function (user, callback) {
        // Vérification que l'utilisateur n'existe pas
        var userIndex = -1;
        for (i = 0; i < blobsData.length; i++) {
            if (blobsData[i].username === user.username) {
                userIndex = i;
            }
        }
        if (user !== undefined && userIndex === -1) {
            // S'il est bien nouveau
            // Sauvegarde de l'utilisateur et ajout à la liste des connectés
            loggedBlob = user;
            //blobsData.push(loggedBlob);
            // Envoi des messages de service
            var userServiceMessage =
            {
                text: 'You logged in as "' + loggedBlob.username + '"',
                type: 'login'
            };
            var broadcastedServiceMessage =
            {
                text: 'User "' + loggedBlob.username + '" logged in',
                type: 'login'
            };
            socket.emit('service-message', userServiceMessage);
            socket.broadcast.emit('service-message', broadcastedServiceMessage);
            // Emission de 'user-login' et appel du callback
            io.emit('user-login', loggedBlob);
            callback(true);
        }
        else {
            callback(false);
        }
    });

    socket.on('start', function (data) {
        console.log(data.id + ' ' + ' ' + data.x + ' ' + data.y);
        var blob = new Blob(data.id, data.color, data.x, data.y);
        allBlobsData.push(blob);
    });

    /**
     * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
     */
    socket.on('update', function (data) {
        //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
        var blob;
        for (var i = 0; i < blobsData.length; i++) {
            if (socket.id == blobsData[i].id) {
                blob = blobsData[i];
            }
        }

        blob.x = data.x;
        blob.y = data.y;
    });

    /**
    * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
    */
    /**
     * Déconnexion d'un utilisateur
    */
    socket.on('disconnect', function () {
        if (loggedBlob !== undefined) {
            // Broadcast d'un 'service-message'
            var serviceMessage =
            {
                text: 'User "' + loggedBlob.username + '" disconnected',
                type: 'logout'
            };
            socket.broadcast.emit('service-message', serviceMessage);

            // Suppression de la liste des connectés
            var userIndex = blobsData.indexOf(loggedBlob);
            if (userIndex !== -1) {
                blobsData.splice(userIndex, 1);
            }

            // Emission d'un 'user-logout' contenant le user
            //io.emit('user-logout', loggedBlob);      
        }
    });

});


/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
server.listen(3000, function () {
    console.log('Server is listening on *:3000');
});



