let shape;
let angle;

function setup() {
  var canvas = createCanvas(800, 600);
  canvas.parent('myCanvas');

  shape = new Shape();

    //Create starting animals in random positions
    for (var i = 0; i < 3; i++) {
      x = 400;
      y = random(501);
      var e = new Ellipse(x, y);
      shape.addEllipse(e);
    }
}

function draw() {
  background(255);
  shape.run();
}

function mousePressed() {
  shape.addTriangle(new Triangle(mouseX, mouseY));
}

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
}

Shape.prototype.addEllipse = function(e) {
  this.ellipses.push(e);
}

Shape.prototype.addTriangle = function(t) {
  this.triangles.push(t);
}

function Ellipse (x, y) {
  this.position = createVector(x, y);
  this.w = 400.0;
  this.h = 25.0;
}

Ellipse.prototype.run = function () {
  this.render()
}

Ellipse.prototype.render = function() {
  fill(125);
  stroke(0);
  ellipse(this.position.x, this.position.y, this.w * 2, this.h * 2)
}

Shape.prototype.addTriangle = function(t) {
  this.triangles.push(t);
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
  if (lol == true) {
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
  var rx = el.w, ry = el.h;
  // Discarding the points outside the bounding box
  if (this.position.x > el.position.x + rx || this.position.x < el.position.x - rx ||this.position.y > el.position.y + ry || this.position.y < el.position.y - ry) {
    return false;
  } else {
    // Compare the point to its equivalent on the ellipse
    var xx = this.position.x - el.position.x, yy = this.position.y - el.position.y;
    var eyy = ry * sqrt(abs(rx * rx - xx * xx)) / rx;
    return yy <= eyy && yy >= -eyy;
  }
}
