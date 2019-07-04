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
  fill(190, 22, 23, 130);
  stroke(190, 22, 23, 130);
  push();
  translate(this.position.x, this.position.y)
  // ellipse(0,0, this.w, this.h);
  ellipse(0,0, this.w * 2, this.h * 2);
  pop();
}
