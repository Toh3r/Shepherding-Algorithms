// Environment object, holds/manages all objects in the simulation
function Environment() {
  // Initialize arrays to store agents/objects
  this.herd = [];
  this.shepherds = [];
  this.novelObjects = [];
  this.gates = [];
  this.accumulatedStress = 0;
  this.accumulatedStress.toFixed(2);
}

Environment.prototype.run = function() {
  for (var i = 0; i < this.herd.length; i++) {
    this.herd[i].run(this.herd, this.shepherds, this.novelObjects);  // Passing all arrays to each animal
  }

  for (var i = 0; i < this.shepherds.length; i++) {
    this.shepherds[i].run(this.herd);
  }

  for (var i = 0; i < this.novelObjects.length; i++) {
    this.novelObjects[i].run();
  }

  for (var i = 0; i < this.gates.length; i++) {
    this.gates[i].run();
  }

  if (herdZoneCheck.checked() == true) {
    this.displayHerd(); // Render herd zone
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

Environment.prototype.displayNums = function () {
  return this.herd.length;
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

Environment.prototype.displayHerd = function() {
  var bottom = Math.max.apply(Math, this.herd.map(function(o) { return o.position.y; }));
  var top = Math.min.apply(Math, this.herd.map(function(o) { return o.position.y; }));
  var left = Math.min.apply(Math, this.herd.map(function(o) { return o.position.x; }));
  var right = Math.max.apply(Math, this.herd.map(function(o) { return o.position.x; }));

  var yPos = (bottom + top) / 2;
  var xPos = (left + right) / 2;

  // console.log("/Top/XPOS: " + bottom +"/"+ top + "/"+ xPos);

  var topDist, botDist, leftDist, rightDist, ylen, xlen;

  topDist = yPos - top;
  botDist = bottom - yPos;

  // console.log("Top/Bottom/YPOS: " + top + "/" + bottom + "/" + ysPos);
  // console.log("Top Dist/Bottom Dist: " + topDist + "/" + botDist);
  leftDist = xPos - left;
  rightDist = right - xPos;


  if (topDist > botDist) {
    ylen = topDist;
  } else {
    ylen = botDist;
  }

  if (leftDist > rightDist) {
    xlen = leftDist;
  } else {
    xlen = rightDist;
  }

  // Display Herd Flight Zone
  rectMode(CENTER);
  fill(0,0,0,0.0);
  stroke(0, 0, 255);
  rect(xPos, yPos, xlen*2 + 100, ylen*2 + 100, 55);

  // Display Herd Pressure Zone
  rectMode(CENTER);
  fill(0,0,0,0.0);
  stroke(238, 248, 52);
  rect(xPos, yPos, xlen*2 + 200, ylen*2 + 200, 90);

  // Draw pressure zone
  fill(0);
  stroke(0);
  ellipse(left,top, 10, 10);

  // // Draw pressure zone
  // fill(0);
  // stroke(0);
  // ellipse(left,bottom, 10, 10);
  //
  // // Draw pressure zone
  // fill(0);
  // stroke(0);
  // ellipse(right,top, 10, 10);

  // Draw pressure zone
  fill(0);
  stroke(0);
  ellipse(right, bottom, 10, 10);
}

// // Method to allow for class extensions
// function extend (base, constructor) {
//   var prototype = new Function();
//   prototype.prototype = base.prototype;
//   constructor.prototype = new prototype();
//   constructor.prototype.constructor = constructor;
// }
