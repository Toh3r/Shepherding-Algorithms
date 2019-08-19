class FlightyAnimal extends Animal {
  constructor (x, y, goals) {
    super(x, y, goals)
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

// Call functions for each animal each time step
FlightyAnimal.prototype.run = function(herd, shepherds, novelObjects, obstacles) {
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
FlightyAnimal.prototype.accumulateMovevmentForces = function(herd, shepherds, novelObjects, obstacles) {
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
  // var alo = this.alone(herd);
  var moveChance = int(random(1,20));

  if (bre == true) {
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
    mov.mult(2);
    sep.mult(1.5);
    ali.mult(0.4);
    coh.mult(0.4);
    this.maxspeed = 0.6;
    this.velocity.setMag(0.6);
  }

  if (pre > 0 && bre == false) { // && alo == false
    this.inFlightZone = 0;
    if (bun == false) {
      this.maxspeed = 0.5;
      this.velocity.setMag(0.5);
      mov.mult(0.2);
      sep.mult(1);
      ali.mult(0.4);
      coh.mult(0.6);
    } else if (bun == true) {
      this.maxspeed = this.timeCount / 10 + .1;
      mov.mult(2);
      sep.mult(1.5);
      ali.mult(0.4);
      coh.mult(0.4);
    }
    if (this.oldFli > fli && bun == true) {
      this.timeCount = (Math.round(this.velocity.mag()*10));
      if(dist(this.position.x, this.position.y, this.goals[this.goalCounter].x, this.goals[this.goalCounter].y) > 120) {
        this.speedRed();
      }
    }
  }

  // WHEN SHEPHERDS ARE NOT IN EITHER ZONE
  if (!pre && !fli) {
    this.inFlightZone = 0;
    sep.mult(4);
    ali.mult(0);
    coh.mult(0);
    this.maxspeed = 0.03;
    // this.velocity.setMag(wVelSlider.value());
    if (this.oldPre > pre && dist(this.position.x, this.position.y, this.goals[this.goalCounter].x, this.goals[this.goalCounter].y) > 120) {
      this.timeCount = Math.round(this.velocity.mag()*10);
      this.speedRed();
    }
    if (this.velocity.mag() < 0.15) {
      if (moveChance == 2) {
        this.maxspeed = 0.1;
        this.velocity.setMag(0.1);
        var wan = this.wander();
        wan.mult(0.1);
        this.applyForce(wan);
      } else {
        this.maxspeed = 0.03;
        this.velocity.setMag(0.03);
      }
    } else if (this.velocity.mag() > 0.15) {
      this.velocity.heading = this.oldheading;
      sep.mult(1.2);
      ali.mult(0.7);
      coh.mult(1);
    }
  }

  if(bun == true && dist(this.position.x, this.position.y, this.goals[this.goalCounter].x, this.goals[this.goalCounter].y) < 120) {
    var goa = this.goal(herd);            // Seek (Goal area)
    goa.mult(0.8);
    this.timeCount = 4;
  }

  // if(bun == true && dist(this.position.x, this.position.y, this.goals[this.goals.length-1].x, this.goals[this.goals.length-1].y) < 120) {
  //   goa.mult(0.8);
  // }
  avo.mult(1.3);

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
