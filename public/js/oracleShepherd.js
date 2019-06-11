// Shepherd Class
// Create shepherd attributes
function OracleShepherd(x, y, gx, gy) {  // Passing through starting co-ords and goal co-ords
  this.acceleration = createVector(0,0); // Startigng acceleration of 0
  this.velocity = createVector(0,0);     // Starting velocity of 0
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxForce = 0.3;
  this.maxspeed = 0.6;
  this.movingUp = false;
  this.target = createVector(0,0);
  this.targetLock = false;
  this.oldTarget = createVector(0,0);
  this.animalsBottom = 0;
  this.animalsTop = 0;
  this.animalsLeft = 0;
  this.animalsRight = 0;
  this.targetDir = "right";
  this.timestep = 0;
  this.goalX = gx;
  this.goalY = gy;
  this.oldAnimals = [];
}

// Call methods for each shepherd
OracleShepherd.prototype.run = function(oracles) {
  this.update();
  this.borders();
  this.render();
  var currentAnimals = oracles[0].animals;
  if (oracles[0].targetNum == oracles[0].numSectors) {
    this.oldAnimals.length = 0;
    this.maxspeed = 1;
    this.herdAnimals(currentAnimals);
    this.timestep++;
    this.saveOldPositions(currentAnimals);
    if(lineCheck.checked() == true) {
      this.displayShepLines();
    }
  } else if (this.oldAnimals.length > 0) {
    this.maxspeed = 1;
    this.herdAnimals(this.oldAnimals);
    this.timestep++;
    if(lineCheck.checked() == true) {
      this.displayShepLines();
    }
  } else {
    this.maxspeed = 0;
  }
}

// Apply each behavioural rule to each animal
OracleShepherd.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

OracleShepherd.prototype.herdAnimals = function (animals) {
  var bun = this.bunched(animals);
  if (bun == true) {
    // console.log(animals);
    var mov = this.moveAnimals(animals);
    this.applyForce(mov);
  }

  if (bun == false) {
    var col = this.collectAnimals(animals);
    this.applyForce(col);
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
    this.velocity.x *= -1;
    this.position.x = 10;
  } else if (this.position.y < 10) {
    this.velocity.y *= -1;
    this.position.y = 10;
  } else if (this.position.x > width - 10) {
    this.velocity.x *= -1;
    this.position.x = width - 10;
  } else if (this.position.y > height - 10) {
    this.velocity.y *= -1;
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
  vertex(0, -this.r*1.5);
  vertex(-this.r, this.r*1.5);
  vertex(this.r, this.r*1.5);
  endShape(CLOSE);
  pop();
}

OracleShepherd.prototype.bunched = function (animals) {
  this.animalsBottom = Math.max.apply(Math, animals.map(function(o) { return o.position.y; }));
  this.animalsTop = Math.min.apply(Math, animals.map(function(o) { return o.position.y; }));
  this.animalsLeft = Math.min.apply(Math, animals.map(function(o) { return o.position.x; }));
  this.animalsRight = Math.max.apply(Math, animals.map(function(o) { return o.position.x; }));

  herDist = dist(this.animalsLeft, this.animalsTop, this.animalsRight, this.animalsBottom);
  if (herDist < 200) {
    // console.log(this.animalsBottom);
    return true;
  } else {
    return false;
  }
}

OracleShepherd.prototype.collectAnimals = function (animals) {
  var herdX = (this.animalsRight + this.animalsLeft) / 2; // X co-ord of herd centre
  var herdY = (this.animalsTop + this.animalsBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(this.goalX,this.goalY); // Location of exit

  if (environment.vocalizing() == true) {
    goal = this.avoidObstacle(center, goal);
  }

  animalFL = Math.abs(herdX - this.animalsLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.animalsRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.animalsTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.animalsBottom); // Cords of animal furthest bottom
  furthestAnimal = Math.max(animalFL, animalFR, animalFT, animalFB);

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

 if (this.movingUp == false) {
   var target = createVector(pzp1.x,pzp1.y);
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
   var target = createVector(pzp2.x,pzp2.y);
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

OracleShepherd.prototype.moveAnimals = function (animals) {

  var herdX = (this.animalsRight + this.animalsLeft) / 2; // X co-ord of herd centre
  var herdY = (this.animalsTop + this.animalsBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(this.goalX,this.goalY); // Location of exit

  if (environment.vocalizing() == true) {
    goal = this.avoidObstacle(center, goal);
  }

  animalFL = Math.abs(herdX - this.animalsLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.animalsRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.animalsTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.animalsBottom); // Cords of animal furthest bottom
  furthestAnimal = Math.max(animalFL, animalFR, animalFT, animalFB);

  // Lines to flight zone and pressure zone
  let l2fz = this.adjustLineLen(center,goal,furthestAnimal+15);
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

  herdHeading = this.checkHeading(animals);

  if (this.movingUp == false) {
    if (environment.avgSpeed() < 0.35 || !(-0.75 < herdHeading && herdHeading < 0.75)) {
      var target = createVector(fzp1.x,fzp1.y);
    } else {
      var target = createVector(pzp1.x,pzp1.y);
    }
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
    if (environment.avgSpeed() < 0.35 || !(-0.75 < herdHeading && herdHeading < 0.75)) {
      var target = createVector(fzp2.x,fzp2.y);
    } else {
      var target = createVector(pzp2.x,pzp2.y);
    }
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

OracleShepherd.prototype.displayShepLines = function () {
  var herdX = (this.animalsRight + this.animalsLeft) / 2; // X co-ord of herd centre
  var herdY = (this.animalsTop + this.animalsBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(this.goalX,this.goalY); // Location of exit

  if (environment.vocalizing() == true) {
    goal = this.avoidObstacle(center, goal);
  }

  animalFL = Math.abs(herdX - this.animalsLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.animalsRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.animalsTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.animalsBottom); // Cords of animal furthest bottom
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

OracleShepherd.prototype.avoidObstacle = function (center, goal) {
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

      // Create new object with static values of animals
      var parsedAnimal = {
        position: createVector(parsedPosX, parsedPosY),
        heading: parsedVel,
        vocalizing: parsedVoc,
        inSector: createVector(parsedSecX, parsedSecY)
      }
      this.oldAnimals.push(parsedAnimal); // Add to animals array which is used by shepherd
      count++;
  }
}
