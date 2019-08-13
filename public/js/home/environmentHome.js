// Environment class, holds/manages all agents/objects in the simulation
function Environment() {
  // Initialize arrays to store agents/objects
  this.herd = []; // Stores animal agents
  this.shepherds = [];
  this.autoShepherds = [];
  this.oracles = [];
  this.oracleShepherds = [];
  this.multiGPSShepherds = [];
  this.multiOracleShepherds = [];
  this.novelObjects = [];
  this.gates = [];
  this.obstacles = [];
  this.allShepherds = [];

  // Create environmental variables
  this.accumulatedStress = 0;
  this.accumulatedStress.toFixed(2);
  this.stress = 0; // **Delete when fixed in animal class**
  this.averageSpeed = 0;
  this.vocal = false;
  this.oldTime = 0; // Used for displaying timesteps, timestep variable currently held by shepherd **change to here**
  this.oldMoves = 0;
  this.testNum = testNumRadio.value();
  this.testNumStatic = testNumRadio.value();
  this.testCounter = 1;
  this.totalTime = 0;
  this.totalMoves = 0;
  this.totalAccStress = 0;
  this.testResults = [];

}

// ------------ CREATES AGENTS/OBJECTS WHEN PASSED INFO FROM SKETCH ------------
Environment.prototype.run = function() {
  for (var i = 0; i < this.herd.length; i++) {
    this.herd[i].run(this.herd, this.shepherds, this.novelObjects, this.autoShepherds, this.multiGPSShepherds, this.obstacles, this.oracleShepherds, this.multiOracleShepherds);  // Passing all arrays to each animal
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

  for(var i = 0; i < this.multiOracleShepherds.length; i++) {
    this.multiOracleShepherds[i].run(this.oracles);
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

  if(this.herd.length == 0 && this.testNum >= 1) {
    this.testNum--;
    if(this.testNum >= 1) {
      this.runItBack();
    }
  } else if (this.testNum == 0) {
    let myNumbers = {
      num: this.testCounter,
      time: this.oldTime,
      move: this.oldMoves,
      adverse: this.accumulatedStress
    }
    this.testResults.push(myNumbers);
    manageFE.addTestResult();
    manageFE.updateMyChart();
    this.totalTime += this.oldTime;
    this.totalMoves += this.oldMoves;
    this.totalTime = this.totalTime / this.testNumStatic;
    console.log("Total from else if: " + this.totalTime)
    this.totalMoves = this.totalMoves / this.testNumStatic;
    this.totalAccStress = this.totalAccStress / this.testNumStatic;
    this.testNum--;
    // alert("Tests Complete: " + this.testNumStatic +
    //       "\n Average TimeSteps: " + this.totalTime.toFixed(0) +
    //       "\n Average Good Movement: " + this.totalMoves.toFixed(0) +
    //       "\n Average Adverse Conditions: " + this.totalAccStress.toFixed(2));
    manageFE.addAverageResults();
    this.totalTime = 0;
    this.totalMoves = 0;
    this.totalAccStress = 0;
  }


}
 // + "\n Adverse Conditions: " + this.accumulatedStress
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

Environment.prototype.addMultiOracleShepherd = function(mos) {
  this.multiOracleShepherds.push(mos);
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

Environment.prototype.removeGate = function () {
  this.gates.pop();
}

// ------------ FUNCTIONS TO REMOVE AGENTS/OBJECTS ------------
Environment.prototype.deleteAnimal = function() {
  this.herd.pop();
}

Environment.prototype.deleteShepherd = function() {
  this.shepherds.length = 0;
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

Environment.prototype.avgHeading = function() {
  this.averageHeading = 0;
  for (var i = 0; i < this.herd.length; i++) {
    this.averageHeading += this.herd[i].velocity.heading();
  }
  this.averageHeading = this.averageHeading / this.herd.length;
  return this.averageHeading;
}

Environment.prototype.totalStress = function() {
  this.stress = 0;
  for (var i = 0; i < this.herd.length; i++) {
    this.stress += this.herd[i].stressLevel;
  }
  return this.stress;
}

Environment.prototype.timeSteps = function() {
  this.allShepherds = this.autoShepherds.concat(this.multiGPSShepherds, this.oracles);
  this.time = 0;
  for (var i = 0; i < this.allShepherds.length; i++) {
    this.time += this.allShepherds[i].timestep;
  }
  if (this.time % 50 == 0){
    this.oldTime = this.time;
    return this.time;
  } else {
    return this.oldTime;
  }
}

Environment.prototype.goodMovementTime = function() {
  this.allShepherds = this.autoShepherds.concat(this.multiGPSShepherds, this.oracles);
  this.goodMoves = 0;
  for (var i = 0; i < this.allShepherds.length; i++) {
    this.goodMoves += this.allShepherds[i].goodMovement;
  }
  if (this.goodMoves % 50 == 0){
    this.oldMoves = this.goodMoves;
    return this.goodMoves;
  } else {
    return this.oldMoves;
  }
}

Environment.prototype.theCorrectHeading = function() {
  this.allShepherds = this.autoShepherds.concat(this.multiGPSShepherds, this.oracles);
  if(this.allShepherds.length > 0) {
    return this.allShepherds[0].correctHeading;
  } else {
    return 0;
  }
}

Environment.prototype.shepCollect = function () {
  this.allShepherds = this.autoShepherds.concat(this.multiGPSShepherds, this.oracleShepherds);
  if(this.allShepherds.length > 0) {
    return this.allShepherds[0].collectBool;
  } else {
    return false;
  }
}

Environment.prototype.getSectors = function () {
  if(this.oracles.length > 0) {
    return this.oracles[0].numSectors;
  } else {
    return "0";
  }
}

Environment.prototype.getOracleTarget = function () {
  if(this.oracles.length > 0) {
    var t = this.oracles[0].lol.x + ", " + this.oracles[0].lol.y;
    return t;
  } else {
    return "No Target";
  }
}

Environment.prototype.getOracleSearchArea = function () {
  if(this.oracles.length > 0) {
    var t = this.oracles[0].isForDisplayStart;
    return t;
  } else {
    return "No Target";
  }
}

Environment.prototype.shepMove = function () {
  this.allShepherds = this.autoShepherds.concat(this.multiGPSShepherds, this.oracleShepherds);
  if(this.allShepherds.length > 0) {
    return this.allShepherds[0].moveBool;
  } else {
    return false;
  }
}

Environment.prototype.oShepMove = function () {
  if(this.oracleShepherds.length > 0) {
    return this.oracleShepherds[0].isFollowing;
  } else {
    return false;
  }
}

Environment.prototype.oShepCol = function () {
  if(this.oracleShepherds.length > 0) {
    return this.oracleShepherds[0].isCollecting;
  } else {
    return false;
  }
}

Environment.prototype.shepAvoidHerd = function () {
  this.allShepherds = this.autoShepherds.concat(this.multiGPSShepherds, this.oracleShepherds);
  if(this.allShepherds.length > 0) {
    return this.allShepherds[0].avoidHerdBool;
  } else {
    return false;
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

Environment.prototype.checkBunched = function () {
  herdBottom = Math.max.apply(Math, this.herd.map(function(o) { return o.position.y; }));
  herdTop = Math.min.apply(Math, this.herd.map(function(o) { return o.position.y; }));
  herdLeft = Math.min.apply(Math, this.herd.map(function(o) { return o.position.x; }));
  herdRight = Math.max.apply(Math, this.herd.map(function(o) { return o.position.x; }));
  herDist = dist(herdLeft, herdTop, herdRight, herdBottom);
  if (herDist < 200) {
    return true;
  } else {
    return false;
  }
}

// ------------ FUNCTIONS TO REMOVE ANIMAL FROM ENV WHEN THEY REACH GATE ------------
Environment.prototype.hitTheGap = function(animal) {
  this.accumulatedStress += animal.stressLevel;
  this.totalAccStress += animal.stressLevel;
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
  this.multiOracleShepherds.length = 0;
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

Environment.prototype.runItBack = function () {
  let myNumbers = {
    num: this.testCounter,
    time: this.oldTime,
    move: this.oldMoves,
    adverse: this.accumulatedStress
  }
  this.testResults.push(myNumbers);
  manageFE.addTestResult();
  manageFE.updateMyChart();
  this.testCounter++;

  this.totalTime += this.oldTime;
  this.totalMoves += this.oldMoves;
  this.time = 0;
  this.oldTime = 0;
  this.accumulatedStress = 0;
  this.goodMoves = 0;
  this.oldMoves = 0;
  this.removeAll();
  manageEnv.createNewEnv();
  if(manageEnv.uavType == "SingleGPS") {
    manageEnv.singleGPSHerd();
  } else if (manageEnv.uavType == "multiGPS") {
    manageEnv.multiGPSHerd();
  } else if (manageEnv.uavType == "oracleHerd") {
    manageEnv.oracleHerd();
  } else if (manageEnv.uavType == "multiOracle") {
    manageEnv.multiOracleHerd();
  }
}



// // Method to allow for class extensions
// function extend (base, constructor) {
//   var prototype = new Function();
//   prototype.prototype = base.prototype;
//   constructor.prototype = new prototype();
//   constructor.prototype.constructor = constructor;
// }
