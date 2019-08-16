class SingleGPSUAV extends UAVAgent {
  constructor(startPos, shepGoals) {
    super(startPos, shepGoals);
    this.acceleration = createVector(0,0);     // Creating starting variables
    this.velocity = createVector(0,0);
    this.position = createVector(startPos.x, startPos.y);
    this.maxForce = 0.6;
    this.maxspeed = 0.7;
    this.movingUp = false; // ----- Herd Moving variables
    this.target = createVector(0,0);
    this.targetLock = false;
    this.oldTarget = createVector(0,0);
    this.oldTargetAnimal = {
      position: createVector(2000, 2000)
    }
    this.switchingActions = false;
    this.collectBool = true;
    this.moveBool = false;
    this.shepGoals = shepGoals; // ----- Goal variables
    this.goalCounter = 0;
    this.oldMovement = "starting";
    this.avoidHerdBool = false; // ----- Avoiding variables
    this.avoiding = false;
    this.wait = true;
    this.firstAvoid = false;
    this.timestep = 0; // ----- Counters
    this.goodMovement = 0;
    this.correctHeading = 0;
  }
}

// Call methods for each shepherd
SingleGPSUAV.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
  this.herdAnimals(herd);
  if(lineCheck.checked() == true && herd.length > 0) { // Display shepherd tagets/lines
    this.displayShepLines(herd);
  }
  if (shepGoalCheck.checked() == true) { // Display Shepherd Goal Points
    this.drawShepGoals();
  }
  if (herd.length > 0) { // Count time steps
    this.timestep++;
  }
}

SingleGPSUAV.prototype.herdAnimals = function (herd) {
  if (herd.length == 0) { // When no animals, stop UAV movement
    this.maxspeed = 0;
  }
  var bun = this.bunched(herd); // Check if herd is bunched
  var too = this.tooClose(herd);

  if (bun == true) {  	        // If bunched, call move function
    var mov = this.moveAnimals(herd);
    this.applyForce(mov);
    this.collectBool = false;  // Booleans for UI output
    this.moveBool = true;
  }

  if (bun == false) { // If false, call collecting function
    var avgDist = this.checkDist(herd)
    var non = this.nonMover(herd);
    if (avgDist > 120 || non == true) { // FFHC Collect
      var col = this.advanceCollect(herd);
    } else { // ZZ Collect
      var col = this.collectAnimals(herd);
    }

    this.applyForce(col);
    this.collectBool = true; // Booleans for UI output
    this.moveBool = false;
  }

  if(too == true) {
    this.maxspeed = 0.1;
  }

}

// ----------- ZIG-ZAG COLLECTING -----------
SingleGPSUAV.prototype.collectAnimals = function (herd) {
  this.oldMovement = "collecting"; // Set current movement
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter];

  // Functions to deal with stressor aversion if necessary
  if (environment.vocalizing() == true && herd.length > 0) {
    this.avoiding = true;
    if(this.wait = "false") {
      this.maxspeed = 0.5;
    } else {
      this.maxspeed = 0.5;
      goal = this.avoidObstacle(center, goal, herd);
    }
  } else if (environment.vocalizing() == false && herd.length > 0) {
    this.wait = false;
    this.maxspeed = 0.8;
    this.avoiding = false;
  }

  var myLine = this.findClosestAnimal(herd, center);
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
   this.targetInBounds(target);
   this.outOfHerd(target);
   // this.targetInBounds(target);
   // console.log("Target after OOH: " + target);
   this.targetInHerd(target);
   // this.targetInBounds(target);
   // console.log("Target after TIH: " + target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 1){
     this.movingUp = true;
   }
   return steer;
 } else if (this.movingUp == true) {
   var target = createVector(pzp2.x,pzp2.y);
   this.targetInBounds(target);
   this.outOfHerd(target);
   // this.targetInBounds(target);
   // console.log("Target after OOH: " + target);
   this.targetInHerd(target);
   // this.targetInBounds(target);
   // console.log("Target after TIH: " + target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 1) {
     this.movingUp = false;
   }
   return steer;
 }
}

SingleGPSUAV.prototype.advanceCollect = function (herd) {
  this.oldMovement = "collecting"; // Set movement type to collecting
  this.avoidHerdBool = false;
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY);          // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter];      // Current Goal Point


  // Functions to deal with stressor avoidance
  if (environment.vocalizing() == true && herd.length > 0) {
    this.avoiding = true;
    this.maxspeed = 0.5;
    goal = this.avoidObstacle(center, goal, herd); // function to switch target points
  } else if (environment.vocalizing() == false && herd.length > 0) {
    this.maxspeed = 0.8;
    this.avoiding = false;
  }

  // Locate furthest animal from centre of herd
  var furthestPos = 0;
  for (var i = 0; i < herd.length; i++) {
    currentDist = dist(herd[i].position.x, herd[i].position.y, herdX, herdY);
    if (currentDist > furthestPos) {
      furthestPos = currentDist;
      this.targetAnimal = herd[i]; // Make it the targeted animal
    }
  }

  // Draw circle around target animal
  if (herd.length > 0) {
    fill(255,0,0, 20);
    stroke(0);
    ellipse(this.targetAnimal.position.x, this.targetAnimal.position.y, 20,20);
    ellipse(this.oldTargetAnimal.position.x, this.oldTargetAnimal.position.y, 20,20)
  }

  //
  var comp1 = dist(this.targetAnimal.position.x, this.targetAnimal.position.y, herdX, herdY);
  var comp2 = dist(this.oldTargetAnimal.position.x, this.oldTargetAnimal.position.y, herdX, herdY);

  if(Math.abs(comp1 - comp2) < 30) { // Keep old target animal if distance to
    this.targetAnimal = this.oldTargetAnimal;
  }

  let fz2hc = this.adjustLineLen(this.targetAnimal.position, center, 40);
  let pz2hc = this.adjustLineLen(this.targetAnimal.position, center, 70);

  // Get co-ords for flight zone line points
  let fzp10 = this.createPCo1(fz2hc.x,fz2hc.y,pz2hc.x,pz2hc.y);
  let fzp20 = this.createPCo2(fz2hc.x,fz2hc.y,pz2hc.x,pz2hc.y);
  //Get co-ords for pressure zone line points
  let pzp10 = this.createPCo1(pz2hc.x,pz2hc.y,fz2hc.x, fz2hc.y);
  let pzp20 = this.createPCo2(pz2hc.x,pz2hc.y,fz2hc.x, fz2hc.y);

  if (herd.length > 0) { // Draw herding lines/target points
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

  this.oldTargetAnimal = this.targetAnimal; //
  herdHeading = this.checkHeading(herd);

 if (this.movingUp == false) {
   if (environment.avgSpeed() < 0.30 || !(-0.50 < herdHeading && herdHeading < 0.50)) {
     var target = createVector(fzp10.x,fzp10.y);
   } else {
     var target = createVector(pzp10.x,pzp10.y);
   }
   this.targetInBounds(target);
   this.outOfHerd(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
     this.movingUp = !this.movingUp;
   }
   return steer;
 } else if (this.movingUp == true) {
   if (environment.avgSpeed() < 0.30 || !(-0.50 < herdHeading && herdHeading < 0.50)) {
     var target = createVector(fzp20.x,fzp20.y);
   } else {
     var target = createVector(pzp20.x,pzp20.y);
   }
   this.targetInBounds(target);
   this.outOfHerd(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 5) {
     this.movingUp = !this.movingUp;
   }
   return steer;
 }
}

SingleGPSUAV.prototype.moveAnimals = function (herd) {
  this.avoidHerdBool = false;
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter];
  this.checkGoal(center, goal);

  if (environment.vocalizing() == true && herd.length > 0) {
    if (this.oldMovement == 'moving') {
      this.firstAvoid = true;
    }
    this.oldMovement = 'avoiding';
    this.avoiding = true;
    goal = this.avoidObstacle(center, goal, herd);
    this.maxspeed = 0.5;
  } else if (environment.vocalizing() == false && herd.length > 0) {
    if(this.avoiding == true) {
      this.switchingActions = true;
      this.avoiding = false;
    }
    this.maxspeed = 0.8;
    this.avoiding = false;
  }

  var myLine = this.findClosestAnimal(herd, center);
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

  herdHeading = this.checkHeading(herd);

  this.correctHeading = this.getGoodHeading(center, goal);
  if (environment.avgSpeed() > 0.30 && environment.avgSpeed() < 0.50 && Math.abs(this.correctHeading - herdHeading) < 0.50) {
    this.goodMovement += 1;
  }

  if(this.firstAvoid == true) {
    console.log("First Avoid true")
    if (dist(fzp1.x, fzp1.y, this.shepGoals[this.goalCounter].x, this.shepGoals[this.goalCounter].y) > dist(fzp2.x, fzp2.y, this.shepGoals[this.goalCounter].x, this.shepGoals[this.goalCounter].y)) {
      this.movingUp = false;
      this.firstAvoid = false;
      // this.moveOutofFli = true;
    } else if (dist(fzp2.x, fzp2.y, this.shepGoals[this.goalCounter].x, this.shepGoals[this.goalCounter].y) > dist(fzp1.x, fzp1.y, this.shepGoals[this.goalCounter].x, this.shepGoals[this.goalCounter].y)) {
      this.movingUp = true;
      this.firstAvoid = false;
      // this.moveOutofFli = true;
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

  let slo = this.slowForGoal(center, herd);
  if (slo == true) {
    this.maxspeed = 0.2;
  }

  let statues = this.checkForStatues(herd, center);
  if (this.movingUp == false) {
    if (environment.avgSpeed() < 0.30 || !(-0.50 < herdHeading && herdHeading < 0.50)) {
      var target = createVector(fzp1.x,fzp1.y);
    } else {
      var target = createVector(pzp1.x,pzp1.y);
    }
    if (statues == true) {
      var target = createVector(this.nudge.x, this.nudge.y);
    }
    this.targetInBounds(target);
    if (this.oldMovement != "moving") {
      this.outOfHerd(target);
    }
    stroke(255)
    // fill(0,255,0)
    // ellipse(target.x, target.y, 15,15)
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
      this.movingUp = !this.movingUp;
      this.firstAvoid = false;
      this.switchingActions = false;
      this.oldMovement = 'moving';
      // this.moveOutofFli = false;
    }
    return steer;
  } else if (this.movingUp == true) {
      if (environment.avgSpeed() < 0.30 || !(-0.50 < herdHeading && herdHeading < 0.50)) {
        var target = createVector(fzp2.x,fzp2.y);
      } else {
        var target = createVector(pzp2.x,pzp2.y);
      }
      if (statues == true) {
        var target = createVector(this.nudge.x, this.nudge.y);
      }
    this.targetInBounds(target);
    if (this.oldMovement != "moving") {
      this.outOfHerd(target);
    }
    // stroke(255)
    // fill(0,255,0)
    // ellipse(target.x, target.y, 15,15)
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
      this.movingUp = !this.movingUp;
      this.firstAvoid = false;
      this.switchingActions = false;
      this.oldMovement = 'moving';
      // this.moveOutofFli = false;
    }
    return steer;
  }
}

SingleGPSUAV.prototype.checkHeading = function (herd) {
  totalHeading = 0;
  for (var i = 0; i < herd.length; i++) {
    totalHeading += herd[i].velocity.heading();
  }
  averageHeading = totalHeading/herd.length;
  return averageHeading;
}

SingleGPSUAV.prototype.getGoodHeading = function (hc, g) {

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

SingleGPSUAV.prototype.checkForStatues = function (herd, center) {
  let count = 0;
  let n = this.findClosestAnimalToUAV(herd, center);
  for (var i = 0; i < herd.length; i++) {
    if(herd[i].velocity.mag() < 0.15 && dist(this.position.x, this.position.y, herd[i].position.x, herd[i].position.y) == n) {
      count++;
      fill(30,30,30,30)
      ellipse(herd[i].position.x, herd[i].position.y, 30, 30)
      this.nudge = createVector(herd[i].position.x, herd[i].position.y);
    }
  }
  if (count > 0) {
    console.log("I run")

    return true;
  } else {
    return false;
  }
}
