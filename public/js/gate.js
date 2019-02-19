//Gate/Exit class
// Set gate attributes
function Gate (x, y) {
  this.position = createVector(x, y);
  this.r = 25.0;
}

// Draw Gate
Gate.prototype.render = function () {
  fill(150, 150, 150);
  stroke(0);
  push();
  rect(this.position.x,this.position.y, this.r/2, this.r*2);
  pop();
}

// Render Gate on canvas
Gate.prototype.run = function() {
  this.render();
}
