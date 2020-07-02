// VECTOR OBJECT

function Blob(color, x, y, s, d, ig, bg, bo) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.s = s;
    this.d = d;
    this.ig = ig;
    this.bg = bg;
    this.bo = bo;

    this.drawBlob = function () {
        colorMode(HSB);
        fill(this.color, 100, 100);
        ellipse(this.x, this.y, this.s, this.s);

    };
}