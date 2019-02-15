// Boid class
// Set Boid attributes
function Animal(x,y) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-3,3),random(-3,3));
  this.position = createVector(x,y);
  this.r = 3.0;
  this.maxspeed = 1;    // Maximum speed
  this.maxforce = 0.03; // Maximum steering force
}

// Call functions for each boid
Animal.prototype.run = function(herd, shepherds) {
  this.flock(herd, shepherds);
  this.update();
  this.borders();
  this.render();
  if (zoneCheck.checked() == true) {
    this.renderZones();
  }
}

// Apply each behavioural rule to each boid
Animal.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// Accumulate a new acceleration each time based on three rules
Animal.prototype.flock = function(herd, shepherds) {
  var sep = this.separate(herd);   // Separation
  var ali = this.align(herd);      // Alignment
  var coh = this.cohesion(herd);   // Cohesion
  var bun = this.bunch(shepherds); // Bunching
  var mov = this.move(shepherds);  // Steer herd


  // Forces weighted using slider input
  sep.mult(2.8);
  mov.mult(5);

  if (bun > 0) {
    ali.mult(3);
  } else {
    ali.mult(0);
  }
  // ali.mult(alignSlider.value());

  if (bun > 0) {
    coh.mult(3);
  } else {
    coh.mult(0);
  }


  // Add the force vectors to acceleration
  this.applyForce(mov);
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Animal.prototype.update = function() {
  this.velocity.setMag(speedSlider.value());
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

// Method to draw boid
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

// Method to render a boids flight and pressure zone
Animal.prototype.renderZones = function () {
  fill(0,0,0,0.0)
  stroke(255, 0, 0);
  ellipse(this.position.x,this.position.y, 50, 50);

  fill(0,0,0,0.0)
  stroke(0, 0, 0);
  ellipse(this.position.x,this.position.y, 200, 200);
};

// Method for boid to turn when it encounters a wall
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

// Separation
// Method checks for nearby boids and steers away
Animal.prototype.separate = function(herd) {
  var desiredseparation = 15.0;
  var steer = createVector(0,0);
  var count = 0;
  // For every boid in the system, check if it's too close
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
// For every nearby boid in the system, calculate the average velocity
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
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
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

// Bunching Behaviour
Animal.prototype.bunch = function(shepherds) {
  var neighbordist = 200;
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

Animal.prototype.move = function(shepherds) {
  var desiredseparation = 150.0;
  var steer = createVector(0,0);
  var count = 0;
  // For every boid in the system, check if it's too close
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
