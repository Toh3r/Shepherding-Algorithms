// Oracle class, passing through starting co-ords and goal co-ords
function Oracle (x, y, gx, gy) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(random(-1,1),random(-1,1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 1;
  this.maxForce = 0.3;
  this.firstSearch = true;
  this.moving = true;
  this.movingUp = true;
  this.targets = [];
  this.animalPositions = [];
  this.target = createVector(0,0);
  this.oldTarget = createVector(0,0);
  this.startx = x;
  this.starty = y;
  this.targetNum = 0;
  this.numSectors = 1;
}

// Call methods for each shepherd
Oracle.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
  this.runTheShow(herd);

  if (sectorCheck.checked() == true) {
    this.drawSectors();
  }
}

Oracle.prototype.runTheShow = function () {

  if (this.targetNum < this.numSectors) {
    var search = this.searchForAnimals();
    this.applyForce(search);
  } else {
    this.maxspeed = 0;
    this.velocity.setMag(0);
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

Oracle.prototype.render = function() {
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

Oracle.prototype.searchForAnimals = function () {
  if (this.firstSearch == true) {
    this.target = this.locateFirstTarget();
    if ((this.position.x - 2 < this.target.x && this.target.x < this.position.x + 2) && (this.position.y - 2 < this.target.y && this.target.y < this.position.y + 2)){
      this.firstSearch = false;
    }
  } else if (this.moving == false) {
      this.target = this.calculateTarget();
      this.moving = true;
  } else if (this.moving == true) {
      this.target = this.oldTarget;
  }

  this.oldTarget = this.target;
  var desired = p5.Vector.sub(this.target, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  if ((this.position.x - 2 < this.target.x && this.target.x < this.position.x + 2) && (this.position.y - 2 < this.target.y && this.target.y < this.position.y + 2)){
    this.moving = false;
    this.targetNum ++;
    console.log(this.targetNum)
    this.saveAnimalPos(herd);
  }
  return steer;
}

Oracle.prototype.locateFirstTarget = function () {
  secWidthNum = Math.ceil(width/250);
  secHeightNum = Math.ceil(height/250);
  this.numSectors = secWidthNum*secHeightNum;
  this.secWidth = width/secWidthNum;
  this.secHeight = height/secHeightNum;

  sectorY = 0;
  for(var sectorX = 0; sectorX < width; sectorX += this.secWidth){
    this.target = createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2));
    if(this.targets.length < this.numSectors) {
      this.targets.push(this.target);
    }
    for(sectorY = this.secHeight; sectorY < height; sectorY += this.secHeight) {
      this.target = createVector(sectorX + (this.secWidth/2),sectorY + (this.secHeight/2));
      if(this.targets.length < this.numSectors) {
        this.targets.push(this.target);
      }
    }
    sectorY = 0;
  }

  // Find animal agents that are furthest left, right, highest, lowest on canvas
  this.bottomPoint = Math.max.apply(Math, this.targets.map(function(o) { return o.y; }));
  this.topPoint = Math.min.apply(Math, this.targets.map(function(o) { return o.y; }));
  this.leftPoint = Math.min.apply(Math, this.targets.map(function(o) { return o.x; }));
  this.rightPoint = Math.max.apply(Math, this.targets.map(function(o) { return o.x; }));

  if (this.startx < width / 2 && this.starty < width / 2) {
    this.target = createVector(this.leftPoint,this.topPoint);
    this.startPos = "tl";
    this.movingUp = false;
  } else if (this.startx < width / 2 && this.starty > width / 2) {
    this.target = createVector(this.leftPoint, this.bottomPoint);
    this.startPos = "bl";
    this.movingUp = true;
  } else if (this.startx > width / 2 && this.starty < width / 2) {
    this.target = createVector(this.rightPoint,this.topPoint);
    this.startPos = "tr";
    this.movingUp = false;
  } else if (this.startx > width / 2 && this.starty > width / 2) {
    this.target = createVector(this.rightPoint, this.bottomPoint);
    this.startPos = "br";
    this.movingUp = true;
  }
  return this.target;
}

Oracle.prototype.calculateTarget = function () {
  floored = Math.floor(this.target.y - (this.secHeight/2)); // top
  floored2 = Math.floor(this.target.y + (this.secHeight/2)); // bottom
  floored3 = Math.floor(this.target.x - (this.secWidth/2)); // left
  if (this.startPos == "br") {
    if (this.movingUp == true && floored > 0) {
      this.target = createVector(this.position.x, this.position.y - this.secHeight);
    } else if (this.movingUp == false && floored2 <= height + 2) {
      this.target = createVector(this.position.x, this.position.y + this.secHeight);
    } else {
      this.target = createVector(this.position.x - this.secWidth,this.position.y);
      this.movingUp = !this.movingUp;
    }
  } else if (this.startPos == "tr") {
    if (this.movingUp == false && floored2 < height) {
      this.target = createVector(this.position.x, this.position.y + this.secHeight);
    } else if (this.movingUp == true && floored > 0) {
      this.target = createVector(this.position.x, this.position.y - this.secHeight);
    } else if (floored3 > 0){
      this.target = createVector(this.position.x - this.secWidth,this.position.y);
      this.movingUp = !this.movingUp;
    } else {
      this.target = this.oldTarget;
    }
  }

  return this.target;
}


Oracle.prototype.drawSectors = function () {
  secWidthNum = Math.ceil(width/250);
  secHeightNum = Math.ceil(height/250);
  numSectors = secWidthNum*secHeightNum;
  secWidth = width/secWidthNum;
  secHeight = height/secHeightNum;
  fill(40,40,40,40);
  stroke(255);
  sectorY = 0;
  for(var sectorX = 0; sectorX < width; sectorX += secWidth){
    rect(sectorX, sectorY, secWidth, secHeight);
    ellipse(sectorX + (secWidth/2),sectorY + (secHeight/2), 10, 10);
    for(sectorY = secHeight; sectorY < height; sectorY += secHeight) {
      rect(sectorX, sectorY, secWidth, secHeight);
      ellipse(sectorX + (secWidth/2),sectorY + (secHeight/2), 10, 10);
    }
    sectorY = 0;
  }
}

Oracle.prototype.saveAnimalPos = function (herd) {
  console.log("In Animal Pose");
  console.log(herd);
  var viewWidth = this.secWidth/2;
  var viewHieght = this.secHeight/2;
  var count = 0;
  for (var i = 0; i < herd.length; i++) {
    console.log(Math.abs(this.position.x - herd[i].positioin.x));
    if (Math.abs(this.position.x - herd[i].positioin.x) < viewWidth && Math.abs(this.position.y - herd[i].positioin.y) < viewHieght) {
      this.animalPositions.push(herd[i].positioin);
      count++;
    }
  }
  console.log(this.animalPositions);
}
