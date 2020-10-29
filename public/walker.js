class Walker {
    constructor() {
        this.username = "host";
        this.x = random(0, 200);
        this.y = radom(0, 200);
        this.mycolor = [0, 0, 0];
    }

    update() {
        this.x = this.x + random(-5, 5);
        this.y = this.y + random(-5, 5);

    }

    show() {
        fill(color(this.mycolor));
        ellipse(this.x, this.y, 10, 10);
    }

}