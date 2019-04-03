// Shepherd Class
// Create shepherd attributes
function AutoShepherd() {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-3,3),random(-3,3));
  this.position = createVector(950, 250);
  this.r = 3.0;
  this.maxspeed = 1;
  this.movingUp = false;
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
  var bottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  var top = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  var left = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  var right = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));

  herDist = dist(left, top, right, bottom);
  if (herDist < 200) {
    return true;
  } else {
    return false;
  }
}

AutoShepherd.prototype.collectAnimals = function (herd) {
  var bottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  var top = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  var left = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  var right = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));


 if (this.movingUp == false) {
   var target = createVector(left - 20, bottom + 40);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (this.position.y >= bottom + 20 && this.position.x <= left){
     // console.log("Turning true");
     this.movingUp = true;
   }
   return steer;
 } else if (this.movingUp == true) {
   var target = createVector(left - 20, top - 40);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (this.position.y <= top + 20 ){
     this.movingUp = false;
     // console.log("Turning false")
   }
   return steer;
 }
}

AutoShepherd.prototype.moveAnimals = function (herd) {
  var bottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  var top = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  var left = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  var right = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));

  var mid1 = (top + bottom) / 2; // Y co-ord of herd
  var mid2 = (right + left) / 2; // X co-ord of herd

  var center = createVector(mid1, mid2); // Centre co-ords of herd
  var goal = createVector(980,250); // Location of exit

  var diffCPos = mid1 - goal.y; //Diff of herd y co-ord to goal y co-ord
  var diffBPos = mid2 - goal.x; // del
  animalFB = mid2 - left;
  animalFB2 = mid1 - top; //del
  // console.log(mid2 - left);
  // console.log(mid2 - goal.x); //del


  stroke(0);
  line(mid2, mid1, 980,250);

  stroke(0, 0, 255);
  line(mid2 + (diffCPos) /2, mid1 + 40, mid2 - (diffCPos) / 2, mid1 - 40);

  stroke(0, 0, 255);
  line(mid2 + (diffCPos) /2 - 40, mid1 + 40, mid2 - (diffCPos) / 2 - 40,  mid1 - 40);


  stroke(255, 255, 0);
  line(mid2 + (diffCPos) /2 - (animalFB *2) - 60, mid1 + 40, mid2 - (diffCPos) / 2 - (animalFB*2) - 60, mid1 - 40);

  // Draw pressure zone
  fill(255,0,0);
  stroke(0);
  ellipse(mid2,mid1, 10, 10);

  if (this.movingUp == false) {
    if (environment.avgSpeed() < 0.350) {
      console.log("TARGET + Flight");
      console.log(environment.avgSpeed());
      var target = createVector(mid2 + (diffCPos) /2 - 40, mid1 + 40);
    } else {
      console.log("TARGET + Pressure");
      console.log(environment.avgSpeed());
      var target = createVector(mid2 + (diffCPos) /2 - (animalFB *2) - 60, mid1 + 40);
    }
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (this.position.y >= mid1 + 40 && this.position.x <= mid2 + (diffCPos) /2 - 20){
      console.log("Turning true");
      this.movingUp = true;
    }
    return steer;
  } else if (this.movingUp == true) {
    if (environment.avgSpeed() < 0.350) {
      var target = createVector(mid2 - (diffCPos) / 2 - 40,  mid1 - 40);
    } else {
      var target = createVector(mid2 - (diffCPos) / 2 - (animalFB*2) - 60, mid1 - 40);
    }
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (this.position.y <= mid1 - 40){
      this.movingUp = false;
    }
    return steer;
  }
}
