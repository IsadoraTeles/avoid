
class Blob {

    constructor() {
        this.r = random(0, 255);
        this.g = random(0, 255);
        this.b = random(0, 255);

        this.color = color(r, g, b);
        this.x = 0;
        this.y = 0;
    }

    giveNameAndId(username, id) {
        this.name = username;
        this.id = id;
    }

    updateBlob(newX, newY) {
        this.x = newX;
        this.y = newY;
    }

}