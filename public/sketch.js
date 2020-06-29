
// VARIABLES 
// SOCKET
//const port = process.env.PORT || 3000;
let socket;

// VIDEO CAPTURE
let captureClient;
var w = 320;
var h = 240;
var targetColor = [255, 0, 0];
var thresholdAmount = 206.55;

// DRAWING PARAMETERS
let myColor;
var myPosition;
var mySize;


function setup() {

    myColor = random(360);
    myPosition = createVector(0, 0);
    mySize = createVector(10, 10);

    // STEUP CANVAS
    createCanvas(w, h);
    //background(0);

    // SETUP SOCKETS
    socket = io.connect();
    // Draw client on canvas
    socket.on('clientData', drawOthers);

    // VIDEO DRAW
    setupVideoDraw(w, h);

    // SETUP MY PROPERTIES


}

function draw() {

    // update color

    // update sound

    // update color position form video
    myPosition = updateColorPosition(targetColor, thresholdAmount);
    drawMe(myColor, myPosition, mySize);

    // SOCKET SEND POSITION
    sendMyData(myColor, myPosition, mySize);

}

// ***VIDEO DRAW*** //
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

    return sumPosition;
}

function sendMyData(color, position, size) {
    var data = {
        r: color.r,
        g: color.g,
        b: color.b,
        x: position.x,
        y: position.y,
        w: size.x,
        h: size.y
    }

    socket.emit('clientData', data);

}

function drawMe(color, position, size) {
    colorMode(HSB);
    fill(color, 100, 100);
    ellipse(position.x, position.y, size.x, size.y);
}

function drawOthers(data) {
    fill(data[0], data[1], data[2]);
    ellipse(data[3], data[4], data[5], data[6]);
}

function assignColor() {

}

function updateColor() {

}

function assignSound() {

}

function updateSound() {

}