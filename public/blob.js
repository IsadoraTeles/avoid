
function Blob(id, username, mycolor, x, y) {
  this.id = id;
  this.username = username;
  this.mycolor = mycolor;
  this.x = x;
  this.y = y;
  this.velocity = createVector();


  this.update = function () {
    let oldPos = createVector(this.x, this.y);
    this.x = mouseX;
    this.y = mouseY;
    let newPos = createVector(this.x, this.y);
    this.velocity = newPos.sub(oldPos);
  };

  this.show = function () {
    fill(color(this.mycolor));
    ellipse(this.x, this.y, 10, 10);
  };

  this.bump = function (idhh, posX, posY) {
    if (idhh != this.id && dist(posX, this.x, posY, this.y) < 0) { return true; }
    else return false;
  };
}