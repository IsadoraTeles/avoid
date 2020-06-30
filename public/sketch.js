// *** CLIENT *** //

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
var w = 320;
var h = 240;
var targetColor = [255, 0, 0];
var thresholdAmount = 206.55;

// drawing
let myColor;
var myPosition;
var mySize;
var myId;

function setup() {

    myColor = random(360);
    myPosition = createVector(0, 0);
    mySize = 10;

    // STEUP CANVAS
    createCanvas(w, h);
    //background(0);

    // SETUP SOCKETS
    socket = io.connect();
    // Draw client on canvas
    //socket.on('clientData', drawOthers);

    // VIDEO DRAW
    setupVideoDraw(w, h);

    // ME
    blob = new Blob(myColor, myPosition.x, myPosition.y, mySize);
    var data = {
        color: blob.color,
        x: blob.x,
        y: blob.y,
        s: blob.s
    }
    socket.emit('start', data);

    socket.on('heartbeat', function (data) {
        blobs = data; // update other blobs
    });

}

function draw() {

    background(0);
    // update color, position and size from video
    myPosition = updateColorPosition(targetColor, thresholdAmount);
    // update my blob
    blob.color = myColor;
    blob.x = myPosition.x;
    blob.y = myPosition.y;
    blob.s = mySize;

    // draw others
    for (var i = blobs.length - 1; i >= 0; i--) {
        var id = blobs[i].id;
        // I DONT WANT TO DRAW MYSELF ??
        if (id !== socket.id) {
            colorMode(HSB);
            fill(blobs[i].color, 100, 100);
            ellipse(blobs[i].x, blobs[i].y, blobs[i].s, blobs[i].s);

            fill(255);
            textAlign(CENTER);
            textSize(12);
            text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].s);
        }
    }

    // draw me and send an 'update' data
    blob.drawBlob(); fill(255);
    textAlign(CENTER);
    textSize(12);
    text(socket.id, blob.x, blob.y + blob.s);

    var data = {
        color: blob.color,
        x: blob.x,
        y: blob.y,
        s: blob.s
    };
    socket.emit('update', data);

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

    /*
    var c = blob.color;
    colorMode(HSB);
    fill(c, 100, 100);
    ellipse(sumPosition.x, sumPosition.y, blob.size, blob.size);
*/

    return sumPosition;
}


