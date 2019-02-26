let oldBun;
// Animal class
// Set Animal attributes
function Animal(x,y) {
  this.acceleration = createVector(0,0); // Starting accelertion
  this.velocity = createVector(random(-3,3),random(-3,3)); // Create starting velocity direction
  this.position = createVector(x,y); // Starting position
  this.r = 3.0;         // Animal size
  this.maxspeed = 1;    // Maximum speed
  this.maxforce = 0.03; // Maximum steering force
  this.velocity.setMag(0.1); // Create starting velocity speed
  this.name = Math.random(); // Give every animal a random id
  this.stressLevel = 0;      // Starting stress level
}

// ----- ANIMAL UPDATE FUNCTIONS

// Call functions for each animal each frame
Animal.prototype.run = function(herd, shepherds, novelObjects) {
  this.herd(herd, shepherds, novelObjects);
  this.update();
  this.borders();
  this.render();
  if (zoneCheck.checked() == true) {
    this.renderZones();
  }
}

// Apply each behavioural rule to each animal
Animal.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// Accumulate a new acceleration each time based on all rules
Animal.prototype.herd = function(herd, shepherds, novelObjects) {
  // // Change speed using speed slider
  // this.velocity.setMag(speedSlider.value());

  var sep = this.separate(herd);      // Separation
  var ali = this.align(herd);         // Alignment
  var coh = this.cohesion(herd);      // Cohesion
  var bun = this.bunch(shepherds);    // Bunching
  var mov = this.move(shepherds);     // Steer herd
  var goa = this.goal();              // Move to goal
  var avo = this.avoid(novelObjects); // Avoid Novelty


  // Forces weighted depending on its conditions
  sep.mult(4.5);
  mov.mult(3);

  console.log('New Bunch: ' + bun);
  console.log('Old Bunch: ' + oldBun);

  if (bun > 0) {
    ali.mult(3);
  } else {
    ali.mult(0);
  }
  // ali.mult(alignSlider.value());

  // if shepherd is in pressure zone
  if (bun > 0) {
    this.velocity.setMag(0.5);
    coh.mult(2);
  } else { // if shepherd is not in pressure zone
    if (bun < oldBun) {
      speedDec(this);
    }
    // this.velocity.setMag(0.1);
    coh.mult(0);
  }


  // Add the force vectors to acceleration
  this.applyForce(mov);
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
  this.applyForce(goa);
  this.applyForce(avo);

  // Store old bun array value (Used for comparison in following frame)
  oldBun = bun;

}

// Method to update location
Animal.prototype.update = function() {
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
Animal.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

// ----- ANIMAL DRAWING FUNCTIONS

// Method to draw animal
Animal.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + radians(90);
  fill(0, 0, 0);
  stroke(255);
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

// Method to render animals flight and pressure zone
Animal.prototype.renderZones = function () {
  // Draw flight zone
  fill(0,0,0,0.0)
  stroke(255, 0, 0);
  ellipse(this.position.x,this.position.y, 100, 100);

  // Draw pressure zone
  fill(0,0,0,0.0)
  stroke(0, 0, 0);
  ellipse(this.position.x,this.position.y, 200, 200);
};

// Method to keep animal in enclosure
Animal.prototype.borders = function () {
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

// ----- ANIMAL BEHAVIOURAL RULES WITH OTHER ANIMALS

// Separation
// Method checks for nearby animals and steers away
Animal.prototype.separate = function(herd) {
  var desiredseparation = 15.0;
  var steer = createVector(0,0);
  var count = 0;
  // For every animal in the system, check if it's too close
  for (var i = 0; i < herd.length; i++) {
    var d = p5.Vector.dist(this.position,herd[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position,herd[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby animal in the system, calculate the average velocity
Animal.prototype.align = function(herd) {
  var neighbordist = 50;
  var sum = createVector(0,0);
  var count = 0;
  for (var i = 0; i < herd.length; i++) {
    var d = p5.Vector.dist(this.position,herd[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(herd[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    var steer = p5.Vector.sub(sum,this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0,0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby animals, calculate steering vector towards that location
Animal.prototype.cohesion = function(herd) {
  var neighbordist = 200;
  var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
  var count = 0;
  for (var i = 0; i < herd.length; i++) {
    var d = p5.Vector.dist(this.position,herd[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(herd[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0,0);
  }
}

// ----- ANIMAL BEHAVIOURAL RULES WITH DRONE

// When shepherd enters pressure zone, initiate bunching with neighbours
Animal.prototype.bunch = function(shepherds) {
  var neighbordist = 100;
  var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
  var count = 0;
  for (var i = 0; i < shepherds.length; i++) {
    var d = p5.Vector.dist(this.position,shepherds[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(shepherds[i].position); // Add location
      count++;
    }
    return count;
  }
}

// When shepherd enters flight zone, move in opposite direction
Animal.prototype.move = function(shepherds) {
  var desiredseparation = 50.0;
  var steer = createVector(0,0);
  var count = 0;
  // For every animal in the system, check if it's too close
  for (var i = 0; i < shepherds.length; i++) {
    var d = p5.Vector.dist(this.position,shepherds[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position,shepherds[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
    this.stressLevel = (this.stressLevel + 0.1);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// ----- ANIMAL BEHAVIOURAL RULES WITH ENVIRONMENT

// Goal setting behaviour when animal comes within certain area of a gate
Animal.prototype.goal = function () {
  if (this.position.x > 850 && this.position.y > 180 && this.position.y < 320) {
    var gate = createVector(980, 250);
    //console.log(this.animal);
    if (this.position.x > 980 && this.position.y > 230 && this.position.y < 270) {
      environment.hitTheGap(this);
    }
    var desired = p5.Vector.sub(gate, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }
}

// Try to avoid novel objects -- ** Code needs to be put out on the line **
Animal.prototype.avoid = function (novelObjects) {
  var desiredseparation = 50.0;
  var steer = createVector(0,0);
  var count = 0;
  // For every animal in the system, check if it's too close
  for (var i = 0; i < novelObjects.length; i++) {
    var d = p5.Vector.dist(this.position,novelObjects[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position,novelObjects[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
    this.stressLevel = (this.stressLevel + 0.1);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// ----- ANIMAL SPEED FUNCTIONS

// ---- Funtion to reduce speed ----
let count = 5;

function speedDec(animal) {
  var timer = setInterval(function () {
    if (count == 0) {
      clearInterval(timer);
      count = 5;
    } else {
      animal.velocity.setMag(count * .1);
      console.log("Animal Velocity: " + animal.velocity.mag())
      count--;
      console.log("I'M THE COUNTER: " + count);
    }
  }, 1000)
}
