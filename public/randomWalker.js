class RandomWalker {
    constructor() {
        this.username = "host";
        this.x = random(0, 200);
        this.y = radom(0, 200);
        this.mycolor = [0, 0, 0];

        // FLOCKING STUFF
        this.position = createVector(this.x, this.y);
        this.velocity = createVector();
        this.acceleration = createVector();

        this.maxSpeed = createVector();
        this.maxForce = createVector();
    }

    update() {
        this.x = this.x + random(-5, 5);
        this.y = this.y + random(-5, 5);
        this.position = (this.x, this.y);
    }

    show() {
        fill(color(this.mycolor));
        ellipse(this.position.x, this.position.y, 10, 10);
    }

}