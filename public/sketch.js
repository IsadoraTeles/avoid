
// *** SOUNDS *** //
let carrier; // this is the oscillator we will hear
let modulator; // this oscillator will modulate the frequency of the carrier
var moyeneDistances;
var moyenneX;
var moyenneY;
var numBlobs;

// the carrier frequency pre-modulation
let carrierBaseFreq = 220;

// min/max ranges for modulator
let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 150;
let modMinDepth = -150;

var button;
var playing = false;

// *** CLIENT *** //
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
var w = 320;
var h = 240;
var targetColor = [0, 0, 255]; // BLUE
var thresholdAmount = 206.55;

// drawing
let myColor;
var myPosition;
var mySize;
var myDistance;
var isGiuseppe;

function setup() {

    carrier = new p5.Oscillator('sine');

    // try changing the type to 'square', 'sine' or 'triangle'
    modulator = new p5.Oscillator('sawtooth');


    button = createButton('play/pause');
    button.mousePressed(toggle);

    ///////

    giuPosition = createVector(0, 0);

    myColor = random(360);
    myPosition = createVector(0, 0);
    mySize = 10;
    myDistance = 0;
    isGiuseppe = false;

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
    blob = new Blob(myColor, myPosition.x, myPosition.y, mySize, myDistance, isGiuseppe);
    var data = {
        color: blob.color,
        x: blob.x,
        y: blob.y,
        s: blob.s,
        d: blob.d,
        ig: isGiuseppe
    }
    socket.emit('start', data);

    socket.on('heartbeat', function (data) {

        blobs = data; // update other blobs

    });
}

function draw() {


    background(0);

    // update my blob
    blob.color = myColor;
    blob.x = myPosition.x;
    blob.y = myPosition.y;
    blob.s = mySize;
    blob.d = myDistance;
    blob.ig = isGiuseppe;


    // IF IM NOT GIUSEPPE
    if (isGiuseppe == false) {

        myPosition = updateColorPosition(targetColor, thresholdAmount);

        moyeneDistances = 0;
        moyenneX = 0;
        moyenneY = 0;
        numBlobs = 0;

        // draw others
        for (var i = blobs.length - 1; i >= 0; i--) {
            var id = blobs[i].id;

            // IF ITS NOT ME
            if (id !== socket.id) {

                // IF ITS GIUSEPPE and giuseppe is not me
                if (i == 0) {

                    blobs[0].color = 0;
                    blobs[0].s = 30;
                    blobs[0].d = 0;

                    myDistance = dist(myPosition.x, myPosition.y, blobs[0].x, blobs[0].y);

                    colorMode(HSB);
                    fill(blobs[0].color, 100, 100);
                    ellipse(blobs[0].x, blobs[0].y, blobs[0].s, blobs[0].s);
                    fill(255);
                    textAlign(CENTER);
                    textSize(12);
                    text('GIUSEPPE', blobs[0].x, blobs[0].y - 20);


                }

                // OTHERS THEN ME OR GIUSEPPE
                else if (i > 0) {
                    colorMode(HSB);
                    fill(blobs[i].color, 100, 100);
                    ellipse(blobs[i].x, blobs[i].y, blobs[i].s, blobs[i].s);

                    fill(255);
                    textAlign(CENTER);
                    textSize(12);
                    text(blobs[i].d, blobs[i].x, blobs[i].y);

                }
            }

            moyeneDistances = (moyeneDistances + blobs[i].d) / blobs.length;
            moyenneX = (moyenneX + blobs[i].x) / blobs.length;
            moyenneY = (moyenneY + blobs[i].y) / blobs.length;

            // map mouseY to modulator freq between a maximum and minimum frequency
            let modFreq = map(moyeneDistances, 30, 300, modMinFreq, modMaxFreq);
            modulator.freq(modFreq);

            // change the amplitude of the modulator
            // negative amp reverses the sawtooth waveform, and sounds percussive
            //
            let modDepth = map(moyenneX, 0, width, modMinDepth, modMaxDepth);
            modulator.amp(modDepth);


            // IF I AM GIUSEPPE
            if (blobs[0].id == socket.id && isGiuseppe == false) {
                isGiuseppe = true; // created giuseppe on first connected
            }
        }

        ////////////
        blob.drawBlob();

        fill(255);
        textAlign(CENTER);
        textSize(12);
        text(blob.d, blob.x, blob.y + blob.s);

        var data = {
            color: blob.color,
            x: blob.x,
            y: blob.y,
            s: blob.s,
            d: blob.d,
            ig: false
        };
        socket.emit('update', data);
        ////////////
    }

    if (isGiuseppe) {

        myPosition = updateColorPosition(gTarget, thresholdAmount);
        //giuPosition = (myPosition.x, myPosition.y);

        moyeneDistances = 0;
        moyenneX = 0;
        moyenneY = 0;
        numBlobs = 0;

        for (var i = blobs.length - 1; i >= 0; i--) {

            var id = blobs[i].id;
            // IF ITS NOT ME
            if (id !== socket.id) {

                colorMode(HSB);
                fill(blobs[i].color, 100, 100);
                ellipse(blobs[i].x, blobs[i].y, blobs[i].s, blobs[i].s);

                // updating other's distance from me
                blobs[i].d = dist(blobs[i].x, blobs[i].y, myPosition.x, myPosition.y);

                fill(255);
                textAlign(CENTER);
                textSize(12);
                text(blobs[i].d, blobs[i].x, blobs[i].y);
            }

            moyeneDistances = (moyeneDistances + blobs[i].d) / blobs.length;
            moyenneX = (moyenneX + blobs[i].x) / blobs.length;
            moyenneY = (moyenneY + blobs[i].y) / blobs.length;

            // map mouseY to modulator freq between a maximum and minimum frequency
            let modFreq = map(moyenneY, height, 0, modMinFreq, modMaxFreq);
            modulator.freq(modFreq);

            // change the amplitude of the modulator
            // negative amp reverses the sawtooth waveform, and sounds percussive
            //
            let modDepth = map(moyenneX, 0, width, modMinDepth, modMaxDepth);
            modulator.amp(modDepth);
        }

        ////////
        blob.color = 0;
        blob.s = 30;
        blob.d = 0;

        blob.drawBlob();

        fill(255);
        textAlign(CENTER);
        textSize(12);
        text('GIUSEPPE', blob.x, blob.y - 20);

        var data = {
            color: blob.color,
            x: blob.x,
            y: blob.y,
            s: blob.s,
            d: blob.d,
            ig: true
        };
        socket.emit('update', data);
        /////////
    }

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

function toggle() {
    if (!playing) {
        carrier.amp(1.0, 0.01);
        carrier.freq(carrierBaseFreq); // set frequency
        carrier.start(); // start oscillating

        modulator.start();

        // add the modulator's output to modulate the carrier's frequency
        modulator.disconnect();
        carrier.freq(modulator);

        playing = true;
    } else {

        carrier.amp(0.0, 1.0);

        playing = false;
    }
}


