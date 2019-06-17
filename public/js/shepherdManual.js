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
  this.recHerd(herd);
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

Shepherd.prototype.recHerd = function (herd) {
  this.herdBottom = Math.max.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdTop = Math.min.apply(Math, herd.map(function(o) { return o.position.y; }));
  this.herdLeft = Math.min.apply(Math, herd.map(function(o) { return o.position.x; }));
  this.herdRight = Math.max.apply(Math, herd.map(function(o) { return o.position.x; }));

  // console.log("Dist: " + dist(left, top, right, bottom));
}

Shepherd.prototype.outOfHerd = function () {

  if (this.position.x > this.herdLeft && this.position.x < this.herdRight && this.position.y < this.herdTop + 50 && this.position.y > this.herdTop) {
    // this.position.y = this.position.y - 1;
    console.log("Running outOfHerd");
  } else if (this.position.x > this.herdLeft && this.position.x < this.herdRight && this.position.y < this.herdBottom + 50 && this.position.y > this.herdTop) {
    // this.position.y = this.position.y + 1;
    console.log("Running outOfHerd");
  } else if (this.position.y > this.herdTop && this.position.y < this.herdBottom && this.position.x < this.herdRight + 50 && this.position.x > this.herdLeft) {
    // this.position.x = this.position.x + 1;
    console.log("Running outOfHerd");
  } else if (this.position.y > this.herdTop && this.position.y < this.herdBottom && this.position.x > this.herdLeft - 50 && this.position.x < this.herdLeft) {
    // this.position.x = this.position.x - 1;
    console.log("Running outOfHerd");
  }
}
