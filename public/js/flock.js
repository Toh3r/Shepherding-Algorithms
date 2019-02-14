// Flock object
function Flock() {
  // Initialize arrays to store agents/objects
  this.boids = [];
  this.shepherds = [];
  this.novelObjects = [];
}

Flock.prototype.run = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }

  for (var i = 0; i < this.shepherds.length; i++) {
    this.shepherds[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }

  for (var i = 0; i < this.novelObjects.length; i++) {
    this.novelObjects[i].run();  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

Flock.prototype.addShepherd = function(s) {
  this.shepherds.push(s);
}

Flock.prototype.addNovelty = function(n) {
  this.novelObjects.push(n);
}

Flock.prototype.deleteBoid = function() {
  this.boids.pop();
}

Flock.prototype.deleteShepherd = function() {
  this.shepherds.pop();
}

Flock.prototype.deleteNovelty = function() {
  this.novelObjects.pop();
}

Flock.prototype.removeAll = function() {
  this.boids.length = 0;
  this.shepherds.length = 0;
  this.novelObjects.length = 0;
}

// function to allow shepherd to extend boid
function extend (base, constructor) {
  var prototype = new Function();
  prototype.prototype = base.prototype;
  constructor.prototype = new prototype();
  constructor.prototype.constructor = constructor;
}
