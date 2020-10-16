// CLIENT SIDE

// BLOB
var name;
var couleur;
var blob;
var allBlobs = [];


// COMMUNICATION
/*global io*/
var socket = io();

// socket.connect(); ??????????????????

/**
 * Connexion de l'utilisateur
 * Uniquement si le username n'est pas vide et n'existe pas encore
 */
$('#login form').submit(function (e) {
    e.preventDefault();

    var user = {
        username: $('#login input').val().trim()
    };


    if (user.username.length > 0) {
        // Si le champ de connexion n'est pas vide

        var r = random(0, 255);
        var g = random(0, 255);
        var b = random(0, 255);

        couleur = color(r, g, b);

        blob = new Blob(username, couleur);

        socket.emit('user-login', blob, function (success) {
            if (success) {
                $('body').removeAttr('id'); // Cache formulaire de connexion
                $('#chat input').focus(); // Focus sur le champ du message
            }
        });
    }
});

/**
 * Connexion d'un nouvel utilisateur
 */
socket.on('user-login', function (blob) {
    $('#users').append($('<li class="' + blob.name + ' new">').html(blob.name));
    setTimeout(function () {
        $('#users li.new').removeClass('new');
    }, 1000);

});

/**
 * Déconnexion d'un utilisateur
 */
socket.on('user-logout', function (blob) {
    var blobIndex = allBlobs.indexOf(blob);
    if (blobIndex !== -1) {
        allBlobs.splice(blobIndex, 1);
    }

});

/**
 * Réception d'un message
 */
socket.on('allBlobs', function (allBlobs) {
    allBlobsHere = allBlobs;
});

function setup() {
}

function draw() {
    // draw all blobs
    drawAllBlobs();

}

function mouseDragged() {
    // update my blob data
    blob.updateBlob(mouseX, mouseY);

    /**
     * Envoi du blob
     */
    var blobMessage = blob;
    socket.emit('blob-message', blobMessage);

}

function drawAllBlobs() {
    for (var i = 0; i < allBlobs.length; i++) {

        // extract information about blob
        var couleur = allBlobs[i].color;
        var posX = allBlobs[i].x;
        var posY = allBlobs[i].y;

        // draw blob
        fill(couleur);
        noStroke();
        ellipse(posX, posY, 20, 20);
    }
}