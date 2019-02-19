// Environment object, holds all objects in the simulation
function Environment() {
  // Initialize arrays to store agents/objects
  this.herd = [];
  this.shepherds = [];
  this.novelObjects = [];
}

Environment.prototype.run = function() {
  for (var i = 0; i < this.herd.length; i++) {
    this.herd[i].run(this.herd, this.shepherds);  // Passing the entire list of boids to each boid individually
  }

  for (var i = 0; i < this.shepherds.length; i++) {
    this.shepherds[i].run();  // Passing the entire list of boids to each boid individually
  }

  for (var i = 0; i < this.novelObjects.length; i++) {
    this.novelObjects[i].run();  // Passing the entire list of boids to each boid individually
  }
}

// Methods to add agents/Objects
Environment.prototype.addAnimal = function(b) {
  this.herd.push(b);
}

Environment.prototype.addShepherd = function(s) {
  this.shepherds.push(s);
}

Environment.prototype.addNovelty = function(n) {
  this.novelObjects.push(n);
}

// Methods to delete agents/Obstructions
Environment.prototype.deleteAnimal = function() {
  this.herd.pop();
}

Environment.prototype.deleteShepherd = function() {
  this.shepherds.pop();
}

Environment.prototype.deleteNovelty = function() {
  this.novelObjects.pop();
}

Environment.prototype.hitTheGap = function(animal) {
  console.log(animal.name);
  var index = this.herd.map(function (item) {
    return item.name;
  }).indexOf(animal.name);

  this.herd.splice(index, 1);
}

// Method to clear the canvas
Environment.prototype.removeAll = function() {
  this.herd.length = 0;
  this.shepherds.length = 0;
  this.novelObjects.length = 0;
}

// Method to allow for class extensions
function extend (base, constructor) {
  var prototype = new Function();
  prototype.prototype = base.prototype;
  constructor.prototype = new prototype();
  constructor.prototype.constructor = constructor;
}
