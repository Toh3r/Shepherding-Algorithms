//Novelty class
// Set novelty attributes
function Obstacle (x, y) {
  this.position = createVector(x, y);
  this.r = 0;
}

// Render novelty on canvas
Obstacle.prototype.run = function() {
  this.render();
}

Obstacle.prototype.render = function () {
  fill(190, 87, 23);
  stroke(0);
  push();
  ellipse(this.position.x,this.position.y, this.r, this.r);
  pop();

  // fill(255);
  // textSize(16);
  // text('Novelty', this.position.x - 25, this.position.y + 25);
}
