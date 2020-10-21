// CLIENT SIDE

// BLOB
var name;
var allBlobsData = [];
var blob;

// COMMUNICATION
/*global io*/
var socket = io();

function setup() {

    blob = new Blob();

}

/**
 * Connexion de l'utilisateur
 * Uniquement si le username n'est pas vide et n'existe pas encore
 */
$('#login form').submit(function (e) {
    e.preventDefault();

    var user = { username: $('#login input').val().trim() };

    if (user.username.length > 0) {
        // Si le champ de connexion n'est pas vide

        //blob.giveNameAndId(socket.id, user.username);

        var data1 = {
            id: blob.id,
            name: blob.name,
            x: blob.x,
            y: blob.y,
            color: blob.color
        };

        console.log('login');
        console.log(blob.name);


        socket.emit('user-login', user, function (success) {
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
socket.on('user-login', function (user) {
    $('#users').append($('<li class="' + data2.name + ' new">').html(data2.name));
    setTimeout(function () {
        $('#users li.new').removeClass('new');
    }, 1000);
});

/**
 * Déconnexion d'un utilisateur
 */
socket.on('user-logout', function (data4) {
    var blobOutIndex;
    for (var i = 0; i < allBlobsData.length; i++) {
        if (data4.id == allBlobsData[i].id) {
            blobOutIndex = allBlobsData[i];
            allBlobsData.splice(blobOutIndex, 1);
        }
    }

});

/**
 * Réception d'un message
 */
socket.on('blobsData', function (data3) {
    allBlobsData = data3;
});


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
    var data5 = {
        id: blob.id,
        name: blob.name,
        color: blob.color,
        x: blob.x,
        y: blob.y
    };
    socket.emit('update', data5);

}

function drawAllBlobs() {
    for (var i = 0; i < allBlobsData.length; i++) {

        var tempBlob = new Blob();
        // extract information about blob
        //var id = allBlobsData[i].id;
        // var name = allBlobsData[i].name;
        var color = allBlobsData[i].color;
        var posX = allBlobsData[i].x;
        var posY = allBlobsData[i].y;

        // draw blob
        fill(color);
        noStroke();
        ellipse(posX, posY, 20, 20);
    }
}