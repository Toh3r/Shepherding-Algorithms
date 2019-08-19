// Animal class
// Set Animal attributes
class Animal {
  constructor (x, y, goals) {
    this.acceleration = createVector(0,0); // Starting accelertion
    this.velocity = createVector(random(-1,1),random(-1,1)); // Create starting velocity direction
    this.position = createVector(x,y); // Starting position
    this.r = 2.5;         // Animal size
    this.maxspeed = .1;   // Maximum speed
    this.maxforce = 0.03; // Maximum steering force
    this.velocity.setMag(0.1);   // Create starting velocity speed
    this.name = chance.first();  // Give every animal a random name
    this.stressLevel = 0;        // Starting stress level of animal
    this.stressLevel.toFixed(2); // Starting stress level
    this.oldPre = 0;             // Starting num of shepherds in pressure zone
    this.oldFli = 0;             // Starting num of shepherds in flight zone
    this.red = random(255);      // Set colours for name
    this.green = random(255);
    this.blue = random(255);
    this.timeCount = 5;          // Set starting timecount for speed reduce function
    this.reducingSpeed = false;  // Set boolean for setInterval
    // ----- FOR WANDER BEHAVIOUR
    this.wanderRadius = 10;      // Set wander rule variables
    this.wanderDistance = 1;
    this.wanderCenter = 0;
    this.wanderAngle = random(50);
    this.wanderForce = createVector(0,0);
    // -------- ENVIRONMENT INTERACTION
    this.vocalizing = false;
    this.oldheading = 0;
    this.goals = goals;    // Holds all goal points
    this.goalCounter = 0;  // Holds current goal point
    this.inFlightZone = 0;
  }
}

// ----- ANIMAL UPDATE FUNCTIONS

// Call functions for each animal each time step
Animal.prototype.run = function(herd, shepherds, novelObjects, obstacles) {
  this.accumulateMovevmentForces(herd, shepherds, novelObjects, obstacles); // Apply forces
  this.updatePosition(); // Update position based on forces
  this.borders();   // Keep animal in enclosure
  this.render();    // Render animal
  if (zoneCheck.checked() == true) {
    this.renderZones(); // Render animal zones
  }
  if(nameCheck.checked() == true) {
    this.showName();    // Render Animal info
  }
  if(forceCheck.checked() == true) {
    this.renderForces(); // Render force zones
  }

}

// Apply each behavioural rule to each animal
Animal.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// Method to update location
Animal.prototype.updatePosition = function() {
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

// ----- ANIMAL RENDER FUNCTIONS

// Method to draw animal
Animal.prototype.render = function () {
  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + radians(90);
  fill(0, 0, 0);
  stroke(255);
  push();
  translate(this.position.x,this.position.y);
  rotate(theta);
  beginShape();
  ellipse(0,0, 5, 10)
  ellipse(0,-5,5,5)
  endShape(CLOSE);
  pop();
}

Animal.prototype.showName = function () {
  var stressFixed = this.stressLevel.toFixed(2);

  // Render Animal Name
  fill(this.red, this.green, this.blue);
  // fill(0);
  stroke(0);
  textSize(12);
  text(this.name, this.position.x, this.position.y);

  // Render Animal Name
  fill(this.red, this.green, this.blue);
  stroke(0);
  textSize(12);
  text(stressFixed, this.position.x, this.position.y + 10);

  // Render Animal Name
  fill(this.red, this.green, this.blue);
  stroke(0);
  textSize(12);
  text(this.velocity.mag().toFixed(2), this.position.x, this.position.y + 20);
}

// Method to render animals flight and pressure zone
Animal.prototype.renderZones = function () {
  // Draw flight zone
  fill(0,0,0,0.0)
  stroke(255, 0, 0);
  ellipse(this.position.x,this.position.y, 50 * 2, 50 * 2);
  text("FZ", this.position.x + 50, this.position.y);
  // text("Zone", this.position.x + fliSizeSlider.value(), th15
  // Draw pressure zone
  fill(0,0,0,0.0)
  stroke(0, 0, 0);
  ellipse(this.position.x,this.position.y, 200 * 2, 200 * 2);
  text("PZ", this.position.x + 200, this.position.y);
  // text("Zone", this.position.x + preSizeSlider.value(), this.position.y + 15);
};

Animal.prototype.renderForces = function () {
  fill(0,0,0,0.0)
  stroke(255, 0, 0);
  ellipse(this.position.x,this.position.y, 15 * 2, 15 * 2);
  fill(0)
  textSize(12);
  text("Sep", this.position.x + 15, this.position.y);

  fill(0,0,0,0.0)
  stroke(255);
  ellipse(this.position.x,this.position.y, 200 * 2, 200 * 2);
  fill(0)
  textSize(12);
  text("Ali", this.position.x + 200, this.position.y + 15);

  fill(0,0,0,0.0)
  stroke(0);
  ellipse(this.position.x,this.position.y, 200 * 2, 200 * 2);
  fill(0)
  textSize(12);
  text("Coh", this.position.x + 200, this.position.y);

  fill(0,0,0,0.0)
  stroke(0, 0, 255);
  ellipse(this.position.x,this.position.y, 50 * 2, 50 * 2);
  fill(0)
  textSize(12);
  text("dSep", this.position.x + 50, this.position.y);

}

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
  var desiredseparation = 15;
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
  var neighbordist = 200;
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
Animal.prototype.pressure = function(herd, shepherds) {
  var neighbordistMax = 200;
  var neighbordistMin = 50;
  var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
  var count = 0;
  var neighCount = 0;

  for (var i = 0; i < shepherds.length; i++) {
    var d = p5.Vector.dist(this.position,shepherds[i].position);
    if ((d > 0) && (d < neighbordistMax) && (d > neighbordistMin)) {
      sum.add(shepherds[i].position); // Add location
      count++;
    }
  }
  return count; // Return number of shepherds in pressure zone
}

// When shepherd enters pressure zone, initiate bunching with neighbours
Animal.prototype.flightZone = function(herd, shepherds) {
  var neighbordistMax = 50;
  var sum = createVector(0,0);   // Start with empty vector to accumulate all locations
  var count = 0;
  var neighCount = 0;

  for (var i = 0; i < shepherds.length; i++) {
    var d = p5.Vector.dist(this.position,shepherds[i].position);
    if ((d > 0) && (d < neighbordistMax)) {
      sum.add(shepherds[i].position); // Add location
      count++;
    }
  }
  return count; // Return number of shepherds in pressure zone
}

Animal.prototype.bunched = function (herd) {
  this.bottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.top = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.left = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  this.right = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));

  herDist = dist(this.left, this.top, this.right, this.bottom);
  if (herDist < 200) {
    return true;
  } else {
    return false;
  }
}

Animal.prototype.setAngle = function(vec, value) {
    vec.x = cos(value) * vec.mag();
    vec.y = sin(value) * vec.mag();
}

Animal.prototype.wander = function() {

    //create future position to base wander displacement off of
    this.wanderCenter = this.velocity.copy();
    this.wanderCenter.normalize();
    this.wanderCenter.mult(this.wanderDistance);

    //calculate displacement force
    var displacement = createVector(0, -0.1);
    displacement.mult(this.wanderRadius);

    this.setAngle(displacement, this.wanderAngle);
    this.wanderAngle += random(-0.05, 0.05);

    this.wanderForce = this.wanderCenter.add(displacement);
    this.wanderForce.normalize();
    this.wanderForce.mult(this.maxspeed);
    this.wanderForce.sub(this.velocity);
    this.wanderForce.limit(this.maxforce);

    //returns steering force that pushed the agent toward target
    return this.wanderForce;
}

// When shepherd enters flight zone, move in opposite direction
Animal.prototype.move = function(shepherds) {
  var desiredseparation = 50;
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
    if (this.inFlightZone > 150) {
      this.stressLevel = (this.stressLevel + 0.01);
    }
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

// setting behaviour when animal comes within certain area of a gate
Animal.prototype.goal = function () {
    var gate = createVector(this.goals[this.goalCounter].x, this.goals[this.goalCounter].y);
    this.checkGoal(gate);
    if (dist(this.position.x, this.position.y, this.goals[this.goals.length -1].x, this.goals[this.goals.length -1].y) < 40) {
      console.log("Name of animal leaving: " + this.name);
      environment.hitTheGap(this);
    }
    var desired = p5.Vector.sub(gate, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
}

// Try to avoid novel objects -- ** Code needs to be put out on the line **
Animal.prototype.avoid = function (novelObjects) {
  var desiredseparation = 0;
  var steer = createVector(0,0);
  var count = 0;

  // For every animal in the system, check if it's too close
  for (var i = 0; i < novelObjects.length; i++) {

    var ex = novelObjects[i].w + 20, ey = novelObjects[i].h + 20; // Adding "+ whatever for size of flight zone"
    var xx = this.position.x - novelObjects[i].position.x
    var yy = this.position.y - novelObjects[i].position.y;
    var eyy = ey * sqrt(abs(ex * ex - xx * xx)) / ex;
    // var d = p5.Vector.dist(this.position,ellipses[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself

    if (this.position.x > novelObjects[i].position.x + ex|| this.position.x < novelObjects[i].position.x - ex||this.position.y > novelObjects[i].position.y + ey|| this.position.y < novelObjects[i].position.y - ey) {
      count = count;
    } else if (yy <= eyy && yy >= -eyy)  {
      // console.log(random(200));
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position,novelObjects[i].position);
      diff.normalize();
      diff.div(eyy);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }

  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
    this.vocalizing = true;
    this.stressLevel = (this.stressLevel + 0.01);
  } else {
    this.vocalizing = false;
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
Animal.prototype.speedRed = function() {
  if (this.reducingSpeed == false) {
    this.reducingSpeed = true;
    // console.log(this);
    var self = this;
    var timer = setInterval(function () {
      if (self.timeCount == 0) {
        self.velocity.setMag(0);
        self.reducingSpeed = false;
        // console.log(self.name + "'s SPEED: " + self.velocity.mag());
        clearInterval(timer);
      } else {
        self.velocity.setMag(self.timeCount * .1);
        // console.log(self.name + "'s SPEED: " + self.velocity.mag());
        self.timeCount--;
      }
    }, 4000);
  } else {
    // console.log("ALREADY DECREASING SPEED");
  }
}

Animal.prototype.avoidObstacle = function (obstacles) {

  for (var i = 0; i < obstacles.length; i++) {
    var obs = obstacles[i];
    xReach = obs.w;
    yReach = obs.h;
    if (this.position.x > obs.position.x && this.position.x < obs.position.x + xReach && this.position.y > obs.position.y - 5 && this.position.y < obs.position.y) {
      this.velocity.y *= -1;
      this.position.y = obs.position.y - 5;
    } else if (this.position.x > obs.position.x && this.position.x < obs.position.x + xReach && this.position.y < obs.position.y + yReach + 5 && this.position.y > obs.position.y) {
      this.velocity.y *= -1;
      this.position.y = obs.position.y + yReach + 5;
    } else if (this.position.y > obs.position.y && this.position.y < obs.position.y + yReach && this.position.x < obs.position.x + xReach + 5 && this.position.x > obs.position.x) {
      this.velocity.x *= -1;
      this.position.x = obs.position.x + xReach + 5;
    } else if (this.position.y > obs.position.y && this.position.y < obs.position.y + yReach && this.position.x > obs.position.x - 5 && this.position.x < obs.position.x) {
      this.velocity.x *= -1;
      this.position.x = obs.position.x - 5;
    }
  }
}

Animal.prototype.checkGoal = function (g) {
  if (dist(this.position.x, this.position.y, g.x, g.y) < 50 && this.goalCounter < this.goals.length -1) {
    this.goalCounter++;
  }
}

Animal.prototype.breakUp = function (shep) {
  var count = 0;
  for(let i = 0; i < shep.length; i++) {
    if(shep[i].position.x > this.left + 50 && shep[i].position.x < this.right - 50 && shep[i].position.y > this.top + 50 && shep[i].position.y < this.bottom - 50) {
      count ++;
    }
  }
  if (count > 0) {
    this.stressLevel += 0.01;
    return true;
  } else {
    return false;
  }
}
