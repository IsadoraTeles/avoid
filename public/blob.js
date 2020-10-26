
function Blob(id, username, color, x, y) {
  this.id = id;
  this.username = username;
  this.mycolor = color;
  this.x = x;
  this.y = y;

  this.update = function () {
    this.x = mouseX;
    this.y = mouseY;
  };

  this.show = function () {
    fill(this.color);
    ellipse(this.x, this.y, 10, 10);
  };
}