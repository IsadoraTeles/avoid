
function Blob(id, username, mycolor, x, y) {
  this.id = id;
  this.username = username;
  this.mycolor = mycolor;
  this.x = x;
  this.y = y;

  this.update = function () {
    this.x = mouseX;
    this.y = mouseY;
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