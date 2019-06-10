// Environment class, holds/manages all agents/objects in the simulation
function Environment() {
  // Initialize arrays to store agents/objects
  this.herd = []; // Stores animal agents
  this.shepherds = [];
  this.autoShepherds = [];
  this.oracles = [];
  this.oracleShepherds = [];
  this.multiGPSShepherds = [];
  this.novelObjects = [];
  this.gates = [];
  this.obstacles = [];

  // Create environmental variables
  this.accumulatedStress = 0;
  this.accumulatedStress.toFixed(2);
  this.stress = 0; // **Delete when fixed in animal class**
  this.averageSpeed = 0;
  this.vocal = false;
  this.oldTime = 0; // Used for displaying timesteps, timestep variable currently held by shepherd **change to here**

  // Hold positoins of herd to draw herd radius on canvas
  this.herdBottom = 0;
  this.herdTop = 0;
  this.herdLeft = 0;
  this.herdRight = 0;
}

// ------------ CREATES AGENTS/OBJECTS WHEN PASSED INFO FROM SKETCH ------------
Environment.prototype.run = function() {
  for (var i = 0; i < this.herd.length; i++) {
    this.herd[i].run(this.herd, this.shepherds, this.novelObjects, this.autoShepherds, this.multiGPSShepherds, this.obstacles, this.oracleShepherds);  // Passing all arrays to each animal
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

  for(var i = 0; i < this.autoShepherds.length; i++) {
    this.autoShepherds[i].run(this.herd);
  }

  for(var i = 0; i < this.multiGPSShepherds.length; i++) {
    this.multiGPSShepherds[i].run(this.herd);
  }

  for(var i = 0; i < this.oracles.length; i++) {
    this.oracles[i].run(this.herd);
  }

  for(var i = 0; i < this.oracleShepherds.length; i++) {
    this.oracleShepherds[i].run(this.oracles);
  }

  for(var i = 0; i < this.obstacles.length; i++) {
    this.obstacles[i].run();
  }

  // -- Draws herd radius/sectors on canvas
  if (herdZoneCheck.checked() == true) {
    this.displayHerd(); // Render herd zone
  }

  // if (sectorCheck.checked() == true) {
  //   this.sectors();
  // }
}

// ------------ FUNCTIONS TO ADD AGENTS/OBJECTS ------------
Environment.prototype.addAnimal = function(a) {
  this.herd.push(a);
}

Environment.prototype.addShepherd = function(s) {
  this.shepherds.push(s);
}

Environment.prototype.addAutoShepherd = function(as) {
  this.autoShepherds.push(as);
}

Environment.prototype.addMultiGPS = function(ms) {
  this.multiGPSShepherds.push(ms);
}

Environment.prototype.addOracle = function(o) {
  this.oracles.push(o);
}

Environment.prototype.addOracleShepherd = function(os) {
  this.oracleShepherds.push(os);
}

Environment.prototype.addNovelty = function(n) {
  this.novelObjects.push(n);
}

Environment.prototype.addObstacle = function(ob) {
  this.obstacles.push(ob);
}

Environment.prototype.addGate = function(g) {
  this.gates.push(g);
}

// ------------ FUNCTIONS TO REMOVE AGENTS/OBJECTS ------------
Environment.prototype.deleteAnimal = function() {
  this.herd.pop();
}

Environment.prototype.deleteShepherd = function() {
  this.shepherds.pop();
}

Environment.prototype.deleteNovelty = function() {
  this.novelObjects.pop();
}

Environment.prototype.deleteObstacle = function() {
  this.obstacles.pop();
}

// ------------ FUNCTIONS TO MANAGE ENV VARIABLES ------------
Environment.prototype.displayNums = function () {
  return this.herd.length;
}

Environment.prototype.avgSpeed = function() {
  this.averageSpeed = 0;
  for (var i = 0; i < this.herd.length; i++) {
    this.averageSpeed += this.herd[i].velocity.mag();
  }
  this.averageSpeed = this.averageSpeed / this.herd.length;
  return this.averageSpeed;
}

Environment.prototype.totalStress = function() {
  this.stress = 0;
  for (var i = 0; i < this.herd.length; i++) {
    this.stress += this.herd[i].stressLevel;
  }
  return this.stress;
}

Environment.prototype.timeSteps = function() {
  this.time = 0;
  for (var i = 0; i < this.autoShepherds.length; i++) {
    this.time += this.autoShepherds[i].timestep;
  }
  if (this.time % 50 == 0){
    this.oldTime = this.time;
    return this.time;
  } else {
    return this.oldTime;
  }
}

Environment.prototype.vocalizing = function () {
  this.vocal = false;
  for (var i = 0; i < this.herd.length; i++) {
    if (this.herd[i].vocalizing == true){
      this.vocal = true;
    }
  }
  return this.vocal;
}

// ------------ FUNCTIONS TO REMOVE ANIMAL FROM ENV WHEN THEY REACH GATE ------------
Environment.prototype.hitTheGap = function(animal) {
  this.accumulatedStress = (this.accumulatedStress + animal.stressLevel);
  console.log('Accumulated stress: ' + this.accumulatedStress);
  var index = this.herd.map(function (item) { // Find index of animal using 'name' property
    return item.name;
  }).indexOf(animal.name);

  this.herd.splice(index, 1); // Remove selected animal after they have left field
}

// ------------ FUNCTIONS TO CLEAR ALL AGENTS/OBJECTS FROM CANVAS ------------
Environment.prototype.removeAll = function() {
  this.herd.length = 0;
  this.shepherds.length = 0;
  this.autoShepherds.length = 0;
  this.multiGPSShepherds.length = 0;
  this.oracles.length = 0;
  this.oracleShepherds.length = 0;
  this.novelObjects.length = 0;
  this.obstacles.length = 0;
  this.accumulatedStress = 0;
}

// ------------ FUNCTIONS TO DISPLAY HERD RADIUS ------------
Environment.prototype.displayHerd = function() {
  // Find animal agents that are furthest left, right, highest, lowest on canvas
  this.herdBottom = Math.max.apply(Math, this.herd.map(function(o) { return o.position.y; }));
  this.herdTop = Math.min.apply(Math, this.herd.map(function(o) { return o.position.y; }));
  this.herdLeft = Math.min.apply(Math, this.herd.map(function(o) { return o.position.x; }));
  this.herdRight = Math.max.apply(Math, this.herd.map(function(o) { return o.position.x; }));

  // Find centre of herd based on locations of furthest animals
  var yPos = (this.herdBottom + this.herdTop) / 2;
  var xPos = (this.herdLeft + this.herdRight) / 2;

  // Find which animals are furthest from herd centre
  var topDist, botDist, leftDist, rightDist, ylen, xlen;
  topDist = yPos - this.herdTop;
  botDist = this.herdBottom - yPos;
  leftDist = xPos - this.herdLeft;
  rightDist = this.herdRight - xPos;

  // Use length from furthest two animals ** This needs some work**
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
  rect(xPos, yPos, xlen*2 + 225, ylen*2 + 225, 90);

  // Draw pressure zone
  fill(0);
  stroke(0);
  ellipse(this.herdLeft,this.herdTop, 10, 10);

  fill(0);
  stroke(0);
  ellipse(this.herdRight,this.herdBottom, 10, 10);
}

// ------------ FUNCTIONS TO DRAW SECTORS ------------
// Currently not used for anything, will be used for oracle drone
Environment.prototype.sectors = function () {

  stroke(255);
  fill(0,0,0,0.1);
  rect(0,0, width/3, height/3);
  rect(width/3,0, width/3, height/3);
  rect(width-width/3,0, width/3,height/3);
  // Middle Sectors
  rect(0,height/3, width/3, height/3);
  rect(width/3,height/3, width/3, height/3);
  rect(width-width/3,height/3, width/3,height/3);
  // Middle Sectors
  rect(0,height-height/3, width/3, height/3);
  rect(width/3,height -height/3, width/3, height/3);
  rect(width-width/3,height-height/3, width/3,height/3);

  //Sector labels
  stroke(0,0,255);
  text("Sector 1", 10, height/3 - 10);
  text("Sector 2", width/3 + 10, height/3 - 10);
  text("Sector 3", width-width/3 + 10, height/3 - 10);

  text("Sector 4", 10, height-height/3 - 10);
  text("Sector 5", width/3 + 10, height - height/3 - 10);
  text("Sector 6", width-width/3 + 10, height - height/3 - 10);

  text("Sector 7", 10, height - 10);
  text("Sector 8", width/3 + 10, height - 10);
  text("Sector 9", width-width/3 + 10, height - 10);

  fill(25,25,25);
  stroke(0);
  ellipse(980, 570, 20);
}

// // Method to allow for class extensions
// function extend (base, constructor) {
//   var prototype = new Function();
//   prototype.prototype = base.prototype;
//   constructor.prototype = new prototype();
//   constructor.prototype.constructor = constructor;
// }
