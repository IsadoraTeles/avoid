// CLIENT SIDE

// BLOB
var allBlobsData = []; // OTHER BLOBS
var blob; // ME
var name;
var myColor;

var go = false;

// COMMUNICATION
/*global io*/
var socket = io();

// ** 1
socket.on('heartbeat', function (blobsData) {
    allBlobsData = blobsData;
    print("blobs received: " + blobsData.length);
    //print("blobs here on client : " + allBlobsData.length);
});

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

}

function draw() {
    //background(0);

    socket.on('newDrawing', function (newData) {
        //allBlobsData[newData.index].x = newData.posX;
        //allBlobsData[newData.index].x = newData.posY;
        fill(255, 255, 0);
        ellipse(newData.posX, newData.posY, 10, 10);


        //fill(255);
        //textAlign(CENTER);
        //textSize(4);
        //text(allBlobsData[i].username, allBlobsData[i].x, allBlobsData[i].y + 10);
    });

    // for (var i = 0; i < allBlobsData.length; i++) {
    //     //var id = allBlobsData[i].id;

    //     if (allBlobsData[i].id !== socket.id) {
    //         var c = allBlobsData[i].myColor[0];
    //         print("color " + c);
    //         fill(255, 255, 0);
    //         ellipse(allBlobsData[i].x, allBlobsData[i].y, 10, 10);


    //         fill(255);
    //         textAlign(CENTER);
    //         textSize(4);
    //         text(allBlobsData[i].username, allBlobsData[i].x, allBlobsData[i].y + 10);
    //     }
    // }
    //print("blobs here on client : " + allBlobsData.length);
}

function mouseDragged() {
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

// function sendmouse(xpos, ypos) {
//     var data =
//     {
//         id: blob.id,
//         x: xpos,
//         y: ypos
//     };

//     socket.emit('update', data);
// }

socket.on('user-logout', function (user) {
    print("user " + user + " has disconnected");

});





