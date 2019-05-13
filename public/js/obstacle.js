//Novelty class
// Set novelty attributes
function Obstacle (x, y, w, h, rot) {
  this.position = createVector(x, y);
  this.w = w;
  this.h = h
  this.rot = radians(rot);
}

// Render novelty on canvas
Obstacle.prototype.run = function() {
  this.render();
}

Obstacle.prototype.render = function () {
  fill(125,125,125, 130);
  stroke(0);
  push();
  translate(this.position.x, this.position.y);
  rotate(this.rot);
  rect(0,0, this.w, this.h);
  pop();
}
