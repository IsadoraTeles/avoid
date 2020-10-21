
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
function Blob(id, name, color, x, y) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.x = x;
    this.y = y;
}

setInterval(heartbeat, 33);

// STILL USEFUL ???
function heartbeat() {
    io.sockets.emit('blobsData', blobsData); // message with array of data
}

/*******************************/

io.on('connection', function (socket) {

    /**
     * Utilisateur connecté à la socket
     */
    var loggedBlob; // DATA NOT OBJECT

    /**
    * Emission d'un événement "user-login" pour chaque utilisateur connecté
    */
    for (i = 0; i < blobsData.length; i++) {
        socket.emit('user-login', blobsData[i]);
    }

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
                text: 'User "' + loggedBlob.name + '" disconnected',
                type: 'logout'
            };

            socket.broadcast.emit('service-message', serviceMessage);

            // Suppression de la liste des connectés
            var blobIndex = blobsData.indexOf(loggedBlob);

            if (blobIndex !== -1) {
                blobsData.splice(blobIndex, 1);
            }

            // Emission d'un 'user-logout' contenant le user
            io.emit('user-logout', loggedBlob);
        }
    });

    /**
    * Log de connexion d'un utilisateur (avant login)
    */
    console.log('a user connected');

    /**
     * Connexion d'un utilisateur via le formulaire :
     */
    //1
    socket.on('user-login', function (data1, callback) // !!!
    {
        // Vérification que l'utilisateur n'existe pas
        //loggedBlob = new Blob(data1.id, data1.name, data1.color, data1.x, data1.y);

        var blobIndex = -1;

        for (i = 0; i < blobsData.length; i++) {
            if (blobsData[i].name === data1.name) {
                blobIndex = i;
            }
        }

        if (data1.name !== undefined && blobIndex === -1) {
            // S'il est bien nouveau
            // Sauvegarde de l'utilisateur et ajout à la liste des connectés
            loggedBlob = new Blob(data1.id, data1.name, data1.color, data1.x, data1.y);
            blobsData.push(loggedBlob);

            // Envoi des messages de service
            var userServiceMessage =
            {
                text: 'You logged in as "' + loggedBlob.name + '"',
                type: 'login'

            };

            var broadcastedServiceMessage =
            {
                text: 'User "' + loggedBlob.name + '" logged in',
                type: 'login'
            };

            socket.emit('service-message', userServiceMessage);
            socket.broadcast.emit('service-message', broadcastedServiceMessage);

            // Emission de 'user-login' et appel du callback
            var data2 = loggedBlob;
            io.emit('user-login', data2);
            callback(true);
        }

        else {
            callback(false);
        }


        /**
         * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
         */
        socket.on('update', function (data5) {
            //var serverBlob;
            for (var i = 0; i < allBlobsData.length; i++) {
                if (socket.id == allBlobsData[i].id) {
                    //serverBlob = allBlobsData[i]; // ??
                    allBlobsData[i].id = data5.id;
                    allBlobsData[i].name = data5.name;
                    allBlobsData[i].color = data5.color;
                    allBlobsData[i].x = data5.x;
                    allBlobsData[i].y = data5.y;
                }
            }

        });

    });

});

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
server.listen(3000, function () {
    console.log('Server is listening on *:3000');
});



