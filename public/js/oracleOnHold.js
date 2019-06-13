// Oracle // Oracle class, passing through starting co-ords and goal co-ords
function Oracle (x, y, gx, gy) {
  // Create drone properties
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-1,1),random(-1,1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 1;
  this.maxForce = 0.3;
  // Variables to control searching
  this.firstSearch = true;
  this.firstRun= true;
  this.moving = true;
  this.movingUp = true;
  // this.target = createVector(0,0);    //Holds position of current target
  this.oldTarget = createVector(0,0); //
  this.targets = [];   // Stores vectors for all targets in an enclosure
  this.animals = [];   // Stores herd information that is passed to shepherd
  this.startx = x;     // Starting x position of oracle
  this.starty = y;     // Starting y position of oracle
  this.targetNum = 0;  // Holds the target number of targets oracle has passed
  this.numSectors = 1; // Holds number of sectors in an environment
}

// Call methods for each shepherd
Oracle.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
  // Create sectors on first call
  if (this.targets.length == 0) {
    this.createSectors();
  }
  this.runTheShow(herd);
  if (sectorCheck.checked() == true) {
    this.drawSectors();
  }
}

Oracle.prototype.runTheShow = function (herd) {
  var bun = this.bunched();
  if (this.firstRun == true) {
    var search = this.searchForAnimals(herd);
    this.applyForce(search);
    if (this.targetNum >= this.numSectors) {
      // console.log("First run now false")
      this.firstRun = false;
    }
  } else if (this.firstRun == false && bun == false) {
    var cover = this.coverHerd();
    this.applyForce(cover);
  } else if (this.firstRun == false && bun == true) {
    var follow = this.followHerd();
    this.applyForce(follow);
  }
}

// Apply each behavioural rule to each animal
Oracle.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// Method to update location
Oracle.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// Method to prevent shepherd from leaving enclosure
Oracle.prototype.borders = function () {
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

Oracle.prototype.render = function(herd) {
  // Draw a triangle rotated in the direction of velocity
  var theta = this.velocity.heading() + radians(90);
  fill(0, 79, 249);
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

Oracle.prototype.searchForAnimals = function (herd) {
  if (this.firstSearch == true) {
    this.target.position = this.locateFirstTarget();
    if ((this.position.x - 2 < this.target.position.x && this.target.position.x < this.position.x + 2) && (this.position.y - 2 < this.target.position.y && this.target.position.y < this.position.y + 2)){
      this.firstSearch = false;
      console.log(this.target)
    }
  } else if (this.moving == false) {
      this.target.position = this.calculateTarget();
      this.moving = true;
  } else if (this.moving == true) {
      this.target.position = this.oldTarget;
  }

  this.oldTarget = this.target.position;
  var desired = p5.Vector.sub(this.target.position, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  if ((this.position.x - 2 < this.target.position.x && this.target.position.x < this.position.x + 2) && (this.position.y - 2 < this.target.position.y && this.target.position.y < this.position.y + 2)){
    this.moving = false;
    this.targetNum ++;
    this.saveAnimalPos(herd);

  }
  return steer;
}

Oracle.prototype.locateFirstTarget = function () {

  this.bottomPoint = Math.max.apply(Math, this.targets.map(function(o) { return o.id.y; }));
  this.topPoint = Math.min.apply(Math, this.targets.map(function(o) { return o.id.y; }));
  this.leftPoint = Math.min.apply(Math, this.targets.map(function(o) { return o.id.x; }));
  this.rightPoint = Math.max.apply(Math, this.targets.map(function(o) { return o.id.x; }));

  if (this.startx < width / 2 && this.starty < width / 2) {
    this.target.position = createVector(this.leftPoint,this.topPoint);
    this.startPos = "tl";
    this.movingUp = false;
  } else if (this.startx < width / 2 && this.starty > width / 2) {
    this.target.position = createVector(this.leftPoint, this.bottomPoint);
    this.startPos = "bl";
    this.movingUp = true;
  } else if (this.startx > width / 2 && this.starty < width / 2) {

    var lol = this.targets.find(x => x.id === (this.rightPoint, this.topPoint));
    console.log(lol);

    this.target.position = createVector(850,150);
    this.startPos = "tr";
    this.movingUp = false;
  } else if (this.startx > width / 2 && this.starty > width / 2) {
    this.target.position = createVector(this.rightPoint, this.bottomPoint);
    this.startPos = "br";
    this.movingUp = true;
  }
  return this.target.position;
}

Oracle.prototype.calculateTarget = function () {
  floored = Math.floor(this.target.position.y - (this.secHeight/2)); // top
  floored2 = Math.floor(this.target.position.y + (this.secHeight/2)); // bottom
  floored3 = Math.floor(this.target.position.x - (this.secWidth/2)); // left
  if (this.startPos == "br") {
    if (this.movingUp == true && floored > 0) {
      this.target.position = createVector(this.position.x, this.position.y - this.secHeight);
    } else if (this.movingUp == false && floored2 <= height + 2) {
      this.target.position = createVector(this.position.x, this.position.y + this.secHeight);
    } else {
      this.target.position = createVector(this.position.x - this.secWidth,this.position.y);
      this.movingUp = !this.movingUp;
    }
  } else if (this.startPos == "tr") {
    if (this.movingUp == false && floored2 < height) {
      this.target.position = createVector(this.position.x, this.position.y + this.secHeight);
    } else if (this.movingUp == true && floored > 0) {
      this.target.position = createVector(this.position.x, this.position.y - this.secHeight);
    } else if (floored3 > 0){
      this.target.position = createVector(this.position.x - this.secWidth,this.position.y);
      this.movingUp = !this.movingUp;
    } else {
      this.target.position = this.oldTarget;
    }
  }

  return this.target.position;
}

Oracle.prototype.saveAnimalPos = function (herd) {
  // console.log("In Animal Pose");
  var viewWidth = this.secWidth/2;
  var viewHieght = this.secHeight/2;
  var count = 0;
  var animals = [];
  for (var i = 0; i < herd.length; i++) {
    if (this.targetNum <= this.numSectors && Math.abs(this.position.x - herd[i].position.x) < viewWidth && Math.abs(this.position.y - herd[i].position.y) < viewHieght) {
      // Javascript passes objects/arrays by reference, have to create new deep array
      // Parsing position x and y separatly to stop circular structure error
      var parsedPosX = JSON.parse(JSON.stringify(herd[i].position.x));
      var parsedPosY = JSON.parse(JSON.stringify(herd[i].position.y));
      var parsedVel = JSON.parse(JSON.stringify(herd[i].velocity.heading()));
      var parsedVoc = JSON.parse(JSON.stringify(herd[i].vocalizing));

      // Create new object with static values of animals
      var parsedAnimal = {
        position: createVector(parsedPosX, parsedPosY),
        heading: parsedVel,
        vocalizing: parsedVoc,
        inSector: this.target.id
      }
      console.log("Animal: ", parsedAnimal)
      // console.log(this.target)
      this.animals.push(parsedAnimal); // Add to animals array which is used by shepherd
      count++;
    } else if (this.targetNum >= this.numSectors){

    }
  }
}

// Function to create target points for UAV Agent when locating animal agents
Oracle.prototype.createSectors = function () {
  secWidthNum = Math.ceil(width/250);           // Find number of sectors on x axis
  secHeightNum = Math.ceil(height/250);         // Find number of sectors on y-axis
  this.numSectors = secWidthNum*secHeightNum;   // Store number of sectors
  console.log("Number of sectors: " + this.numSectors)
  this.secWidth = width/secWidthNum;            // Create sectors with even width
  this.secHeight = height/secHeightNum;         // Create sectors with even height
  sectorY = 0; // Initiate y sector as 0
  var c = 1;
  for(var sectorX = 0; sectorX < width; sectorX += this.secWidth){
    var r = 1;
    this.target = {
      position: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
      pos: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
      id: createVector (c, r)
    }
    if(this.targets.length < this.numSectors) {
      this.targets.push(this.target);
    }
    for(sectorY = this.secHeight; sectorY < height; sectorY += this.secHeight) {
      r ++;
      this.target = {
        position: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
        pos: createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2)),
        id: createVector (c, r)
      }
      if(this.targets.length < this.numSectors) {
        this.targets.push(this.target);
      }
    }
    sectorY = 0;
    c++;
  }
}

Oracle.prototype.drawSectors = function () {
  for (var i = 0; i < this.targets.length; i++) {
    text(this.targets[i].id.x + "." + this.targets[i].id.y, this.targets[i].pos.x + 10, this.targets[i].pos.y);
  }
  secWidthNum = Math.ceil(width/250);
  secHeightNum = Math.ceil(height/250);
  numSectors = secWidthNum*secHeightNum;
  secWidth = width/secWidthNum;
  secHeight = height/secHeightNum;
  fill(20,20,20,20);
  stroke(255);
  sectorY = 0;
  for(var sectorX = 0; sectorX < width; sectorX += secWidth){
    rect(sectorX, sectorY, secWidth, secHeight);
    ellipse(sectorX + (secWidth/2),sectorY + (secHeight/2), 5, 5);
    for(sectorY = secHeight; sectorY < height; sectorY += secHeight) {
      rect(sectorX, sectorY, secWidth, secHeight);
      ellipse(sectorX + (secWidth/2),sectorY + (secHeight/2), 5, 5);
    }
    sectorY = 0;
  }
}

Oracle.prototype.bunched = function () {
  this.herdBottom = Math.max.apply(Math, this.animals.map(function(o) { return o.position.y; }));
  this.herdTop = Math.min.apply(Math, this.animals.map(function(o) { return o.position.y; }));
  this.herdLeft = Math.min.apply(Math, this.animals.map(function(o) { return o.position.x; }));
  this.herdRight = Math.max.apply(Math, this.animals.map(function(o) { return o.position.x; }));

  herDist = dist(this.herdLeft, this.herdTop, this.herdRight, this.herdBottom);
  if (herDist < 200) {
    return true;
  } else {
    return false;
  }
}

Oracle.prototype.coverHerd = function () {
  // console.log("Covering");
}

Oracle.prototype.followHerd = function () {
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd

  var target = createVector(herdX,herdY);
  this.targetInBounds(target);
  var desired = p5.Vector.sub(target, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);

  return steer;
}

Oracle.prototype.targetInBounds = function (target) {
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