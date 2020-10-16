// VECTOR OBJECT

class Blob() 
{

    constructor(name, couleur)
    {
        var name = name;
        var couleur = couleur;
        var x = 0;
        var y = 0;
    };

    function updateBlob(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

}