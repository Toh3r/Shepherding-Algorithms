// Shepherd Class
// Create shepherd attributes
function AutoShepherd(x, y, gx, gy) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-1,1),random(-1,1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxForce = 0.3;
  this.maxspeed = 0.7;
  this.movingUp = false;
  this.target = createVector(0,0);
  this.targetLock = false;
  this.oldTarget = createVector(0,0);
  this.herdBottom = 0;
  this.herdTop = 0;
  this.herdLeft = 0;
  this.herdRight = 0;
  this.targetDir = "right";
  this.timestep = 0;
  this.goalX = gx;
  this.goalY = gy;
  this.targets = [];    // Holds number of sectors in an environment
  this.furthestAnimal = 0;
  this.targetAnimal = {};
  this.oldTargetAnimal = {
    position: createVector(2000, 2000)
  }
}

// Call methods for each shepherd
AutoShepherd.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
  this.herdAnimals(herd);
  if(lineCheck.checked() == true && herd.length > 0) {
    this.displayShepLines();
  }
  // if (this.targets.length == 0) { // Create sectors on first call
  //   this.createSectors();
  // }
  // if (sectorCheck.checked() == true) { // Display enclosure sectors if checked (auto-checked on)
  //   this.drawSectors();
  // }
  this.timestep++;
  // if (this.timestep % 50 == 0){
  //   console.log("Timestep: " + this.timestep);
  // }

}

// Apply each behavioural rule to each animal
AutoShepherd.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

AutoShepherd.prototype.herdAnimals = function (herd) {
  if (herd.length == 0) {
    this.maxspeed = 0;
  } else {
    this.maxspeed = uavSpeedSlider.value();
  }

  var bun = this.bunched(herd);
  if (bun == true) {
    var mov = this.moveAnimals(herd);
    this.applyForce(mov);
  }

  if (bun == false) {
    // var col = this.collectAnimals(herd);
    // this.applyForce(col);
    var adCol = this.advanceCollect(herd);
    this.applyForce(adCol);
  }

}

// Method to update location
AutoShepherd.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// Method to prevent shepherd from leaving enclosure
AutoShepherd.prototype.borders = function () {
  if (this.position.x < 10) {
    this.velocity.x *= -1;
    this.position.x = 10;
  } else if (this.position.y < 10) {
    this.velocity.y *= -1;
    this.position.y = 10;
  } else if (this.position.x > width - 10) {
    this.velocity.x *= -1;
    this.position.x = width - 15;
  } else if (this.position.y > height - 10) {
    this.velocity.y *= -1;
    this.position.y = height - 10;
  }
}

// Draw shepherd
AutoShepherd.prototype.render = function() {
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

AutoShepherd.prototype.bunched = function (herd) {
  this.herdBottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdTop = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdLeft = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  this.herdRight = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));

  herDist = dist(this.herdLeft, this.herdTop, this.herdRight, this.herdBottom);
  if (herDist < 200) {
    return true;
  } else {
    return false;
  }
}

AutoShepherd.prototype.collectAnimals = function (herd) {
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

AutoShepherd.prototype.advanceCollect = function (herd) {
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(this.goalX,this.goalY); // Location of exit

  if (environment.vocalizing() == true) {
    goal = this.avoidObstacle(center, goal);
  }

  var furthestPos = 0;
  for (var i = 0; i < herd.length; i++) {
    currentDist = dist(herd[i].position.x, herd[i].position.y, herdX, herdY);
    if (currentDist > furthestPos) {
      furthestPos = currentDist;
      this.targetAnimal = herd[i];
    }
  }

  if (herd.length > 0) {
    fill(255,0,0, 20);
    stroke(0);
    ellipse(this.targetAnimal.position.x, this.targetAnimal.position.y, 20,20);
  }

  var comp1 = dist(this.targetAnimal.position.x, this.targetAnimal.position.y, herdX, herdY);
  var comp2 = dist(this.oldTargetAnimal.position.x, this.oldTargetAnimal.position.y, herdX, herdY);

  if(Math.abs(comp1 - comp2) < 20) {
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
   var target = createVector(fzp20.x,fzp20.y);
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


AutoShepherd.prototype.moveAnimals = function (herd) {

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

  herdHeading = this.checkHeading(herd);

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

AutoShepherd.prototype.targetInBounds = function (target) {
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

AutoShepherd.prototype.displayShepLines = function () {
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

AutoShepherd.prototype.avoidObstacle = function (center, goal) {
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
AutoShepherd.prototype.createPCo1 = function (x1,y1,x2,y2) {
  xDiff = x1 - x2;
  yDiff = y1 - y2;
  px1 = x1 - yDiff;
  py1 = y1 + xDiff;
  point = createVector(px1, py1);
  return point;
}

// Create point b for perpindicular lines
AutoShepherd.prototype.createPCo2 = function (x1,y1,x2,y2) {
  xDiff = x1 - x2;
  yDiff = y1 - y2;
  px2 = x1 + yDiff;
  py2 = y1 - xDiff;
  point = createVector(px2,py2);
  return point;
}

AutoShepherd.prototype.adjustLineLen = function (p1,p2,d) {
  // extend line from goal to herd centre to fz and pre zone
  let originalDist = int(dist(p1.x, p1.y, p2.x,p2.y));
  lp1 = p1.x + (p1.x - p2.x) / originalDist * (d);
  lp2 = p1.y + (p1.y - p2.y) / originalDist * (d);
  point = createVector(lp1,lp2);
  return point;
}
AutoShepherd.prototype.checkHeading = function (herd) {
  totalHeading = 0;
  for (var i = 0; i < herd.length; i++) {
    totalHeading += herd[i].velocity.heading();
  }
  averageHeading = totalHeading/ herd.length;
  return averageHeading;
}

// // --------------- FUNCTIONS TO CALCULATE AND DRAW SECTORS ---------------
// AutoShepherd.prototype.createSectors = function () {  // Creates sectors in enclosure for Oracle, used during search for animals
//   secWidthNum = Math.ceil(width/250);           // Find number of sectors on x axis (Columns)
//   secHeightNum = Math.ceil(height/250);         // Find number of sectors on y-axis (Rows)
//   this.numSectors = secWidthNum*secHeightNum;   // Store number of sectors
//   console.log("Number of sectors: " + this.numSectors)
//   this.secWidth = width/secWidthNum;            // Create sectors with even width
//   this.secHeight = height/secHeightNum;         // Create sectors with even height
//   sectorY = 0; // SectorX/Y used to loop through cols/rows
//   var c = 1;   // Set column i.d to 1
//   for(var sectorX = 0; sectorX < width; sectorX += this.secWidth){ // Loop through columns, while theres space keep creating cols
//     var r = 1; // Set row i.d to 1
//     this.target = { // Create target object with sector position and sector i.d to be used by oracle
//       position: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
//       pos: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)), // I can't remember why I added pos...
//       id: createVector (c, r)
//     }
//     if(this.targets.length < this.numSectors) {
//       this.targets.push(this.target); // Add target to targets array
//     }
//     for(sectorY = this.secHeight; sectorY < height; sectorY += this.secHeight) { // Do same for rows using nested for loop
//       r++; // Increment row i.d each iteration
//       this.target = {
//         position: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
//         pos: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
//         id: createVector (c, r)
//       }
//       if(this.targets.length < this.numSectors) {
//         this.targets.push(this.target);
//       }
//     } // Close nested (row creation) for loop
//     sectorY = 0; // Reset row height to 0 after each iteration of a created column
//     c++;         // Increment column i.d number after each iteration
//   } // End Column for loop
// }
//
// AutoShepherd.prototype.drawSectors = function () { // Draws enclosure sectors and Oracle targets when checked
//   fill(0, 79, 249);
//   stroke(0, 79, 249);
//   for (var i = 0; i < this.targets.length; i++) { // For loop to write label for each sector
//     text(this.targets[i].id.x + "." + this.targets[i].id.y, this.targets[i].pos.x + 10, this.targets[i].pos.y);
//   }
//   secWidthNum = Math.ceil(width/250);    // Find max number of columns :: width divided by oracle veiw range
//   secHeightNum = Math.ceil(height/250);  // Find max number of rows :: height divided by oracle veiw range
//   numSectors = secWidthNum*secHeightNum; // Find total number of sectors :: cols*rows
//   secWidth = width/secWidthNum;          // Create equal length columns
//   secHeight = height/secHeightNum;       // Create equal length rows
//   fill(20,20,20,20);  // Shade in sectors
//   stroke(255);        // White lines to divide sectors
//   sectorY = 0;        // Set sectorY (rows to 0)
//   for(var sectorX = 0; sectorX < width; sectorX += secWidth){ // Loop through each column to create sectors
//     rect(sectorX, sectorY, secWidth, secHeight); // Create square/rect sectore passing through x,y co-ords and width/height
//     ellipse(sectorX + (secWidth/2),sectorY + (secHeight/2), 5, 5); // Create circle at centre of each sector (Representing oracle targets when searching)
//     for(sectorY = secHeight; sectorY < height; sectorY += secHeight) { // Same for rows
//       rect(sectorX, sectorY, secWidth, secHeight);
//       ellipse(sectorX + (secWidth/2),sectorY + (secHeight/2), 5, 5);
//     }
//     sectorY = 0; // Reset rows to 0 after each iteration
//   }
// }
