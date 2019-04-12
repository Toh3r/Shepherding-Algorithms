// --------------------------------------------------------------------------------
//                  T A R G E T - R I G  H T
// --------------------------------------------------------------------------------

AutoShepherd.prototype.collectAnimals = function (herd) {

 if (this.movingUp == false) {
   var target = createVector(this.herdLeft - 20, this.herdBottom + 40);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (this.position.y >= this.herdBottom + 20 && this.position.x <= this.herdLeft){
     // console.log("Turning true");
     this.movingUp = true;
   }
   return steer;
 } else if (this.movingUp == true) {
   var target = createVector(this.herdLeft - 20, this.herdTop - 40);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (this.position.y <= this.herdTop + 20 ){
     this.movingUp = false;
     // console.log("Turning false")
   }
   return steer;
 }
}

AutoShepherd.prototype.moveAnimals = function () {

  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(980,250); // Location of exit

  var diffXPos = herdX - goal.x; // Diff of herd x co-ord to goal x co-ord
  var diffYPos = herdY - goal.y; // Diff of herd y co-ord to goal y co-ord

  animalFL = Math.abs(herdX - this.herdLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.herdRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.herdTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.herdBottom); // Cords of animal furthest bottom
  // console.log("Top and Bot: " + animalFT, animalFB)
  furthestAnimal = Math.max(animalFL);

  // var target = createVector(0,0);
  // this.targetSelect(goal, target);


  if (this.movingUp == false) {
    if (environment.avgSpeed() < 0.35) {
      // console.log(environment.avgSpeed());
      var target = createVector(herdX + (diffYPos)/2 - (furthestAnimal + 30), herdY + (furthestAnimal + 30));
    } else {
      // console.log(environment.avgSpeed());
      var target = createVector(herdX + (diffYPos) /2 - (furthestAnimal + 50) - 40, herdY +  (furthestAnimal + 50));
    }
    this.targetInBounds(target);
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (this.position.y >= herdY + 40 && this.position.x <= herdX + (diffYPos) /2 - 20){
      this.movingUp = true;
    }
    return steer;
  } else if (this.movingUp == true) {
    if (environment.avgSpeed() < 0.35) {
      var target = createVector(herdX - (diffYPos)/2 - (furthestAnimal + 30),herdY  - (furthestAnimal+30));
    } else {
      var target = createVector(herdX - (diffYPos) / 2 - (furthestAnimal + 50) - 40, herdY - (furthestAnimal + 50));
    }
    this.targetInBounds(target);
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (this.position.y <= herdY - 40){
      this.movingUp = false;
    }
    return steer;
  }
}

// --------------------------------------------------------------------------------
//                   T A R G E T - L E F T
// --------------------------------------------------------------------------------

AutoShepherd.prototype.collectAnimals = function (herd) {

 if (this.movingUp == false) {
   var target = createVector(this.herdRight + 20, this.herdBottom + 40);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (this.position.y >= this.herdBottom + 20 && this.position.x >= this.herdRight){
     // console.log("Turning true");
     this.movingUp = true;
   }
   return steer;
 } else if (this.movingUp == true) {
   var target = createVector(this.herdRight + 20, this.herdTop - 40);
   this.targetInBounds(target);
   var desired = p5.Vector.sub(target, this.position);
   desired.normalize();
   desired.mult(this.maxspeed);
   var steer = p5.Vector.sub(desired, this.velocity);
   steer.limit(this.maxforce);
   if (this.position.y <= this.herdTop + 20 ){
     this.movingUp = false;
     // console.log("Turning false")
   }
   return steer;
 }
}

AutoShepherd.prototype.moveAnimals = function () {

  var herdX = (this.herdRight + this.herdLeft) / 2; // X co-ord of herd centre
  var herdY = (this.herdTop + this.herdBottom) / 2; // Y co-ord of herd centre

  var center = createVector(herdX, herdY); // Centre co-ords of herd
  var goal = createVector(980,250); // Location of exit

  var diffXPos = herdX - goal.x; // Diff of herd x co-ord to goal x co-ord
  var diffYPos = herdY - goal.y; // Diff of herd y co-ord to goal y co-ord

  animalFL = Math.abs(herdX - this.herdLeft); // Cords of animal furthest left
  animalFR = Math.abs(herdX - this.herdRight);  // Cords of animal furthest right
  animalFT = Math.abs(herdY - this.herdTop); // Cords of animal furthest top
  animalFB = Math.abs(herdY - this.herdBottom); // Cords of animal furthest bottom
  // console.log("Top and Bot: " + animalFT, animalFB)
  furthestAnimal = Math.max(animalFR);

  // var target = createVector(0,0);
  // this.targetSelect(goal, target);


  if (this.movingUp == false) {
    if (environment.avgSpeed() < 0.35) {
      // console.log(environment.avgSpeed());
      var target = createVector(herdX - (diffYPos)/2 + (furthestAnimal + 30), herdY + (furthestAnimal + 30));
    } else if (environment.avgSpeed() > 0.35) {
      // console.log(environment.avgSpeed());
      var target = createVector(herdX - (diffYPos) /2 + (furthestAnimal + 50) + 40, herdY + (furthestAnimal + 30));
    }
    this.targetInBounds(target);
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (this.position.y >= herdY + 40 && this.position.x >= herdX - (diffYPos) /2 + 20){
      this.movingUp = true;
    }
    return steer;
  } else if (this.movingUp == true) {
    if (environment.avgSpeed() < 0.35) {
      var target = createVector(herdX + (diffYPos)/2 + (furthestAnimal + 30),herdY  - (furthestAnimal+30));
    } else if (environment.avgSpeed() > 0.35) {
      var target = createVector(herdX + (diffYPos) / 2 + (furthestAnimal + 50) + 40, herdY - (furthestAnimal + 30));
    }
    this.targetInBounds(target);
    var desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    if (this.position.y <= herdY - 40){
      this.movingUp = false;
    }
    return steer;
  }
}

// --------------------------------------------------------------------------------
//                  T A R G E T - T O P
// --------------------------------------------------------------------------------
