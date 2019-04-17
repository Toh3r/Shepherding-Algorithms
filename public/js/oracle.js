// Oracle class
function Oracle () {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-1,1),random(-1,1));
  this.position = createVector(950, 250);
  this.r = 3.0;
  this.maxspeed = 1;
  this.maxForce = 0.3;
  this.firstSearch = true;
  this.moving = true;
  this.oldTarget = createVector(0,0);
  this.startx = width - 125;
  this.starty = 125;
}

// Call methods for each shepherd
Oracle.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
  this.runTheShow();
}

Oracle.prototype.runTheShow = function () {
  var search = this.searchForAnimals();
  this.applyForce(search);
}

// Apply each behavioural rule to each animal
Oracle.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// Method to update location
Oracle.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// Method to prevent shepherd from leaving enclosure
Oracle.prototype.borders = function () {
  if (this.position.x < 15) {
    this.velocity.x *= -1;
    this.position.x = 15;
  } else if (this.position.y < 15) {
    this.velocity.y *= -1;
    this.position.y = 15;
  } else if (this.position.x > width - 15) {
    this.velocity.x *= -1;
    this.position.x = width - 15;
  } else if (this.position.y > height - 15) {
    this.velocity.y *= -1;
    this.position.y = height - 15;
  }
}

Oracle.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + radians(90);
  fill(0, 79, 249);
  stroke(0);
  push();
  translate(this.position.x,this.position.y);
  rotate(theta);
  beginShape();
  vertex(0, -this.r*1.5);
  vertex(-this.r, this.r*1.5);
  vertex(this.r, this.r*1.5);
  endShape(CLOSE);
  pop();
}

Oracle.prototype.searchForAnimals = function () {
  if (this.firstSearch == true) {
    var target = createVector(width-125,125);
    if ((this.position.x - 2 < target.x && target.x < this.position.x + 2) && (this.position.y - 2 < target.y && target.y < this.position.y + 2)){
      this.firstSearch = false;
    }
  } else if (this.moving == false && height - this.position.y > 125) {
      var target = createVector(width-125,this.position.y + 250);
      this.moving = true;
  } else if (this.moving == true) {
      var target = this.oldTarget;
  } else {
    var target = this.oldTarget;
    this.maxspeed = 0;
  }

  this.oldTarget = target;

  var desired = p5.Vector.sub(target, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  if ((this.position.x - 2 < target.x && target.x < this.position.x + 2) && (this.position.y - 2 < target.y && target.y < this.position.y + 2)){
    // console.log("Hit target");
    this.moving = false;
  }
  return steer;
}

Oracle.prototype.calculateTargets = function () {
}
