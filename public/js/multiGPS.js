// Shepherd Class
// Create shepherd attributes
function MultiGPSShepherd(x, y, gx, gy, moving, uavNum) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-1,1),random(-1,1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxForce = 0.3;
  this.maxspeed = 0.7;
  this.movingUp = moving;
  this.target = createVector(0,0);
  this.targetLock = false;
  this.oldTarget = createVector(0,0);
  // this.targetDir = "right";
  this.timestep = 0;
  this.goalX = gx;
  this.goalY = gy;
  this.oldTargetAnimal = {
    position: createVector(2000, 2000)
  }
  this.uavNum = uavNum;
}

// Call methods for each shepherd
MultiGPSShepherd.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
  this.herdAnimals(herd);
  if(lineCheck.checked() == true) {
    this.displayShepLines();
  }
  this.timestep++;
  // if (this.timestep % 50 == 0){
  //   console.log("Timestep: " + this.timestep);
  // }

}

// Apply each behavioural rule to each animal
MultiGPSShepherd.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

MultiGPSShepherd.prototype.herdAnimals = function (herd) {
  this.maxspeed = uavSpeedSlider.value();
  var bun = this.bunched(herd);
  if (bun == true) {
    var mov = this.moveAnimals(herd);
    this.applyForce(mov);
  }

  if (bun == false) {
    // var col = this.collectAnimals(herd);
    // this.applyForce(col);

    // var col = this.collectAnimals(herd);
    // this.applyForce(col);
    var adCol = this.advanceCollect(herd);
    this.applyForce(adCol);
    this.collectBool = true;
    this.moveBool = false;
  }
}

// Method to update location
MultiGPSShepherd.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// Method to prevent shepherd from leaving enclosure
MultiGPSShepherd.prototype.borders = function () {
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
MultiGPSShepherd.prototype.render = function() {
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

MultiGPSShepherd.prototype.bunched = function (herd) {
  this.herdBottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdTop = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdLeft = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  this.herdRight = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));

  this.topLeft = createVector(this.herdLeft, this.herdTop);
  this.topRight =  createVector(this.herdRight, this.herdTop);
  this.bottomLeft =  createVector(this.herdLeft, this.herdBottom);
  this.bottomRight =  createVector(this.herdRight, this.herdBottom);

  fill(0,255,255)
  ellipse(this.herdLeft, this.herdTop)

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

  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  // line(this.shepGoals[this.goalCounter].x, this.shepGoals[this.goalCounter].y, herdX, herdY);

  herDist = dist(this.herdLeft, this.herdTop, this.herdRight, this.herdBottom);
  if (herDist < 200) {
    return true;
  } else {
    return false;
  }
}

MultiGPSShepherd.prototype.collectAnimals = function (herd) {
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(this.goalX,this.goalY); // Location of exit

  if (environment.vocalizing() == true) {
    goal = this.avoidObstacle(center, goal);
  }

  animalFL = Math.abs(herdX - this.herdLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.herdRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.herdTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.herdBottom); // Cords of animal furthest bottom
  furthestAnimal = Math.max(animalFL, animalFR, animalFT, animalFB);
  cAnimal = Math.min(animalFL, animalFR, animalFT, animalFB)

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
   var target = createVector(pzp2.x,pzp2.y);
   this.targetInBounds(target);
   this.outOfHerd(target);
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

MultiGPSShepherd.prototype.moveAnimals = function (herd) {

  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(this.goalX,this.goalY); // Location of exit

  if (environment.vocalizing() == true) {
    goal = this.avoidObstacle(center, goal);
  }

  animalFL = Math.abs(herdX - this.herdLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.herdRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.herdTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.herdBottom); // Cords of animal furthest bottom
  furthestAnimal = Math.max(animalFL, animalFR, animalFT, animalFB);


  var myLine = this.findClosestAnimal(herd, center);
  console.log("Furthest: ", furthestAnimal + 15);
  console.log("myLine: ", myLine + 20);

  // Lines to flight zone and pressure zone
  let l2fz = this.adjustLineLen(center,goal,myLine + 20);
  let l2pz = this.adjustLineLen(center,goal,myLine + 60);


  let cpfz = this.adjustLineLen(center,goal,furthestAnimal + 30);
  let cppz = this.adjustLineLen(center,goal,furthestAnimal + 60);

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
  ellipse(cpfz.x, cpfz.y, 20, 20)

  if (this.movingUp == false) {
    if (this.uavNum == 2) {
      if (environment.avgSpeed() < 0.35 || !(-0.75 < herdHeading && herdHeading < 0.75)) {
        var target = createVector(fzp1.x,fzp1.y);
      } else {
        var target = createVector(pzp1.x,pzp1.y);
      }
    } else if (this.uavNum == 1) {
      if (environment.avgSpeed() < 0.35 || !(-0.75 < herdHeading && herdHeading < 0.75)) {
        var target = createVector(cpfz.x,cpfz.y);
      } else {
        var target = createVector(cppz.x,cppz.y);
      }
    }
    // console.log("target: ", target)
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
    if (this.uavNum == 2) {
      if (environment.avgSpeed() < 0.35 || !(-0.75 < herdHeading && herdHeading < 0.75)) {
        var target = createVector(cpfz.x,cpfz.y);
      } else {
        var target = createVector(cppz.x,cppz.y);
      }
    } else if (this.uavNum == 1) {
      if (environment.avgSpeed() < 0.35 || !(-0.75 < herdHeading && herdHeading < 0.75)) {
        var target = createVector(fzp2.x,fzp2.y);
      } else {
        var target = createVector(pzp2.x,pzp2.y);
      }
    }
    // console.log("target: ", target)
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

MultiGPSShepherd.prototype.advanceCollect = function (herd, uavNum) {
  this.avoidHerdBool = false;
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(this.goalX,this.goalY); // Location of exit
  // var goal = this.shepGoals[this.goalCounter];

  // if (environment.vocalizing() == true) {
  //   goal = this.avoidObstacle(center, goal);
  // }

  if (this.uavNum == 1) {
    var furthestPos1 = 0;
    for (var i = 0; i < herd.length; i++) {
      currentDist = dist(herd[i].position.x, herd[i].position.y, herdX, herdY);
      if (currentDist > furthestPos1 && herd[i].position.y > herdY) {
        furthestPos1 = currentDist;
        this.targetAnimal = herd[i];
      }
    }
  }
  if (this.uavNum == 2) {
    var furthestPos2 = 0;
    for (var i = 0; i < herd.length; i++) {
      currentDist = dist(herd[i].position.x, herd[i].position.y, herdX, herdY);
      if (currentDist > furthestPos2 && herd[i].position.y < herdY) {
        furthestPos2 = currentDist;
        this.targetAnimal = herd[i];
      }
    }
  }
  if (herd.length > 0) {
    fill(255,0,0, 20);
    stroke(0);
    ellipse(this.targetAnimal.position.x, this.targetAnimal.position.y, 20,20);
  }

  var comp1 = dist(this.targetAnimal.position.x, this.targetAnimal.position.y, herdX, herdY);
  var comp2 = dist(this.oldTargetAnimal.position.x, this.oldTargetAnimal.position.y, herdX, herdY);

  if(Math.abs(comp1 - comp2) < 30) {
    this.targetAnimal = this.oldTargetAnimal;
  }

  if (herd.length > 0) {
    fill(255,0,0, 20);
    stroke(0);
    ellipse(this.targetAnimal.position.x, this.targetAnimal.position.y, 20,20);
    ellipse(center.x, center.y, 10,10);
    line(center.x, center.y, this.targetAnimal.position.x, this.targetAnimal.position.y);
  }

  let fz2hc = this.adjustLineLen(this.targetAnimal.position, center, 40);
  let pz2hc = this.adjustLineLen(this.targetAnimal.position, center, 70);
  if (herd.length > 0) {
    line(pz2hc.x, pz2hc.y, center.x, center.y);
    fill(0,255,0)
    stroke(0,255,0);
    line(fz2hc.x, fz2hc.y, center.x, center.y);
  }

  // Get co-ords for flight zone line points
  let fzp10 = this.createPCo1(fz2hc.x,fz2hc.y,pz2hc.x,pz2hc.y);
  let fzp20 = this.createPCo2(fz2hc.x,fz2hc.y,pz2hc.x,pz2hc.y);
  //Get co-ords for pressure zone line points
  let pzp10 = this.createPCo1(pz2hc.x,pz2hc.y,fz2hc.x, fz2hc.y);
  let pzp20 = this.createPCo2(pz2hc.x,pz2hc.y,fz2hc.x, fz2hc.y);

  if (herd.length > 0) {
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
   if ((this.position.x - 2 < target.x && target.x < this.position.x + 2) && (this.position.y - 2 < target.y && target.y < this.position.y + 2)){
     this.movingUp = true;
     // console.log("Hit it");
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
   if ((this.position.x - 2 < target.x && target.x < this.position.x + 2) && (this.position.y - 2 < target.y && target.y < this.position.y + 2)){
     this.movingUp = false;
     // console.log("Hit it");
   }
   return steer;
 }
}

MultiGPSShepherd.prototype.targetInBounds = function (target) {
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

MultiGPSShepherd.prototype.displayShepLines = function () {
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(this.goalX,this.goalY); // Location of exit

  if (environment.vocalizing() == true) {
    goal = this.avoidObstacle(center, goal);
  }

  animalFL = Math.abs(herdX - this.herdLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.herdRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.herdTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.herdBottom); // Cords of animal furthest bottom
  furthestAnimal = Math.max(animalFL, animalFR,animalFT,animalFB);

  // Lines to flight zone and pressure zone
  let l2fz = this.adjustLineLen(center,goal,furthestAnimal+20);
  let l2pz = this.adjustLineLen(center,goal,furthestAnimal+60);

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

MultiGPSShepherd.prototype.avoidObstacle = function (center, goal) {
  if (center.y < height/2) {
    var avoidPointCentre = this.createPCo2(center.x, center.y, goal.x,goal.y); //  Use PCo2 for else statement
    this.targetInBounds(avoidPointCentre);
  } else {
    var avoidPointCentre = this.createPCo1(center.x, center.y, goal.x,goal.y); //  Use PCo2 for else statement
    this.targetInBounds(avoidPointCentre);
  }
  return avoidPointCentre;
}

// Create point a for perpindicular lines
MultiGPSShepherd.prototype.createPCo1 = function (x1,y1,x2,y2) {
  xDiff = x1 - x2;
  yDiff = y1 - y2;
  px1 = x1 - yDiff;
  py1 = y1 + xDiff;
  point = createVector(px1, py1);
  return point;
}

// Create point b for perpindicular lines
MultiGPSShepherd.prototype.createPCo2 = function (x1,y1,x2,y2) {
  xDiff = x1 - x2;
  yDiff = y1 - y2;
  px2 = x1 + yDiff;
  py2 = y1 - xDiff;
  point = createVector(px2,py2);
  return point;
}

MultiGPSShepherd.prototype.adjustLineLen = function (p1,p2,d) {
  // extend line from goal to herd centre to fz and pre zone
  let originalDist = int(dist(p1.x, p1.y, p2.x,p2.y));
  lp1 = p1.x + (p1.x - p2.x) / originalDist * (d);
  lp2 = p1.y + (p1.y - p2.y) / originalDist * (d);
  point = createVector(lp1,lp2);
  return point;
}
MultiGPSShepherd.prototype.checkHeading = function (herd) {
  totalHeading = 0;
  for (var i = 0; i < herd.length; i++) {
    totalHeading += herd[i].velocity.heading();
  }
  averageHeading = totalHeading/ herd.length;
  return averageHeading;
}

MultiGPSShepherd.prototype.outOfHerd = function (target) { //In herd
  fill(241, 244, 66, 100);
  stroke(66, 66, 244);
  if (this.position.x > this.topLeft.x && this.position.x < this.topRight.x && this.position.y > this.topLeft.y && this.position.y < this.bottomLeft.y) {
    stroke(66, 66, 244); // Around herd
    fill(255,30,30,100);
    quad(this.topLeft.x, this.topLeft.y, this.topRight.x, this.topRight.y, this.bottomRight.x, this.bottomRight.y, this.bottomLeft.x, this.bottomLeft.y);
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
    this.avoidHerdBottomRight(target, this.sec8, this.sec5, this.sec7);
  }
}

MultiGPSShepherd.prototype.avoidHerdTop = function (target, c1, c2, c3, c4) {
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

MultiGPSShepherd.prototype.avoidHerdRight = function (target, c1, c2, c3, c4) {
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

MultiGPSShepherd.prototype.avoidHerdBottom = function (target, c1, c2, c3, c4) {
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

MultiGPSShepherd.prototype.avoidHerdLeft = function (target, c1, c2, c3, c4) {
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

MultiGPSShepherd.prototype.avoidHerdTopLeft = function (target, c1, c2, c3) {
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

MultiGPSShepherd.prototype.avoidHerdTopRight = function (target, c1, c2, c3) {
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

MultiGPSShepherd.prototype.avoidHerdBottomRight = function (target, c1, c2, c3) {
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

MultiGPSShepherd.prototype.avoidHerdBottomLeft = function (target, c1, c2, c3) {
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

MultiGPSShepherd.prototype.findClosestAnimal = function (herd, c) {
  closest = 4000;
  for (var i = 0; i < herd.length; i++) {
    shep2Animal = Math.abs(dist(this.position.x, this.position.y, herd[i].position.x, herd[i].position.y)); // Find distance to each animal
    if (shep2Animal < closest) { // if this is the shortest distance
      closest = shep2Animal;     // distance is saved as closest
      closestDist = Math.abs(dist(c.x, c.y, herd[i].position.x, herd[i].position.y));
    }
  }
  return closestDist;
}
