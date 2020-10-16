
/**
* SERVER SIDE - GESTION DES CONNEXIONS
*/

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
var blobs = []; // list of objects blob

setInterval(heartbeat, 33);

// STILL USEFUL ???
function heartbeat() {
    io.sockets.emit('allBlobs', blobs); // message with array of blobs
}

/*******************************/

io.on('connection', function (socket) {

    /**
     * Utilisateur connecté à la socket
     */
    var loggedBlob;

    /**
    * Emission d'un événement "user-login" pour chaque utilisateur connecté
    */
    for (i = 0; i < blobs.length; i++) {
        socket.emit('user-login', blobs[i]);
    }

    /**
    * Log de connexion d'un utilisateur (avant login)
    */
    console.log('a user connected');

    /**
     * Connexion d'un utilisateur via le formulaire :
     */
    socket.on('user-login', function (blob, callback) // !!!
    {
        // Vérification que l'utilisateur n'existe pas
        var blobIndex = -1;
        for (i = 0; i < blobs.length; i++) {
            if (blobs[i].name === blob.name) {
                blobIndex = i;
            }
        }

        if (blob !== undefined && blobIndex === -1) {
            // S'il est bien nouveau
            // Sauvegarde de l'utilisateur et ajout à la liste des connectés
            loggedBlob = blob;
            blobs.push(loggedBlob);

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
            io.emit('user-login', loggedBlob);
            callback(true);
        }

        else {
            callback(false);
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
                var blobIndex = blobs.indexOf(loggedBlob);

                if (blobIndex !== -1) {
                    blobs.splice(blobIndex, 1);
                }

                // Emission d'un 'user-logout' contenant le user
                io.emit('user-logout', loggedBlob);
            }
        });

        /**
         * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
         */
        socket.on('blob-message', function (blobMessage) {
            //blobMessage.name = loggedBlob.name;
            var blobIndex = blobs.indexOf(loggedBlob);
            var blobUpdate = blobMessage;
            blobs[blobIndex] = blobUpdate;
        });

    });

});

/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
server.listen(3000, function () {
    console.log('Server is listening on *:3000');
});



