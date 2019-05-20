let shape;
let angle;

function setup() {
  var canvas = createCanvas(1200, 600);
  canvas.parent('myCanvas');

  addTri = createButton('Add Triangle');
  addTri.parent('addTri');
  addTri.mouseClicked(addTriangle);

  addCirc = createButton('Add Circle');
  addCirc.parent('addCirc');
  addCirc.mouseClicked(addCircle);

  addEl = createButton('Add Ellipse');
  addEl.parent('addEl');
  addEl.mouseClicked(addEllipse);

  addRect = createButton('Add Rectangle');
  addRect.parent('addRect');
  addRect.mouseClicked(addRectangle);

  delTri = createButton('Delete Triangle');
  delTri.parent('delTri');
  delTri.mouseClicked(deleteTriangle);

  delCirc = createButton('Delete Circle');
  delCirc.parent('delCirc');
  delCirc.mouseClicked(delCircle);

  shape = new Shape();

    //Create starting animals in random positions
    for (var i = 0; i < 1; i++) {
      x = 500;
      y = random(601);
      var e = new Ellipse(x, y);
      shape.addEllipse(e);
    }
}

function draw() {
  background(255);
  shape.run();
}

// function mousePressed() {
//   shape.addTriangle(new Triangle(mouseX, mouseY));
// }

// function to store arrays of shapes
function Shape() {
  this.ellipses = [];
  this.points = [];
  this.triangles = [];
  this.circles = [];
  this.rectangels = [];
  this.ellipses = [];
}

Shape.prototype.run = function() {
  for (let i = 0; i < this.ellipses.length; i++) {
    this.ellipses[i].run();  // Passing the entire list of boids to each boid individually
  }
  for (let i = 0; i < this.triangles.length; i++) {
    this.triangles[i].run(this.ellipses);  // Passing the entire list of boids to each boid individually
  }
  for (let i = 0; i < this.circles.length; i++) {
    this.circles[i].run(this.ellipses);  // Passing the entire list of boids to each boid individually
  }
}

Shape.prototype.addEllipse = function(e) {
  this.ellipses.push(e);
}

Shape.prototype.addTriangle = function(t) {
  this.triangles.push(t);
}
Shape.prototype.addCircle = function(c) {
  this.circles.push(c);
}

function Ellipse (x, y) {
  this.position = createVector(x, y);
  this.w = 400.0;
  this.h = 60.0;
}

Ellipse.prototype.run = function () {
  this.render()
}

Ellipse.prototype.render = function() {
  fill(125);
  stroke(0);
  ellipse(this.position.x, this.position.y, this.w * 2, this.h * 2)
}

function Triangle (x, y) {
  this.position = createVector(x, y);
  this.r = 5;
  // this.w = 25.0;
  // this.h = 25.0;
}

Triangle.prototype.run = function (ellipses) {
  this.render(ellipses);
  this.update();
  this.collideOval(ellipses);
}

// Method to update shepherd location
Triangle.prototype.update = function() {
  this.position.x = lerp(this.position.x, mouseX, 0.6);
  this.position.y = lerp(this.position.y, mouseY, 0.6);
}

// Draw shepherd
Triangle.prototype.render = function(ellipses) {
  // Draw a triangle rotated in the direction of velocity
  if (mouseY != pmouseY && mouseX != pmouseX) {
    angle = atan2(mouseY-pmouseY, mouseX-pmouseX);
  }

  var lol = this.collideOval(ellipses);
  if (lol > 0) {
    fill(0,0,255);
    stroke(255,0,0);
  } else {
    fill(255);
    stroke(0);
  }
  push();
  translate(mouseX, mouseY);
  rotate(angle + HALF_PI);
  beginShape();
  vertex(0, -this.r*1.5);
  vertex(-this.r, this.r*1.5);
  vertex(this.r, this.r*1.5);
  endShape(CLOSE);
  pop();

  fill(0,0,0,0);
  ellipse(this.position.x, this.position.y, 100);

}

Triangle.prototype.collideOval = function (ellipses) {
  var count = 0;
  for (var i = 0; i < ellipses.length; i++) {
    var el = ellipses[i];
    if(this.checkforNovelty(el) == true) {
      count ++
    }
  }
  return count;
}

Triangle.prototype.checkforNovelty = function (el) {
  //get height and width of ellipse
  var ex = el.w + 50, ey = el.h + 50;
  var xx = this.position.x - el.position.x; // get difference between each x-axis
  var yy = this.position.y - el.position.y; // get difference between each y-axis
  var eyy = ey * sqrt(abs(ex * ex - xx * xx)) / ex;
  // Discarding the points outside the bounding box
  if (this.position.x> el.position.x + ex|| this.position.x < el.position.x - ex||this.position.y > el.position.y + ey|| this.position.y < el.position.y - ey) {
    return false;
  } else if (yy <= eyy && yy >= -eyy)  {
    return  true;
  }
}

function Circle (x, y) {
  this.position = createVector(x, y);
  this.r = 25;
  this.acceleration = createVector(0,0); // Starting accelertion
  this.velocity = createVector(random(-1,1),random(-1,1)); // Create starting velocity direction
  this.maxspeed = .5;   // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
  // this.w = 25.0;
  // this.h = 25.0;
}

Circle.prototype.run = function (ellipses) {
  this.render(ellipses);
  this.update();    // Update position based on forces
  this.borders();   // Keep animal in enclosure
  this.collideOval(ellipses);
  var avo = this.avoidNovelty(ellipses);
  avo.mult(0.3);
  this.applyForce(avo);
}

// Apply each behavioural rule to each animal
Circle.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

// Draw shepherd
Circle.prototype.render = function(ellipses) {
  var lol = this.collideOval(ellipses);
  if (lol > 0) {
    fill(0,0,255);
    stroke(255,0,0);
  } else {
    fill(255);
    stroke(0);
  }
  ellipse(this.position.x, this.position.y, this.r);
  fill(0,0,0,0);
  ellipse(this.position.x, this.position.y, 100);
}

// Method to update location
Circle.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Circle.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  var steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

// Method to keep animal in enclosure
Circle.prototype.borders = function () {
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


Circle.prototype.collideOval = function (ellipses) {
  var count = 0;
  for (var i = 0; i < ellipses.length; i++) {
    var el = ellipses[i];
    if(this.checkforNovelty(el) == true) {
      count ++
    }
  }
  return count;
}

Circle.prototype.checkforNovelty = function (el) {
  //get height and width of ellipse
  var ex = el.w + 50, ey = el.h + 50;
  var xx = this.position.x - el.position.x; // get difference between each x-axis
  var yy = this.position.y - el.position.y; // get difference between each y-axis
  var eyy = ey * sqrt(abs(ex * ex - xx * xx)) / ex;
  // Discarding the points outside the bounding box
  if (this.position.x> el.position.x + ex|| this.position.x < el.position.x - ex||this.position.y > el.position.y + ey|| this.position.y < el.position.y - ey) {
    return false;
  } else if (yy <= eyy && yy >= -eyy)  {
    return  true;
  }
}

Circle.prototype.avoidNovelty = function (ellipses) {
  var desiredseparation = 0;
  var steer = createVector(0,0);
  var count = 0;

  // For every animal in the system, check if it's too close
  for (var i = 0; i < ellipses.length; i++) {

    var ex = ellipses[i].w + 50, ey = ellipses[i].h + 50;
    var xx = this.position.x - ellipses[i].position.x
    var yy = this.position.y - ellipses[i].position.y;
    var eyy = ey * sqrt(abs(ex * ex - xx * xx)) / ex;
    // var d = p5.Vector.dist(this.position,ellipses[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself

    if (this.position.x> ellipses[i].position.x + ex|| this.position.x < ellipses[i].position.x - ex||this.position.y > ellipses[i].position.y + ey|| this.position.y < ellipses[i].position.y - ey) {
      return steer;
    } else if (yy <= eyy && yy >= -eyy)  {
      // console.log(random(200));
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position,ellipses[i].position);
      diff.normalize();
      diff.div(eyy);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

function addTriangle () {
  shape.addTriangle(new Triangle(mouseX, mouseY));
}

function addCircle () {
  shape.addCircle(new Circle(random(500), random(500)));
}

function addEllipse () {

}

function addRectangle () {

}

function deleteTriangle () {
  shape.triangles.pop();
}

function delCircle () {
  shape.circles.pop()
}
function dontMindThis () {
  var desiredseparation = 50.0;
  var steer = createVector(0,0);
  var count = 0;
  // For every animal in the system, check if it's too close
  for (var i = 0; i < novelObjects.length; i++) {
    var d = p5.Vector.dist(this.position,novelObjects[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      var diff = p5.Vector.sub(this.position,novelObjects[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
    // this.velocity.setMag(0.1);
    this.vocalizing = true;
    // console.log("Vocalizing");
    this.stressLevel = (this.stressLevel + 0.1);
  } else {
    this.vocalizing = false;
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}
