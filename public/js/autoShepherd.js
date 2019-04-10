// Shepherd Class
// Create shepherd attributes
function AutoShepherd() {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-3,3),random(-3,3));
  this.position = createVector(950, 250);
  this.r = 3.0;
  this.maxspeed = 1;
  this.movingUp = false;
  this.target = createVector(0,0);
  this.targetLock = false;
  this.herdBottom = 0;
  this.herdTop = 0;
  this.herdLeft = 0;
  this.herdRight = 0;
}

// Call methods for each shepherd
AutoShepherd.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
  this.herdAnimals(herd);
}

// Apply each behavioural rule to each animal
AutoShepherd.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

AutoShepherd.prototype.herdAnimals = function (herd) {
  var bun = this.bunched(herd);
  if (bun == true) {
    var mov = this.moveAnimals(herd);
    this.applyForce(mov);
  }

  if (bun == false) {
    var col = this.collectAnimals(herd);
    this.applyForce(col);
  }
}

// Method to update location
AutoShepherd.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
AutoShepherd.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

// Method to prevent shepherd from leaving enclosure
AutoShepherd.prototype.borders = function () {
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

// Draw shepherd
AutoShepherd.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + radians(90);
  fill(255);
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

AutoShepherd.prototype.bunched = function (herd) {
  this.herdBottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdTop = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdLeft = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  this.herdRight = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));

  herDist = dist(this.herdLeft, this.herdTop, this.herdRight, this.herdBottom);
  if (herDist < 200) {
    return true;
  } else {
    return false;
  }
}

AutoShepherd.prototype.collectAnimals = function (herd) {

 if (this.movingUp == false) {
   var target = createVector(this.herdLeft - 20, this.herdBottom + 40);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (this.position.y >= this.herdBottom + 20 && this.position.x <= this.herdLeft){
     // console.log("Turning true");
     this.movingUp = true;
   }
   return steer;
 } else if (this.movingUp == true) {
   var target = createVector(this.herdLeft - 20, this.herdTop - 40);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (this.position.y <= this.herdTop + 20 ){
     this.movingUp = false;
     // console.log("Turning false")
   }
   return steer;
 }
}

AutoShepherd.prototype.moveAnimals = function (herd) {

  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(980,250); // Location of exit

  // var diffXPos = herdX - goal.x; // Diff of herd x co-ord to goal x co-ord
  var diffYPos = herdY - goal.y; // Diff of herd y co-ord to goal y co-ord

  animalFL = Math.abs(herdX - this.herdLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.herdRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.herdTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.herdBottom); // Cords of animal furthest bottom
  console.log("Top and Bot: " + animalFT, animalFB)


  furthestAnimal = Math.max(animalFL);


  // Herd centre circle
  fill(255,0,0);
  stroke(0);
  ellipse(herdX,herdY, 10, 10);

  // Line to gate
  stroke(0);
  line(herdX, herdY, 980,250);

  // line through herd
  stroke(0, 0, 255);
  line(herdX + (diffYPos) /2, herdY + 40, herdX - (diffYPos) / 2, herdY - 40);

  // Fli Zone Line
  stroke(255, 255, 0);
  line(herdX + (diffYPos)/2 - (furthestAnimal + 30), herdY + 40, herdX - (diffYPos)/2 - (furthestAnimal + 30),herdY  - 40);
  // ellipse(herdX + (diffYPos)/2 - (furthestAnimal + 30), herdY + (furthestAnimal + 30), 10, 10)
  // Pre Zone Line
  stroke(255, 255, 0);
  line(herdX + (diffYPos) /2 - (furthestAnimal + 50) - 40, herdY +  40 ,herdX - (diffYPos) / 2 - (furthestAnimal + 50) - 40, herdY - 40);


  if (this.movingUp == false) {
    if (environment.avgSpeed() < 0.35) {
      // console.log(environment.avgSpeed());
      var target = createVector(herdX + (diffYPos)/2 - (furthestAnimal + 30), herdY + (furthestAnimal + 30));
    } else {
      // console.log(environment.avgSpeed());
      var target = createVector(herdX + (diffYPos) /2 - (furthestAnimal + 50) - 40, herdY +  (furthestAnimal + 50));
    }
    this.targetInBounds(target);
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (this.position.y >= herdY + 40 && this.position.x <= herdX + (diffYPos) /2 - 20){
      this.movingUp = true;
    }
    return steer;
  } else if (this.movingUp == true) {
    if (environment.avgSpeed() < 0.35) {
      var target = createVector(herdX - (diffYPos)/2 - (furthestAnimal + 30),herdY  - (furthestAnimal+30));
    } else {
      var target = createVector(herdX - (diffYPos) / 2 - (furthestAnimal + 50) - 40, herdY - (furthestAnimal + 50));
    }
    this.targetInBounds(target);
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (this.position.y <= herdY - 40){
      this.movingUp = false;
    }
    return steer;
  }
}

AutoShepherd.prototype.targetInBounds = function (target) {
  if (target.x < 15) {
    target.x = 15;
  } else if (target.y < 15) {
    target.y = 15;
  } else if (target.x > width - 15) {
    target.x = width - 15;
  } else if (target.y > height - 15) {
    target.y = height - 15;
  }

  return target;
}
