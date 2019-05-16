// Create enviroment variable
var environment;

// Create page elements using p5.js
function setup() {

  // Create Canvas
  var canvas = createCanvas(1000,600);
  img1 = loadImage('./css/images/Field1B.jpg');
  img2 = loadImage('./css/images/Field_1.jpg');
  img3 = loadImage('./css/images/Field_2.jpg');
  img4 = loadImage('./css/images/Field_3.jpg');
  canvas.parent('myCanvas'); // .parent allows item to manipulated on html page

  // Set framerate of canvas
  // setFrameRate(10);

  // Max Speed Sliders
  wSpeedSlider = createSlider(0, 2, 0.2, 0.1);
  wSpeedSlider.parent('wSpeSli');
  wSpeOut = createElement("h6", wSpeedSlider.value());
  wSpeOut.parent('wSpeSli');

  pSpeedSlider = createSlider(0, 2, 0.6, 0.1);
  pSpeedSlider.parent('pSpeSli');
  pSpeOut = createElement("h6", pSpeedSlider.value());
  pSpeOut.parent('pSpeSli');

  fSpeedSlider = createSlider(0, 2, 0.6, 0.1);
  fSpeedSlider.parent('fSpeSli');
  fSpeOut = createElement("h6", fSpeedSlider.value());
  fSpeOut.parent('fSpeSli');

  // Set Velocity Sliders
  wVelSlider = createSlider(0, 2, 0.1, 0.1);
  wVelSlider.parent('wVelSli');
  wVelOut = createElement("h6", wVelSlider.value());
  wVelOut.parent('wVelSli');

  pVelSlider = createSlider(0, 2, 0.6, 0.1);
  pVelSlider.parent('pVelSli');
  pVelOut = createElement("h6", pVelSlider.value());
  pVelOut.parent('pVelSli');

  fVelSlider = createSlider(0, 2, 0.6, 0.1);
  fVelSlider.parent('fVelSli');
  fVelOut = createElement("h6", fVelSlider.value());
  fVelOut.parent('fVelSli');

  // Seperation Sliders
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

  // Alignment Sliders
  aliWanSlider = createSlider(0, 5, 0, 0.1);
  aliWanSlider.parent('aliWan');
  aliWanOut = createElement("h6", aliWanSlider.value());
  aliWanOut.parent('aliWan');

  aliPreSlider = createSlider(0, 5, 0.5, 0.1);
  aliPreSlider.parent('aliPre');
  aliPreOut = createElement("h6", aliPreSlider.value());
  aliPreOut.parent('aliPre');

  aliFliSlider = createSlider(0, 5, 0.5, 0.1);
  aliFliSlider.parent('aliFli');
  aliFliOut = createElement("h6", aliFliSlider.value());
  aliFliOut.parent('aliFli');

  // Cohsion Sliders
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

  // Drone Seperation Sliders
  dSepPreSlider = createSlider(0, 5, 0, 0.1);
  dSepPreSlider.parent('dSepPre');
  dSepPreOut = createElement("h6", dSepPreSlider.value());
  dSepPreOut.parent('dSepPre');

  dSepFliSlider = createSlider(0, 5, 2, 0.1);
  dSepFliSlider.parent('dSepFli');
  dSepFliOut = createElement("h6", dSepFliSlider.value());
  dSepFliOut.parent('dSepFli');

  // Force Size Sliders
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

  // Zone Size Sliders
  preSizeSlider = createSlider(0, 200, 200, 10);
  preSizeSlider.parent('preSizeSli');
  preSizeOut = createElement("h6", preSizeSlider.value());
  preSizeOut.parent('preSizeSli');

  fliSizeSlider = createSlider(0, 200, 50, 10);
  fliSizeSlider.parent('fliSizeSli');
  fliSizeOut = createElement("h6", fliSizeSlider.value());
  fliSizeOut.parent('fliSizeSli');


  // Create Dropdown to add agents/objects
  sel = createSelect();
  sel.parent('addDrop');
  sel.option('Add Animal');
  sel.option('Add Shepherd');
  sel.option('Add Novelty');
  sel.option('Add Obstacle');
  canvas.mouseClicked(addStuff);

  // Create delete buttons to remove agents/objects
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

  // Create checkbox to display flight/Pressure zones
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
  lineCheck = createCheckbox("Show Shep Lines");
  lineCheck.parent("zoneDiv");

  // Create checkbox to display flight/Pressure zones
  sectorCheck = createCheckbox("Show Sectors");
  sectorCheck.parent("zoneDiv");

  // shepControl = createCheckbox("Control Shepherd");
  // shepControl.parent("zoneDiv");

  droneHerd = createButton('Magic Button');
  droneHerd.parent('droneHerd');
  droneHerd.mouseClicked(herd);

  createOracle = createButton('Oracle');
  createOracle.parent('oracleBtn');
  createOracle.mouseClicked(oracle);

  resetBtn = createButton('Resest');
  resetBtn.parent('resetBtn');
  resetBtn.mouseClicked(createNewHerd);

  pauseBtn = createButton('Pause');
  pauseBtn.parent('pauseBtn');
  pauseBtn.mouseClicked(togglePlay);

  envRadio = createRadio();
  envRadio.parent("envRadio");
  envRadio.option('Environment 1', 1);
  envRadio.option('Environment 2', 2);
  envRadio.option('Environment 3', 3);
  envRadio.option('Environment 4', 4);
  envRadio.style('width', '100px');
  textAlign(CENTER);
  fill(255, 0, 0);

  envRadio._getInputChildrenArray()[1].checked = true;

  // Initialize starting environment (with agents/objects)
  environment = new Environment();

  createNewHerd();

  animalDisplay = createP("Number of Animals: " + environment.herd.length);
  animalDisplay.parent("numAnimalsDiv");

  shepherdDisplay = createP("Number of Shepherds: " + environment.shepherds.length);
  shepherdDisplay.parent("numAnimalsDiv");

  var fixedStress = environment.totalStress().toFixed(2);
  stressDisplay = createP("Accumulated Stress: " + fixedStress);
  stressDisplay.parent("numAnimalsDiv");

  var fixedSpeed = environment.avgSpeed().toFixed(2);
  speedDisplay = createP("Average Speed: " + fixedSpeed);
  speedDisplay.parent("numAnimalsDiv");
}

// Call run to begin simulation
function draw() {
  // background(9, 123, 18);
  // background(255);
  background(img);
  environment.run();
  display();
}

var isPlaying = false;
function togglePlay() {
  if (isPlaying == true) {
     loop();
     pauseBtn.html('Pause');
     isPlaying = false;
  } else if (isPlaying == false) {
     noLoop();
     pauseBtn.html('Play');
     isPlaying = true;
  }
}


function createNewHerd () {
  // Initialize starting environment (with agents/objects)
  environment = new Environment();

  var enVal = envRadio.value();
  if (enVal == 1) {
    canvas.remove();
    canvas = createCanvas(1000,600);
    img = img1;
    canvas.parent('myCanvas');
  } else if (enVal == 2) {
    canvas.remove();
    canvas = createCanvas(1000,600);
    img = img2;
    canvas.parent('myCanvas');
  } else if (enVal == 3) {
    canvas.remove();
    canvas = createCanvas(1800,600);
    img = img3;
    canvas.parent('myCanvas');
  } else if (enVal == 4) {
    canvas.remove();
    canvas = createCanvas(2400,800);
    img = img4;
    canvas.parent('myCanvas');
  }

  // Create starting shepherds in random positions
  for (var i = 0; i < 0; i++) {
    var s = new Shepherd(Math.floor(Math.random() * 1000) + 1,Math.floor(Math.random() * 500) + 1);
    environment.addShepherd(s);
  }

  // Create starting auto shepherd
  for (var i = 0; i < 0; i++) {
    var as = new AutoShepherd();
    environment.addAutoShepherd(as);
  }

  // Create starting auto shepherd
  for (var i = 0; i < 0; i++) {
    var o = new Oracle();
    environment.Oracle(o);
  }

  // Create starting novelties in random positions
  for (var i = 0; i < 0; i++) {
    var n = new NovelObject(Math.floor(Math.random() * 1000) + 1,Math.floor(Math.random() * 500) + 1);
    environment.addNovelty(n);
  }

  // Create starting novelties in random positions
  for (var i = 0; i < 0; i++) {
    //Create starting animals in random positions
    for (var i = 0; i < 10; i++) {
      x = random(201);
      y = random(501);
      var a = new Animal(x, y);
      environment.addAnimal(a);
    }

    var ob = new Obstacle(Math.floor(Math.random() * 1000) + 1,Math.floor(Math.random() * 500) + 1);
    environment.addNovelty(ob);
  }

  if (envRadio.value() == 1) {
    autoShepX = 970;
    autoShepY = 250;
    goalX = 990;
    goalY = 255;
    gzX = createVector(850, 1000);
    gzY = createVector(180, 330);
    //Create starting animals in random positions
    for (var i = 0; i < 10; i++) {
      x = random(201);
      y = random(501);
      var a = new Animal(x, y, goalX, goalY, gzX, gzY);
      environment.addAnimal(a);
    }
  }

  if (envRadio.value() == 2) {
    autoShepX = 970;
    autoShepY = 570;
    goalX = 970;
    goalY = 580;
    gzX = createVector(850, 1000);
    gzY = createVector(450, 600);
    //Create starting animals in random positions
    for (var i = 0; i < 10; i++) {
      x = random(201);
      y = random(501);
      var a = new Animal(x, y, goalX, goalY, gzX, gzY);
      environment.addAnimal(a);
    }

    var n = new NovelObject(800,550,230);
    environment.addNovelty(n);

    var ob = new Obstacle(240, 240, 50, 50);
    environment.addObstacle(ob);
  }

  if (envRadio.value() == 3) {
    autoShepX = 1030;
    autoShepY = 165;
    goalX = 1100;
    goalY = 255;
    gzX = createVector(1100, 1250);
    gzY = createVector(155, 305);
    //Create starting animals in random positions
    for (var i = 0; i < 10; i++) {
      x = random(100,251);
      y = random(50,351);
      var a = new Animal(x, y, goalX, goalY, gzX, gzY);
      environment.addAnimal(a);
    }

    var n = new NovelObject(1050,50,600,180);
    environment.addNovelty(n);
    var n = new NovelObject(1400,265,90,180);
    environment.addNovelty(n);

    var ob = new Obstacle(0, 0, 1500, 20, 1.5);
    environment.addObstacle(ob);
    var ob = new Obstacle(1500, 40, 70, 120, 2);
    environment.addObstacle(ob);
    var ob = new Obstacle(1560, 155, 10, 70, -60);
    environment.addObstacle(ob);
    var ob = new Obstacle(1615, 185, 160, 90, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1525, 275, 100, 50, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1750, 270, 20, 220, 20);
    environment.addObstacle(ob);
    var ob = new Obstacle(1680, 475, 20, 550, 80);
    environment.addObstacle(ob);
    var ob = new Obstacle(1030, 400, 220, 20, 55);
    environment.addObstacle(ob);
    var ob = new Obstacle(160, 400, 865, 20, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(0, 240, 240, 20, 45);
    environment.addObstacle(ob);
    var ob = new Obstacle(1030, 180, 60, 170, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1220, 180, 75, 170, 3);
    environment.addObstacle(ob);
    var ob = new Obstacle(1030, 350, 255, 20, 0);
    environment.addObstacle(ob);
  }

  if (envRadio.value() == 4) {
    autoShepX = 450;
    autoShepY = 450;
    goalX = 2370;
    goalY = 35;
    gzX = createVector(2250, 2400);
    gzY = createVector(0, 85);
    //Create starting animals in random positions
    for (var i = 0; i < 10; i++) {
      x = random(801);
      y = random(551,751);
      var a = new Animal(x, y, goalX, goalY, gzX, gzY);
      environment.addAnimal(a);
    }

    var n = new NovelObject(2350,180,220, 160);
    environment.addNovelty(n);
    var n = new NovelObject(2150,20,400, 60);
    environment.addNovelty(n);

    var ob = new Obstacle(0, 440, 430, 20);
    environment.addObstacle(ob);
    var ob = new Obstacle(500, 440, 600, 20);
    environment.addObstacle(ob);
    var ob = new Obstacle(0, 100, 2400, 20, -3);
    environment.addObstacle(ob);
    var ob = new Obstacle(1080, 120, 20, 680, -2);
    environment.addObstacle(ob);
    var ob = new Obstacle(1730, 90, 20, 720);
    environment.addObstacle(ob);
    var ob = new Obstacle(2010, 575, 50, 35);
    environment.addObstacle(ob);
  }

  // Create gate ('exit') at end of field
  for (var i = 0; i < 1; i++) {
    var g = new Gate(990, 230);
    if (enVal == 1) {
      var g = new Gate(990, 230);
    } else if (enVal == 2) {
      var g = new Gate(990, 580);
    } else if (enVal == 3) {
      var g = new Gate(1090, 230);
    } else if (enVal == 4) {
      var g = new Gate(2390, 10);
    }
    environment.addGate(g);
  }
}

function display() {
  animalDisplay.remove();
  shepherdDisplay.remove();
  stressDisplay.remove();
  speedDisplay.remove();

  animalDisplay = createP("Number of Animals: " + environment.herd.length);
  animalDisplay.parent("numAnimalsDiv");

  shepherdDisplay = createP("Number of Shepherds: " + environment.shepherds.length);
  shepherdDisplay.parent("numAnimalsDiv");

  var fixedStress = environment.totalStress().toFixed(2);
  stressDisplay = createP("Accumulated Stress: " + fixedStress);
  stressDisplay.parent("numAnimalsDiv");

  var fixedSpeed = environment.avgSpeed().toFixed(2);
  speedDisplay = createP("Average Speed: " + fixedSpeed);
  speedDisplay.parent("numAnimalsDiv");
}

// Method to update slider values
function mouseDragged() {
  // Update zone sizes
  preSizeVal = preSizeSlider.value();
  preSizeOut.html(preSizeVal);

  fliSizeVal = fliSizeSlider.value();
  fliSizeOut.html(fliSizeVal);

  // Update Force Sizes
  sepSizeVal = sepSizeSlider.value();
  sepSizeOut.html(sepSizeVal);

  aliSizeVal = aliSizeSlider.value();
  aliSizeOut.html(aliSizeVal);

  cohSizeVal = cohSizeSlider.value();
  cohSizeOut.html(cohSizeVal);

  dSepSizeVal = dSepSizeSlider.value();
  dSepSizeOut.html(dSepSizeVal);

  // Update max speeds
  wSpeedVal = wSpeedSlider.value();
  wSpeOut.html(wSpeedVal);

  pSpeedVal = pSpeedSlider.value();
  pSpeOut.html(pSpeedVal);

  fSpeedVal = fSpeedSlider.value();
  fSpeOut.html(fSpeedVal);

  // Update velocity
  wVelVal = wVelSlider.value();
  wVelOut.html(wVelVal);

  pVelVal = pVelSlider.value();
  pVelOut.html(pVelVal);

  fVelVal = fVelSlider.value();
  fVelOut.html(fVelVal);

  // Update Seperation
  sepWanVal = sepWanSlider.value();
  sepWanOut.html(sepWanVal);

  sepPreVal = sepPreSlider.value();
  sepPreOut.html(sepPreVal);

  sepFliVal = sepFliSlider.value();
  sepFliOut.html(sepFliVal);

  // Update Alignment
  aliWanVal = aliWanSlider.value();
  aliWanOut.html(aliWanVal);

  aliPreVal = aliPreSlider.value();
  aliPreOut.html(aliPreVal);

  aliFliVal = aliFliSlider.value();
  aliFliOut.html(aliFliVal);

  // Update Cohesion
  cohWanVal = cohWanSlider.value();
  cohWanOut.html(cohWanVal);

  cohPreVal = cohPreSlider.value();
  cohPreOut.html(cohPreVal);

  cohFliVal = cohFliSlider.value();
  cohFliOut.html(cohFliVal);

  // Update Drone Seperation
  dSepPreVal = dSepPreSlider.value();
  dSepPreOut.html(dSepPreVal);

  dSepFliVal = dSepFliSlider.value();
  dSepFliOut.html(dSepFliVal);
}

// Call add functions to add agents/objects on mouse co-ords
function addStuff() {
  var dropSelect = sel.value();
  if (dropSelect == "Add Animal") {
    environment.addAnimal(new Animal(mouseX, mouseY));
  }
  if (dropSelect == "Add Shepherd") {
    environment.addShepherd(new Shepherd(mouseX, mouseY));
  }
  if (dropSelect == "Add Novelty") {
    environment.addNovelty(new NovelObject(mouseX, mouseY, 25.0));
  }
  if (dropSelect == "Add Obstacle") {
    environment.addObstacle(new Obstacle(mouseX, mouseY, 25.0, 25.0, 0));
  }
}

// Call delete functions to delete agents/objects
function delAnimal() {
  environment.deleteAnimal();
}
function delShepherd() {
  environment.deleteShepherd();
}
function delNovelty() {
  environment.deleteNovelty();
}
function delObstacle() {
  environment.deleteObstacle();
}
function deleteAll() {
  environment.removeAll();
}

function herd() {
  console.log("Goin' Herding");
  environment.addAutoShepherd(new AutoShepherd(autoShepX, autoShepY, goalX, goalY));
}

function oracle() {
  console.log("Goin' Herding");
  environment.addOracle(new Oracle());
}
