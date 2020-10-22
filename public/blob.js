
function Blob(id, username, color, x, y) {
  this.id = id;
  this.username = username;
  this.color = color;
  this.x = x;
  this.y = y;

  this.update = function (newX, newY) {
    this.x = newX;
    this.y = newY;
  };

  this.show = function () {
    fill(this.color);
    ellipse(this.x, this.y, 10, 10);
  };
}