
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
function Blob(id, username, mycolor, x, y) {
    this.id = id;
    this.username = username;
    this.myColor = mycolor;
    this.x = x;
    this.y = y;
}


/*******************************/

io.on('connection', function (socket) {

    /**
     * Utilisateur connecté à la socket
     */
    var blobName; // stock all logged user data
    var loggedblob;
    /**
    * Log de connexion d'un utilisateur (avant login)
    */
    console.log('a user connected SERVER');

    /**
     * Connexion d'un utilisateur via le formulaire :
     */
    socket.on('user-login', function (user, callback) {
        // Vérification que l'utilisateur n'existe pas
        var userIndex = -1;
        for (i = 0; i < blobsData.length; i++) {
            if (blobsData[i].username == user.username) {
                userIndex = i;
                console.log('THIS USER EXISTS ! and its name is : ' + user.username);
            }
        }
        if (user !== undefined && userIndex === -1) {
            // S'il est bien nouveau
            // Sauvegarde de l'utilisateur et ajout à la liste des connectés
            blobName = user.username;
            console.log(user.username + ' ' + ' ' + user.x + ' ' + user.y);

            loggedblob = new Blob(user.id, user.username, user.mycolor, user.x, user.y);
            blobsData.push(loggedblob);
            // Emission de 'user-login' et appel du callback
            io.emit('user-login', blobName);
            callback(true);
        }
        else {
            callback(false);
        }
    });

    /**
     * Réception de l'événement 'chat-message' et réémission vers tous les utilisateurs
     */
    socket.on('mouse',
        function (data) {
            // Data comes in as whatever was sent, including objects
            console.log("Received: 'mouse' " + data.x + " " + data.y);

            // Send it to all other clients
            socket.broadcast.emit('mouse', data);

            // This is a way to send to everyone including sender
            // io.sockets.emit('message', "this goes to everyone");


        });

    /**
    * Déconnexion d'un utilisateur : broadcast d'un 'service-message'
    */
    /**
     * Déconnexion d'un utilisateur
    */
    socket.on('disconnect', function () {
        if (blobName !== undefined) {
            var userIndex = -1;
            for (var i = 0; i < blobsData.length; i++) {
                if (socket.id == blobsData[i].id) {
                    userIndex = i;
                }
                if (userIndex !== -1) {
                    blobsData.splice(userIndex, 1);
                }
            }

            // Suppression de la liste des connectés

            // Emission d'un 'user-logout' contenant le user
            io.emit('user-logout', blobName);
        }
    });

});


/**
 * Lancement du serveur en écoutant les connexions arrivant sur le port 3000
 */
server.listen(3000, function () {
    console.log('Server is listening on *:3000');
});



