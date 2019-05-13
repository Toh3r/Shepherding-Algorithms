//Novelty class
// Set novelty attributes
function NovelObject (x, y, w, h) {
  this.position = createVector(x, y);
  this.w = w;
  this.h = h;
}

// Render novelty on canvas
NovelObject.prototype.run = function() {
  this.render();
}

// Draw novelty
NovelObject.prototype.render = function () {
  fill(190, 22, 23, 80);
  stroke(0);
  push();
  ellipse(this.position.x,this.position.y, this.w, this.h);
  pop();
}
