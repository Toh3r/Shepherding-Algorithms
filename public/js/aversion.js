function setup() {
  var canvas = createCanvas(1200, 600);
  canvas.parent('myCanvas');

  what = new What ();

    //Create starting animals in random positions
    for (var i = 0; i < 1; i++) {
      x = mouseX;
      y = mouseY;
      var s = new Shepherd(x, y);
      what.addShepherd(s);
    }

}

function draw() {
  background(255);
  what.run();
}

function What() {
  this.shepherds = [];
}

What.prototype.run = function() {
  for (let i = 0; i < this.shepherds.length; i++) {
    this.shepherds[i].run();  // Passing the entire list of boids to each boid individually
  }
}

What.prototype.addShepherd = function (s) {
  this.shepherds.push(s);
}

let angle;
// Shepherd Class
// Create shepherd attributes
function Shepherd(x,y) {
  this.position = createVector(x,y);
  this.r = 5.0;
}

// Call methods for each shepherd
Shepherd.prototype.run = function(herd) {
  this.update();
  this.borders();
  this.render();
  this.recHerd();
  this.outOfHerd();
}

// Method to prevent shepherd from leaving enclosure
Shepherd.prototype.borders = function () {
  if (this.position.x < 15) {
    this.position.x = 15;
  } else if (this.position.y < 15) {
    this.position.y = 15;
  } else if (this.position.x > width - 15) {
    this.position.x = width - 15;
  } else if (this.position.y > height - 15) {
    this.position.y = height - 15;
  }
}

// Method to update shepherd location
Shepherd.prototype.update = function() {
  this.position.x = lerp(this.position.x, mouseX, 0.6);
  this.position.y = lerp(this.position.y, mouseY, 0.6);
}

// Draw shepherd
Shepherd.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  if (mouseY != pmouseY && mouseX != pmouseX) {
    angle = atan2(mouseY-pmouseY, mouseX-pmouseX);
  }

  fill(255);
  stroke(0);
  push();
  translate(mouseX, mouseY);
  rotate(angle + HALF_PI);
  beginShape();
  vertex(0, -this.r*1.5);
  vertex(-this.r, this.r*1.5);
  vertex(this.r, this.r*1.5);
  endShape(CLOSE);
  pop();
}

Shepherd.prototype.recHerd = function () {

  this.topLeft = createVector(150, 150);
  this.topRight =  createVector(400, 150);
  this.bottomLeft =  createVector(150, 400);
  this.bottomRight =  createVector(400, 400);

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

}

Shepherd.prototype.outOfHerd = function () { //In herd
  fill(241, 244, 66, 100);
  stroke(66, 66, 244);
  if (this.position.x > this.topLeft.x && this.position.x < this.topRight.x && this.position.y > this.topLeft.y && this.position.y < this.bottomLeft.y) {
    // Around herd
    stroke(66, 66, 244);
    fill(255,30,30,100);
    quad(this.topLeft.x, this.topLeft.y, this.topRight.x, this.topRight.y, this.bottomRight.x, this.bottomRight.y, this.bottomLeft.x, this.bottomLeft.y);
  } else if (this.position.x > this.topLeft.x && this.position.x < this.topRight.x && this.position.y > this.topLeft.y - 100 && this.position.y < this.topLeft.y) { // top
    // Top
    this.avoidHerd(this.sec5, this.sec6, this.sec7, this.sec8);
    quad(this.topLeft.x, this.topLeft.y - 100, this.topRight.x, this.topRight.y - 100, this.topRight.x, this.topRight.y , this.topLeft.x, this.topLeft.y)
  } else if (this.position.x > this.topRight.x && this.position.x < this.topRight.x + 100 && this.position.y > this.topRight.y && this.position.y < this.bottomRight.y) { //Right
    // Right
    quad(this.topRight.x, this.topRight.y, this.topRight.x + 100, this.topRight.y, this.bottomRight.x + 100, this.bottomRight.y , this.bottomRight.x, this.bottomRight.y)
  } else if (this.position.x > this.bottomLeft.x && this.position.x < this.topRight.x && this.position.y > this.bottomLeft.y && this.position.y < this.bottomLeft.y + 100) { // bottom
    // Bottom
    quad(this.bottomLeft.x, this.bottomLeft.y, this.bottomRight.x, this.bottomRight.y, this.bottomRight.x, this.bottomRight.y + 100, this.bottomLeft.x, this.bottomLeft.y + 100)
  } else if (this.position.x > this.topLeft.x - 100 && this.position.x < this.topLeft.x && this.position.y > this.topLeft.y && this.position.y < this.bottomLeft.y) { // Left
    // Left
    quad(this.topLeft.x - 100, this.topLeft.y, this.topLeft.x, this.topLeft.y, this.bottomLeft.x, this.bottomLeft.y, this.bottomLeft.x - 100, this.bottomLeft.y);
  } else if (this.position.x > this.topLeft.x - 100 && this.position.x < this.topLeft.x && this.position.y > this.topLeft.y - 100 && this.position.y < this.topLeft.y) {
    quad(this.topLeft.x - 100, this.topLeft.y - 100, this.topLeft.x, this.topLeft.y - 100, this.topLeft.x, this.topLeft.y, this.topLeft.x - 100, this.topLeft.y)
  } else if (this.position.x > this.topRight.x && this.position.x < this.topRight.x + 100 && this.position.y > this.topRight.y - 100 && this.position.y < this.topRight.y) {
    // Top right corner
    quad(this.topRight.x, this.topRight.y - 100, this.topRight.x + 100, this.topRight.y - 100, this.topRight.x + 100, this.topRight.y, this.topRight.x, this.topRight.y)
  } else if (this.position.x > this.bottomRight.x && this.position.x < this.bottomRight.x + 100 && this.position.y > this.bottomRight.y && this.position.y < this.bottomRight.y + 100) {
    // Bottom Right corner
    quad(this.bottomRight.x, this.bottomRight.y, this.bottomRight.x + 100, this.bottomRight.y, this.bottomRight.x + 100, this.bottomRight.y + 100, this.bottomRight.x, this.bottomRight.y + 100)
  } else if (this.position.x > this.bottomLeft.x - 100 && this.position.x < this.bottomLeft.x && this.position.y > this.bottomLeft.y && this.position.y < this.bottomLeft.y + 100) {
    // Bottom left
    quad(this.bottomLeft.x - 100, this.bottomLeft.y, this.bottomLeft.x, this.bottomLeft.y, this.bottomLeft.x, this.bottomLeft.y + 100, this.bottomLeft.x - 100, this.bottomLeft.y + 100)
  }
}

Shepherd.prototype.avoidHerd = function (c1, c2, c3, c4) {
  target = createVector(this.position.x, this.position.y);
  if (target.x > c1.tl.x && target.x < c2.tr.x && target.y > c1.tl.y && target.y < c1.bl.y) {
    console.log("lolololol")
  }

}
