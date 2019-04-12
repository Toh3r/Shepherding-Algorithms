// Animal class
// Set Animal attributes
function Animal(x,y) {
  this.acceleration = createVector(0,0); // Starting accelertion
  this.velocity = createVector(random(-3,3),random(-3,3)); // Create starting velocity direction
  this.position = createVector(x,y); // Starting position
  this.r = 3.0;         // Animal size
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
  this.timeCount = 5;          // Set starting timecount
  this.reducingSpeed = false;  // Set boolean for setInterval
  this.wanderRadius = 10;      // Set wander rule variables
  this.wanderDistance = 2.5;
  this.wanderCenter = 0;
  this.wanderAngle = random(50);
  this.wanderForce = createVector(0,0);
  this.vocalizing = false;
}

// ----- ANIMAL UPDATE FUNCTIONS

// Call functions for each animal each frame
Animal.prototype.run = function(herd, shepherds, novelObjects, autoShepherds) {
  this.herd(herd, shepherds, novelObjects, autoShepherds); // Apply forces
  this.update();    // Update position based on forces
  this.borders();   // Keep animal in enclosure
  this.render();    // Render animal
  if (zoneCheck.checked() == true) {
    this.renderZones(); // Render animal zones
  }
  if(nameCheck.checked() == true) {
    this.showName();    // Render Animal info
  }
  if(forceCheck.checked() == true) {
    this.renderForces();
  }
}

// Apply each behavioural rule to each animal
Animal.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// Accumulate a new acceleration each time based on all rules
Animal.prototype.herd = function(herd, shepherds, novelObjects, autoShepherds) {
  var sep = this.separate(herd);      // Separation
  var ali = this.align(herd);         // Alignment
  var coh = this.cohesion(herd);      // Cohesion
  var pre = this.pressure(herd, shepherds, autoShepherds);   // shepherds in pressure zone
  var fli = this.flightZone(herd, shepherds, autoShepherds); // shepherds in pressure zone
  var mov = this.move(shepherds, autoShepherds);     // Steer herd
  var goa = this.goal();              // Seek (Goal area)
  var avo = this.avoid(novelObjects); // Avoid Novelty
  var bun = this.bunched(herd);       // Bunched


  // WHEN SHEPHERD IN FLIGHT ZONE
  if (fli > 0) {
    mov.mult(dSepFliSlider.value());
    sep.mult(sepFliSlider.value());
    ali.mult(aliFliSlider.value());
    coh.mult(cohFliSlider.value());
    this.maxspeed = fSpeedSlider.value();
    this.velocity.setMag(fVelSlider.value());
  }

  // WHEN SHEPHERD IN PRESSURE ZONE
  if (pre > 0) {
    if (bun == false) {
      this.maxspeed = pSpeedSlider.value();
      this.velocity.setMag(pVelSlider.value());
      mov.mult(dSepPreSlider.value());
      sep.mult(sepPreSlider.value());
      ali.mult(aliPreSlider.value());
      coh.mult(cohPreSlider.value());
    } else if (bun == true) {
      this.maxspeed = this.timeCount / 10 + .1;
      mov.mult(dSepPreSlider.value());
      sep.mult(sepPreSlider.value());
      ali.mult(aliPreSlider.value());
      coh.mult(cohFliSlider.value());
    }
    if (this.oldFli > fli && bun == true) {
      this.timeCount = (Math.round(this.velocity.mag()*10));
      this.speedRed();
      mov.mult(dSepPreSlider.value());
      sep.mult(sepPreSlider.value());
      ali.mult(aliPreSlider.value());
      coh.mult(cohFliSlider.value());
    }
  }

  // WHEN SHEPHERDS ARE NOT IN EITHER ZONE
  if (!pre && !fli) {
    sep.mult(sepWanSlider.value());
    ali.mult(aliWanSlider.value());
    coh.mult(cohWanSlider.value());
    this.maxspeed = wSpeedSlider.value();
    // this.velocity.setMag(wVelSlider.value());
    if (this.oldPre > pre) {
      this.timeCount = Math.round(this.velocity.mag()*10);
      this.speedRed();
    }
    if (this.velocity.mag() < 0.15) {
      this.maxspeed = wSpeedSlider.value();
      this.velocity.setMag(wVelSlider.value());
      var wan = this.wander();
      wan.mult(.1);
      this.applyForce(wan);
    } else if (this.velocity.mag() > 0.15) {
      sep.mult(sepPreSlider.value());
      ali.mult(aliPreSlider.value());
      coh.mult(cohFliSlider.value());
    }
  }

  // Add the force vectors to acceleration
  this.applyForce(mov);
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(goa);
  this.applyForce(avo);
  this.applyForce(coh);

  this.oldFli = fli;
  this.oldPre = pre; // Store old array values (Used for comparison in following frame)
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
  vertex(0, -this.r*1.5);
  vertex(-this.r, this.r*1.5);
  vertex(this.r, this.r*1.5);
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
  ellipse(this.position.x,this.position.y, fliSizeSlider.value() * 2, fliSizeSlider.value() * 2);

  // Draw pressure zone
  fill(0,0,0,0.0)
  stroke(0, 0, 0);
  ellipse(this.position.x,this.position.y, preSizeSlider.value() * 2, preSizeSlider.value() * 2);
};

Animal.prototype.renderForces = function () {
  fill(0,0,0,0.0)
  stroke(255, 0, 0);
  ellipse(this.position.x,this.position.y, sepSizeSlider.value() * 2, sepSizeSlider.value() * 2);
  fill(0)
  textSize(12);
  text("Sep", this.position.x + sepSizeSlider.value(), this.position.y);

  fill(0,0,0,0.0)
  stroke(255);
  ellipse(this.position.x,this.position.y, aliSizeSlider.value() * 2, aliSizeSlider.value() * 2);
  fill(0)
  textSize(12);
  text("Ali", this.position.x + aliSizeSlider.value(), this.position.y);

  fill(0,0,0,0.0)
  stroke(0);
  ellipse(this.position.x,this.position.y, cohSizeSlider.value() * 2, cohSizeSlider.value() * 2);
  fill(0)
  textSize(12);
  text("Coh", this.position.x + cohSizeSlider.value(), this.position.y);

  fill(0,0,0,0.0)
  stroke(0, 0, 255);
  ellipse(this.position.x,this.position.y, dSepSizeSlider.value() * 2, dSepSizeSlider.value() * 2);
  fill(0)
  textSize(12);
  text("dSep", this.position.x + dSepSizeSlider.value(), this.position.y);

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
  var desiredseparation = sepSizeSlider.value();
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
  var neighbordist = aliSizeSlider.value();
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
  var neighbordist = cohSizeSlider.value();
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
Animal.prototype.pressure = function(herd, shepherds, autoShepherds) {
  var neighbordistMax = preSizeSlider.value();
  var neighbordistMin = fliSizeSlider.value();
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
  for (var i = 0; i < autoShepherds.length; i++) {
    var d = p5.Vector.dist(this.position,autoShepherds[i].position);
    if ((d > 0) && (d < neighbordistMax) && (d > neighbordistMin)) {
      sum.add(autoShepherds[i].position); // Add location
      count++;
    }
  }
  return count; // Return number of shepherds in pressure zone
}

// When shepherd enters pressure zone, initiate bunching with neighbours
Animal.prototype.flightZone = function(herd, shepherds, autoShepherds) {
  var neighbordistMax = fliSizeSlider.value();
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
  for (var i = 0; i < autoShepherds.length; i++) {
    var d = p5.Vector.dist(this.position,autoShepherds[i].position);
    if ((d > 0) && (d < neighbordistMax)) {
      sum.add(autoShepherds[i].position); // Add location
      count++;
    }
  }
  return count; // Return number of shepherds in pressure zone
}

Animal.prototype.bunched = function (herd) {
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
    this.wanderAngle += random(-0.1, 0.1);

    this.wanderForce = this.wanderCenter.add(displacement);
    // this.wanderForce.limit(this.maxForce);

    this.wanderForce.mult(this.maxspeed);
    this.wanderForce.sub(this.velocity);
    this.wanderForce.limit(this.maxforce);

    //returns steering force that pushed the agent toward target
    return this.wanderForce;
}

// When shepherd enters flight zone, move in opposite direction
Animal.prototype.move = function(shepherds, autoShepherds) {
  var desiredseparation = dSepSizeSlider.value();
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
  for (var i = 0; i < autoShepherds.length; i++) {
    var d = p5.Vector.dist(this.position,autoShepherds[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position,autoShepherds[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
    this.stressLevel = (this.stressLevel + 0.01);
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
  if (this.position.x > 850 && this.position.y > 180 && this.position.y < 330) {
    var gate = createVector(980, 250);
    //console.log(this.animal);
    if (this.position.x > 980 && this.position.y > 230 && this.position.y < 270) {
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
    // this.velocity.setMag(0.1);
    this.vocalizing = true;
    console.log("Vocalizing");
    this.stressLevel = (this.stressLevel + 0.1);
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
    }, 3000);
  } else {
    // console.log("ALREADY DECREASING SPEED");
  }

}
