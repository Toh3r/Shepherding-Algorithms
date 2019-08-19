// Oracle class
// Create Oracle attributes
function Oracle (startPos, os, shepGoals) { // Passing through starting co-ords, goal co-ords, **Num animals**
  // General Attributes
  this.acceleration = createVector(0,0); // Starting acceleration of 0
  this.velocity = createVector(0,0);     // Starting acceleration of 0
  this.position = createVector(startPos.x, startPos.y);    // Starting position
  this.maxspeed = 1.5;    // Starting Maxspeed
  this.maxForce = 1;  // Max strength of forces

  // Searching/managing attributes
  this.firstSearch = true; // True when searching for first target
  this.firstRun= true;     // True for first search of enclosure
  this.moving = true;      // Turns flase when target reached and calculates next target
  this.movingUp = true;    // Controls up/down movement of oracle when moving bewtween targets
  this.currentTarget = {   // Hold position of Oracles current target when searching sectors
    position: createVector(0,0),
    id: createVector(0,0)
  }
  this.oldTarget = createVector(0,0); // Holds position of current target
  this.targets = [];      // Stores vectors for all targets in an enclosure
  this.animals = [];      // Stores herd information that is passed to shepherd
  this.startx = startPos.x;        // Starting x position of oracle
  this.starty = startPos.y;        // Starting y position of oracle
  this.targetNum = 0;     // Holds the target number of targets oracle has passed
  this.numSectors = 1;    // Holds number of sectors in an environment
  this.following = false; // True when herd is bunched
  this.usingSec = os.dir;
  this.start = os;
  this.lol = createVector(0,0);
  this.shepGoals = shepGoals; // ----- Goal variables
  this.goalCounter = 0;
  this.timestep = 0;
  this.goodMovement = 0;
  this.correctHeading = 0;
  this.isForShep = {
    position: createVector(0,0),
    id: createVector(0,0)
  }
}

// Call methods for each shepherd
Oracle.prototype.run = function (herd) { // Called when oracle created, passing through herd array
  this.update();  // Updates position based on action selection
  this.borders(); // Stops oracle from colliding/moving out of enclosing walls
  this.render();  // Renders Oracle each frame
  if (this.targets.length == 0) { // Create sectors on first call
    this.createSectors();
  }
  if (sectorCheck.checked() == true) { // Display enclosure sectors if checked (auto-checked on)
    this.drawSectors();
  }
  this.runTheShow(herd); // Manages action selection
  if (herd.length > 0) { // Count time steps
    this.timestep++;
  }

}

Oracle.prototype.runTheShow = function (herd) { // Function which determines action selection based on a whole lotta things
  var bun = this.bunched(herd);     // Function to determine if animals are bunched

  if (herd.length == 0) {
    this.maxspeed = 0;
  }

  if( this.start.dir != 'start') {
    this.firstRun = false;
  }

  let allInView = this.checkViewBox(herd);

  if (allInView == true || bun == true) {
    this.maxspeed = 0.5;
    // console.log("I.. I.. I.. Follow")  // If animals are bunched, move to centre of herd
    this.following = true;
    var follow = this.followHerd(herd);                // and keep passing positions to oracle shepherd
    this.applyForce(follow);
  } else if (this.firstRun == true && this.start.dir == 'start') {  // Runs on initial search for animals when searching entire enclosure
    this.maxspeed = 1.5;
    this.following = false;
    var search = this.searchForAnimals(herd);
    this.applyForce(search);
    if (this.targetNum >= this.numSectors) { // Once all targets searched or all all animals located, initial search finishes
      this.firstRun = false; // Finish initial searxh
      this.movingUp = false; // Defualt for now
    }
  } else if (this.firstRun == false && bun == false && allInView == false || this.start.dir != "start") { // Once initial search finishes,if animals are not bunched
    this.following = false;
    // this.maxspeed = oracleSpeedSlider.value();
    var keep = this.keepSearching(herd);               // calculate new search based on their positions
    this.applyForce(keep);                        // and keep searching
  }
}

Oracle.prototype.applyForce = function(force) { // Apply movement force to Oracle
  this.acceleration.add(force);
}

Oracle.prototype.update = function() { // Method to update location based on forces
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

Oracle.prototype.borders = function () { // Method to prevent Oracle from leaving enclosure
  if (this.position.x < 10) {
    this.position.x = 10;
  } else if (this.position.y < 10) {
    this.position.y = 10;
  } else if (this.position.x > width - 10) {
    this.position.x = width - 10;
  } else if (this.position.y > height - 10) {
    this.position.y = height - 10;
  }
}

Oracle.prototype.render = function() { // Render Oracle each frame
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
  fill(255,0,0);
  ellipse(-5,-5, 5,5); // 1
  ellipse(0,-5, 5,5); // 3
  endShape(CLOSE);
  pop();
}

Oracle.prototype.searchForAnimals = function (herd) {
  if (this.firstSearch == true) {
    this.currentTarget = this.locateFirstTarget();
    if (dist(this.position.x, this.position.y, this.currentTarget.position.x, this.currentTarget.position.y) < 2){
      this.firstSearch = false;
    }
  } else if (this.moving == false) {
    // console.log("from search");
      this.currentTarget = this.calculateTarget();
      this.moving = true;
  } else if (this.moving == true) {
      this.currentTarget.position = this.oldTarget;
  }
  this.oldTarget = this.currentTarget.position;
  var desired = p5.Vector.sub(this.currentTarget.position, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  if (dist(this.position.x, this.position.y, this.currentTarget.position.x, this.currentTarget.position.y) < 2){
    this.moving = false;
    this.targetNum ++;
    this.saveAnimalPos(herd);
  }
  return steer;
}

Oracle.prototype.locateFirstTarget = function () { // Function to find first target for initial search of enclosure
  // Find
  this.bottomRow = Math.max.apply(Math, this.targets.map(function(o) { return o.id.y; }));
  this.topRow = Math.min.apply(Math, this.targets.map(function(o) { return o.id.y; }));
  this.leftCol = Math.min.apply(Math, this.targets.map(function(o) { return o.id.x; }));
  this.rightCol = Math.max.apply(Math, this.targets.map(function(o) { return o.id.x; }));

  if (this.startx < width / 2 && this.starty < width / 2) {
    target = this.targets.find(target => target.id.x === this.leftCol && target.id.y === this.topRow);
    this.startPos = "tl";
    this.movingUp = false;
    this.isForDisplayStart = this.leftCol + ", " + this.topRow;
  } else if (this.startx < width / 2 && this.starty > width / 2) {
    target = this.targets.find(target => target.id.x === this.leftCol && target.id.y === this.bottomRow);
    this.startPos = "bl";
    this.movingUp = true;
    this.isForDisplayStart = this.leftCol + ", " + this.bottomRow;
  } else if (this.startx > width / 2 && this.starty < width / 2) { // Starting near top left
    target = this.targets.find(target => target.id.x === this.rightCol && target.id.y === this.topRow);
    this.startPos = "tr";
    this.movingUp = false;
    this.isForDisplayStart = this.rightCol + ", " + this.topRow;
  } else if (this.startx > width / 2 && this.starty > width / 2) {
    target = this.targets.find(target => target.id.x === this.rightCol && target.id.y === this.bottomRow);
    this.startPos = "br";
    this.movingUp = true;
    this.isForDisplayStart = this.rightCol + ", " + this.bottomRow;
  }
  if (this.firstRun == true) {
    targetPos = {
      position: createVector(target.position.x, target.position.y),
      id: createVector(target.id.x, target.id.y)
    }
  }
  return targetPos;
}

Oracle.prototype.calculateTarget = function (minSec, maxSec) {

  if (this.firstRun == true) {
    // console.log("First is running")
    topR = this.topRow;
    bottomR = this.bottomRow;
    leftC = this.leftCol;
    rightC = this.rightCol
  } else if (this.firstRun == false) {
    // console.log(maxSec)
    // console.log("First is not running")
    rightC = minSec.id.x;
    leftC = maxSec.id.x;
    // console.log("From if: "+ leftC)
    topR = minSec.id.y;
    bottomR = maxSec.id.y;
    // console.log("From if: "+ bottomR)
  }

  // console.log("TOP -- moving: " + this.movingUp)
  // console.log("TOP -- y/b/t: " + this.currentTarget.id.y + ", " + bottomR + ", " + topR)
  // console.log("TOP -- x/left: " + this.currentTarget.id.x + ", " + leftC + ", " + rightC)

  if (this.startPos == "br") {
    if (this.movingUp == true && this.currentTarget.id.y > topR) {
      var newTarget = {
        position: createVector(this.position.x, this.position.y - this.secHeight),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
    } else if (this.movingUp == false && this.currentTarget.id.y < bottomR) {
      var newTarget = {
        position: createVector(this.position.x, this.position.y + this.secHeight),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
    } else if (this.currentTarget.id.x > leftC){
        var newTarget = {
          position: createVector(this.position.x - this.secWidth,this.position.y),
          id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
        }
      this.movingUp = !this.movingUp;
    } else {
      // console.log("Why you do this br")
    }
  } else if (this.startPos == "tr") {
    //
    // console.log("moving: " + this.movingUp)
    // console.log("y/b/t: " + this.currentTarget.id.y + ", " + bottomR + ", " + topR)
    // console.log("x/left: " + this.currentTarget.id.x + ", " + leftC)

    if (this.movingUp == false && this.currentTarget.id.y < bottomR) {
      var newTarget = {
        position: createVector(this.position.x, this.position.y + this.secHeight),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
    } else if (this.movingUp == true && this.currentTarget.id.y > topR) {
      var newTarget = {
        position: createVector(this.position.x, this.position.y - this.secHeight),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
    } else if (this.currentTarget.id.x > leftC){
      var newTarget = {
        position: createVector(this.position.x - this.secWidth,this.position.y),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
      this.movingUp = !this.movingUp;
    } else {
      // console.log("Why you do this tr")
    }
  } else if (this.startPos == "bl") {
    if (this.movingUp == true && this.currentTarget.id.y > topR) {
      var newTarget = {
        position: createVector(this.position.x, this.position.y - this.secHeight),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
    } else if (this.movingUp == false && this.currentTarget.id.y < bottomR) {
      var newTarget = {
        position: createVector(this.position.x, this.position.y + this.secHeight),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
    } else if (this.currentTarget.id.x < rightC) {
        var newTarget = {
          position: createVector(this.position.x + this.secWidth,this.position.y),
          id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
        }
      this.movingUp = !this.movingUp;
    } else {
      // console.log("Why you do this bl")
    }
  } else if (this.startPos == "tl") {
    if (this.movingUp == false && this.currentTarget.id.y < bottomR) {
      var newTarget = {
        position: createVector(this.position.x, this.position.y + this.secHeight),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
    } else if (this.movingUp == true && this.currentTarget.id.y > topR) {
      var newTarget = {
        position: createVector(this.position.x, this.position.y - this.secHeight),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
    } else if (this.currentTarget.id.x < rightC){
      var newTarget = {
        position: createVector(this.position.x + this.secWidth,this.position.y),
        id: createVector(this.currentTarget.id.x, this.currentTarget.id.y)
      }
      this.movingUp = !this.movingUp;
    } else {
      // console.log("Why you do this tl")
    }
  }
  // this.lol = newTarget.id;
  this.isForShep = {
    position: createVector(this.oldTarget.x, this.oldTarget.y),
    id: createVector(newTarget.id.x, newTarget.id.y)
  }
  return newTarget;
}

Oracle.prototype.saveAnimalPos = function (herd) {
  if(this.following == true) {
    this.animals.length = 0;
  }
  var viewWidth = this.secWidth/2;
  var viewHieght = this.secHeight/2;
  var count = 0;
  var animals = [];
  this.currentTarget.id = this.checkSector();
  for (var i = 0; i < herd.length; i++) {
    if (this.targetNum <= this.numSectors && Math.abs(this.position.x - herd[i].position.x) < viewWidth && Math.abs(this.position.y - herd[i].position.y) < viewHieght) {
      // Javascript passes objects/arrays by reference, have to create new deep array
      // Parsing vectors separatly to stop circular structure error
      var parsedPosX = JSON.parse(JSON.stringify(herd[i].position.x));
      var parsedPosY = JSON.parse(JSON.stringify(herd[i].position.y));
      var parsedVel = JSON.parse(JSON.stringify(herd[i].velocity.heading()));
      var parsedVoc = JSON.parse(JSON.stringify(herd[i].vocalizing));
      var parsedSpeed = JSON.parse(JSON.stringify(herd[i].velocity.mag()));

      // Create new object with static values of animals
      var parsedAnimal = {
        position: createVector(parsedPosX, parsedPosY),
        heading: parsedVel,
        vocalizing: parsedVoc,
        inSector: this.currentTarget.id,
        speed: parsedSpeed
      }
      this.animals.push(parsedAnimal); // Add to animals array which is used by shepherd
      count++;
    } else if (this.targetNum >= this.numSectors){
    }
  }
}

Oracle.prototype.bunched = function (herd) { // Function to determine if herd is bunched
  // Find furthest left, right, top and bottom animals
  this.herdBottom = Math.max.apply(Math, this.animals.map(function(o) { return o.position.y; }));
  this.herdTop = Math.min.apply(Math, this.animals.map(function(o) { return o.position.y; }));
  this.herdLeft = Math.min.apply(Math, this.animals.map(function(o) { return o.position.x; }));
  this.herdRight = Math.max.apply(Math, this.animals.map(function(o) { return o.position.x; }));
  // Find distance between top left and bottom right animals.. will do for now
  herDist = dist(this.herdLeft, this.herdTop, this.herdRight, this.herdBottom);
  if (herDist < 200 && this.animals.length == herd.length) { // Once dist less than 200, oracle recognises herd as bunched
    return true;                                    // 200 is arbituary, change ...
  } else {
    return false;
  }
}

Oracle.prototype.keepSearching = function (herd) {
  if (this.start.diffStart == true){
    this.targetNum = this.numSectors;
  }

  if(this.targetNum >= this.numSectors) {
    this.firstSearch = true;
    if (this.start.diffStart == true) {
      this.bRow = this.start.endSec.y;
      this.tRow = this.start.startSec.y;
      this.lCol = this.start.startSec.x;
      this.rCol = this.start.endSec.x;
      this.start.startSwitcher = false;
      console.log("startswitcher false")
    } else  {
      this.start.diffStart = false;
      this.bRow = Math.max.apply(Math, this.animals.map(function(o) { return o.inSector.y; }));
      this.tRow = Math.min.apply(Math, this.animals.map(function(o) { return o.inSector.y; }));
      this.lCol = Math.min.apply(Math, this.animals.map(function(o) { return o.inSector.x; }));
      this.rCol = Math.max.apply(Math, this.animals.map(function(o) { return o.inSector.x; }));
    }
    if (this.animals.length == 0) {
      this.bRow = this.oldbRow;
      this.tRow = this.oldtRow;
      this.lCol = this.oldlCol;
      this.rCol = this.oldrCol;
    }

    if (this.animals.length < herd.length && this.start.startSwitcher == false) {
      console.log("Adding columns")
      if (this.lCol >= 2) {
        this.lCol = this.lCol - 1;
      }
      if (this.rCol <= this.rightCol - 1) {
        this.rCol = this.rCol + 1;
      }
      if (this.tRow >= 2) {
        this.tRow = this.tRow - 1;
      }
      if (this.bRow <= this.bottomRow - 1) {
        this.bRow = this.bRow + 1;
      }
    }


    if (this.start.diffStart == true) {
      this.bRow = this.start.endSec.y;
      this.tRow = this.start.startSec.y;
      this.lCol = this.start.startSec.x;
      this.rCol = this.start.endSec.x;
    }

    topRight = createVector(this.rCol, this.tRow);   // Top right
    bottomLeft = createVector(this.lCol, this.bRow); // bottom left
    bottomRight = createVector(this.rCol, this.bRow) //bottom right
    topLeft = createVector(this.lCol, this.tRow)     // Top left

    this.tRight = this.getPositionOfTarget(topRight);    // Gets top right sector
    this.tLeft = this.getPositionOfTarget(topLeft);      // Gets bottom left sector
    this.bRight = this.getPositionOfTarget(bottomRight); // Gets bottom left sector
    this.bLeft = this.getPositionOfTarget(bottomLeft);   // Gets bottom left sector

    if (this.start.diffStart == false) {
      this.usingSec = this.findClosest();
    }

    this.oldbRow = this.bRow;
    this.oldtRow = this.tRow;
    this.oldlCol = this.lCol;
    this.oldrCol = this.rCol;
  }

  if (this.firstSearch == true && this.targetNum >= this.numSectors) {

    if (this.start.diffStart == false) {
      this.usingSec = this.findClosest();
    }

    if (this.usingSec == "tr") {
      this.movingUp = false;
      this.startPos = 'tr';
      this.currentTarget = this.tRight;
      this.isForDisplayStart = topRight.x + ", " + topRight.y;
    } else if (this.usingSec == "bl") {
      this.movingUp = true;
      this.startPos = 'bl';
      this.currentTarget = this.bLeft;
      this.isForDisplayStart = bottomLeft.x + ", " + bottomLeft.y;
    } else if (this.usingSec == "tl") {
      this.movingUp = false;
      this.startPos = 'tl';
      this.currentTarget = this.tLeft;
      this.isForDisplayStart = topLeft.x + ", " + topLeft.y;
    } else if (this.usingSec == "br") {
      this.movingUp = true;
      this.startPos = 'br';
      this.currentTarget = this.bRight;
      this.isForDisplayStart = bottomRight.x + ", " + bottomRight.y;
    }

    if (dist(this.position.x, this.position.y,this.currentTarget.position.x, this.currentTarget.position.y) < 2){
      this.firstSearch = false;
      this.targetNum = 0;
      // console.log("rcol: ", this.rCol)
      // console.log("row: ", this.bRow - (this.tRow - 1))
      this.numSectors = ((this.rCol - (this.lCol - 1))*(this.bRow - (this.tRow - 1))); // <---- -_-
      // console.log("Num Sectors: ", this.numSectors)
      this.animals.length = 0;
      this.start.diffStart = false;
      // console.log("My current target is : ", this.currentTarget)
      // this.usingMinSec = !this.usingMinSec;
    }
  } else if (this.moving == false) {
      // console.log("this.tRight: " + this.tRight.id.x + ", " + this.tRight.id.y)
      // console.log("this.bLeft: " + this.bLeft.id.x + ", " + this.bLeft.id.y)
      this.currentTarget = this.calculateTarget(this.tRight, this.bLeft);
      this.moving = true;
  } else if (this.moving == true) {
      this.currentTarget.position = this.oldTarget;
  }
  this.oldTarget = this.currentTarget.position;
  var desired = p5.Vector.sub(this.currentTarget.position, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  if (dist(this.position.x, this.position.y, this.currentTarget.position.x, this.currentTarget.position.y) < 2){
    this.moving = false;
    this.targetNum ++;
    this.saveAnimalPos(herd);
  }
  return steer;
}

Oracle.prototype.followHerd = function (herd) { // When herd is bunched
  let herdBottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  let herdTop = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  let herdLeft = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  let herdRight = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));
  // Find centre position of herd
  var herdX = (herdRight + herdLeft) / 2; // X co-ord of herd centre
  var herdY = (herdTop + herdBottom) / 2; // Y co-ord of herd centre
  var center = createVector(herdX, herdY);          // Centre co-ords of herd
  var goal = this.shepGoals[this.goalCounter];
  this.checkGoal(center, goal);
  // When over the centre of the herd
  if (dist(this.position.x, this.position.y, center.x, center.y) < 2) {
    this.animals.length = 0;  // Clear saved animals array
    this.saveAnimalPos(herd); // Save new positions and pass to Oracle Shepherd
    // console.log("Animal positions saved")
  }
  herdHeading = this.checkHeading(herd);
  this.correctHeading = this.getGoodHeading(center, goal);
  if (environment.avgSpeed() > 0.30 && Math.abs(this.correctHeading - herdHeading) < 0.50) {
    this.goodMovement += 1;
  }
  // ***--- Fix speeds for this funciton ---***//
  var target = createVector(herdX,herdY); // Create target as herd centre
  this.targetInBounds(target);            // Keep target in bounds
  var desired = p5.Vector.sub(target, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  // console.log("Target for Oracle: " + target)
  // fill(0)
  // ellipse(target.x, target.y, 15,15)
  return steer;
}

Oracle.prototype.targetInBounds = function (target) { // If target is outside enclosure, move back inside enclosure
  // ** Probably unnecessary for this function.. **
  if (target.x < 15) { // If T out of enclosure
    target.x = 15;     // Move back in enclosure
  } else if (target.y < 15) {
    target.y = 15;
  } else if (target.x > width - 15) {
    target.x = width - 15;
  } else if (target.y > height - 15) {
    target.y = height - 15;
  }
  return target;
}

Oracle.prototype.checkSector = function () { // Function to determine current sector
  var currentMin = width; // currentMin will store distance to closest sector centre
  for (var i = 0; i < this.targets.length; i++) { // Loop through targets array
    // Find distance from current position to nearest sector centre
    distTo = dist(this.position.x, this.position.y, this.targets[i].position.x, this.targets[i].position.y);
    if (distTo < currentMin) {   // If shorter than previous
      currentMin = distTo;       // Save shortest distance
      current = this.targets[i]; // Save closest target
    }
  }
  currentID = createVector(current.id.x, current.id.y); // Find i.d for closest sector
  return currentID; // and return it to saveAnimalPos
}

Oracle.prototype.getPositionOfTarget = function (secNum) { // Calculates min and max search sectors after initial search
  for (var i = 0; i < this.targets.length; i++) { // Find sectors with animals located in them
    if(secNum.x == this.targets[i].id.x && secNum.y == this.targets[i].id.y) { // and matches them to a target
      current = this.targets[i];
    }
  }
  return current; // And sends back min/max targets to keepSearching()
}

// --------------- FUNCTIONS TO CALCULATE AND DRAW SECTORS ---------------
Oracle.prototype.createSectors = function () {  // Creates sectors in enclosure for Oracle, used during search for animals
  secWidthNum = Math.ceil(width/250);           // Find number of sectors on x axis (Columns)
  secHeightNum = Math.ceil(height/250);         // Find number of sectors on y-axis (Rows)
  this.numSectors = secWidthNum*secHeightNum;   // Store number of sectors
  console.log("Number of sectors: " + this.numSectors)
  this.secWidth = width/secWidthNum;            // Create sectors with even width
  this.secHeight = height/secHeightNum;         // Create sectors with even height
  sectorY = 0; // SectorX/Y used to loop through cols/rows
  var c = 1;   // Set column i.d to 1
  for(var sectorX = 0; sectorX < width; sectorX += this.secWidth){ // Loop through columns, while theres space keep creating cols
    var r = 1; // Set row i.d to 1
    this.target = { // Create target object with sector position and sector i.d to be used by oracle
      position: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
      pos: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)), // I can't remember why I added pos...
      id: createVector (c, r)
    }
    if(this.targets.length < this.numSectors) {
      this.targets.push(this.target); // Add target to targets array
    }
    for(sectorY = this.secHeight; sectorY < height; sectorY += this.secHeight) { // Do same for rows using nested for loop
      r++; // Increment row i.d each iteration
      this.target = {
        position: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
        pos: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
        id: createVector (c, r)
      }
      if(this.targets.length < this.numSectors) {
        this.targets.push(this.target);
      }
    } // Close nested (row creation) for loop
    sectorY = 0; // Reset row height to 0 after each iteration of a created column
    c++;         // Increment column i.d number after each iteration
  } // End Column for loop
}

Oracle.prototype.drawSectors = function () { // Draws enclosure sectors and Oracle targets when checked
  textSize(16);
  for (var i = 0; i < this.targets.length; i++) { // For loop to write label for each sector
    text(this.targets[i].id.x + "." + this.targets[i].id.y, this.targets[i].pos.x + 10, this.targets[i].pos.y);
  }
  secWidthNum = Math.ceil(width/250);    // Find max number of columns :: width divided by oracle veiw range
  secHeightNum = Math.ceil(height/250);  // Find max number of rows :: height divided by oracle veiw range
  numSectors = secWidthNum*secHeightNum; // Find total number of sectors :: cols*rows
  secWidth = width/secWidthNum;          // Create equal length columns
  secHeight = height/secHeightNum;       // Create equal length rows
  fill(20,20,20,20);  // Shade in sectors
  stroke(255);  // White lines to divide sectors
  sectorY = 0;        // Set sectorY (rows to 0)
  for(var sectorX = 0; sectorX < width; sectorX += secWidth){ // Loop through each column to create sectors
    rectMode(CORNER);
    rect(sectorX, sectorY, secWidth, secHeight); // Create square/rect sectore passing through x,y co-ords and width/height
    ellipse(sectorX + (secWidth/2),sectorY + (secHeight/2), 5, 5); // Create circle at centre of each sector (Representing oracle targets when searching)
    for(sectorY = secHeight; sectorY < height; sectorY += secHeight) { // Same for rows
      rect(sectorX, sectorY, secWidth, secHeight);
      ellipse(sectorX + (secWidth/2),sectorY + (secHeight/2), 5, 5);
    }
    sectorY = 0; // Reset rows to 0 after each iteration
  }
}

Oracle.prototype.findClosest = function () {
  distTR = dist(this.position.x, this.position.y, this.tRight.position.x, this.tRight.position.y)
  distTL = dist(this.position.x, this.position.y, this.tLeft.position.x, this.tLeft.position.y)
  distBR = dist(this.position.x, this.position.y, this.bRight.position.x, this.bRight.position.y)
  distBL = dist(this.position.x, this.position.y, this.bLeft.position.x, this.bLeft.position.y)

  shortest = Math.min(distTR, distTL, distBR, distBL);

  if (shortest == distTR){
    return "tr";
  } else if (shortest == distTL) {
    return "tl"
  } else if (shortest == distBR) {
    return "br"
  } else if (shortest == distBL) {
    return "bl"
  }

}

Oracle.prototype.checkGoal = function (hc, g) {
  if (dist(hc.x, hc.y, g.x, g.y) < 50 && this.goalCounter < this.shepGoals.length -1) {
    this.goalCounter++;
  }
}

Oracle.prototype.getGoodHeading = function (hc, g) {

  let v0 = createVector(hc.x, hc.y);
  let v1 = createVector(g.x - hc.x, g.y - hc.y);

  let myHeading = v1.heading();

  return myHeading;
}

Oracle.prototype.checkHeading = function (herd) {
  totalHeading = 0;
  for (var i = 0; i < herd.length; i++) {
    totalHeading += herd[i].velocity.heading();
  }
  averageHeading = totalHeading/herd.length;
  return averageHeading;
}

Oracle.prototype.checkViewBox = function (herd) {
  let numAnimals = 0;
  for (var i = 0; i < herd.length; i++) {
    if (Math.abs(this.position.x - herd[i].position.x) < this.secWidth/2 && Math.abs(this.position.y - herd[i].position.y) < this.secHeight/2) {
      numAnimals ++;
    }
  }

  if (numAnimals == herd.length) {
    return true;
  } else {
    return false;
  }
}
