// Create variable for display output
let animalDisplay, timeSteps, vocalDisplay, fixedStress, goodMoves,
    manualUAVDisplay, totalUAVDisplay, fixedSpeed, avgHeading, isBunched,
    isMoving, isCollecting, isAvoidingOBS, isAvoidingHerd, goodHeading,
    numSectors, currentTarget, currentSearchArea;

function ManageControls () {
  // Class to manage front-end control creation and updates
  // Using prototype for this because it makes it real easy to
  // pass information outta here
}

// Function run at start up, creates all starting controls
ManageControls.prototype.createControls = function () {

  // ---------- CREATE CANVAS ----------
  // Have to create canvas here for buttons to be able to manipulate it
  var canvas = createCanvas(1000,600);
  img1 = loadImage('./css/images/Field1B.jpg'); // Load background images
  img2 = loadImage('./css/images/Field_1.jpg'); // Image to be used is selected in draw function
  img3 = loadImage('./css/images/Field_2.jpg'); // in sketchTest Image by Gerd Altmann from Pixabay
  img4 = loadImage('./css/images/Field_3.jpg');
  canvas.parent('myCanvas'); // .parent allows item to manipulated on html page

  // ---------- SPEED SLIDERS ----------
  wSpeedSlider = createSlider(0, 2, 0.1, 0.1);
  wSpeedSlider.parent('wSpeSli');
  wSpeOut = createElement("h6", wSpeedSlider.value());
  wSpeOut.parent('wSpeSli');

  pSpeedSlider = createSlider(0, 2, 0.4, 0.1);
  pSpeedSlider.parent('pSpeSli');
  pSpeOut = createElement("h6", pSpeedSlider.value());
  pSpeOut.parent('pSpeSli');

  fSpeedSlider = createSlider(0, 2, 0.5, 0.1);
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

  fVelSlider = createSlider(0, 2, 0.5, 0.1);
  fVelSlider.parent('fVelSli');
  fVelOut = createElement("h6", fVelSlider.value());
  fVelOut.parent('fVelSli');

  // ---------- SEPERATION FORCE SLIDERS ----------
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

  // ---------- ALIGNMENT FORCE SLIDERS ----------
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

  // ---------- COHESION FORCE SLIDERS ----------
  cohWanSlider = createSlider(0, 5, 0, 0.1);
  cohWanSlider.parent('cohWan');
  cohWanOut = createElement("h6", cohWanSlider.value());
  cohWanOut.parent('cohWan');

  cohPreSlider = createSlider(0, 5, 1.5, 0.1);
  cohPreSlider.parent('cohPre');
  cohPreOut = createElement("h6", cohPreSlider.value());
  cohPreOut.parent('cohPre');

  cohFliSlider = createSlider(0, 5, 0.8, 0.1);
  cohFliSlider.parent('cohFli');
  cohFliOut = createElement("h6", cohFliSlider.value());
  cohFliOut.parent('cohFli');

  // ---------- dSEP FORCE SLIDERS ----------
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

    // ---------- GOAL/STRESSOR AVOIDANCE STRENGTH SLIDERS ----------
  goalAnimalsSlider = createSlider(0, 5, 0.5, 0.1);
  goalAnimalsSlider.parent('goalAnimalsSli');
  goalAnimalsOut = createElement("h6", goalAnimalsSlider.value());
  goalAnimalsOut.parent('goalAnimalsSli');

  stressorAnimalsSlider = createSlider(0, 5, 0.5, 0.1);
  stressorAnimalsSlider.parent('stressorAnimalsSli');
  stressorAnimalsOut = createElement("h6", stressorAnimalsSlider.value());
  stressorAnimalsOut.parent('stressorAnimalsSli');

  // ---------- UAV SLIDERS ----------
  uavSpeedSlider = createSlider(0, 2, 0.7, 0.1);
  uavSpeedSlider.parent('uavSpeSli');
  uavSpeOut = createElement("h6", uavSpeedSlider.value());
  uavSpeOut.parent('uavSpeSli');

  oracleSpeedSlider = createSlider(0, 4, 1.5, 0.1);
  oracleSpeedSlider.parent('oracleSpeSli');
  oracleSpeOut = createElement("h6", oracleSpeedSlider.value());
  oracleSpeOut.parent('oracleSpeSli');

    // ---------- STARTING PARAMETER SLIDERS ----------
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
  zoneCheck = createCheckbox("Display Each Zone");     // DISPLAY FORCE ZONES
  zoneCheck.parent("zoneDiv");

  herdZoneCheck = createCheckbox("Display Herd Zone"); // DISPLAY HERD AREA
  herdZoneCheck.parent("zoneDiv");

  forceCheck = createCheckbox("Display Force Zone");   // DISPLAY FLIGHT/PRESSURE ZONE
  forceCheck.parent("zoneDiv");

  nameCheck = createCheckbox("Display Animal Info");   // DISPLAY ANIMAL INFO -> NAME, SPEED
  nameCheck.parent("zoneDiv");

  animalGoalCheck = createCheckbox("Show Animal Goals" , true); // ANIMAL GOAL POINTS
  animalGoalCheck.parent("zoneDiv");

  lineCheck = createCheckbox("Show Shep Lines", true);  // DISPLAY SHEPHERD LINES
  lineCheck.parent("uavStuff");

  shepGoalCheck = createCheckbox("Show Shep Goals", true); // DISPLAY UAV GOALS
  shepGoalCheck.parent("uavStuff");

  sectorCheck = createCheckbox("Show Sectors", true); // DISPLAY ORACLE SECTORS
  sectorCheck.parent("oracleStuff");

  // -------- INITIATE UAV BUTTONS --------
  singleGPSBtn = createButton('GPS UAV'); // SINGLE GPS
  singleGPSBtn.parent('singleGPSBtn');
  singleGPSBtn.mouseClicked(herd);

  singleOracleBtn = createButton('Oracle UAV'); // SINGLE ORACLE
  singleOracleBtn.parent('singleOracleBtn');
  singleOracleBtn.mouseClicked(oracle);

  multiGPSBtn = createButton('Multi-GPS'); // MULTI-GPS
  multiGPSBtn.parent('multiGPSBtn');
  multiGPSBtn.mouseClicked(multiDrone); //MULTI-ORACLE

  // -------- START Multi-Drones --------
  multiOracleBtn = createButton('Multi-Oracle');
  multiOracleBtn.parent('multiOracleBtn');
  multiOracleBtn.mouseClicked(multiOracle);

  // -------- RESET BUTTON --------
  resetBtn = createButton('Reset');
  resetBtn.parent('resetBtn');
  resetBtn.mouseClicked(createNewEnv);

  pauseBtn = createButton('Pause');   // PAUSE BUTTON
  pauseBtn.parent('pauseBtn');
  pauseBtn.mouseClicked(togglePlay);

  envRadio = createRadio();    // SELECT ENVIRONMENT RADIO BUTTONS
  envRadio.parent("envRadio");
  envRadio.option('1', 1);
  envRadio.option('2', 2);
  envRadio.option('3', 3);
  envRadio.option('4', 4);

  collectRadio = createRadio(); // UAV COLLECTION TYPE BUTTON
  collectRadio.parent("collectRadio");
  collectRadio.option('FFHC', 1);
  collectRadio.option('ZZ', 2);

  //  SELECT STARTING PARAMETERS
  envRadio._getInputChildrenArray()[0].checked = true;
  collectRadio._getInputChildrenArray()[0].checked = true;

  // Initialize new environment
  environment = new Environment();

  // Function which initilises starting agents and obstecles
  // Needs to be called before information paragraphs or they will through errord from recieving null arguements
  createNewEnv();
  updateDisplayInfo();
}

// Function to update simulation info each frame
ManageControls.prototype.updateSimInfo = function () {
  manShep = ((environment.manualShepherds.length > 0) ? 'True' : 'False');
  totalUAVs = environment.allShepherds.length;

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

  updateDisplayInfo();
}

// Function to update controls values on mouse drag or mouse release
ManageControls.prototype.applyControls = function () {
  preSizeVal = preSizeSlider.value();
  preSizeOut.html(preSizeVal);

  fliSizeVal = fliSizeSlider.value();
  fliSizeOut.html(fliSizeVal);

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

// Function to create paragrahs to display environment information on front-end
function updateDisplayInfo () {
  // Variables for UAV information
  manShep = ((environment.manualShepherds.length > 0) ? 'True' : 'False');
  totalUAVs = environment.allShepherds.length;

  // ---------- CREATE PARAGRAPHS TO DISPLAY INFO ON FRONT-END ----------
  timeSteps = environment.timeSteps();
  timeDisplay = createP("Timesteps: " + timeSteps);
  timeDisplay.parent("envInfoDiv");

  animalDisplay = createP("Number of Animals: " + environment.herd.length);
  animalDisplay.parent("envInfoDiv");

  vocalDisplay = createP("Vocalizing: false");
  vocalDisplay.parent("animalInfoDiv");

  fixedStress = environment.totalStress().toFixed(2);
  stressDisplay = createP("Adverse Conditions: " + fixedStress);
  stressDisplay.parent("envInfoDiv");

  goodMoves = environment.goodMovementTime();
  movementDisplay = createP("Good Movement Steps: " + goodMoves);
  movementDisplay.parent("envInfoDiv");

  manualUAVDisplay = createP("Manual UAV: " + "No");
  manualUAVDisplay.parent("envInfoDiv");

  totalUAVDisplay = createP("Total UAV's: " + "0");
  totalUAVDisplay.parent("envInfoDiv");

  fixedSpeed = environment.avgSpeed().toFixed(2);
  speedDisplay = createP("Average Speed: " + fixedSpeed);
  speedDisplay.parent("animalInfoDiv");

  avgHeading = environment.avgHeading().toFixed(2);
  headingDisplay = createP("Average Heading: " + avgHeading);
  headingDisplay.parent("animalInfoDiv");

  isBunched = environment.checkBunched();
  bunchedDisplay = createP("Bunched: " + isBunched);
  bunchedDisplay.parent("animalInfoDiv");

  isCollecting = environment.shepCollect();
  collectingDisplay = createP("Collecting: " + isCollecting);
  collectingDisplay.parent("gpsInfoDiv");

  isMoving = environment.shepMove();
  moveDisplay = createP("Moving: " + isMoving);
  moveDisplay.parent("gpsInfoDiv");

  isAvoidingOBS = environment.shepAvoidHerd();
  avoOBSDisplay = createP("Avoid Obstacle: " + isAvoidingOBS);
  avoOBSDisplay.parent("gpsInfoDiv");

  isAvoidingHerd = environment.shepAvoidHerd();
  avoherdDisplay = createP("Avoid herd: " + isAvoidingHerd);
  avoherdDisplay.parent("gpsInfoDiv");

  goodHeading = environment.theCorrectHeading().toFixed(2);
  goodHeadingDisplay = createP("Desired Heading: " + goodHeading);
  goodHeadingDisplay.parent("gpsInfoDiv");

  numSectors = environment.getSectors();
  numSectorDisplay = createP("Number of Sectors: " + numSectors);
  numSectorDisplay.parent("oracleInfoDiv");

  currentTarget = environment.getOracleTarget();
  currentTargetDisplay = createP("Current Sector: " + currentTarget);
  currentTargetDisplay.parent("oracleInfoDiv");

  currentSearchArea = environment.getOracleSearchArea();
  currentSearchAreaDisplay = createP("Searching: " + currentSearchArea + " -> X");
  currentSearchAreaDisplay.parent("oracleInfoDiv");
}

// ---------- CALLED ON MOUSE DRAG TO UPDATE ALL SLIDERS ----------
function mouseReleased() {
  manageFE.applyControls();
}

function mouseDragged() {
  manageFE.applyControls();
}

function togglePlay() {       // Pause function for simulation
  if (isPlaying == true) {    // On pause/play button press
     loop();                  // Lets canvas update
     pauseBtn.html('Pause');  // Change wording on button
     isPlaying = !isPlaying;  // Switch boolean
  } else if (isPlaying == false) {
     noLoop();                // Stops canvas from updating
     pauseBtn.html('Play');
     isPlaying = !isPlaying;
  }
}

// Pause function when "p" is pressed
function keyPressed() {
  if (keyCode == 80) {
    togglePlay();
  }
}
