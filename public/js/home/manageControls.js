let testNames = [];

// Class to manage front-end control creation and updates
function ManageControls () {}

// Function run at start up, creates all starting controls
ManageControls.prototype.createControls = function () {

  // ---------- CREATE CANVAS ----------
  // Have to create canvas here for buttons to be able to manipulate it
  var canvas = createCanvas(1000,600);
  img1 = loadImage('./css/images/Field1B.jpg'); // Load background images
  img2 = loadImage('./css/images/Field_1.jpg'); // Image to be used is selected in draw function
  img3 = loadImage('./css/images/Field_2.jpg'); // in sketchTest Image by Gerd Altmann from Pixabay
  img4 = loadImage('./css/images/Field_3.jpg');
  img5 = loadImage('./css/images/fence.jpg');
  canvas.parent('myCanvas'); // .parent allows item to manipulated on html page

  // frameRate(30); // Set Frame Rate

  // ---------- CHECKBOXES TO TURN ON/OFF SIM INFO ON CANVAS ----------
  zoneCheck = createCheckbox("Display Each Zone");
  zoneCheck.parent("zoneDiv");

  // Create checkbox to display flight/Pressure zones
  herdZoneCheck = createCheckbox("Display Herd Zone");
  herdZoneCheck.parent("zoneDiv");

  // Create checkbox to display flight/Pressure zones
  forceCheck = createCheckbox("Display Force Zone");
  forceCheck.parent("zoneDiv");

  // Create checkbox to display flight/Pressure zones
  nameCheck = createCheckbox("Display Animal Info");
  nameCheck.parent("zoneDiv");

  // Create checkbox to display flight/Pressure zones
  animalGoalCheck = createCheckbox("Show Animal Goals" , true);
  animalGoalCheck.parent("zoneDiv");

  // Create checkbox to display flight/Pressure zones
  lineCheck = createCheckbox("Show Shep Lines", true);
  lineCheck.parent("uavStuff");

  // Create checkbox to display flight/Pressure zones
  shepGoalCheck = createCheckbox("Show Shep Goals", true);
  shepGoalCheck.parent("uavStuff");

  // Create checkbox to display flight/Pressure zones
  sectorCheck = createCheckbox("Show Sectors", true);
  sectorCheck.parent("oracleStuff");

  // -------- START AUTO SHEPHERD --------
  droneHerd = createButton('GPS UAV');
  droneHerd.parent('droneHerd');
  droneHerd.mouseClicked(herd);

  // -------- START ORCALE --------
  createOracle = createButton('Oracle UAV');
  createOracle.parent('oracleBtn');
  createOracle.mouseClicked(oracle);

  // -------- START Multi-Drones --------
  createMulti = createButton('Multi-GPS');
  createMulti.parent('multiBtn');
  createMulti.mouseClicked(multiDrone);

  // -------- START Multi-Drones --------
  createMulti = createButton('Multi-Oracle');
  createMulti.parent('multiOracleBtn');
  createMulti.mouseClicked(multiDrone);

  // -------- RESET BUTTON --------
  resetBtn = createButton('Reset');
  resetBtn.parent('resetBtn');
  resetBtn.mouseClicked(createNewEnv);

  // -------- PAUSE BUTTON --------
  pauseBtn = createButton('Pause');
  pauseBtn.parent('pauseBtn');
  pauseBtn.mouseClicked(togglePlay);

  // -------- SELECT ENVIRONMENT RADIO BUTTONS --------
  envRadio = createRadio();
  envRadio.parent("envRadio");
  envRadio.option('1', 1);
  envRadio.option('2', 2);
  envRadio.option('3', 4);
  envRadio.option('4', 5);
  // envRadio.style('width', '100px');
  // textAlign(CENTER);
  // fill(255, 0, 0);

  pathRadio = createRadio();
  pathRadio.parent("pathRadio");
  pathRadio.option('Reactive', 1);
  pathRadio.option('Planned', 2);

  anNumRadio = createRadio();
  anNumRadio.parent("anNumRadio");
  anNumRadio.option('10', 1);
  anNumRadio.option('25', 2);
  anNumRadio.option('50', 3);

  anTypeRadio = createRadio();
  anTypeRadio.parent("anTypeRadio");
  anTypeRadio.option('Tame', 1);
  anTypeRadio.option('Flighty', 2);

  testNumRadio = createRadio();
  testNumRadio.parent("testNumRadio");
  testNumRadio.option('1', 1);
  testNumRadio.option('5', 5);
  testNumRadio.option('25', 25);
  testNumRadio.option('50', 50);

  //  Select starting environment
  envRadio._getInputChildrenArray()[0].checked = true;
  pathRadio._getInputChildrenArray()[0].checked = true;
  anNumRadio._getInputChildrenArray()[0].checked = true;
  anTypeRadio._getInputChildrenArray()[0].checked = true;
  testNumRadio._getInputChildrenArray()[0].checked = true;

  // Initialize new environment
  environment = new Environment();
  // Function which initilises starting agents and obstecles
  // Needs to be called before information paragraphs or they will through errord from recieving null arguements
  createNewEnv();

  // ---------- CREATE PARAGRAPHS TO DISPLAY INFO ----------
  var timeSteps = environment.timeSteps();
  timeDisplay = createP("Timesteps: " + timeSteps);
  timeDisplay.parent("envInfoDiv");

  animalDisplay = createP("Number of Animals: " + environment.herd.length);
  animalDisplay.parent("envInfoDiv");

  vocalDisplay = createP("Vocalizing: false");
  vocalDisplay.parent("animalInfoDiv");

  var fixedStress = environment.totalStress().toFixed(2);
  stressDisplay = createP("Adverse Conditions: " + fixedStress);
  stressDisplay.parent("envInfoDiv");

  var goodMoves = environment.goodMovementTime();
  movementDisplay = createP("Good Movement Steps: " + goodMoves);
  movementDisplay.parent("envInfoDiv");

  manualUAVDisplay = createP("Manual UAV: " + "No");
  manualUAVDisplay.parent("envInfoDiv");

  totalUAVDisplay = createP("Total UAV's: " + "0");
  totalUAVDisplay.parent("envInfoDiv");

  var fixedSpeed = environment.avgSpeed().toFixed(2);
  speedDisplay = createP("Average Speed: " + fixedSpeed);
  speedDisplay.parent("animalInfoDiv");

  var avgHeading = environment.avgHeading().toFixed(2);
  headingDisplay = createP("Average Heading: " + avgHeading);
  headingDisplay.parent("animalInfoDiv");

  var isBunched = environment.checkBunched();
  bunchedDisplay = createP("Bunched: " + isBunched);
  bunchedDisplay.parent("animalInfoDiv");

  var numSectors = environment.getSectors();
  numSectorDisplay = createP("Number of Sectors: " + numSectors);
  numSectorDisplay.parent("oracleInfoDiv");

  var currentTarget = environment.getOracleTarget();
  currentTargetDisplay = createP("Current Target: " + currentTarget);
  currentTargetDisplay.parent("oracleInfoDiv");

  var currentSearchArea = environment.getOracleSearchArea();
  currentSearchAreaDisplay = createP("Searching: " + currentSearchArea + " -> X");
  currentSearchAreaDisplay.parent("oracleInfoDiv");

  var isCollecting = environment.shepCollect();
  collectingDisplay = createP("Collecting: " + isCollecting);
  collectingDisplay.parent("gpsInfoDiv");

  var isMoving = environment.shepMove();
  moveDisplay = createP("Moving: " + isMoving);
  moveDisplay.parent("gpsInfoDiv");

  var isAvoidingOBS = environment.shepAvoidHerd();
  avoOBSDisplay = createP("Avoid Obstacle: " + isAvoidingOBS);
  avoOBSDisplay.parent("gpsInfoDiv");

  var isAvoidingHerd = environment.shepAvoidHerd();
  avoherdDisplay = createP("Avoid herd: " + isAvoidingHerd);
  avoherdDisplay.parent("gpsInfoDiv");

  var goodHeading = environment.theCorrectHeading().toFixed(2);
  goodHeadingDisplay = createP("Desired Heading: " + goodHeading);
  goodHeadingDisplay.parent("gpsInfoDiv");

}

// Function to update simulation info each frame
ManageControls.prototype.updateSimInfo = function () {
  manShep = ((environment.shepherds.length > 0) ? 'True' : 'False');
  totalUAVs = environment.shepherds.length + environment.autoShepherds.length + environment.oracles.length +
  environment.oracleShepherds.length + environment.multiGPSShepherds.length;

  // Destroy all info outputs from previous frame
  animalDisplay.remove();
  stressDisplay.remove();
  speedDisplay.remove();
  timeDisplay.remove();
  manualUAVDisplay.remove();
  totalUAVDisplay.remove();
  movementDisplay.remove();
  vocalDisplay.remove();
  numSectorDisplay.remove();
  currentTargetDisplay.remove();
  headingDisplay.remove();
  bunchedDisplay.remove();
  collectingDisplay.remove();
  moveDisplay.remove();
  avoOBSDisplay.remove();
  avoherdDisplay.remove();
  currentSearchAreaDisplay.remove();
  goodHeadingDisplay.remove();

  // Update with sim info from current frame
  var timeSteps = environment.timeSteps();
  timeDisplay = createP("Timesteps: " + timeSteps);
  timeDisplay.parent("envInfoDiv");

  animalDisplay = createP("Number of Animals: " + environment.herd.length);
  animalDisplay.parent("envInfoDiv");

  vocalDisplay = createP("Vocalizing: false");
  vocalDisplay.parent("animalInfoDiv");

  var fixedStress = environment.totalStress().toFixed(2);
  stressDisplay = createP("Adverse Conditions: " + fixedStress);
  stressDisplay.parent("envInfoDiv");

  var goodMoves = environment.goodMovementTime();
  movementDisplay = createP("Good Movement Steps: " + goodMoves);
  movementDisplay.parent("envInfoDiv");

  manualUAVDisplay = createP("Manual UAV: " + manShep);
  manualUAVDisplay.parent("envInfoDiv");

  totalUAVDisplay = createP("Total UAV's: " + totalUAVs);
  totalUAVDisplay.parent("envInfoDiv");

  var fixedSpeed = environment.avgSpeed().toFixed(2);
  speedDisplay = createP("Average Speed: " + fixedSpeed);
  speedDisplay.parent("animalInfoDiv");

  var avgHeading = environment.avgHeading().toFixed(2);
  headingDisplay = createP("Average Heading: " + avgHeading);
  headingDisplay.parent("animalInfoDiv");

  var isBunched = environment.checkBunched();
  bunchedDisplay = createP("Bunched: " + isBunched);
  bunchedDisplay.parent("animalInfoDiv");

  var numSectors = environment.getSectors();
  numSectorDisplay = createP("Number of Sectors: " + numSectors);
  numSectorDisplay.parent("oracleInfoDiv");

  var currentTarget = environment.getOracleTarget();
  currentTargetDisplay = createP("Current Target: " + currentTarget);
  currentTargetDisplay.parent("oracleInfoDiv");

  var currentSearchArea = environment.getOracleSearchArea();
  currentSearchAreaDisplay = createP("Searching: " + currentSearchArea + " -> X");
  currentSearchAreaDisplay.parent("oracleInfoDiv");

  var isCollecting = environment.shepCollect();
  collectingDisplay = createP("Collecting: " + isCollecting);
  collectingDisplay.parent("gpsInfoDiv");

  var isMoving = environment.shepMove();
  moveDisplay = createP("Moving: " + isMoving);
  moveDisplay.parent("gpsInfoDiv");

  var isAvoidingOBS = environment.vocalizing();
  avoOBSDisplay = createP("Avoid Obstacle: " + isAvoidingOBS);
  avoOBSDisplay.parent("gpsInfoDiv");

  var isAvoidingHerd = environment.shepAvoidHerd();
  avoherdDisplay = createP("Avoid herd: " + isAvoidingHerd);
  avoherdDisplay.parent("gpsInfoDiv");

  var goodHeading = environment.theCorrectHeading().toFixed(2);
  goodHeadingDisplay = createP("Desired Heading: " + goodHeading);
  goodHeadingDisplay.parent("gpsInfoDiv");
}

// Pause function for simulation -> when pause button clicked, boolean switches stopping canvas update
function togglePlay() {
  if (isPlaying == true) {
     loop();  // Lets canvas update
     pauseBtn.html('Pause'); // Change wording on button
     isPlaying = false;
  } else if (isPlaying == false) {
     noLoop(); // Stops canvas from updating
     pauseBtn.html('Play');
     isPlaying = true;
  }
}

function keyPressed() {
  if (keyCode == 80) {
    if (isPlaying == true) {
       loop();  // Lets canvas update
       pauseBtn.html('Pause'); // Change wording on button
       isPlaying = false;
    } else if (isPlaying == false) {
       noLoop(); // Stops canvas from updating
       pauseBtn.html('Play');
       isPlaying = true;
    }
}
}

// function mouseClicked() {
//   addAnAnimal();
// }
//
// function addAnAnimal () {
//   envronment.addAnimal(new Animal(mouseX, mouseY, animalGoals));
// }

ManageControls.prototype.addTestResult = function () {
  var results = environment.testResults;
    for(var i = results.length-1; i < results.length; i++) {
      test = createP("Test: " + results[results.length-1].num + " Time: " + results[results.length-1].time + " Move: " + results[results.length-1].move +
                          " Adverse: " + results[i].adverse.toFixed(2));
      if(i < 10) {
        test.parent("test" + 0);
      } else if (i < 20) {
        test.parent("test" + 1);
      } else if (i < 30) {
        test.parent("test" + 2);
      } else if (i < 40) {
        test.parent("test" + 3);
      } else if (i < 50) {
        test.parent("test" + 4);
      }
    }
}
