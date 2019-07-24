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

  // ---------- SPEED SLIDERS ----------
  wSpeedSlider = createSlider(0, 2, 0.1, 0.1);
  wSpeedSlider.parent('wSpeSli');
  wSpeOut = createElement("h6", wSpeedSlider.value());
  wSpeOut.parent('wSpeSli');

  pSpeedSlider = createSlider(0, 2, 0.4, 0.1);
  pSpeedSlider.parent('pSpeSli');
  pSpeOut = createElement("h6", pSpeedSlider.value());
  pSpeOut.parent('pSpeSli');

  fSpeedSlider = createSlider(0, 2, 0.6, 0.1);
  fSpeedSlider.parent('fSpeSli');
  fSpeOut = createElement("h6", fSpeedSlider.value());
  fSpeOut.parent('fSpeSli');

  // ---------- VELOCITY SLIDERS ----------
  wVelSlider = createSlider(0, 2, 0.1, 0.1);
  wVelSlider.parent('wVelSli');
  wVelOut = createElement("h6", wVelSlider.value());
  wVelOut.parent('wVelSli');

  pVelSlider = createSlider(0, 2, 0.4, 0.1);
  pVelSlider.parent('pVelSli');
  pVelOut = createElement("h6", pVelSlider.value());
  pVelOut.parent('pVelSli');

  fVelSlider = createSlider(0, 2, 0.6, 0.1);
  fVelSlider.parent('fVelSli');
  fVelOut = createElement("h6", fVelSlider.value());
  fVelOut.parent('fVelSli');

  // ---------- SEPERATION SLIDERS ----------
  sepWanSlider = createSlider(0, 5, 4, 0.1);
  sepWanSlider.parent('sepWan');
  sepWanOut = createElement("h6", sepWanSlider.value());
  sepWanOut.parent('sepWan');

  sepPreSlider = createSlider(0, 5, 1.2, 0.1);
  sepPreSlider.parent('sepPre');
  sepPreOut = createElement("h6", sepPreSlider.value());
  sepPreOut.parent('sepPre');

  sepFliSlider = createSlider(0, 5, 1.2, 0.1);
  sepFliSlider.parent('sepFli');
  sepFliOut = createElement("h6", sepFliSlider.value());
  sepFliOut.parent('sepFli');

  // ---------- ALIGNMENT SLIDERS ----------
  aliWanSlider = createSlider(0, 5, 0, 0.1);
  aliWanSlider.parent('aliWan');
  aliWanOut = createElement("h6", aliWanSlider.value());
  aliWanOut.parent('aliWan');

  aliPreSlider = createSlider(0, 5, 0.7, 0.1);
  aliPreSlider.parent('aliPre');
  aliPreOut = createElement("h6", aliPreSlider.value());
  aliPreOut.parent('aliPre');

  aliFliSlider = createSlider(0, 5, 0.7, 0.1);
  aliFliSlider.parent('aliFli');
  aliFliOut = createElement("h6", aliFliSlider.value());
  aliFliOut.parent('aliFli');

  // ---------- COHESION SLIDERS ----------
  cohWanSlider = createSlider(0, 5, 0, 0.1);
  cohWanSlider.parent('cohWan');
  cohWanOut = createElement("h6", cohWanSlider.value());
  cohWanOut.parent('cohWan');

  cohPreSlider = createSlider(0, 5, 1, 0.1);
  cohPreSlider.parent('cohPre');
  cohPreOut = createElement("h6", cohPreSlider.value());
  cohPreOut.parent('cohPre');

  cohFliSlider = createSlider(0, 5, 0.8, 0.1);
  cohFliSlider.parent('cohFli');
  cohFliOut = createElement("h6", cohFliSlider.value());
  cohFliOut.parent('cohFli');

  // ---------- dSEP SLIDERS ----------
  dSepPreSlider = createSlider(0, 5, 0.1, 0.1);
  dSepPreSlider.parent('dSepPre');
  dSepPreOut = createElement("h6", dSepPreSlider.value());
  dSepPreOut.parent('dSepPre');

  dSepFliSlider = createSlider(0, 5, 1.5, 0.1);
  dSepFliSlider.parent('dSepFli');
  dSepFliOut = createElement("h6", dSepFliSlider.value());
  dSepFliOut.parent('dSepFli');

  // ---------- FORCE RADIUS SLIDERS ----------
  sepSizeSlider = createSlider(0, 200, 15, 5);
  sepSizeSlider.parent('sepSizeSli');
  sepSizeOut = createElement("h6", sepSizeSlider.value());
  sepSizeOut.parent('sepSizeSli');

  aliSizeSlider = createSlider(0, 200, 200, 5);
  aliSizeSlider.parent('aliSizeSli');
  aliSizeOut = createElement("h6", aliSizeSlider.value());
  aliSizeOut.parent('aliSizeSli');

  cohSizeSlider = createSlider(0, 200, 200, 5);
  cohSizeSlider.parent('cohSizeSli');
  cohSizeOut = createElement("h6", cohSizeSlider.value());
  cohSizeOut.parent('cohSizeSli');

  dSepSizeSlider = createSlider(0, 200, 50, 5);
  dSepSizeSlider.parent('dSepSizeSli');
  dSepSizeOut = createElement("h6", dSepSizeSlider.value());
  dSepSizeOut.parent('dSepSizeSli');

  // ---------- ZONE RADIUS SLIDERS ----------
  preSizeSlider = createSlider(0, 200, 200, 10);
  preSizeSlider.parent('preSizeSli');
  preSizeOut = createElement("h6", preSizeSlider.value());
  preSizeOut.parent('preSizeSli');

  fliSizeSlider = createSlider(0, 200, 50, 10);
  fliSizeSlider.parent('fliSizeSli');
  fliSizeOut = createElement("h6", fliSizeSlider.value());
  fliSizeOut.parent('fliSizeSli');

  // ---------- UAV SLIDERS ----------
  uavSpeedSlider = createSlider(0, 2, 0.7, 0.1);
  uavSpeedSlider.parent('uavSpeSli');
  uavSpeOut = createElement("h6", uavSpeedSlider.value());
  uavSpeOut.parent('uavSpeSli');

  oracleSpeedSlider = createSlider(0, 4, 1.5, 0.1);
  oracleSpeedSlider.parent('oracleSpeSli');
  oracleSpeOut = createElement("h6", oracleSpeedSlider.value());
  oracleSpeOut.parent('oracleSpeSli');

  numAnimalsSlider = createSlider(0, 50, 10, 1);
  numAnimalsSlider.parent('numAnimalsSli');
  numAnimalsOut = createElement("h6", numAnimalsSlider.value());
  numAnimalsOut.parent('numAnimalsSli');

  xMinAnimalsSlider = createSlider(0, 500, 0, 10);
  xMinAnimalsSlider.parent('xMinAnimalsSli');
  xMinAnimalsOut = createElement("h6", xMinAnimalsSlider.value());
  xMinAnimalsOut.parent('xMinAnimalsSli');

  xMaxAnimalsSlider = createSlider(0, 500, 200, 10);
  xMaxAnimalsSlider.parent('xMaxAnimalsSli');
  xMaxAnimalsOut = createElement("h6", xMaxAnimalsSlider.value());
  xMaxAnimalsOut.parent('xMaxAnimalsSli');

  yMinAnimalsSlider = createSlider(0, 500, 0, 10);
  yMinAnimalsSlider.parent('yMinAnimalsSli');
  yMinAnimalsOut = createElement("h6", yMinAnimalsSlider.value());
  yMinAnimalsOut.parent('yMinAnimalsSli');

  yMaxAnimalsSlider = createSlider(0, 500, 500, 10);
  yMaxAnimalsSlider.parent('yMaxAnimalsSli');
  yMaxAnimalsOut = createElement("h6", yMaxAnimalsSlider.value());
  yMaxAnimalsOut.parent('yMaxAnimalsSli');

  goalAnimalsSlider = createSlider(0, 5, 0.5, 0.1);
  goalAnimalsSlider.parent('goalAnimalsSli');
  goalAnimalsOut = createElement("h6", goalAnimalsSlider.value());
  goalAnimalsOut.parent('goalAnimalsSli');

  stressorAnimalsSlider = createSlider(0, 5, 0.5, 0.1);
  stressorAnimalsSlider.parent('stressorAnimalsSli');
  stressorAnimalsOut = createElement("h6", stressorAnimalsSlider.value());
  stressorAnimalsOut.parent('stressorAnimalsSli');

  // ---------- DROPDOWN TO ADD AGENTS/OBJETCS ----------
  sel = createSelect();
  sel.parent('addDrop');
  sel.option('Add Animal');
  sel.option('Add Shepherd');
  sel.option('Add Novelty');
  sel.option('Add Obstacle');
  canvas.mouseClicked(addStuff);

  // ---------- DELETE BUTTONS FOR AGENTS/OBJECTS ----------
  delA = createButton('Delete Animal');
  delA.parent('animalButtons');
  delA.mouseClicked(delAnimal);

  delS = createButton('Delete Shepherd');
  delS.parent('shepButtons');
  delS.mouseClicked(delShepherd);

  delN = createButton('Delete Novelty');
  delN.parent('novButtons');
  delN.mouseClicked(delNovelty);

  delO = createButton('Delete Obstacle');
  delO.parent('novButtons');
  delO.mouseClicked(delObstacle);

  delAll = createButton('Delete All');
  delAll.parent('delAll');
  delAll.mouseClicked(deleteAll);

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
  envRadio.option('3', 3);
  envRadio.option('4', 4);
  envRadio.option('5', 5);
  // envRadio.style('width', '100px');
  // textAlign(CENTER);
  // fill(255, 0, 0);

  collectRadio = createRadio();
  collectRadio.parent("collectRadio");
  collectRadio.option('FFHC', 1);
  collectRadio.option('ZZ', 2);

  //  Select starting environment
  envRadio._getInputChildrenArray()[4].checked = true;
  collectRadio._getInputChildrenArray()[0].checked = true;

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

// Function to update controls values on mouse drag
ManageControls.prototype.applyControls = function () {
  // ---------- UPDATE ZONE RADIUS ----------
  preSizeVal = preSizeSlider.value();
  preSizeOut.html(preSizeVal);

  fliSizeVal = fliSizeSlider.value();
  fliSizeOut.html(fliSizeVal);

  // ---------- UPDATE FORCE RADIUS ----------
  sepSizeVal = sepSizeSlider.value();
  sepSizeOut.html(sepSizeVal);

  aliSizeVal = aliSizeSlider.value();
  aliSizeOut.html(aliSizeVal);

  cohSizeVal = cohSizeSlider.value();
  cohSizeOut.html(cohSizeVal);

  dSepSizeVal = dSepSizeSlider.value();
  dSepSizeOut.html(dSepSizeVal);

  // ---------- UPDATE MAX SPEEDS ----------
  wSpeedVal = wSpeedSlider.value();
  wSpeOut.html(wSpeedVal);

  pSpeedVal = pSpeedSlider.value();
  pSpeOut.html(pSpeedVal);

  fSpeedVal = fSpeedSlider.value();
  fSpeOut.html(fSpeedVal);

  // ---------- UPDATE CURRENT VELOCITY ----------
  wVelVal = wVelSlider.value();
  wVelOut.html(wVelVal);

  pVelVal = pVelSlider.value();
  pVelOut.html(pVelVal);

  fVelVal = fVelSlider.value();
  fVelOut.html(fVelVal);

  // ---------- UPDATE SEPERATION ----------
  sepWanVal = sepWanSlider.value();
  sepWanOut.html(sepWanVal);

  sepPreVal = sepPreSlider.value();
  sepPreOut.html(sepPreVal);

  sepFliVal = sepFliSlider.value();
  sepFliOut.html(sepFliVal);

  // ---------- UPDATE ALIGNMENT ----------
  aliWanVal = aliWanSlider.value();
  aliWanOut.html(aliWanVal);

  aliPreVal = aliPreSlider.value();
  aliPreOut.html(aliPreVal);

  aliFliVal = aliFliSlider.value();
  aliFliOut.html(aliFliVal);

  // ---------- UPDATE COHESION ----------
  cohWanVal = cohWanSlider.value();
  cohWanOut.html(cohWanVal);

  cohPreVal = cohPreSlider.value();
  cohPreOut.html(cohPreVal);

  cohFliVal = cohFliSlider.value();
  cohFliOut.html(cohFliVal);

  // ---------- UPDATE dSEP ----------
  dSepPreVal = dSepPreSlider.value();
  dSepPreOut.html(dSepPreVal);

  dSepFliVal = dSepFliSlider.value();
  dSepFliOut.html(dSepFliVal);

  // ---------- UPDATE UAV ----------
  uavSpeedVal = uavSpeedSlider.value();
  uavSpeOut.html(uavSpeedVal);

  oracleSpeedVal = oracleSpeedSlider.value();
  oracleSpeOut.html(oracleSpeedVal);

  numAnimalsVal = numAnimalsSlider.value();
  numAnimalsOut.html(numAnimalsVal);

  xMinAnimalsVal = xMinAnimalsSlider.value();
  xMinAnimalsOut.html(xMinAnimalsVal);

  xMaxAnimalsVal = xMaxAnimalsSlider.value();
  xMaxAnimalsOut.html(xMaxAnimalsVal);

  yMinAnimalsVal = yMinAnimalsSlider.value();
  yMinAnimalsOut.html(yMinAnimalsVal);

  yMaxAnimalsVal = yMaxAnimalsSlider.value();
  yMaxAnimalsOut.html(yMaxAnimalsVal);

  goalAnimalsVal = goalAnimalsSlider.value();
  goalAnimalsOut.html(goalAnimalsVal);

  stressorAnimalsVal = stressorAnimalsSlider.value();
  stressorAnimalsOut.html(stressorAnimalsVal);
}

// ---------- CALLED ON MOUSE DRAG TO UPDATE ALL SLIDERS ----------
function mouseReleased() {
  manageFE.applyControls();
}

function mouseDragged() {
  manageFE.applyControls();
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
