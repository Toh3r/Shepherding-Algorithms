// Shepherd Class
// Create shepherd attributes
function OracleShepherd(startPos, shepGoals) {  // Passing through starting co-ords and goal co-ords
  this.acceleration = createVector(0,0); // Startigng acceleration of 0
  this.velocity = createVector(0,0);     // Starting velocity of 0
  this.position = createVector(startPos.x, startPos.y);
  this.maxForce = 0.6;
  this.maxspeed = 0.7;
  this.movingUp = false;
  this.target = createVector(0,0);
  this.targetLock = false;
  this.oldTarget = createVector(0,0);
  this.timestep = 0;
  this.shepGoals = shepGoals; // ----- Goal variables
  this.goalCounter = 0;
  this.oldAnimals = [];
  this.targetAnimal = {};
  this.oldTargetAnimal = {
    position: createVector(2000, 2000)
  }
  this.switchingActions = false;
  this.collectBool = true;
  this.moveBool = false;
  this.avoidHerdBool = false; // ----- Avoiding variables
  this.avoiding = false;
  this.wait = true;
  this.firstAvoid = false;
  this.goodMovement = 0;
  this.correctHeading = 0;
}

// Call methods for each shepherd
OracleShepherd.prototype.run = function(oracles) {
  this.update();
  this.borders();
  this.render();
  var currentAnimals = oracles[0].animals;
  if (oracles[0].targetNum == oracles[0].numSectors || oracles[0].targetNum == 0 || oracles[0].following == true) {
    if(currentAnimals.length != 0) {
      this.oldAnimals.length = 0;
      this.herdAnimals(currentAnimals);
      this.timestep++;
      this.saveOldPositions(currentAnimals);
      if(lineCheck.checked() == true) {
        this.displayShepLines(currentAnimals);
      }
    }
  } else if (this.oldAnimals.length > 0) {
    this.herdAnimals(this.oldAnimals);
    this.timestep++;
    if(lineCheck.checked() == true) {
      this.displayShepLines(this.oldAnimals);
    }
  }
  // else {
  //   this.maxspeed = 0;
  // }

  if(oracles[0].maxspeed == 0) {
    this.maxspeed = 0;
  }
}

// Apply each behavioural rule to each animal
OracleShepherd.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

OracleShepherd.prototype.herdAnimals = function (animals) {
  var bun = this.bunched(animals);
  var too = this.tooClose(animals);

  if (bun == true) {  	        // If bunched, call move function
    var mov = this.moveAnimals(animals);
    this.applyForce(mov);
    this.collectBool = false;  // Booleans for UI output
    this.moveBool = true;
  }

  if (bun == false) { // If false, call collecting function
  var avgDist = this.checkDist(animals)
  if (avgDist > 150) { // FFHC Collect
    var col = this.advanceCollect(animals);
  } else { // ZZ Collect
    var col = this.collectAnimals(animals);
  }

  this.applyForce(col);
  this.collectBool = true; // Booleans for UI output
  this.moveBool = false;
  }

  if(too == true) {
    this.maxspeed = 0.2;
  }
}

// Method to update location
OracleShepherd.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// Method to prevent shepherd from leaving enclosure
OracleShepherd.prototype.borders = function () {
  if (this.position.x < 10) {
    this.position.x = 10;
  } else if (this.position.y < 10) {
    this.position.y = 10;
  } else if (this.position.x > width - 10) {
    this.position.x = width - 15;
  } else if (this.position.y > height - 10) {
    this.position.y = height - 10;
  }
}
// Draw shepherd
OracleShepherd.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + radians(90);
  fill(255);
  stroke(0);
  push();
  translate(this.position.x,this.position.y);
  rotate(theta);
  beginShape();
  ellipse(-5, 0, 5,5); // 2
  ellipse(0, 0, 5,5); // 4
  fill(0,0,255);
  ellipse(-5,-5, 5,5); // 1
  ellipse(0,-5, 5,5); // 3
  endShape(CLOSE);
  pop();
}

OracleShepherd.prototype.bunched = function (animals) {
  this.animalsBottom = Math.max.apply(Math, animals.map(function(o) { return o.position.y; }));
  this.animalsTop = Math.min.apply(Math, animals.map(function(o) { return o.position.y; }));
  this.animalsLeft = Math.min.apply(Math, animals.map(function(o) { return o.position.x; }));
  this.animalsRight = Math.max.apply(Math, animals.map(function(o) { return o.position.x; }));

  this.topLeft = createVector(this.animalsLeft, this.animalsTop);
  this.topRight =  createVector(this.animalsRight, this.animalsTop);
  this.bottomLeft =  createVector(this.animalsLeft, this.animalsBottom);
  this.bottomRight =  createVector(this.animalsRight, this.animalsBottom);

  this.sec5 = { // Top Left Corner
    tl: createVector(this.topLeft.x - 100, this.topLeft.y - 100),
    tr: createVector(this.topLeft.x, this.topLeft.y - 100),
    br: createVector(this.topLeft.x, this.topLeft.y),
    bl: createVector(this.topLeft.x - 100, this.topLeft.y)
  }
  this.sec6 = { // Top Right Corner
    tl: createVector(this.topRight.x, this.topRight.y - 100),
    tr: createVector(this.topRight.x + 100, this.topRight.y - 100),
    br: createVector(this.topRight.x + 100, this.topRight.y),
    bl: createVector(this.topRight.x, this.topRight.y)
  }
  this.sec7 = { // Bottom Right Corner
    tl: createVector(this.bottomRight.x, this.bottomRight.y),
    tr: createVector(this.bottomRight.x + 100, this.bottomRight.y),
    br: createVector(this.bottomRight.x + 100, this.bottomRight.y + 100),
    bl: createVector(this.bottomRight.x, this.bottomRight.y + 100)
  }
  this.sec8 = { // Bottom Left Corner
    tl: createVector(this.bottomLeft.x - 100, this.bottomLeft.y),
    tr: createVector(this.bottomLeft.x, this.bottomLeft.y),
    br: createVector(this.bottomLeft.x, this.bottomLeft.y + 100),
    bl: createVector(this.bottomLeft.x - 100, this.bottomLeft.y + 100)
  }

  herDist = dist(this.animalsLeft, this.animalsTop, this.animalsRight, this.animalsBottom);
  if (herDist < 100) {
    return true;
  } else {
    return false;
  }
}

OracleShepherd.prototype.collectAnimals = function (animals) {
  this.oldMovement = "collecting"; // Set current movement
  var herdX = (this.animalsRight + this.animalsLeft) / 2; // X co-ord of herd centre
  var herdY = (this.animalsTop + this.animalsBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter];

  // Functions to deal with stressor aversion if necessary
  if (environment.vocalizing() == true && animals.length > 0) {
    this.avoiding = true;
    if(this.wait = "false") {
      this.maxspeed = 0.5;
    } else {
      this.maxspeed = 0.5;
      goal = this.avoidObstacle(center, goal, animals);
    }
  } else if (environment.vocalizing() == false && animals.length > 0) {
    this.wait = false;
    this.maxspeed = 0.8;
    this.avoiding = false;
  }

  var myLine = this.findClosestAnimal(animals, center);
  // Lines to flight zone and pressure zone
  let l2fz = this.adjustLineLen(center,goal,myLine+20);
  let l2pz = this.adjustLineLen(center,goal,myLine+60);

  // Get co-ords for flight zone line points
  let fzp1 = this.createPCo1(l2fz.x,l2fz.y,herdX,herdY);
  let fzp2 = this.createPCo2(l2fz.x,l2fz.y,herdX,herdY);
  //Get co-ords for pressure zone line points
  let pzp1 = this.createPCo1(l2pz.x,l2pz.y,herdX,herdY);
  let pzp2 = this.createPCo2(l2pz.x,l2pz.y,herdX,herdY);
  // Get co-ords for herd line points
  let hlp1 = this.createPCo1(herdX,herdY,l2fz.x,l2fz.y);
  let hlp2 = this.createPCo2(herdX,herdY,l2fz.x,l2fz.y);
  // Shorten length of pz line
  pzp1 = this.adjustLineLen(pzp1,l2pz, -40);
  pzp2 = this.adjustLineLen(pzp2,l2pz, -40);

 if (this.movingUp == false) {
   var target = createVector(pzp1.x,pzp1.y);
   this.targetInHerd(target);
   this.targetInBounds(target);
   this.outOfHerd(target);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
     this.movingUp = true;
   }
   return steer;
 } else if (this.movingUp == true) {
   var target = createVector(pzp2.x,pzp2.y);
   this.targetInHerd(target);
   this.targetInBounds(target);
   this.outOfHerd(target);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
     this.movingUp = false;
   }
   return steer;
 }
}

OracleShepherd.prototype.advanceCollect = function (animals) {
  this.oldMovement = "collecting"; // Set movement type to collecting
  this.avoidHerdBool = false;
  var herdX = (this.animalsRight + this.animalsLeft) / 2; // X co-ord of herd centre
  var herdY = (this.animalsTop + this.animalsBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter]; // Location of exit

  // Functions to deal with stressor avoidance
  if (environment.vocalizing() == true && animals.length > 0) {
    this.avoiding = true;
    this.maxspeed = 0.5;
    goal = this.avoidObstacle(center, goal, animals); // function to switch target points
  } else if (environment.vocalizing() == false && animals.length > 0) {
    this.maxspeed = 0.8;
    this.avoiding = false;
  }

  var furthestPos = 0;
  for (var i = 0; i < animals.length; i++) {
    currentDist = dist(animals[i].position.x, animals[i].position.y, herdX, herdY);
    if (currentDist > furthestPos) {
      furthestPos = currentDist;
      this.targetAnimal = animals[i];
    }
  }

  if (animals.length > 0) {
    fill(255,0,0, 20);
    stroke(0);
    ellipse(this.targetAnimal.position.x, this.targetAnimal.position.y, 20,20);
    ellipse(this.oldTargetAnimal.position.x, this.oldTargetAnimal.position.y, 20,20)
  }

  var comp1 = dist(this.targetAnimal.position.x, this.targetAnimal.position.y, herdX, herdY);
  var comp2 = dist(this.oldTargetAnimal.position.x, this.oldTargetAnimal.position.y, herdX, herdY);

  // if(Math.abs(comp1 - comp2) < 30) {
  //   this.targetAnimal = this.oldTargetAnimal;
  // }

  let fz2hc = this.adjustLineLen(this.targetAnimal.position, center, 40);
  let pz2hc = this.adjustLineLen(this.targetAnimal.position, center, 70);

  // Get co-ords for flight zone line points
  let fzp10 = this.createPCo1(fz2hc.x,fz2hc.y,pz2hc.x,pz2hc.y);
  let fzp20 = this.createPCo2(fz2hc.x,fz2hc.y,pz2hc.x,pz2hc.y);
  //Get co-ords for pressure zone line points
  let pzp10 = this.createPCo1(pz2hc.x,pz2hc.y,fz2hc.x, fz2hc.y);
  let pzp20 = this.createPCo2(pz2hc.x,pz2hc.y,fz2hc.x, fz2hc.y);

  if (animals.length > 0) {
    fill(0,255,0)
    stroke(0,255,0);
    line(pz2hc.x, pz2hc.y, center.x, center.y);
    line(fz2hc.x, fz2hc.y, center.x, center.y);
    ellipse(fzp10.x, fzp10.y, 10,10);
    ellipse(fzp20.x, fzp20.y, 10,10);
    ellipse(pzp10.x, pzp10.y, 10,10);
    ellipse(pzp20.x, pzp20.y, 10,10);
    line(fzp10.x, fzp10.y,fzp20.x, fzp20.y)
    line(pzp10.x, pzp10.y,pzp20.x, pzp20.y)
  }

  this.oldTargetAnimal = this.targetAnimal;

 if (this.movingUp == false) {
   var target = createVector(fzp10.x,fzp10.y);
   this.targetInBounds(target);
   this.outOfHerd(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
     this.movingUp = true;
   }
   return steer;
 } else if (this.movingUp == true) {
   var target = createVector(fzp20.x,fzp20.y);
   this.targetInBounds(target);
   this.outOfHerd(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
     this.movingUp = false;
   }
   return steer;
 }
}

OracleShepherd.prototype.moveAnimals = function (animals) {

  var herdX = (this.animalsRight + this.animalsLeft) / 2; // X co-ord of herd centre
  var herdY = (this.animalsTop + this.animalsBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter];
  this.checkGoal(center, goal);

  if (environment.vocalizing() == true && animals.length > 0) {
  if (this.oldMovement == 'moving') {
    this.firstAvoid = true;
  }
  this.oldMovement = 'avoiding';
  this.avoiding = true;
  goal = this.avoidObstacle(center, goal, animals);
  this.maxspeed = 0.5;
  } else if (environment.vocalizing() == false && animals.length > 0) {
    this.oldMovement = 'moving'
    if(this.avoiding == true) {
      this.switchingActions = true;
      this.avoiding = false;
    }
    this.maxspeed = 0.8;
    this.avoiding = false;
  }

  var myLine = this.findClosestAnimal(animals, center);
  if (myLine < 20) {
    myLine = 20;
  } else if (myLine > 100) {
    myLine = 100;
  }

  // Lines to flight zone and pressure zone
  let l2fz = this.adjustLineLen(center,goal,myLine+20);
  let l2pz = this.adjustLineLen(center,goal,myLine+60);

  // Get co-ords for flight zone line points
  let fzp1 = this.createPCo1(l2fz.x,l2fz.y,herdX,herdY);
  let fzp2 = this.createPCo2(l2fz.x,l2fz.y,herdX,herdY);
  //Get co-ords for pressure zone line points
  let pzp1 = this.createPCo1(l2pz.x,l2pz.y,herdX,herdY);
  let pzp2 = this.createPCo2(l2pz.x,l2pz.y,herdX,herdY);
  // Get co-ords for herd line points
  let hlp1 = this.createPCo1(herdX,herdY,l2fz.x,l2fz.y);
  let hlp2 = this.createPCo2(herdX,herdY,l2fz.x,l2fz.y);
  // Shorten length of pz line
  pzp1 = this.adjustLineLen(pzp1,l2pz, -40);
  pzp2 = this.adjustLineLen(pzp2,l2pz, -40);

  herdHeading = this.checkHeading(animals);

  this.correctHeading = this.getGoodHeading(center, goal);
  if (environment.avgSpeed() > 0.30 && Math.abs(this.correctHeading - herdHeading) < 0.50) {
    this.goodMovement += 1;
  }

  if(this.firstAvoid == true) {
  console.log("First Avoid true")
  if (dist(fzp1.x, fzp1.y, this.shepGoals[this.goalCounter].x, this.shepGoals[this.goalCounter].y) > dist(fzp2.x, fzp2.y, this.shepGoals[this.goalCounter].x, this.shepGoals[this.goalCounter].y)) {
    this.movingUp = false;
    this.firstAvoid = false;
  } else if (dist(fzp2.x, fzp2.y, this.shepGoals[this.goalCounter].x, this.shepGoals[this.goalCounter].y) > dist(fzp1.x, fzp1.y, this.shepGoals[this.goalCounter].x, this.shepGoals[this.goalCounter].y)) {
    this.movingUp = true;
    this.firstAvoid = false;
  }
}

if(this.switchingActions == true) {
  console.log("Switch running")
  if (dist(this.position.x, this.position.y, fzp1.x, fzp1.y) > dist(this.position.x, this.position.y, fzp2.x, fzp2.y)) {
    this.movingUp = true;
    this.switchingActions = false;
  } else if (dist(this.position.x, this.position.y, fzp2.x, fzp2.y) > dist(this.position.x, this.position.y, fzp1.x, fzp1.y)) {
    this.movingUp = false;
    this.switchingActions = false;
  }
}

let statues = this.checkForStatues(animals, center);

  if (this.movingUp == false) {
    if (environment.avgSpeed() < 0.20 || !(-0.50 < herdHeading && herdHeading < 0.50)) {
      var target = createVector(fzp1.x,fzp1.y);
    } else {
      var target = createVector(pzp1.x,pzp1.y);
    }
    this.targetInBounds(target);
    if (this.oldMovement != "moving") {
      this.outOfHerd(target);
    }
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
      this.movingUp = !this.movingUp;
      this.firstAvoid = false;
      this.switchingActions = false;
    }
    return steer;
  } else if (this.movingUp == true) {
    if (environment.avgSpeed() < 0.20 || !(-0.50 < herdHeading && herdHeading < 0.50)) {
      var target = createVector(fzp2.x,fzp2.y);
    } else {
      var target = createVector(pzp2.x,pzp2.y);
    }
    this.targetInBounds(target);
    if (this.oldMovement != "moving") {
      this.outOfHerd(target);
    }
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
      this.movingUp = !this.movingUp;
      this.firstAvoid = false;
      this.switchingActions = false;
    }
    return steer;
  }
}

OracleShepherd.prototype.targetInBounds = function (target) {
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

OracleShepherd.prototype.targetInHerd = function (target) {
  if (target.x < this.topLeft.x - 100) {
    target.x = this.topLeft - 20;
  } else if (target.y < this.topLeft.y - 100) {
    target.y = this.topLeft.y - 20;
  } else if (target.x > this.topRight.x + 100) {
    target.x = this.topRight.x + 20;
  } else if (target.y > this.bottomRight.y + 100) {
    target.y = this.bottomRight.y + 20;
  }
  return target;
}

OracleShepherd.prototype.displayShepLines = function (animals) {
  var herdX = (this.animalsRight + this.animalsLeft) / 2; // X co-ord of herd centre
  var herdY = (this.animalsTop + this.animalsBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter];

  if (environment.vocalizing() == true && animals.length > 0) {
    goal = this.avoidObstacle(center, goal, animals);
  }

  var myLine = this.findClosestAnimal(animals, center);

  // Lines to flight zone and pressure zone
  let l2fz = this.adjustLineLen(center,goal,myLine+20);
  let l2pz = this.adjustLineLen(center,goal,myLine+60);

  // Get co-ords for flight zone line points
  let fzp1 = this.createPCo1(l2fz.x,l2fz.y,herdX,herdY);
  let fzp2 = this.createPCo2(l2fz.x,l2fz.y,herdX,herdY);
  //Get co-ords for pressure zone line points
  let pzp1 = this.createPCo1(l2pz.x,l2pz.y,herdX,herdY);
  let pzp2 = this.createPCo2(l2pz.x,l2pz.y,herdX,herdY);
  // Get co-ords for herd line points
  let hlp1 = this.createPCo1(herdX,herdY,l2fz.x,l2fz.y);
  let hlp2 = this.createPCo2(herdX,herdY,l2fz.x,l2fz.y);
  // Shorten length of pz line
  pzp1 = this.adjustLineLen(pzp1,l2pz, -40);
  pzp2 = this.adjustLineLen(pzp2,l2pz, -40);

  fill(0);
  stroke(7, 53, 171);
  ellipse(herdX,herdY, 10, 10);      // Herd centre circle
  line(herdX, herdY, goal.x,goal.y); // Line to gate
  ellipse(hlp1.x, hlp1.y, 10, 10);   // Point A on herd Line
  ellipse(hlp2.x, hlp2.y, 10, 10);   // Point B on Herd Line
  line(hlp1.x,hlp1.y,hlp2.x,hlp2.y); //Line Through herd
  ellipse(goal.x,goal.y, 10,10)      // Goal Point

  stroke(255,0,0);
  line(herdX, herdY, l2fz.x,l2fz.y);  // Line to fli
  ellipse(l2fz.x,l2fz.y,10,10);       // Fli centre point
  line(fzp1.x,fzp1.y,fzp2.x,fzp2.y);  // Line through Fli
  ellipse(fzp1.x,fzp1.y,10,10);       // Point A on Fli Line
  ellipse(fzp2.x,fzp2.y,10,10);       // Point B on Fli Line

  // Line to Pre
  stroke(0,255,0);
  line(l2pz.x, l2pz.y, l2fz.x,l2fz.y); // Line to Pre
  ellipse(l2pz.x,l2pz.y,10,10);        // Pre centre point
  line(pzp1.x,pzp1.y,pzp2.x,pzp2.y);   // Line through Pre
  ellipse(pzp1.x,pzp1.y,10,10);        // Point A on Pre
  ellipse(pzp2.x,pzp2.y,10,10);        // Point B on Pre

}

OracleShepherd.prototype.avoidObstacle = function (center, goal, animals) {
  this.oldMovement = "avoiding";
  herdHeading = this.checkHeading(animals);
  fill(0,255,0);
  stroke(0);
  if (herdHeading >= -0.75 && herdHeading <= 0.75) {
    text("Move Right", 50, 50);
    ellipse(width, (this.herdTop + this.herdBottom) / 2, 50,50);
    goal = createVector(width, (this.herdTop + this.herdBottom) / 2);
  } else if (herdHeading >= 0.75 && herdHeading <= 2.25) {
    text("Move Down", 50, 50);
    ellipse((this.herdRight + this.herdLeft) / 2, height, 50,50);
    goal = createVector((this.herdRight + this.herdLeft) / 2, height);
  } else if (herdHeading >= -2.25 && herdHeading <= -0.75) {
    text("Move Up", 50, 50);
    ellipse((this.herdRight + this.herdLeft) / 2, 0, 50,50);
    goal = createVector((this.herdRight + this.herdLeft) / 2, 0);
  } else {
    text("Move Left", 50, 50);
    ellipse(0, (this.herdTop + this.herdBottom) / 2, 50,50);
    goal = createVector(0, (this.herdTop + this.herdBottom) / 2);
  }

  this.targetInBounds(goal);
  return goal;
}

// Create point a for perpindicular lines
OracleShepherd.prototype.createPCo1 = function (x1,y1,x2,y2) {
  xDiff = x1 - x2;
  yDiff = y1 - y2;
  px1 = x1 - yDiff;
  py1 = y1 + xDiff;
  point = createVector(px1, py1);
  return point;
}

// Create point b for perpindicular lines
OracleShepherd.prototype.createPCo2 = function (x1,y1,x2,y2) {
  xDiff = x1 - x2;
  yDiff = y1 - y2;
  px2 = x1 + yDiff;
  py2 = y1 - xDiff;
  point = createVector(px2,py2);
  return point;
}

OracleShepherd.prototype.adjustLineLen = function (p1,p2,d) {
  // extend line from goal to herd centre to fz and pre zone
  let originalDist = int(dist(p1.x, p1.y, p2.x,p2.y));
  lp1 = p1.x + (p1.x - p2.x) / originalDist * (d);
  lp2 = p1.y + (p1.y - p2.y) / originalDist * (d);
  point = createVector(lp1,lp2);
  return point;
}
OracleShepherd.prototype.checkHeading = function (animals) {
  totalHeading = 0;
  for (var i = 0; i < animals.length; i++) {
    totalHeading += animals[i].heading;
  }
  averageHeading = totalHeading/ animals.length;
  return averageHeading;
}

OracleShepherd.prototype.saveOldPositions = function (animals) {
  var count = 0;
  for (var i = 0; i < animals.length; i++) {
      // Javascript passes objects/arrays by reference, have to create new deep array
      // Parsing position x and y separatly to stop circular structure error
      var parsedPosX = JSON.parse(JSON.stringify(animals[i].position.x));
      var parsedPosY = JSON.parse(JSON.stringify(animals[i].position.y));
      var parsedVel = JSON.parse(JSON.stringify(animals[i].heading));
      var parsedVoc = JSON.parse(JSON.stringify(animals[i].vocalizing));
      var parsedSecX = JSON.parse(JSON.stringify(animals[i].inSector.x));
      var parsedSecY = JSON.parse(JSON.stringify(animals[i].inSector.y));
      var parsedSpeed = JSON.parse(JSON.stringify(animals[i].speed));

      // Create new object with static values of animals
      var parsedAnimal = {
        position: createVector(parsedPosX, parsedPosY),
        heading: parsedVel,
        vocalizing: parsedVoc,
        inSector: createVector(parsedSecX, parsedSecY),
        speed: parsedSpeed
      }
      this.oldAnimals.push(parsedAnimal); // Add to animals array which is used by shepherd
      count++;
  }
}

OracleShepherd.prototype.outOfHerd = function (target) { //In herd
  fill(241, 244, 66, 100);
  stroke(66, 66, 244);
  if (this.position.x > this.topLeft.x && this.position.x < this.topRight.x && this.position.y > this.topLeft.y && this.position.y < this.bottomLeft.y) {
    stroke(66, 66, 244); // Around herd
    fill(255,30,30,100);
    quad(this.topLeft.x, this.topLeft.y, this.topRight.x, this.topRight.y, this.bottomRight.x, this.bottomRight.y, this.bottomLeft.x, this.bottomLeft.y);
    this.redAlert(target);
  } else if (this.position.x > this.topLeft.x && this.position.x < this.topRight.x && this.position.y > this.topLeft.y - 100 && this.position.y < this.topLeft.y) { // top
    // Top
    quad(this.topLeft.x, this.topLeft.y - 100, this.topRight.x, this.topRight.y - 100, this.topRight.x, this.topRight.y , this.topLeft.x, this.topLeft.y)
    this.avoidHerdTop(target, this.sec5, this.sec6, this.sec7, this.sec8);
  } else if (this.position.x > this.topRight.x && this.position.x < this.topRight.x + 100 && this.position.y > this.topRight.y && this.position.y < this.bottomRight.y) { //Right
    // Right
    quad(this.topRight.x, this.topRight.y, this.topRight.x + 100, this.topRight.y, this.bottomRight.x + 100, this.bottomRight.y , this.bottomRight.x, this.bottomRight.y)
    this.avoidHerdRight(target, this.sec6, this.sec7, this.sec8, this.sec5);
  } else if (this.position.x > this.bottomLeft.x && this.position.x < this.topRight.x && this.position.y > this.bottomLeft.y && this.position.y < this.bottomLeft.y + 100) { // bottom
    // Bottom
    quad(this.bottomLeft.x, this.bottomLeft.y, this.bottomRight.x, this.bottomRight.y, this.bottomRight.x, this.bottomRight.y + 100, this.bottomLeft.x, this.bottomLeft.y + 100)
    this.avoidHerdBottom(target, this.sec7, this.sec8, this.sec5, this.sec6);
  } else if (this.position.x > this.topLeft.x - 100 && this.position.x < this.topLeft.x && this.position.y > this.topLeft.y && this.position.y < this.bottomLeft.y) { // Left
    // Left
    quad(this.topLeft.x - 100, this.topLeft.y, this.topLeft.x, this.topLeft.y, this.bottomLeft.x, this.bottomLeft.y, this.bottomLeft.x - 100, this.bottomLeft.y);
    this.avoidHerdLeft(target, this.sec8, this.sec5, this.sec6, this.sec7);
  } else if (this.position.x > this.topLeft.x - 100 && this.position.x < this.topLeft.x && this.position.y > this.topLeft.y - 100 && this.position.y < this.topLeft.y) {
    // Top-left Corner
    quad(this.topLeft.x - 100, this.topLeft.y - 100, this.topLeft.x, this.topLeft.y - 100, this.topLeft.x, this.topLeft.y, this.topLeft.x - 100, this.topLeft.y)
    this.avoidHerdTopLeft(target, this.sec5, this.sec6, this.sec8);
  } else if (this.position.x > this.topRight.x && this.position.x < this.topRight.x + 100 && this.position.y > this.topRight.y - 100 && this.position.y < this.topRight.y) {
    // Top right corner
    quad(this.topRight.x, this.topRight.y - 100, this.topRight.x + 100, this.topRight.y - 100, this.topRight.x + 100, this.topRight.y, this.topRight.x, this.topRight.y)
    this.avoidHerdTopRight(target, this.sec6, this.sec7, this.sec5);
  } else if (this.position.x > this.bottomRight.x && this.position.x < this.bottomRight.x + 100 && this.position.y > this.bottomRight.y && this.position.y < this.bottomRight.y + 100) {
    // Bottom Right corner
    quad(this.bottomRight.x, this.bottomRight.y, this.bottomRight.x + 100, this.bottomRight.y, this.bottomRight.x + 100, this.bottomRight.y + 100, this.bottomRight.x, this.bottomRight.y + 100)
    this.avoidHerdBottomRight(target, this.sec7, this.sec6, this.sec8);
  } else if (this.position.x > this.bottomLeft.x - 100 && this.position.x < this.bottomLeft.x && this.position.y > this.bottomLeft.y && this.position.y < this.bottomLeft.y + 100) {
    // Bottom left
    quad(this.bottomLeft.x - 100, this.bottomLeft.y, this.bottomLeft.x, this.bottomLeft.y, this.bottomLeft.x, this.bottomLeft.y + 100, this.bottomLeft.x - 100, this.bottomLeft.y + 100)
    this.avoidHerdBottomLeft(target, this.sec8, this.sec5, this.sec7);
  }
}


OracleShepherd.prototype.avoidHerdTop = function (target, c1, c2, c3, c4) {
  if (target.x > c1.tl.x && target.x < c2.tr.x && target.y > c1.tl.y && target.y < c1.bl.y) {
    target = target;
  } else if (target.x > c4.tl.x && target.x < c4.tr.x && target.y > c1.bl.y && target.y < c4.bl.y) {
    this.avoidHerdBool = true;
    target.x = this.herdLeft - 20, target.y = this.herdTop - 20;
  } else if (target.x > c3.tl.x && target.x < c3.tr.x && target.y > c2.bl.y && target.y < c3.bl.y) {
    this.avoidHerdBool = true;
    target.x = this.herdRight + 20, target.y = this.herdTop - 20;
  } else {
    this.avoidHerdBool = true;
    var swingLeft = dist(this.position.x, this.position.y, this.herdLeft, this.herdTop) + dist(this.herdLeft, this.herdTop, this.herdLeft, this.herdBottom) + dist(this.herdLeft, this.herdBottom, target.x, target.y);
    var swingRight = dist(this.position.x, this.position.y, this.herdRight, this.herdTop) + dist(this.herdRight, this.herdTop, this.herdRight, this.herdBottom) + dist(this.herdRight, this.herdBottom, target.x, target.y);
    if(swingLeft < swingRight) {
      target.x = this.herdLeft - 20, target.y = this.herdTop - 20;
    } else if (swingRight < swingLeft) {
      target.x = this.herdRight + 20, target.y = this.herdTop - 20;
    }
  }
  fill(255)
  ellipse(target.x, target.y, 10,10);
  return target;
}

OracleShepherd.prototype.avoidHerdRight = function (target, c1, c2, c3, c4) {
  if (target.x > c1.tl.x && target.x < c1.tr.x && target.y > c1.tl.y && target.y < c2.bl.y) {
    target = target;
  } else if (target.x > c4.tl.x && target.x < c1.tr.x && target.y > c1.tl.y && target.y < c1.bl.y) {
    this.avoidHerdBool = true;
    target.x = this.herdRight + 20, target.y = this.herdTop - 20;
  } else if (target.x > c3.tl.x && target.x < c2.tl.x && target.y > c2.tl.y && target.y < c2.bl.y) {
    this.avoidHerdBool = true;
    target.x = this.herdRight + 20, target.y = this.herdBottom + 20;
  } else {
    this.avoidHerdBool = true;
    var swingLeft = dist(this.position.x, this.position.y, this.herdRight, this.herdBottom) + dist(this.herdRight, this.herdBottom, this.herdLeft, this.herdBottom) + dist(this.herdLeft, this.herdBottom, target.x, target.y);
    var swingRight = dist(this.position.x, this.position.y, this.herdRight, this.herdTop) + dist(this.herdRight, this.herdTop, this.herdLeft, this.herdTop) + dist(this.herdLeft, this.herdTop, target.x, target.y);
    if(swingLeft < swingRight) {
      target.x = this.herdRight + 20, target.y = this.herdBottom + 20;
    } else if (swingRight < swingLeft) {
      target.x = this.herdRight + 20, target.y = this.herdTop - 20;
    }
  }
  fill(255)
  ellipse(target.x, target.y, 10,10);
  return target;
}

OracleShepherd.prototype.avoidHerdBottom = function (target, c1, c2, c3, c4) {
  if (target.x > c2.tl.x && target.x < c1.tr.x && target.y > c1.tl.y && target.y < c1.bl.y) {
    target = target;
  } else if (target.x > c2.tl.x && target.x < c2.tr.x && target.y > c3.tl.y && target.y < c2.tl.y) {
    this.avoidHerdBool = true;
    target.x = this.herdLeft - 20, target.y = this.herdBottom + 20;
  } else if (target.x > c1.tl.x && target.x < c1.tr.x && target.y > c4.tl.y && target.y < c1.tl.y) {
    this.avoidHerdBool = true;
    target.x = this.herdRight + 20, target.y = this.herdBottom + 20;
  } else {
    this.avoidHerdBool = true;
    var swingLeft = dist(this.position.x, this.position.y, this.herdLeft, this.herdBottom) + dist(this.herdLeft, this.herdBottom, this.herdLeft, this.herdTop) + dist(this.herdLeft, this.herdTop, target.x, target.y);
    var swingRight = dist(this.position.x, this.position.y, this.herdRight, this.herdBottom) + dist(this.herdRight, this.herdBottom, this.herdRight, this.herdTop) + dist(this.herdRight, this.herdTop, target.x, target.y);
    if(swingLeft < swingRight) {
      target.x = this.herdLeft - 20, target.y = this.herdBottom + 20;
    } else if (swingRight < swingLeft) {
      target.x = this.herdRight + 20, target.y = this.herdBottom + 20;
    }
  }
  fill(255)
  ellipse(target.x, target.y, 10,10);
  return target;
}

OracleShepherd.prototype.avoidHerdLeft = function (target, c1, c2, c3, c4) {
  if (target.x > c1.tl.x && target.x < c1.tr.x && target.y > c2.tl.y && target.y < c1.bl.y) {
    target = target;
  } else if (target.x > c2.tr.x && target.x < c3.tr.x && target.y > c2.tl.y && target.y < c2.bl.y) {
    this.avoidHerdBool = true;
    target.x = this.herdLeft - 20, target.y = this.herdTop - 20;
  } else if (target.x > c1.tr.x && target.x < c4.tr.x && target.y > c4.tl.y && target.y < c4.bl.y) {
    this.avoidHerdBool = true;
    target.x = this.herdLeft - 20, target.y = this.herdBottom + 20;
  } else {
    this.avoidHerdBool = true;
    var swingLeft = dist(this.position.x, this.position.y, this.herdLeft, this.herdTop) + dist(this.herdLeft, this.herdTop, this.herdRight, this.herdTop) + dist(this.herdRight, this.herdTop, target.x, target.y);
    var swingRight = dist(this.position.x, this.position.y, this.herdLeft, this.herdBottom) + dist(this.herdLeft, this.herdBottom, this.herdRight, this.herdBottom) + dist(this.herdRight, this.herdBottom, target.x, target.y);
    if(swingLeft < swingRight) {
      target.x = this.herdLeft - 20, target.y = this.herdTop - 20;
    } else if (swingRight < swingLeft) {
      target.x = this.herdLeft - 20, target.y = this.herdBottom + 20;
    }
  }
  fill(255)
  ellipse(target.x, target.y, 10,10);
  return target;
}

OracleShepherd.prototype.avoidHerdTopLeft = function (target, c1, c2, c3) {
  if (target.x > c1.tl.x && target.x < c2.tr.x && target.y > c1.tl.y && target.y < c1.bl.y) {
    target = target;
  } else if (target.x > c1.tl.x && target.x < c1.tr.x && target.y > c1.bl.y && target.y < c3.bl.y) {
    target = target;
  } else {
    this.avoidHerdBool = true;
    var swingLeft = dist(this.position.x, this.position.y, this.herdRight, this.herdTop) + dist(this.herdRight, this.herdTop, target.x, target.y);
    var swingRight = dist(this.position.x, this.position.y, this.herdLeft, this.herdBottom) + dist(this.herdLeft, this.herdBottom, target.x, target.y);
    if(swingLeft < swingRight) {
      target.x = this.herdRight + 20, target.y = this.herdTop - 20;
    } else if (swingRight < swingLeft) {
      target.x = this.herdLeft - 20, target.y = this.herdBottom + 20;
    }
  }
  fill(255)
  ellipse(target.x, target.y, 10,10);
  return target;
}

OracleShepherd.prototype.avoidHerdTopRight = function (target, c1, c2, c3) {
  if (target.x > c1.tl.x && target.x < c1.tr.x && target.y > c1.tl.y && target.y < c2.bl.y) {
    target = target;
  } else if (target.x > c3.tl.x && target.x < c1.tr.x && target.y > c1.tl.y && target.y < c1.bl.y) {
    target = target;
  } else {
    this.avoidHerdBool = true;
    var swingLeft = dist(this.position.x, this.position.y, this.herdRight, this.herdBottom) + dist(this.herdRight, this.herdBottom, target.x, target.y);
    var swingRight = dist(this.position.x, this.position.y, this.herdLeft, this.herdTop) + dist(this.herdLeft, this.herdTop, target.x, target.y);
    if(swingLeft < swingRight) {
      target.x = this.herdRight + 20, target.y = this.herdBottom + 20;
    } else if (swingRight < swingLeft) {
      target.x = this.herdLeft - 20, target.y = this.herdTop - 20;
    }
  }
  fill(255)
  ellipse(target.x, target.y, 10,10);
  return target;
}

OracleShepherd.prototype.avoidHerdBottomRight = function (target, c1, c2, c3) {
  if (target.x > c1.tl.x && target.x < c1.tr.x && target.y > c2.tl.y && target.y < c1.bl.y) {
    target = target;
  } else if (target.x > c3.tl.x && target.x < c1.tl.x && target.y > c1.tl.y && target.y < c1.bl.y) {
    target = target;
  } else {
    this.avoidHerdBool = true;
    var swingLeft = dist(this.position.x, this.position.y, this.herdLeft, this.herdBottom) + dist(this.herdLeft, this.herdBottom, target.x, target.y);
    var swingRight = dist(this.position.x, this.position.y, this.herdRight, this.herdTop) + dist(this.herdRight, this.herdTop, target.x, target.y);
    if(swingLeft < swingRight) {
      target.x = this.herdLeft - 20, target.y = this.herdBottom + 20;
    } else if (swingRight < swingLeft) {
      target.x = this.herdRight + 20, target.y = this.herdTop - 20;
    }
  }
  fill(255)
  ellipse(target.x, target.y, 10,10);
  return target;
}

OracleShepherd.prototype.avoidHerdBottomLeft = function (target, c1, c2, c3) {
  if (target.x > c1.tl.x && target.x < c1.tr.x && target.y > c2.tl.y && target.y < c1.bl.y) {
    target = target;
  } else if (target.x > c1.tl.x && target.x < c3.tr.x && target.y > c1.tl.y && target.y < c1.bl.y) {
    target = target;
  } else {
    this.avoidHerdBool = true;
    var swingLeft = dist(this.position.x, this.position.y, this.herdLeft, this.herdTop) + dist(this.herdLeft, this.herdTop, target.x, target.y);
    var swingRight = dist(this.position.x, this.position.y, this.herdRight, this.herdBottom) + dist(this.herdRight, this.herdBottom, target.x, target.y);
    if(swingLeft < swingRight) {
      target.x = this.herdLeft - 20, target.y = this.herdTop - 20;
    } else if (swingRight < swingLeft) {
      target.x = this.herdRight + 20, target.y = this.herdBottom + 20;
    }
  }
  fill(255)
  ellipse(target.x, target.y, 10,10);
  return target;
}

OracleShepherd.prototype.drawShepGoals = function () {
  fill(255,30,30)
  stroke(0);
  for(var i = 0; i < this.shepGoals.length; i++) {
    ellipse(this.shepGoals[i].x, this.shepGoals[i].y, 10 ,10)
  }
}

OracleShepherd.prototype.checkGoal = function (hc, g) {
  if (dist(hc.x, hc.y, g.x, g.y) < 50 && this.goalCounter < this.shepGoals.length -1) {
    this.goalCounter++;
  }
}

OracleShepherd.prototype.findClosestAnimal = function (animals, c) {
  closest = 40000;
  for (var i = 0; i < animals.length; i++) {
    shep2Animal = Math.abs(dist(this.position.x, this.position.y, animals[i].position.x, animals[i].position.y)); // Find distance to each animal
    if (shep2Animal < closest) { // if this is the shortest distance
      // closestAnimal = herd[i];
      closest = shep2Animal;     // distance is saved as closest
      closestDist = Math.abs(dist(c.x, c.y, animals[i].position.x, animals[i].position.y));
    }
  }
  return closestDist;
}

OracleShepherd.prototype.getGoodHeading = function (hc, g) {

  let v0 = createVector(hc.x, hc.y);
  let v1 = createVector(g.x - hc.x, g.y - hc.y);

  let myHeading = v1.heading();
  //
  // noStroke();
  // text(
  //  'vector heading: ' +
  //    myHeading.toFixed(2) +
  //    ' radians',50,50,90,50);

  return myHeading;
}

OracleShepherd.prototype.checkDist = function (animals) {
  var totalAvgDist = 0;
  var avgDist = 0;
  for(var i = 0; i < animals.length; i++) {
    for(var j = 0; j < animals.length; j++) {
      var d = dist(animals[i].position.x, animals[i].position.y, animals[j].position.x, animals[j].position.y);
      avgDist += d;
    }
    avgDist = avgDist/animals.length;
    totalAvgDist += avgDist
  }
  totalAvgDist = totalAvgDist / animals.length;
  return totalAvgDist;
}

OracleShepherd.prototype.tooClose = function (animals) {
  let count = 0;
  for (var i = 0; i < animals.length; i++) {
    if(dist(this.position.x, this.position.y, animals[i].position.x, animals[i].position.y) < 20) {
      count++;
    }
  }
  if(count > 0) {
    return true;
  } else {
    return false;
  }
}

OracleShepherd.prototype.redAlert = function (target) {
  // console.log("RED")
  let tl = dist(this.position.x, this.position.y, this.topLeft.x, this.topLeft.y);
  let tr = dist(this.position.x, this.position.y, this.topRight.x, this.topRight.y);
  let bl = dist(this.position.x, this.position.y, this.bottomLeft.x, this.bottomLeft.y);
  let br = dist(this.position.x, this.position.y, this.bottomRight.x, this.bottomRight.y);

  let shortestDist = Math.min(tl, tr, bl, br);
  if (shortestDist == tl) {
    target.x = this.topLeft.x - 10, target.y = this.topLeft.y - 10;
  } else if (shortestDist == tr) {
    target.x = this.topRight.x + 10, target.y = this.topRight.y - 10;
  } else if (shortestDist == bl) {
    target.x = this.bottomLeft.x - 10, target.y = this.bottomLeft.y + 10;
  } else if (shortestDist == br) {
    target.x = this.bottomRight.x + 10, target.y = this.bottomRight.y - 10;
  }
  return target;
}

OracleShepherd.prototype.checkForStatues = function (animals, center) {
  let count = 0;
  let n = this.findClosestAnimal(animals, center);
  for (var i = 0; i < animals.length; i++) {
    if(animals[i].speed < 1.1 && dist(this.position.x, this.position.y, animals[i].position.x, animals[i].position.y) == n) {
      count++;
      fill(30,30,30,30)
      ellipse(animals[i].position.x, animals[i].position.y, 30, 30)
    }
  }
  if (count > 0) {
    console.log("I run")
    return true;
  } else {
    return false;
  }
}
