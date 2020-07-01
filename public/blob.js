// VECTOR OBJECT

function Blob(color, x, y, s, d, isGiuseppe) {
    this.color = color;
    this.x = x;
    this.y = y;
    this.s = s;
    this.d = d;
    var ig = isGiuseppe;

    this.drawBlob = function () {
        colorMode(HSB);
        fill(this.color, 100, 100);
        ellipse(this.x, this.y, this.s, this.s);

    };
}