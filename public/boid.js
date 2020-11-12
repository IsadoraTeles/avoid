/*
IMPORTANT VARIABLES FOR PERSONALITY :

* maxSpeed, maxForce, perceptionRadius

*/
class Boid {
    constructor() {
        this.username = "host";
        this.x = random(0, 200);
        this.y = random(0, 200);
        this.mycolor = [0, 0, 0];

        // FLOCKING STUFF
        this.position = createVector(this.x, this.y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 1;
        this.maxSpeed = 4;
    }

    edges() {
        if (this.position.x > width) {
            this.position.x = 0;
        } else if (this.position.x < 0) {
            this.position.x = width;
        }
        if (this.position.y > height) {
            this.position.y = 0;
        } else if (this.position.y < 0) {
            this.position.y = height;
        }
    }

    separation(boids) {
        let perceptionRadius = 50;
        let perceptionCount = 5;
        let steeringForce = createVector();
        let total = 0;

        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
            let otherVec = createVector(other.x, other.y);
            const diff = p5.Vector.sub(this.position, otherVec);
            const d = diff.mag();
            if (d === 0) continue;
            diff.div(d * d);
            steeringForce.add(diff);
            total++;
        }
        if (total > 0) {
            steeringForce.div(total);
            steeringForce.setMag(this.maxSpeed);
            steeringForce.sub(this.velocity);
            steeringForce.limit(this.maxForce);
        }
        return steeringForce;
    }

    cohesion(boids) {
        let perceptionRadius = 100;
        let perceptionCount = 5;
        let steeringForce = createVector();
        let total = 0;
        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
            let otherVec = createVector(other.x, other.y);
            steeringForce.add(otherVec);
            total++;
        }
        if (total > 0) {
            steeringForce.div(total);
            steeringForce.sub(this.position);
            steeringForce.setMag(this.maxSpeed);
            steeringForce.sub(this.velocity);
            steeringForce.limit(this.maxForce);
        }
        return steeringForce;
    }

    align(boids) {
        let perceptionRadius = 50;
        let perceptionCount = 5;
        let steeringForce = createVector();
        let total = 0;
        for (const other of quadTree.getItemsInRadius(this.position.x, this.position.y, perceptionRadius, perceptionCount)) {
            steeringForce.add(other.velocity);
            total++;
        }
        if (total > 0) {
            steeringForce.div(total);
            steeringForce.setMag(this.maxSpeed);
            steeringForce.sub(this.velocity);
            steeringForce.limit(this.maxForce);
        }
        return steeringForce;
    }

    wand() {
        let steeringForce = createVector();
        let x = random(-5, 5);
        let y = random(-5, 5);
        steeringForce = (x, y);
        return steeringForce;
    }


    flock(boids) {
        let alignment = this.align(boids);
        let cohesion = this.cohesion(boids);
        let separation = this.separation(boids);
        let wander = this.wand();

        alignment.mult(alignSlider.value());
        cohesion.mult(cohesionSlider.value());
        separation.mult(separationSlider.value());

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);
        //this.acceleration.add(wander);
    }

    update() {

        this.maxSpeed = maxSpeedSlider.value();
        this.maxForce = maxForceSlider.value();

        this.position.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.x = this.position.x;
        this.y = this.position.y;
        this.acceleration.mult(0);

    }

    show() {
        fill(color(this.mycolor));
        ellipse(this.position.x, this.position.y, 10, 10);
    }

}