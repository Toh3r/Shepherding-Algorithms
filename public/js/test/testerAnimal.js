// Animal class
// Set Animal attributes
class TesterAnimal extends Animal {
  constructor(x, y, goals) {
    super(x, y, goals);
    this.acceleration = createVector(0,0); // Starting accelertion
    this.velocity = createVector(random(-1,1),random(-1,1)); // Create starting velocity direction
    this.position = createVector(x,y); // Starting position
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
TesterAnimal.prototype.run = function(herd, shepherds, novelObjects, obstacles) {
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

// Accumulate a new acceleration each time based on all rules
TesterAnimal.prototype.accumulateMovevmentForces = function(herd, shepherds, novelObjects, obstacles) {
  var sep = this.separate(herd);      // Separation
  var ali = this.align(herd);         // Alignment
  var coh = this.cohesion(herd);      // Cohesion
  var pre = this.pressure(herd, shepherds);   // shepherds in pressure zone
  var fli = this.flightZone(herd, shepherds); // shepherds in pressure zone
  var mov = this.move(shepherds);             // Steer herd
  var avo = this.avoid(novelObjects);   // Avoid Novelty
  var bun = this.bunched(herd);         // Bunched
  var obs = this.avoidObstacle(obstacles);
  var bre = this.breakUp(shepherds)
  var moveChance = int(random(1,20));

  if (bre == true) {
    // console.log("Running break")
    this.inFlightZone += 1;
    mov.mult(1.5);
    sep.mult(1.2);
    ali.mult(0.1);
    coh.mult(0.1);
    this.maxspeed = 0.5;
    this.velocity.setMag(0.5);
  }

  // If UAVS in FZ and PZ, disregard UAVS in FZ
  if (fli > 0 && pre > 0) {
    pre = 0;
  }

  // WHEN SHEPHERD IN FLIGHT ZONE
  if (fli > 0 && bre == false) {
    this.inFlightZone += 1;
    mov.mult(dSepFliSlider.value());
    sep.mult(sepFliSlider.value());
    ali.mult(aliFliSlider.value());
    coh.mult(cohFliSlider.value());
    this.maxspeed = fSpeedSlider.value();
    this.velocity.setMag(fVelSlider.value());
  }

  // WHEN SHEPHERD IN PRESSURE ZONE
  // if (pre > 0 && bre == false && alo == true) {
  //   this.maxspeed = 0;
  // } else
  if (pre > 0 && bre == false) { //  && alo == false
    this.inFlightZone = 0;
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
      if(dist(this.position.x, this.position.y, this.goals[this.goalCounter].x, this.goals[this.goalCounter].y) > 120) {
        this.speedRed();
      }
      mov.mult(dSepPreSlider.value());
      sep.mult(sepPreSlider.value());
      ali.mult(aliPreSlider.value());
      coh.mult(cohFliSlider.value());
    }
  }

  // WHEN SHEPHERDS ARE NOT IN EITHER ZONE
  if (!pre && !fli) {
    this.inFlightZone = 0;
    sep.mult(sepWanSlider.value());
    ali.mult(aliWanSlider.value());
    coh.mult(cohWanSlider.value());
    this.maxspeed = wSpeedSlider.value();
    // this.velocity.setMag(wVelSlider.value());
    if (this.oldPre > pre && dist(this.position.x, this.position.y, this.goals[this.goalCounter].x, this.goals[this.goalCounter].y) > 120) {
      this.timeCount = Math.round(this.velocity.mag()*10);
      this.speedRed();
    }
    if (this.velocity.mag() < 0.15) {
      if (moveChance == 2) {
        this.maxspeed = wSpeedSlider.value();
        this.velocity.setMag(wVelSlider.value());
        var wan = this.wander();
        wan.mult(.1);
        this.applyForce(wan);
      } else {
        this.maxspeed = 0.05;
        this.velocity.setMag(0.05);
      }
    } else if (this.velocity.mag() > 0.15) {
      this.velocity.heading = this.oldheading;
      sep.mult(sepPreSlider.value());
      ali.mult(aliPreSlider.value());
      coh.mult(cohFliSlider.value());
    }
  }

  if(bun == true && dist(this.position.x, this.position.y, this.goals[this.goalCounter].x, this.goals[this.goalCounter].y) < 120) {
    var goa = this.goal(herd);            // Seek (Goal area)
    goa.mult(goalAnimalsSlider.value());
    this.timeCount = 4;
  }
  avo.mult(stressorAnimalsSlider.value());

  // Add the force vectors to acceleration
  this.applyForce(mov);
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(goa);
  this.applyForce(avo);
  this.applyForce(coh);
  this.applyForce(obs);

  this.oldFli = fli;
  this.oldPre = pre; // Store old array values (Used for comparison in following frame)
  this.oldheading = this.velocity.heading;
}

// Method to render animals flight and pressure zone
TesterAnimal.prototype.renderZones = function () {
  // Draw flight zone
  fill(0,0,0,0.0)
  stroke(255, 0, 0);
  ellipse(this.position.x,this.position.y, fliSizeSlider.value() * 2, fliSizeSlider.value() * 2);
  text("FZ", this.position.x + fliSizeSlider.value(), this.position.y);
  // text("Zone", this.position.x + fliSizeSlider.value(), this.position.y + 15);

  // Draw pressure zone
  fill(0,0,0,0.0)
  stroke(0, 0, 0);
  ellipse(this.position.x,this.position.y, preSizeSlider.value() * 2, preSizeSlider.value() * 2);
  text("PZ", this.position.x + preSizeSlider.value(), this.position.y);
  // text("Zone", this.position.x + preSizeSlider.value(), this.position.y + 15);
};

TesterAnimal.prototype.renderForces = function () {
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
  text("Ali", this.position.x + aliSizeSlider.value(), this.position.y + 15);

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

// ----- ANIMAL BEHAVIOURAL RULES WITH OTHER ANIMALS

// Separation
// Method checks for nearby animals and steers away
TesterAnimal.prototype.separate = function(herd) {
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
TesterAnimal.prototype.align = function(herd) {
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
TesterAnimal.prototype.cohesion = function(herd) {
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
TesterAnimal.prototype.pressure = function(herd, shepherds) {
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
  return count; // Return number of shepherds in pressure zone
}

// When shepherd enters pressure zone, initiate bunching with neighbours
TesterAnimal.prototype.flightZone = function(herd, shepherds) {
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
  return count; // Return number of shepherds in pressure zone
}

// When shepherd enters flight zone, move in opposite direction
TesterAnimal.prototype.move = function(shepherds) {
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
