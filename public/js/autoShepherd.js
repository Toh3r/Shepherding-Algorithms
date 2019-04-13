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
  this.targetDir = "right";
}

// Call methods for each shepherd
AutoShepherd.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
  this.herdAnimals(herd);
  if(lineCheck.checked() == true) {
    this.displayShepLines();
  }
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

  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(980,250); // Location of exit

  var diffXPos = herdX - goal.x; // Diff of herd x co-ord to goal x co-ord
  var diffYPos = herdY - goal.y; // Diff of herd y co-ord to goal y co-ord

  animalFL = Math.abs(herdX - this.herdLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.herdRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.herdTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.herdBottom); // Cords of animal furthest bottom
  furthestAnimal = Math.max(animalFL, animalFR, animalFT, animalFB);

  // extend line from goal to herd centre to fz and pre zone
  let d = int(dist(herdX, herdY, goal.x,goal.y));
  x3 = herdX + (herdX - goal.x) / d * (furthestAnimal + 20);
  y3 = herdY + (herdY - goal.y) / d * (furthestAnimal + 20);

  x4 = herdX + (herdX - goal.x) / d * (furthestAnimal + 60);
  y4 = herdY + (herdY - goal.y) / d * (furthestAnimal + 60);

  // Get Co-ords for line through pre
  xDiff = x3 - herdX;
  yDiff = y3 - herdY;
  a1 = x3 - yDiff;
  b1 = y3 + xDiff;
  a2 = x3 + yDiff;
  b2 = y3 - xDiff;
  // Co-ords for line through fli
  xDiff1 = x4 - herdX;
  yDiff1 = y4 - herdY;
  c1 = x4 - yDiff1;
  d1 = y4 + xDiff1;
  c2 = x4 + yDiff1;
  d2 = y4 - xDiff1;
  // Co-ords for line through herd
  xDiff2 = herdX - x3;
  yDiff2 = herdY - y3;
  e1 = herdX - yDiff2;
  f1 = herdY + xDiff2;
  e2 = herdX + yDiff2;
  f2 = herdY - xDiff2;

  //Shortened lines through pre
  let pzDist = int(dist(c1, d1, x4, y4));
  let pzDist2 = int(dist(c2, d2, x4, y4));
  px1 = c1 + (c1 - x4) / pzDist * (-40);
  py1 = d1 + (d1 - y4) / pzDist * (-40);
  px2 = c2 + (c2 - x4) / pzDist2 * (-40);
  py2 = d2 + (d2 - y4) / pzDist2 * (-40);

 if (this.movingUp == false) {
   var target = createVector(px1,py1);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if ((this.position.x - 2 < target.x && target.x < this.position.x + 2) && (this.position.y - 2 < target.y && target.y < this.position.y + 2)){
     this.movingUp = true;
   }
   return steer;
 } else if (this.movingUp == true) {
   var target = createVector(px2,py2);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if ((this.position.x - 2 < target.x && target.x < this.position.x + 2) && (this.position.y - 2 < target.y && target.y < this.position.y + 2)){
     this.movingUp = false;
   }
   return steer;
 }
}

AutoShepherd.prototype.moveAnimals = function () {

  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(980,250); // Location of exit

  var diffXPos = herdX - goal.x; // Diff of herd x co-ord to goal x co-ord
  var diffYPos = herdY - goal.y; // Diff of herd y co-ord to goal y co-ord

  animalFL = Math.abs(herdX - this.herdLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.herdRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.herdTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.herdBottom); // Cords of animal furthest bottom
  furthestAnimal = Math.max(animalFL, animalFR, animalFT, animalFB);

  // extend line from goal to herd centre to fz and pre zone
  let d = int(dist(herdX, herdY, goal.x,goal.y));
  x3 = herdX + (herdX - goal.x) / d * (furthestAnimal + 20);
  y3 = herdY + (herdY - goal.y) / d * (furthestAnimal + 20);

  x4 = herdX + (herdX - goal.x) / d * (furthestAnimal + 60);
  y4 = herdY + (herdY - goal.y) / d * (furthestAnimal + 60);

  // Get Co-ords for line through pre
  xDiff = x3 - herdX;
  yDiff = y3 - herdY;
  a1 = x3 - yDiff;
  b1 = y3 + xDiff;
  a2 = x3 + yDiff;
  b2 = y3 - xDiff;
  // Co-ords for line through fli
  xDiff1 = x4 - herdX;
  yDiff1 = y4 - herdY;
  c1 = x4 - yDiff1;
  d1 = y4 + xDiff1;
  c2 = x4 + yDiff1;
  d2 = y4 - xDiff1;
  // Co-ords for line through herd
  xDiff2 = herdX - x3;
  yDiff2 = herdY - y3;
  e1 = herdX - yDiff2;
  f1 = herdY + xDiff2;
  e2 = herdX + yDiff2;
  f2 = herdY - xDiff2;

  //Shortened lines through pre
  let pzDist = int(dist(c1, d1, x4, y4));
  px1 = c1 + (c1 - x4) / pzDist * (-40);
  py1 = d1 + (d1 - y4) / pzDist * (-40);
  px2 = c2 + (c2 - x4) / pzDist * (-40);
  py2 = d2 + (d2 - y4) / pzDist * (-40);

  if (this.movingUp == false) {
    if (environment.avgSpeed() < 0.35) {
      var target = createVector(a1,b1);
    } else {
      var target = createVector(px1,py1);
    }
    this.targetInBounds(target);
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if ((this.position.x - 2 < target.x && target.x < this.position.x + 2) && (this.position.y - 2 < target.y && target.y < this.position.y + 2)){
      this.movingUp = true;
      console.log(this.position.y)
      console.log(target.y)
    }
    return steer;
  } else if (this.movingUp == true) {
    if (environment.avgSpeed() < 0.35) {
      var target = createVector(a2,b2);
    } else {
      var target = createVector(px2, py2);
    }
    this.targetInBounds(target);
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if ((this.position.x - 2 < target.x && target.x < this.position.x + 2) && (this.position.y - 2 < target.y && target.y < this.position.y + 2)){
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

AutoShepherd.prototype.displayShepLines = function () {
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(980,250); // Location of exit

  animalFL = Math.abs(herdX - this.herdLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.herdRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.herdTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.herdBottom); // Cords of animal furthest bottom
  furthestAnimal = Math.max(animalFL, animalFR,animalFT,animalFB);

  // Herd centre circle
  fill(255,0,0);
  stroke(0);
  ellipse(herdX,herdY, 10, 10);

  // Line to gate
  stroke(0);
  line(herdX, herdY, goal.x,goal.y);

  // extend line from goal to herd centre to fz and pre zone
  let d = int(dist(herdX, herdY, goal.x,goal.y));
  x3 = herdX + (herdX - goal.x) / d * (furthestAnimal + 20);
  y3 = herdY + (herdY - goal.y) / d * (furthestAnimal + 20);

  x4 = herdX + (herdX - goal.x) / d * (furthestAnimal + 60);
  y4 = herdY + (herdY - goal.y) / d * (furthestAnimal + 60);

  // Line to fli
  stroke(99,52,211);
  line(herdX, herdY, x3,y3);
  // Line to Pre
  stroke(211,25,211);
  line(x4, y4, x3,y3);

  //Point of fli
  fill(0,0,255);
  ellipse(x3,y3,10,10);

  //point on pre
  fill(0,255,0);
  ellipse(x4,y4,10,10);

  //goal point
  fill(255,0,0);
  ellipse(goal.x,goal.y, 10,10)


  // Get Co-ords for line through fli
  xDiff = x3 - herdX;
  yDiff = y3 - herdY;
  a1 = x3 - yDiff;
  b1 = y3 + xDiff;
  a2 = x3 + yDiff;
  b2 = y3 - xDiff;
  // Co-ords for line through pre
  xDiff1 = x4 - herdX;
  yDiff1 = y4 - herdY;
  c1 = x4 - yDiff1;
  d1 = y4 + xDiff1;
  c2 = x4 + yDiff1;
  d2 = y4 - xDiff1;
  // Co-ords for line through herd
  xDiff2 = herdX - x3;
  yDiff2 = herdY - y3;
  e1 = herdX - yDiff2;
  f1 = herdY + xDiff2;
  e2 = herdX + yDiff2;
  f2 = herdY - xDiff2;

  //Shortened lines through pre
  let pzDist = int(dist(c1, d1, x4, y4));
  px1 = c1 + (c1 - x4) / pzDist * (-40);
  py1 = d1 + (d1 - y4) / pzDist * (-40);
  px2 = c2 + (c2 - x4) / pzDist * (-40);
  py2 = d2 + (d2 - y4) / pzDist * (-40);

  //Line through Fli
  stroke(0);
  line(a1,b1,a2,b2);

  //Line through Pre
  stroke(255,255,0);
  line(px1,py1,px2,py2);

  //Line Through herd
  line(e1,f1,e2,f2);

  // dot on fli line
  ellipse(a1,b1,10,10);
  ellipse(a2,b2,10,10);

  //dots on pre line
  ellipse(px1,py1,10,10);
  ellipse(px2,py2,10,10);
}

AutoShepherd.prototype.avoidObstacle = function (goal,target) {

}
