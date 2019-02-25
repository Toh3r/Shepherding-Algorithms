// Environment object, holds/manages all objects in the simulation
function Environment() {
  // Initialize arrays to store agents/objects
  this.herd = [];
  this.shepherds = [];
  this.novelObjects = [];
  this.gates = [];
  this.accumulatedStress = 0;
}

Environment.prototype.run = function() {
  for (var i = 0; i < this.herd.length; i++) {
    this.herd[i].run(this.herd, this.shepherds, this.novelObjects);  // Passing all arrays to each animal
  }

  for (var i = 0; i < this.shepherds.length; i++) {
    this.shepherds[i].run();
  }

  for (var i = 0; i < this.novelObjects.length; i++) {
    this.novelObjects[i].run();
  }

  for (var i = 0; i < this.gates.length; i++) {
    this.gates[i].run();
  }
}

// Methods to add agents/Objects to arrays
Environment.prototype.addAnimal = function(a) {
  this.herd.push(a);
}

Environment.prototype.addShepherd = function(s) {
  this.shepherds.push(s);
}

Environment.prototype.addNovelty = function(n) {
  this.novelObjects.push(n);
}

Environment.prototype.addGate = function(g) {
  this.gates.push(g);
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

// Remove selected animal once they enter gate
Environment.prototype.hitTheGap = function(animal) {
  this.accumulatedStress = (this.accumulatedStress + animal.stressLevel);
  console.log('Accumulated stress: ' + this.accumulatedStress);
  var index = this.herd.map(function (item) { // Find index of animal using 'name' property
    return item.name;
  }).indexOf(animal.name);

  this.herd.splice(index, 1); // Remove selected animal after they have left field
}

// Method to clear the canvas
Environment.prototype.removeAll = function() {
  this.herd.length = 0;
  this.shepherds.length = 0;
  this.novelObjects.length = 0;
  this.accumulatedStress = 0;
}

// // Method to allow for class extensions
// function extend (base, constructor) {
//   var prototype = new Function();
//   prototype.prototype = base.prototype;
//   constructor.prototype = new prototype();
//   constructor.prototype.constructor = constructor;
// }
