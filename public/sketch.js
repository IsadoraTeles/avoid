// CLIENT SIDE

// BLOB
var allBlobsData = []; // OTHER BLOBS
var blob; // ME
//var user;
var myColor;

var go = false;

// COMMUNICATION
/*global io*/
var socket = io();

function setup() {

    createCanvas(1000, 1000);

    // ** 1
    socket.on('heartbeat', function (blobsData) {
        allBlobsData = blobsData;
        print("blobs : " + blobsData.length);
    });

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
                    myColor = color(random(50, 255), random(50, 255), random(50, 255));
                    blob = new Blob (socket.id, user.username, myColor, random(width), random(height));
                    $('body').removeAttr('id'); // Cache formulaire de connexion
                    $('#chat input').focus(); // Focus sur le champ du message
                }
            });
        }
    });

    /**
     * Connexion d'un nouvel utilisateur
     */
    socket.on('user-login', function (blobName) {
        console.log('a user connected : ', blobName);                 
        setTimeout(function () {
        $('#users li.new').removeClass('new');
        }, 1000);
    });

    // ** 2
    if (go) {
        // Make a little object with  and y
        var data =
        {
            id: blob.id,
            username: blob.username,
            color: blob.color,
            x: blob.pos.x,
            y: blob.pos.y
        };

        socket.emit('start', data);
        go = false;
    }
}

function draw() {
    //background(0);

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
        id: blob.id,
        x: blob.x,
        y: blob.y
    };

    socket.emit('update', data);
}

socket.on('user-logout', function (user) {
    print("user " + user + " has disconnected");
  });





