// CLIENT SIDE

// BLOB
var allBlobsData = []; // OTHER BLOBS
var boids = [];
var blob; // ME
var name;
var myColor;
var b = false;

var go = false;
var isHost = false;
var isClient = false;

// COMMUNICATION
/*global io*/
var socket = io();

// ** 1

function setup() {

    createCanvas(1000, 1000);

    quadTree = new QuadTree(Infinity, 30, new Rect(0, 0, width, height));
    this.alignSlider = createSlider(0, 10, 1, 0.1);
    this.cohesionSlider = createSlider(0, 10, 1, 0.1);
    this.separationSlider = createSlider(0, 10, 1, 0.1);
    this.maxForceSlider = createSlider(0, 10, 1, 0.1);
    this.maxSpeedSlider = createSlider(0, 10, 1, 0.1);

    /**
    * Connexion de l'utilisateur
    * Uniquement si le username n'est pas vide et n'existe pas encore
    */
    $('#login form').submit(function (e) {
        e.preventDefault(); // On évite le recharchement de la page lors de la validation du formulaire
        name = $('#login input').val().trim();
        if (name.length > 0 && name == "host") {
            print(name);
            myColor = [255, 0, 0];
            //walker = new RandomWalker();
            boid = new Boid();
            var host =
            {
                username: boid.username,
                mycolor: boid.mycolor,
                x: boid.x,
                y: boid.y
            };
            // Si le champ de connexion n'est pas vide
            socket.emit('host-login', host, function (success) {
                if (success) {
                    print("SUCCESS HOST : " + host.username);
                    $('body').removeAttr('id'); // Cache formulaire de connexion
                    $('#chat input').focus(); // Focus sur le champ du message
                    isHost = true;
                }
            });
        }
        else if (name.length > 0 && name != "host") {
            //print(name);
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
                    isClient = true;
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

    socket.on('host-login', function (hostName) {
        console.log('a user connected CLIENT : ', hostName);
        setTimeout(function () {
            $('#users li.new').removeClass('new');
        }, 1000);
    });

    socket.on('mouse',
        // When we receive data
        function (data) { // data: id, xpos, ypos, mycolor
            fill(color(data.mycolor));
            noStroke();
            ellipse(data.x, data.y, 20, 20);
        }
    );


    socket.on('walker',
        // When we receive data
        function (data) { // data: id, xpos, ypos, mycolor
            fill(color(data.mycolor));
            noStroke();
            ellipse(data.x, data.y, 5, 5);
            print("host update");
        }
    );

    // update list of clients connected
    socket.on('heartbeat', function (data) {
        allBlobsData = data;
    });

}

function draw() {

    quadTree.clear();
    for (const blob of allBlobsData) {
        quadTree.addItem(blob.x, blob.y, blob);
    }

    if (isHost) {
        print("host update");
        //sendwalker(walker.x, walker.y, walker.mycolor);
        //walker.update();
        //walker.show();
        sendwalker(boid.position.x, boid.position.y, boid.mycolor);
        boid.edges();
        boid.flock(allBlobsData);
        boid.update();
        boid.show();
    }

    quadTree.debugRender();

}

function mouseDragged() {
    if (isClient) {
        sendmouse(blob.x, blob.y, blob.mycolor);
        blob.update(mouseX, mouseY);
        noStroke();
        blob.show();
    }
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

// Function for sending to the socket
function sendwalker(xpos, ypos, mycolor) {
    // We are sending!
    console.log("sendwalker: " + xpos + " " + ypos);

    // Make a little object with  and y
    var data = {
        x: xpos,
        y: ypos,
        mycolor: mycolor
    };

    // Send that object to the socket
    socket.emit('walker', data);
}

socket.on('user-logout', function (user) {
    print("user " + user + " has disconnected");
    print("blobs : " + allBlobsData.length);
});

socket.on('host-logout', function (user) {
    print("host " + user + " has disconnected");
    print("blobs : " + allBlobsData.length);
});





