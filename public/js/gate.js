//Gate/Exit class
// Set gate attributes
function Gate (goals) {
  this.goals = goals;
  this.position = createVector(goals[goals.length-1].x, goals[goals.length-1].y);
  this.r = 25.0;
}

// Render Gate on canvas
Gate.prototype.run = function() {
  this.goalZone();
  this.render();
  if(animalGoalCheck.checked() == true) {
    this.displayAnimalGoals();
  }
}

// Draw Gate
Gate.prototype.render = function () {
  rectMode(CENTER);
  fill(150, 150, 150);
  stroke(0);
  push();
  if (envRadio.value() != 2){
    rect(this.position.x,this.position.y, this.r/2, this.r*2);
  } else if (envRadio.value() == 2) {
    rect(this.position.x - 5,this.position.y + 15, this.r*2, this.r/2);
  }
  pop();
}

Gate.prototype.goalZone = function () {
  ellipseMode(CENTER);
  fill(0,0,0,0);
  stroke(255);
  ellipse(this.position.x, this.position.y, 240,240)

}

Gate.prototype.displayAnimalGoals = function () {
  stroke(0);
  for(var i = 0; i < this.goals.length; i++) {
    fill(30,30,255)
    ellipse(this.goals[i].x, this.goals[i].y, 10 ,10)
    fill(30,30,255, 30)
    ellipse(this.goals[i].x, this.goals[i].y, 240 ,240)
  }
}
