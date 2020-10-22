// CLIENT SIDE

// BLOB
var allBlobsData = []; // OTHER BLOBS
var blob; // ME
//var user;
var color;

var go = false;

// COMMUNICATION
/*global io*/
var socket = io();

function setup() {

    createCanvas(1000, 1000);

    /**
    * Connexion de l'utilisateur
    * Uniquement si le username n'est pas vide et n'existe pas encore
    */
    $('#login form').submit(function (e) {
        e.preventDefault(); // On évite le recharchement de la page lors de la validation du formulaire
        // On crée notre objet JSON correspondant à notre message
        var user =
        {
            username: $('#login input').val().trim()
        };

        if (user.username.length > 0) {
            // Si le champ de connexion n'est pas vide
            socket.emit('user-login', user, function (success) {
                if (success) {
                    go = true;
                    color = color(random(255), random(255), random(255));
                    blob = new Blob(socket.id, user.username, color, random(width), random(height));
                    $('body').removeAttr('id'); // Cache formulaire de connexion
                    $('#chat input').focus(); // Focus sur le champ du message
                }
            });
        }
    });

    if (go) {
        // Make a little object with  and y
        var data =
        {
            id: blob.id,
            color: blob.color,
            x: blob.pos.x,
            y: blob.pos.y,
        };

        socket.emit('start', data);

        socket.on('heartbeat', function (data) {
            allBlobsData = data;
        });
    }
}

function draw() {
    background(0);

    for (var i = allBlobsData.length - 1; i >= 0; i--) {
        var id = allBlobsData[i].id;

        if (id.substring(2, id.length) !== socket.id) {
            fill(allBlobsData[i].color);
            ellipse(allBlobsData[i].x, allBlobsData[i].y, 10, 10);

            fill(255);
            textAlign(CENTER);
            textSize(4);
            text(allBlobsData[i].id, allBlobsData[i].x, allBlobsData[i].y + 10);
        }
    }
}

function mouseDragged(){
    blob.update(mouseX, mouseY);
    blob.show();
    var data =
    {
        x: blob.x,
        y: blob.y,
    };

    socket.emit('update', data);
}






