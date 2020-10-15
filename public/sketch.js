// CLIENT SIDE

// BLOB
var blob = new Blob;
var allBlobs = [];


// COMMUNICATION
/*global io*/
var socket = io();

// socket.connect(); ??????????????????

/**
 * Connexion de l'utilisateur
 * Uniquement si le username n'est pas vide et n'existe pas encore
 */
$('#login form').submit(function (e) 
{
    e.preventDefault();

    blob.name = $('#login input').val().trim();
    
    if (blob.name.length > 0) 
    { 
        // Si le champ de connexion n'est pas vide
        socket.emit('user-login', blob, function (success) 
        {
            if (success) 
            {
                $('body').removeAttr('id'); // Cache formulaire de connexion
                $('#chat input').focus(); // Focus sur le champ du message
            }
        });
    }
});

/**
 * Déconnexion d'un utilisateur
 */
socket.on('user-logout', function (blob) 
{
    var blobIndex = allBlobs.indexOf(blob);
    if (blobIndex !== -1) 
    {
        allBlobs.splice(blobIndex, 1);
    }

}

/**
 * Réception d'un message
 */
socket.on('allBlobs', function (allBlobs) 
{
    allBlobsHere = allBlobs;
});

function setup()
{

}

function draw()
{

}

function mouseDragged()
{
    blob.draw();

    /**
     * Envoi d'un message 
     */
    var blobMessage = blob;
    socket.emit('blob-message', blobMessage);
}