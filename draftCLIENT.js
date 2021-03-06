/*var canvas;


// *** SOUNDS *** //
var bumpedOtherSound;
var bumpedGiuseppeSound;
var giuBumpedOtherSound;

var wave;

//var randomSound;
//var sfx = [];
//var sfx1, sfx2, sf3, sfx4, sfx5;
//var alerts = [10];

var button;
var playing = false;

// *** CLIENT *** //
//
//
var giuPosition;
var gTarget = [255, 0, 0]; // RED
// ***OBJECTS*** //
// BLOBS
var blob; // me
var blobs = []; // others
// SOCKETs
// const port = process.env.PORT || 3000;
let socket;
// VIDEO CAPTURE
let captureClient;

// ***VARIABLES*** //
// video
var w = 640;
var h = 480;
var targetColor = [255, 0, 0]; // BLUE
var thresholdAmount = 206.55;

// drawing
let myColor;
var myPosition;
var mySize;
var myDistance;
var isGiuseppe;
var bumpedGiuseppe;
var bumpedOther;
var giuBumpedOther;

function preload() {

    bumpedOtherSound = loadSound('sounds/Alert/3.mp3');
    bumpedGiuseppeSound = loadSound('sounds/Alert/1.mp3');
    giuBumpedOtherSound = loadSound('sounds/Alert/8.mp3');


    sfx1 = loadSound('sounds/Alert/0.mp3');
    sfx2 = loadSound('sounds/Alert/2.mp3');
    sfx3 = loadSound('sounds/Woosh/3.mp3');


}

function setup() {

    //bumpedGiuseppeSound.playMode('restart');
    //bumpedOtherSound.playMode('restart');
    //giuBumpedOtherSound.playMode('restart');

    // SOUND
    wave = new p5.Oscillator();

    wave.setType('sine');
    wave.start();
    wave.freq(440);
    wave.amp(0);

    ///////

    giuPosition = createVector(0, 0);

    myColor = random(360);
    // colorMode(HSB, 100);
    // button.style('background-color', myColor);

    myPosition = createVector(0, 0);
    mySize = 20;
    myDistance = 0;
    isGiuseppe = false;
    bumpedGiuseppe = false;
    bumpedOther = false;
    giuBumpedOther = false;

    // STEUP CANVAS
    canvas = createCanvas(w, h);
    //canvas.position(0, 0);
    button = createButton('play/pause noise');
    button.position(60, canvas.y - 40);
    button.size(150, 30);
    button.mousePressed(toggle);

    //background(0);

    // SETUP SOCKETS
    socket = io.connect();
    // Draw client on canvas
    //socket.on('clientData', drawOthers);

    // VIDEO DRAW
    setupVideoDraw(w, h);

    // ME
    blob = new Blob(myColor, myPosition.x, myPosition.y, mySize, myDistance, isGiuseppe, bumpedGiuseppe, bumpedOther);
    var data = {
        color: blob.color,
        x: blob.x,
        y: blob.y,
        s: blob.s,
        d: blob.d,
        ig: blob.ig,
        bg: blob.bg,
        bo: blob.bo
    }
    socket.emit('start', data);

    socket.on('heartbeat', function (data) {

        blobs = data; // update other blobs

    });
}

function draw() {

    background(0);

    noStroke();

    image(captureClient, 0, 0, width, width * captureClient.height / captureClient.width);
    captureClient.hide();

    // IF IM NOT GIUSEPPE
    if (isGiuseppe == false) {

        myPosition = updateColorPosition(targetColor, thresholdAmount);

        // draw others
        for (var i = blobs.length - 1; i >= 0; i--) {
            var id = blobs[i].id;
            var posGiu = createVector(0, 0);

            // IF ITS NOT ME
            if (id !== socket.id) {

                // IF ITS GIUSEPPE and giuseppe is not me
                if (i == 0) {

                    blobs[0].color = 0;
                    blobs[0].s = 30;
                    blobs[0].d = 0;

                    posGiu = (blobs[0].x, blobs[0].y);

                    // IF I BUMPED GIUSEPPE
                    myDistance = dist(myPosition.x, myPosition.y, blobs[0].x, blobs[0].y);
                    if (myDistance < 30) {
                        bumpedGiuseppe = true;
                        blob.bg = true;
                    }

                    var f = map(blobs[0].x, 0, width, 1200, 440);
                    wave.freq(f);

                    colorMode(HSB);
                    fill(blobs[0].color, 100, 100);
                    ellipse(blobs[0].x, blobs[0].y, blobs[0].s, blobs[0].s);
                    fill(255);
                    textAlign(CENTER);
                    textSize(12);
                    //text('GIUSEPPE', blobs[0].x, blobs[0].y - 20);

                }

                // OTHERS THEN ME OR GIUSEPPE
                else if (i > 0) {
                    colorMode(HSB);
                    fill(blobs[i].color, 100, 100);
                    ellipse(blobs[i].x, blobs[i].y, blobs[i].s, blobs[i].s);

                    fill(255);
                    textAlign(CENTER);
                    textSize(12);
                    //text(blobs[i].d, blobs[i].x, blobs[i].y);

                    // IF I BUMPED OTHER PERSON
                    var othersDist = dist(myPosition.x, myPosition.y, blobs[i].x, blobs[i].y);
                    if (othersDist < 30) {
                        bumpedOther = true;
                        blob.bo = true;
                    }

                    ///////////

                    if (blobs[i].bo) {

                        var a = map(blobs[i].y, 0, height, 0, 0.5);

                        bumpedOtherSound.play();
                        bumpedOtherSound.amp(a, 0.1);
                    }
                    else {
                        bumpedOtherSound.amp(0, 0.1);
                    }

                    if (blobs[i].bg) {

                        bumpedGiuseppeSound.play();
                        bumpedGiuseppeSound.amp(a, 0.1);

                    }
                    else {

                        bumpedGiuseppeSound.amp(0, 0.2);

                    }
                }


                if (bumpedGiuseppe) {

                    var a = map(myPosition.y, 0, height, 0, 0.5);


                    bumpedGiuseppeSound.play();
                    bumpedGiuseppeSound.amp(a, 0.1);

                }
                else {

                    bumpedGiuseppeSound.amp(0, 0.2);

                }

                if (bumpedOther) {

                    var a = map(myPosition.y, 0, height, 0, 0.5);

                    bumpedOtherSound.play();
                    bumpedOtherSound.amp(a, 0.1);
                }
                else { bumpedOtherSound.amp(0, 0.2); }
            }

            // IF I AM GIUSEPPE
            if (blobs[0].id == socket.id && isGiuseppe == false) {
                isGiuseppe = true; // created giuseppe on first connected
                blob.ig = true;
            }
        }

        ////////////
        blob.drawBlob();

        fill(255);
        textAlign(CENTER);
        textSize(12);
        //text(blob.d, blob.x, blob.y + blob.s);

        var data = {
            color: blob.color,
            x: blob.x,
            y: blob.y,
            s: blob.s,
            d: blob.d,
            ig: isGiuseppe,
            bg: bumpedGiuseppe,
            bo: bumpedOther
        };
        socket.emit('update', data);
        ////////////
    }


    // IF I AM GIUSEPPE
    if (isGiuseppe) {

        myPosition = updateColorPosition(gTarget, thresholdAmount);

        // DRAW OTHER BLOBS
        for (var i = blobs.length - 1; i >= 0; i--) {

            var id = blobs[i].id;
            if (id !== socket.id) {

                colorMode(HSB);
                fill(blobs[i].color, 100, 100);
                ellipse(blobs[i].x, blobs[i].y, blobs[i].s, blobs[i].s);

                // updating other's distance from me
                blobs[i].d = dist(blobs[i].x, blobs[i].y, myPosition.x, myPosition.y);

                // WHEN GIUSEPPE BUMPS OTHERS
                if (blobs[i].d < 30) {
                    giuBumpedOther = true;
                    blob.bo = true;
                    blobs[i].bg = true;

                    var a = map(blobs[i].y, 0, height, 0, 0.5);

                    bumpedGiuseppeSound.play();
                    bumpedGiuseppeSound.amp(a, 0.1);
                }
                else { bumpedGiuseppeSound.amp(0, 0.3); }

                if (blobs[i].bo) {

                    var a = map(blobs[i].y, 0, height, 0, 0.5);

                    bumpedOtherSound.play();
                    bumpedOtherSound.amp(a, 0.1);
                }
                else {
                    bumpedOtherSound.amp(0, 0.1);
                }

                //fill(255);
                //textAlign(CENTER);
                //textSize(12);
                //text(blobs[i].d, blobs[i].x, blobs[i].y);
            }

        }

        ////////
        blob.color = 0;
        blob.s = 50;
        blob.d = 0;

        blob.drawBlob();
        var f = map(myPosition.x, 0, width, 1200, 440);
        wave.freq(f);

        //fill(255);
        //textAlign(CENTER);
        //textSize(12);
        //text('GIUSEPPE', blob.x, blob.y - 20);

        var data = {
            color: blob.color,
            x: blob.x,
            y: blob.y,
            s: blob.s,
            d: 0,
            ig: isGiuseppe,
            bg: bumpedGiuseppe,
            bo: bumpedOther
        };
        socket.emit('update', data);
        /////////
    }

    // update my blob
    blob.color = myColor;
    blob.x = myPosition.x;
    blob.y = myPosition.y;
    blob.s = mySize;
    blob.d = myDistance;
    blob.ig = isGiuseppe;
    blob.bg = bumpedGiuseppe;
    blob.bo = bumpedOther;

    bumpedGiuseppe = false;
    bumpedOther = false;
    giuBumpedOther = false;


}

// *** VIDEO DRAW *** //
function setupVideoDraw(width, height) {
    captureClient = createCapture(VIDEO);
    captureClient.size(width, height);
    //captureClient.hide();
}

// returns color position in screen calculate color position within video stream
function updateColorPosition(tc, ta) {

    captureClient.loadPixels();
    var sampling = true;
    var sumPosition = createVector(0, 0);
    if (captureClient.pixels.length > 0) { // don't forget this!

        var w = captureClient.width,
            h = captureClient.height;
        var i = 0;
        var pixels = captureClient.pixels;

        var total = 0;
        for (var y = 0; y < h; y++) {
            for (var x = 0; x < w; x++) {
                var diff =
                    Math.abs(pixels[i + 0] - tc[0]) +
                    Math.abs(pixels[i + 1] - tc[1]) +
                    Math.abs(pixels[i + 2] - tc[2]);
                var outputValue = 0;
                if (diff < ta) {
                    outputValue = 255;
                    sumPosition.x += x;
                    sumPosition.y += y;
                    total++;
                }
                pixels[i++] = outputValue; // set red
                pixels[i++] = outputValue; // set green
                pixels[i++] = outputValue; // set blue
                i++; // skip alpha
            }
        }

        sumPosition.div(total);

    }
    if (!sampling) {
        captureClient.updatePixels();
    }


   // var c = blob.color;
    //colorMode(HSB);
    //fill(c, 100, 100);
    //ellipse(sumPosition.x, sumPosition.y, blob.size, blob.size);


    return sumPosition;
}

function toggle() {
    if (!playing) {
        wave.amp(0.5, 1);
        playing = true;
    } else {
        wave.amp(0, 0.2);
        playing = false;
    }
}

*/

// --------------------- //

// CLIENT SIDE

// COMMUNICATION
/*global io*/
var socket = io();

/**
 * Connexion de l'utilisateur
 * Uniquement si le username n'est pas vide et n'existe pas encore
 */
$('#login form').submit(function (e) {
    e.preventDefault();
    var user = {
        username: $('#login input').val().trim()
    };
    if (user.username.length > 0) { // Si le champ de connexion n'est pas vide
        socket.emit('user-login', user, function (success) {
            if (success) {
                $('body').removeAttr('id'); // Cache formulaire de connexion
                $('#chat input').focus(); // Focus sur le champ du message
            }
        });
    }
});

/**
 * Envoi d'un message
 */
$('#chat form').submit(function (e) {
    e.preventDefault();
    var message = {
        text: $('#m').val()
    };
    $('#m').val('');
    if (message.text.trim().length !== 0) { // Gestion message vide
        socket.emit('chat-message', message);
    }
    $('#chat input').focus(); // Focus sur le champ du message
});

/**
 * Réception d'un message
 */
socket.on('chat-message', function (message) {
    $('#messages').append($('<li>').html('<span class="username">' + message.username + '</span> ' + message.text));
});

/**
 * Réception d'un message de service
 */
socket.on('service-message', function (message) {
    $('#messages').append($('<li class="' + message.type + '">').html('<span class="info">information</span> ' + message.text));
});

/**
 * Connexion d'un nouvel utilisateur
 */
socket.on('user-login', function (user) {
    $('#users').append($('<li class="' + user.username + ' new">').html(user.username));
    setTimeout(function () {
        $('#users li.new').removeClass('new');
    }, 1000);

});

/**
 * Déconnexion d'un utilisateur
 */
socket.on('user-logout', function (user) {
    var userIndex = users.indexOf(user);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
    }
});

