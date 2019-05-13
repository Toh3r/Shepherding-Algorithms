//Gate/Exit class
// Set gate attributes
function Gate (x, y) {
  this.position = createVector(x, y);
  this.r = 25.0;
}

// Render Gate on canvas
Gate.prototype.run = function() {
  this.goalZone();
  this.render();
}

// Draw Gate
Gate.prototype.render = function () {
  rectMode(CORNER);
  fill(150, 150, 150);
  stroke(0);
  push();
  if (envRadio.value() != 2){
    rect(this.position.x,this.position.y, this.r/2, this.r*2);
  } else if (envRadio.value() == 2) {
    rect(this.position.x - 40,this.position.y+ 10, this.r*2, this.r/2);
  }
  pop();
}

Gate.prototype.goalZone = function () {
  rectMode(CORNER);
  fill(0,0,0,0);
  stroke(255);
  push();
  if (envRadio.value() == 1) {
    rect(this.position.x - 140, this.position.y - 50, 150, 150);
    textSize(13);
    fill(255);
    text('GoalZone', 890, 180);
  } else if (envRadio.value() == 2) {
    rect(this.position.x - 80, this.position.y - 130, 150, 150);
    textSize(13);
    fill(255);
    text('GoalZone', 910, 450);
  } else if (envRadio.value() == 3) {
    rect(this.position.x , this.position.y - 40, 130, 150);
    textSize(13);
    fill(255);
    text('GoalZone', 1100, 185);
  } else if (envRadio.value() == 4) {
    rect(this.position.x - 120, this.position.y - 60, 130, 150);
    textSize(13);
    fill(255);
    text('GoalZone', 2300, 120);
  }
  pop();
}

Gate.prototype.desiredHeading = function () {

}
