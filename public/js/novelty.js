//Novelty class
// Set novelty attributes
function NovelObject (x, y) {
  this.position = createVector(x, y);
  this.r = 25.0;
}

// Draw novelty
NovelObject.prototype.render = function () {
  fill(190, 87, 23);
  stroke(0);
  push();
  ellipse(this.position.x,this.position.y, this.r, this.r);
  pop();
}

// Render novelty on canvas
NovelObject.prototype.run = function() {
  this.render();
}
