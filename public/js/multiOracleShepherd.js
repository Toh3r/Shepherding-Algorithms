// Shepherd Class
// Create shepherd attributes
class MultiOracleShepherd extends UAVAgent  {  // Passing through starting co-ords and goal co-ords
  constructor (startPos, moving, uavNum, shepGoals) {
    super (startPos, moving, uavNum, shepGoals);
    this.acceleration = createVector(0,0); // Startigng acceleration of 0
    this.velocity = createVector(0,0);     // Starting velocity of 0
    this.position = createVector(startPos.x, startPos.y);
    this.maxForce = 0.6;
    this.maxspeed = 0.7;
    this.movingUp = moving;
    this.target = createVector(0,0);
    this.targetLock = false;
    this.oldTarget = createVector(0,0);
    this.oldTargetAnimal = {
      position: createVector(2000, 2000)
    }
    this.timestep = 0;
    this.shepGoals = shepGoals; // ----- Goal variables
    this.goalCounter = 0;
    this.uavNum = uavNum;
    this.oldMovement = "starting";
    this.oldAnimals = [];
    this.switchingActions = false;
    this.avoidHerdBool = false; // ----- Avoiding variables
    this.avoiding = false;
    this.wait = true;
    this.firstAvoid = false;
    if (this.uavNum == 1) {
      this.gotToAnimal1 = true;
    } else if (this.uavNum == 1) {
      this.gotToAnimal1 = false;
    }
    this.AC_Counter = 0;
    this.oldTar = {
      position: createVector(startPos.x, startPos.y),
      id: createVector(0,0)
    }
    this.goodMovement = 0;
    this.correctHeading = 0;
  }
}

// Call methods for each shepherd
MultiOracleShepherd.prototype.run = function(oracles) {
  this.update();
  this.borders();
  this.render();
  var currentAnimals = oracles[0].animals;
  if (oracles[0].targetNum == oracles[0].numSectors || oracles[0].targetNum == 0 || oracles[0].following == true) {
    if(currentAnimals.length != 0) {
      this.oldAnimals.length = 0;
      this.herdAnimals(currentAnimals, oracles[0]);
      this.saveOldPositions(currentAnimals);
      if(lineCheck.checked() == true) {
        this.displayShepLines(currentAnimals);
      }
    }
  } else if (this.oldAnimals.length > 0) {
    this.herdAnimals(this.oldAnimals, oracles[0]);
    if(lineCheck.checked() == true) {
      this.displayShepLines(this.oldAnimals);
    }
  }
  else if (this.oldAnimals.length == 0) {
    this.maxspeed = 1.2;
    var pat = this.patrol(oracles[0]);
    this.applyForce(pat);
  }

  if(oracles[0].maxspeed == 0) {
    this.maxspeed = 0;
  }
}

MultiOracleShepherd.prototype.herdAnimals = function (animals, oracle) {
  var bun = this.bunched(animals);
  var too = this.tooClose(animals);

  if (oracle.following == true) {  	        // If bunched, call move function
    var mov = this.moveAnimals(animals);
    this.applyForce(mov);
    this.collectBool = false;  // Booleans for UI output
    this.moveBool = true;
  } else { // If false, call collecting function
    var col = this.advanceCollect(animals, oracle);
    this.applyForce(col);
    this.collectBool = true; // Booleans for UI output
    this.moveBool = false;
  }

  if(too == true) {
    this.maxspeed = 0.2;
  }
}

MultiOracleShepherd.prototype.patrol = function (oracle) {
  var orTarXString = oracle.isForShep.id.x;
  var orTarPosX = oracle.isForShep.position.x;
  var orTarPosY = oracle.isForShep.position.y;
  if (orTarXString != this.oldTarX && oracle.animals.length == 0) {
    this.goToEmpty = true;
    this.pPos = Number(this.oldTarPos);
  }
  if (this.goToEmpty == true) {
    var target = createVector(orTarPosX, orTarPosY);
  } else {
    var target = createVector(this.position.x, this.position.y);
  }
  var desired = p5.Vector.sub(target, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  if (dist(this.position.x, this.position.y, target.x, target.y) < 2 || oracle.animals.length > 0){
    this.goToEmpty = false;
  }
  this.oldTarX = orTarXString;
  this.oldTarPos = orTarPosX;
  return steer;
}

MultiOracleShepherd.prototype.collectAnimals = function (animals) {
  this.oldMovement = "collecting"; // Set current movement
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter];
  this.maxspeed = 0.8;


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
   this.targetInBounds(target);
   this.targetInHerd(target);
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
   var target = createVector(pzp2.x,pzp2.y);
   this.targetInBounds(target);
   this.targetInHerd(target);
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

MultiOracleShepherd.prototype.advanceCollect = function (animals, oracle) {
  this.oldMovement = "collecting"; // Set movement type to collecting
  this.avoidHerdBool = false;
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter]; // Location of exit
  this.maxspeed = 0.8;

  if (Math.abs(this.herdLeft - this.herdRight) > Math.abs(this.herdTop - this.herdBottom)) { // --------- change
      var furthestPos1 = 0;
      for (var i = 0; i < animals.length; i++) {
        currentDist = dist(animals[i].position.x, animals[i].position.y, herdX, herdY);
        if (currentDist > furthestPos1 && animals[i].position.x > herdX) {
          furthestPos1 = currentDist;
          this.targetAnimal1 = animals[i];
        }
      }
      var furthestPos2 = 0;
      for (var i = 0; i < animals.length; i++) {
        currentDist = dist(animals[i].position.x, animals[i].position.y, herdX, herdY);
        if (currentDist > furthestPos2 && animals[i].position.x < herdX) {
          furthestPos2 = currentDist;
          this.targetAnimal2 = animals[i];
        }
      }
  } else {
      var furthestPos1 = 0;
      for (var i = 0; i < animals.length; i++) {
        currentDist = dist(animals[i].position.x, animals[i].position.y, herdX, herdY);
        if (currentDist > furthestPos1 && animals[i].position.y > herdY) {
          furthestPos1 = currentDist;
          this.targetAnimal1 = animals[i];
        }
      }
      var furthestPos2 = 0;
      for (var i = 0; i < animals.length; i++) {
        currentDist = dist(animals[i].position.x, animals[i].position.y, herdX, herdY);
        if (currentDist > furthestPos2 && animals[i].position.y < herdY) {
          furthestPos2 = currentDist;
          this.targetAnimal2 = animals[i];
        }
      }
  }

  if (this.gotToAnimal1 == true) {
    this.targetAnimal = this.targetAnimal1;
  } else {
    this.targetAnimal = this.targetAnimal2;
  }

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

 if (this.movingUp == false) {
   var target = createVector(fzp10.x,fzp10.y);
   this.targetInBounds(target);
   this.outOfHerd(target);
   fill(255,255,0);
   stroke(0)
   ellipse(target.x, target.y, 30,30)
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
     this.movingUp = true;
     this.AC_Counter++;
     if (this.AC_Counter == 2) {
       this.gotToAnimal1 = !this.gotToAnimal1;
       this.AC_Counter = 0;
     }
   }
   return steer;
 } else if (this.movingUp == true) {
   var target = createVector(fzp20.x,fzp20.y);
   this.targetInBounds(target);
   this.outOfHerd(target);
   fill(255,255,0);
   stroke(0)
   ellipse(target.x, target.y, 30,30)
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (dist(this.position.x, this.position.y, target.x, target.y) < 5){
     this.movingUp = false;
     this.AC_Counter++;
     if (this.AC_Counter == 2) {
       this.gotToAnimal1 = !this.gotToAnimal1;
       this.AC_Counter = 0;
     };
   }
   return steer;
 }
}

MultiOracleShepherd.prototype.moveAnimals = function (animals) {
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter];
  this.checkGoal(center, goal);
  this.maxspeed = 0.8;

  if (pathRadio.value() == 1) {
    if (environment.vocalizing() == true && animals.length > 0) {
    if (this.oldMovement == 'moving') {
      this.firstAvoid = true;
    }
    this.oldMovement = 'avoiding';
    this.avoiding = true;
    goal = this.avoidObstacle(center, goal, animals);
    this.maxspeed = 0.5;
    } else if (environment.vocalizing() == false && animals.length > 0) {
      if(this.avoiding == true) {
        this.switchingActions = true;
        this.avoiding = false;
      }
      this.maxspeed = 0.8;
      this.avoiding = false;
    }
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

  let cpfz = this.adjustLineLen(center,goal,myLine + 30);
  let cppz = this.adjustLineLen(center,goal,myLine + 60);

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
  avgAnimalSpeed = this.checkAnimalSpeeds(animals);

  this.correctHeading = this.getGoodHeading(center, goal);
  if (environment.avgSpeed() > 0.30 && environment.avgSpeed() < 0.50 && Math.abs(this.correctHeading - herdHeading) < 0.50) {
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

let slo = this.slowForGoal(center, goal);
if (slo == true) {
  this.maxspeed = 0.4;
}

  let statues = this.checkForStatues(animals, center);
  if (this.movingUp == false) {
    if (this.uavNum == 2) {
      if (avgAnimalSpeed < 0.20 || !(-0.50 < herdHeading && herdHeading < 0.50) || statues == true) {
        var target = createVector(fzp1.x,fzp1.y);
      } else {
        var target = createVector(pzp1.x,pzp1.y);
      }
    } else if (this.uavNum == 1) {
      if (avgAnimalSpeed < 0.20 || !(-0.50 < herdHeading && herdHeading < 0.50) || statues == true) {
        var target = createVector(cpfz.x,cpfz.y);
      } else {
        var target = createVector(cppz.x,cppz.y);
      }
    }
    if (statues == true) {
      var target = createVector(this.nudge.x, this.nudge.y);
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
      this.oldMovement = 'moving';

    }
    return steer;
  } else if (this.movingUp == true) {
    if (this.uavNum == 2) {
      if (avgAnimalSpeed < 0.20 || !(-0.50 < herdHeading && herdHeading < 0.50) || statues == true) {
        var target = createVector(cpfz.x,cpfz.y);
      } else {
        var target = createVector(cppz.x,cppz.y);
      }
    } else if (this.uavNum == 1) {
      if (avgAnimalSpeed < 0.20 || !(-0.50 < herdHeading && herdHeading < 0.50) || statues == true) {
        var target = createVector(fzp2.x,fzp2.y);
      } else {
        var target = createVector(pzp2.x,pzp2.y);
      }
    }
    if (statues == true) {
      var target = createVector(this.nudge.x, this.nudge.y);
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
      this.oldMovement = 'moving';

    }
    return steer;
  }
}

MultiOracleShepherd.prototype.checkHeading = function (animals) {
  totalHeading = 0;
  for (var i = 0; i < animals.length; i++) {
    totalHeading += animals[i].heading;
  }
  averageHeading = totalHeading/ animals.length;
  return averageHeading;
}

MultiOracleShepherd.prototype.checkAnimalSpeeds = function (animals) {
  totalSpeed = 0;
  for (var i = 0; i < animals.length; i++) {
    totalSpeed += animals[i].speed;
  }
  averageSpeed = totalSpeed/ animals.length;
  return averageSpeed;
}

MultiOracleShepherd.prototype.saveOldPositions = function (animals) {
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

MultiOracleShepherd.prototype.checkHeading = function (animals) {
  totalHeading = 0;
  for (var i = 0; i < animals.length; i++) {
    totalHeading += animals[i].heading;
  }
  averageHeading = totalHeading/ animals.length;
  return averageHeading;
}

MultiOracleShepherd.prototype.checkForStatues = function (animals, center) {
  let count = 0;
  let n = this.findClosestAnimalToUAV(animals, center);
  for (var i = 0; i < animals.length; i++) {
    if(animals[i].speed < 0.15 && dist(this.position.x, this.position.y, animals[i].position.x, animals[i].position.y) == n) {
      count++;
      fill(30,30,30,30)
      ellipse(animals[i].position.x, animals[i].position.y, 30, 30)
      this.nudge = createVector(animals[i].position.x, animals[i].position.y);
    }
  }
  if (count > 0) {
    return true;
  } else {
    return false;
  }
}
