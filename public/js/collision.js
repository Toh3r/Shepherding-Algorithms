let shape;
let angle;

function setup() {
  var canvas = createCanvas(1000, 600);
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
    for (var i = 0; i < 3; i++) {
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
  this.w = 500.0;
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
  //get height and width of ellipse
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

function Circle (x, y) {
  this.position = createVector(x, y);
  this.r = 25;
  // this.w = 25.0;
  // this.h = 25.0;
}

Circle.prototype.run = function (ellipses) {
  this.render(ellipses);
  this.update();
  this.collideOval(ellipses);
}
// Method to update shepherd location
Circle.prototype.update = function() {
  this.position.x = lerp(this.position.x, mouseX, 0.6);
  this.position.y = lerp(this.position.y, mouseY, 0.6);
}

// Draw shepherd
Circle.prototype.render = function(ellipses) {

  var lol = this.collideOval(ellipses);
  if (lol == true) {
    fill(0,0,255);
    stroke(255,0,0);
  } else {
    fill(255);
    stroke(0);
  }
  ellipse(this.position.x, this.position.y, this.r);

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
  var ex = el.w, ey = el.h;
  // Discarding the points outside the bounding box
  if (this.position.x > el.position.x + ex || this.position.x < el.position.x - ex ||this.position.y > el.position.y + ey || this.position.y < el.position.y - ey) {
    return false;
  } else {
    // Compare the point to its equivalent on the ellipse
    var xx = this.position.x - el.position.x
    var yy = this.position.y - el.position.y;
    var eyy = ey * sqrt(abs(ex * ex - xx * xx)) / ex;
    return yy <= eyy && yy >= -eyy;
  }
}

// Circle.prototype.checkforNovelty = function (el) {
//   //get height and width of ellipse
//   var ex = el.w, ey = el.h;
//   var xx = this.position.x - el.position.x
//   var yy = this.position.y - el.position.y;
//   var eyy = ey * sqrt(abs(ex * ex - xx * xx)) / ex;
//   // Discarding the points outside the bounding box
//   if (this.position.x > el.position.x + ex || this.position.x < el.position.x - ex ||this.position.y > el.position.y + ey || this.position.y < el.position.y - ey) {
//     return false;
//   } else if (dist(yy, eyy) <= 50 && dist(yy ,-eyy) <= 50) {
//     return true;
//   }
// }

function addTriangle () {
  shape.addTriangle(new Triangle(mouseX, mouseY));
}

function addCircle () {
  shape.addCircle(new Circle(mouseX, mouseY));
}

function addEllipse () {

}

function addRectangle () {

}

function deleteTriangle () {
  shape.triangles.pop();
}

function delCircle () {
  shapes.circles.pop()
}
