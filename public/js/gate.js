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

Gate.prototype.goalZone = function () {
  fill(0,0,0,0);
  stroke(255);
  push()
  rect(850, 180, 150, 150);
  pop();

  textSize(20);
  fill(255);
  text('GoalZone', 890, 180);
}

// Render Gate on canvas
Gate.prototype.run = function() {
  this.goalZone();
  this.render();
}
