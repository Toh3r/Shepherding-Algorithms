// Create Base UAV Shepherd
class UAVAgent {
  constructor (startPos, shepGoals) {
    this.shepGoals = shepGoals;
    this.history = [];
  }
}

// Apply accelertion to UAV
UAVAgent.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// Function to update location
UAVAgent.prototype.update = function() {
  this.velocity.add(this.acceleration); // Update velocity
  this.velocity.limit(this.maxspeed);   // Limit speed
  this.position.add(this.velocity);     // Update position
  this.acceleration.mult(0);            // Reset accelertion to 0 each cycle
}

// Function to prevent shepherd from leaving enclosure
UAVAgent.prototype.borders = function () {
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

UAVAgent.prototype.drawHistory = function () {
  var oldPos = {
    pos: createVector(this.position.x, this.position.y),
    mov: this.oldMovement
  }

  if(this.timestep % 25 == 0){
    this.history.push(oldPos);
  }

  for(let i = 0; i < this.history.length; i++){
    if (this.history[i].mov == "collecting") {
      stroke(0,0,255);
      fill(0,0,255);
    } else if (this.history[i].mov == "patroling"){
      stroke(255,255,0);
      fill(255,255,0);
    } else {
      stroke(255);
      fill(255);
    }
    var pos = this.history[i].pos;
    ellipse(pos.x, pos.y, 5, 5)
  }
}

// Draw shepherd
UAVAgent.prototype.render = function() {
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

// Fubction to calculate if herd is bunched and create secter used for herd avoidance
UAVAgent.prototype.bunched = function (herd) {
  // Find positions furthest animals in each direction
  this.herdBottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdTop = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdLeft = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  this.herdRight = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));

  // Use these positions to create corners of the herd zone
  this.topLeft = createVector(this.herdLeft, this.herdTop);
  this.topRight =  createVector(this.herdRight, this.herdTop);
  this.bottomLeft =  createVector(this.herdLeft, this.herdBottom);
  this.bottomRight =  createVector(this.herdRight, this.herdBottom);

  // Create corner sectors used for herd aversion
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
  // Return if herd is bunched or not
  herdDist = dist(this.herdLeft, this.herdTop, this.herdRight, this.herdBottom);
  if (herdDist < 300) {
    return true;
  } else {
    return false;
  }
}

UAVAgent.prototype.targetInBounds = function (target) {
  if (target.x < 15) {
    target.x = 15;
  }
  if (target.y < 15) {
    target.y = 15;
  }
  if (target.x > width - 15) {
    target.x = width - 15;
  }
  if (target.y > height - 15) {
    target.y = height - 15;
  }
  return target;
}

UAVAgent.prototype.targetInHerd = function (target) {
  if (target.x > this.topLeft.x && target.x < this.topRight.x && target.y > this.topLeft.y && target.y < this.bottomRight.y) {
    // console.log("This is not good")
  }
  if (target.x < this.topLeft.x - 100) {
    target.x = this.topLeft - 20;
    // console.log("tl.x running")
  }
  if (target.y < this.topLeft.y - 100) {
    target.y = this.topLeft.y - 20;
    // console.log("tl.y running");
  }
  if (target.x > this.topRight.x + 100) {
    target.x = this.topRight.x + 20;
    // console.log("tr.x running");
  }
  if (target.y > this.bottomRight.y + 100) {
    target.y = this.bottomRight.y + 20;
    // console.log("br.y running");
  }
  return target;
}

UAVAgent.prototype.outOfHerd = function (target) { //In herd
  fill(241, 244, 66, 100);
  stroke(66, 66, 244);
  if (this.position.x > this.topLeft.x && this.position.x < this.topRight.x && this.position.y > this.topLeft.y && this.position.y < this.bottomLeft.y) {
    stroke(66, 66, 244); // Around herd
    fill(255,30,30,100);
    // quad(this.topLeft.x, this.topLeft.y, this.topRight.x, this.topRight.y, this.bottomRight.x, this.bottomRight.y, this.bottomLeft.x, this.bottomLeft.y);
    this.redAlert(target);
  } else if (this.position.x > this.topLeft.x && this.position.x < this.topRight.x && this.position.y > this.topLeft.y - 100 && this.position.y < this.topLeft.y) { // top
    // Top
    // quad(this.topLeft.x, this.topLeft.y - 100, this.topRight.x, this.topRight.y - 100, this.topRight.x, this.topRight.y , this.topLeft.x, this.topLeft.y)
    this.avoidHerdTop(target, this.sec5, this.sec6, this.sec7, this.sec8);
  } else if (this.position.x > this.topRight.x && this.position.x < this.topRight.x + 100 && this.position.y > this.topRight.y && this.position.y < this.bottomRight.y) { //Right
    // Right
    // quad(this.topRight.x, this.topRight.y, this.topRight.x + 100, this.topRight.y, this.bottomRight.x + 100, this.bottomRight.y , this.bottomRight.x, this.bottomRight.y)
    this.avoidHerdRight(target, this.sec6, this.sec7, this.sec8, this.sec5);
  } else if (this.position.x > this.bottomLeft.x && this.position.x < this.topRight.x && this.position.y > this.bottomLeft.y && this.position.y < this.bottomLeft.y + 100) { // bottom
    // Bottom
    // quad(this.bottomLeft.x, this.bottomLeft.y, this.bottomRight.x, this.bottomRight.y, this.bottomRight.x, this.bottomRight.y + 100, this.bottomLeft.x, this.bottomLeft.y + 100)
    this.avoidHerdBottom(target, this.sec7, this.sec8, this.sec5, this.sec6);
  } else if (this.position.x > this.topLeft.x - 100 && this.position.x < this.topLeft.x && this.position.y > this.topLeft.y && this.position.y < this.bottomLeft.y) { // Left
    // Left
    // quad(this.topLeft.x - 100, this.topLeft.y, this.topLeft.x, this.topLeft.y, this.bottomLeft.x, this.bottomLeft.y, this.bottomLeft.x - 100, this.bottomLeft.y);
    this.avoidHerdLeft(target, this.sec8, this.sec5, this.sec6, this.sec7);
  } else if (this.position.x > this.topLeft.x - 100 && this.position.x < this.topLeft.x && this.position.y > this.topLeft.y - 100 && this.position.y < this.topLeft.y) {
    // Top-left Corner
    // quad(this.topLeft.x - 100, this.topLeft.y - 100, this.topLeft.x, this.topLeft.y - 100, this.topLeft.x, this.topLeft.y, this.topLeft.x - 100, this.topLeft.y)
    this.avoidHerdTopLeft(target, this.sec5, this.sec6, this.sec8);
  } else if (this.position.x > this.topRight.x && this.position.x < this.topRight.x + 100 && this.position.y > this.topRight.y - 100 && this.position.y < this.topRight.y) {
    // Top right corner
    // quad(this.topRight.x, this.topRight.y - 100, this.topRight.x + 100, this.topRight.y - 100, this.topRight.x + 100, this.topRight.y, this.topRight.x, this.topRight.y)
    this.avoidHerdTopRight(target, this.sec6, this.sec7, this.sec5);
  } else if (this.position.x > this.bottomRight.x && this.position.x < this.bottomRight.x + 100 && this.position.y > this.bottomRight.y && this.position.y < this.bottomRight.y + 100) {
    // Bottom Right corner
    // quad(this.bottomRight.x, this.bottomRight.y, this.bottomRight.x + 100, this.bottomRight.y, this.bottomRight.x + 100, this.bottomRight.y + 100, this.bottomRight.x, this.bottomRight.y + 100)
    this.avoidHerdBottomRight(target, this.sec7, this.sec6, this.sec8);
  } else if (this.position.x > this.bottomLeft.x - 100 && this.position.x < this.bottomLeft.x && this.position.y > this.bottomLeft.y && this.position.y < this.bottomLeft.y + 100) {
    // Bottom left
    // quad(this.bottomLeft.x - 100, this.bottomLeft.y, this.bottomLeft.x, this.bottomLeft.y, this.bottomLeft.x, this.bottomLeft.y + 100, this.bottomLeft.x - 100, this.bottomLeft.y + 100)
    this.avoidHerdBottomLeft(target, this.sec8, this.sec5, this.sec7);
  }
}


UAVAgent.prototype.avoidHerdTop = function (target, c1, c2, c3, c4) {
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

UAVAgent.prototype.avoidHerdRight = function (target, c1, c2, c3, c4) {
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

UAVAgent.prototype.avoidHerdBottom = function (target, c1, c2, c3, c4) {
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

UAVAgent.prototype.avoidHerdLeft = function (target, c1, c2, c3, c4) {
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

UAVAgent.prototype.avoidHerdTopLeft = function (target, c1, c2, c3) {
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

UAVAgent.prototype.avoidHerdTopRight = function (target, c1, c2, c3) {
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

UAVAgent.prototype.avoidHerdBottomRight = function (target, c1, c2, c3) {
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

UAVAgent.prototype.avoidHerdBottomLeft = function (target, c1, c2, c3) {
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

UAVAgent.prototype.displayShepLines = function (herd) {
  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  // var goal = createVector(this.goalX,this.goalY); // Location of exit
  var goal = this.shepGoals[this.goalCounter];

  if(pathRadio.value() == 1) {
    if (environment.vocalizing() == true && herd.length > 0) {
      goal = this.avoidObstacle(center, goal, herd);
  }
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

UAVAgent.prototype.avoidObstacle = function (center, goal, herd) {
  this.oldMovement = "avoiding";

  herdHeading = this.checkHeading(herd);
  fill(0,255,0);
  stroke(0);
  if (Math.abs(width - center.x) < 150 && dist(goal.x, goal.y, center.x, center.y) > 200) { // herd is beside right side of enclosure
    goal = createVector(0, (this.herdTop + this.herdBottom) / 2); // So move left
  } else if (center.x < 150 && dist(goal.x, goal.y, center.x, center.y) > 200) { // herd centre is beside right left of enclosure
    goal = createVector(width, (this.herdTop + this.herdBottom) / 2); // so move right
  } else if (height - center.y < 150 && dist(goal.x, goal.y, center.x, center.y) > 200) { // herd at bottom of enclosure
    goal = createVector((this.herdRight + this.herdLeft) / 2, 0); // Move up
  } else if (center.y < 150 && dist(goal.x, goal.y, center.x, center.y) > 200) { // at top
    goal = createVector((this.herdRight + this.herdLeft) / 2, height);
  }else if (herdHeading >= -0.75 && herdHeading <= 0.75) {
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

UAVAgent.prototype.createPCo1 = function (x1,y1,x2,y2) {
  xDiff = x1 - x2;
  yDiff = y1 - y2;
  px1 = x1 - yDiff;
  py1 = y1 + xDiff;
  point = createVector(px1, py1);
  return point;
}

// Create point b for perpindicular lines
UAVAgent.prototype.createPCo2 = function (x1,y1,x2,y2) {
  xDiff = x1 - x2;
  yDiff = y1 - y2;
  px2 = x1 + yDiff;
  py2 = y1 - xDiff;
  point = createVector(px2,py2);
  return point;
}

UAVAgent.prototype.adjustLineLen = function (p1,p2,d) {
  // extend line from goal to herd centre to fz and pre zone
  let originalDist = int(dist(p1.x, p1.y, p2.x,p2.y));
  lp1 = p1.x + (p1.x - p2.x) / originalDist * (d);
  lp2 = p1.y + (p1.y - p2.y) / originalDist * (d);
  point = createVector(lp1,lp2);
  return point;
}

UAVAgent.prototype.checkHeading = function (herd) {
  totalHeading = 0;
  for (var i = 0; i < herd.length; i++) {
    totalHeading += herd[i].velocity.heading();
  }
  averageHeading = totalHeading/herd.length;
  return averageHeading;
}

UAVAgent.prototype.drawShepGoals = function () {
  fill(255,30,30)
  stroke(0);
  for(var i = 0; i < this.shepGoals.length; i++) {
    ellipse(this.shepGoals[i].x, this.shepGoals[i].y, 10 ,10)
  }
}

UAVAgent.prototype.checkGoal = function (hc, g) {
  if (dist(hc.x, hc.y, g.x, g.y) < 50 && this.goalCounter < this.shepGoals.length -1) {
    this.goalCounter++;
    this.oldMovement = "switchGoals";
  }
}

UAVAgent.prototype.slowForGoal = function (hc, g) {
  if (dist(hc.x, hc.y, g.x, g.y) < 100) {
    return true;
  } else {
    return false;
  }
}

UAVAgent.prototype.findClosestAnimal = function (herd, c) {
  closest = 40000;
  for (var i = 0; i < herd.length; i++) {
    shep2Animal = Math.abs(dist(this.position.x, this.position.y, herd[i].position.x, herd[i].position.y)); // Find distance to each animal
    if (shep2Animal < closest) { // if this is the shortest distance
      // closestAnimal = herd[i];
      closest = shep2Animal;     // distance is saved as closest
      closestDist = Math.abs(dist(c.x, c.y, herd[i].position.x, herd[i].position.y));
    }
  }
  return closestDist;
}

UAVAgent.prototype.findClosestAnimalToUAV = function (herd, c) {
  closest = 40000;
  for (var i = 0; i < herd.length; i++) {
    shep2Animal = Math.abs(dist(this.position.x, this.position.y, herd[i].position.x, herd[i].position.y)); // Find distance to each animal
    if (shep2Animal < closest) { // if this is the shortest distance
      // closestAnimal = herd[i];
      closest = shep2Animal;     // distance is saved as closest
      closestDist = Math.abs(dist(this.position.x, this.position.y, herd[i].position.x, herd[i].position.y));
    }
  }
  return closestDist;
}

UAVAgent.prototype.getGoodHeading = function (hc, g) {

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

UAVAgent.prototype.checkDist = function (herd) {
  var totalAvgDist = 0;
  var avgDist = 0;
  for(var i = 0; i < herd.length; i++) {
    for(var j = 0; j < herd.length; j++) {
      var d = dist(herd[i].position.x, herd[i].position.y, herd[j].position.x, herd[j].position.y);
      avgDist += d;
    }
    avgDist = avgDist/herd.length;
    totalAvgDist += avgDist
  }
  totalAvgDist = totalAvgDist / herd.length;
  return totalAvgDist;
}

UAVAgent.prototype.tooClose = function (herd) {
  let count = 0;
  for (var i = 0; i < herd.length; i++) {
    if(dist(this.position.x, this.position.y, herd[i].position.x, herd[i].position.y) < 30) {
      count++;
    }
  }
  if(count > 0) {
    return true;
  } else {
    return false;
  }
}

UAVAgent.prototype.redAlert = function (target) {
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

UAVAgent.prototype.checkForStatues = function (herd, center) {
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
    return true;
  } else {
    return false;
  }
}

UAVAgent.prototype.nonMover = function (herd) {
  let count = 0;
  closest = 40000;
  closest2 = 40000;
  for (var i = 0; i < herd.length; i++) {
    shep2Animal = Math.abs(dist(this.position.x, this.position.y, herd[i].position.x, herd[i].position.y)); // Find distance to each animal
    if (shep2Animal < closest) {
      closest = shep2Animal;
    }
  }
  var nextClosest = 0;
  for(var i = 0; i < herd.length; i++) {
    for(var j = 0; j < herd.length; j++) {
      nextClosest = dist(herd[i].position.x, herd[i].position.y, herd[j].position.x, herd[j].position.y);
      if (nextClosest < closest2) {
        closest2 = nextClosest;
      }
    }
  }
  if (closest2 > 180) {
    return true;
  } else {
    return false;
  }
}

UAVAgent.prototype.createHerdingLines = function (centre, goal, myLine, advance) {
  if (advance == true) {
    fzLen = 40, pzlen = 70;
  } else {
    fzLen = 30, pzlen = 60;
  }
  // Lines to flight zone and pressure zone
  let l2fz = this.adjustLineLen(centre,goal,myLine + fzLen);
  let l2pz = this.adjustLineLen(centre,goal,myLine + pzlen);

  // Get co-ords for flight zone line points
  let fzp1 = this.createPCo1(l2fz.x,l2fz.y,centre.x, centre.y);
  let fzp2 = this.createPCo2(l2fz.x,l2fz.y,centre.x, centre.y);
  //Get co-ords for pressure zone line points
  let pzp1 = this.createPCo1(l2pz.x,l2pz.y,centre.x, centre.y);
  let pzp2 = this.createPCo2(l2pz.x,l2pz.y,centre.x, centre.y);
  // Get co-ords for herd line points
  let hlp1 = this.createPCo1(centre.x, centre.y,l2fz.x,l2fz.y);
  let hlp2 = this.createPCo2(centre.x, centre.y,l2fz.x,l2fz.y);

    // Shorten length of pz line
    pzp1 = this.adjustLineLen(pzp1,l2pz, -40);
    pzp2 = this.adjustLineLen(pzp2,l2pz, -40);

  herdPoints = {
    fz1: fzp1,
    fz2: fzp2,
    pz1: pzp1,
    pz2: pzp2
  }

  return herdPoints;
}
