// VECTOR OBJECT

class Blob() 
{

    constructor()
    {
        var name = name;
        var color = color;
        var x = x;
        var y = y;
        var s = s;
        var d = d;
        var ig = ig;
        var bg = bg;
        var bo = bo;
    };

    function updateBlob()
    {
        
    }

    function drawBlob () 
    {
        colorMode(HSB);
        fill(this.color, 100, 100);
        ellipse(this.x, this.y, this.s, this.s);

        rect(0, 0, 30, 30);
        textSize(16);
        text('THIS IS YOUR COLOR', 90, 60);

    };
}