// CLIENT SIDE

// BLOB
var allBlobsData = []; // OTHER BLOBS
var blob; // ME
var name;
var myColor;
var b = false;

var go = false;

// COMMUNICATION
/*global io*/
var socket = io();

// ** 1


function setup() {

    createCanvas(1000, 1000);

    /**
    * Connexion de l'utilisateur
    * Uniquement si le username n'est pas vide et n'existe pas encore
    */
    $('#login form').submit(function (e) {
        e.preventDefault(); // On évite le recharchement de la page lors de la validation du formulaire
        name = $('#login input').val().trim();
        print(name);
        if (name.length > 0) {
            print(name);
            myColor = [random(50, 255), random(50, 255), random(50, 255)];
            blob = new Blob(socket.id, name, myColor, random(width), random(height));
            var user =
            {
                id: blob.id,
                username: blob.username,
                mycolor: myColor,
                x: blob.x,
                y: blob.y
            };
            // Si le champ de connexion n'est pas vide
            socket.emit('user-login', user, function (success) {
                if (success) {
                    print("SUCCES : " + user.username);
                    $('body').removeAttr('id'); // Cache formulaire de connexion
                    $('#chat input').focus(); // Focus sur le champ du message
                    go = true;
                }
            });
        }
    });

    /**
     * Connexion d'un nouvel utilisateur
     */
    socket.on('user-login', function (blobName) {
        console.log('a user connected CLIENT : ', blobName);
        setTimeout(function () {
            $('#users li.new').removeClass('new');
        }, 1000);
    });

    socket.on('mouse',
        // When we receive data
        function (data) {
            console.log("Got: " + data.mycolor + " " + data.y);
            // Draw a blue circle
            fill(color(data.mycolor));
            noStroke();
            ellipse(data.x, data.y, 20, 20);

            b = blob.bump(data.id, data.x, data.y);
            if (b) {
                blob.mycolor = [random(50, 255), random(50, 255), random(50, 255)];
                b = false;
            }

        }
    );

}

function draw() {
}

function mouseDragged() {
    sendmouse(blob.x, blob.y, blob.mycolor);

    blob.update(mouseX, mouseY);
    noStroke();
    blob.show();
}

// Function for sending to the socket
function sendmouse(xpos, ypos, mycolor) {
    // We are sending!
    console.log("sendmouse: " + xpos + " " + ypos);

    // Make a little object with  and y
    var data = {
        id: blob.id,
        x: xpos,
        y: ypos,
        mycolor: mycolor
    };

    // Send that object to the socket
    socket.emit('mouse', data);
}

socket.on('user-logout', function (user) {
    print("user " + user + " has disconnected");

});





