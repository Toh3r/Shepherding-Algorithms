// Create a million variables for index page
var environment;
// let speedSlider, separationSlider, alignSlider, cohesionSlider;
// let speVal, sepVal, aliVal, cohVal;
// let speOut, sepOut, aliOut, cohOut;
// let novelObjects, sel, addText, zoneCheck, herdZoneCheck, nameCheck;
// let delA, delS, delN, delAll;
// let numAnimals, stressLevelOut;
// let animalDisplay, shepherdDisplay, stressDisplay;

// Create page elements using p5.js
function setup() {

  // Create Canvas
  var canvas = createCanvas(1000,500);
  canvas.parent('myCanvas'); // .parent allows item to manipulated on html page

  // setFrameRate(60);

  // Create Sliders to change behavioural rules
  wSpeedSlider = createSlider(0, 5, 0.3, 0.1);
  wSpeedSlider.parent('wSpeSli');
  wSpeOut = createElement("h7", wSpeedSlider.value());
  wSpeOut.parent('wSpeSli');
  wSpeedSlider.mouseReleased(updateValue);

  pSpeedSlider = createSlider(0, 5, 0.3, 0.1);
  pSpeedSlider.parent('pSpeSli');
  pSpeOut = createElement("h7", pSpeedSlider.value());
  pSpeOut.parent('pSpeSli');
  pSpeedSlider.mouseReleased(updateValue);

  fSpeedSlider = createSlider(0, 5, 0.3, 0.1);
  fSpeedSlider.parent('fSpeSli');
  fSpeOut = createElement("h7", fSpeedSlider.value());
  fSpeOut.parent('fSpeSli');
  fSpeedSlider.mouseReleased(updateValue);

  separationSlider = createSlider(0, 5, 1.5, 0.1);
  separationSlider.parent('sepSli');
  sepOut = createElement("h7", "1.5");
  sepOut.parent('sepSli');
  separationSlider.mouseReleased(updateValue);

  alignSlider = createSlider(0, 5, 1, 0.1);
  alignSlider.parent('aliSli');
  aliOut = createElement("h7", "1");
  aliOut.parent('aliSli');
  alignSlider.mouseReleased(updateValue);

  cohesionSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider.parent('cohSli');
  cohOut = createElement("h7", "1");
  cohOut.parent('cohSli');
  cohesionSlider.mouseReleased(updateValue);

  droneSepSlider = createSlider(0, 5, 1, 0.1);
  droneSepSlider.parent('dSepSli');
  dSepOut = createElement("h7", "1");
  dSepOut.parent('dSepSli');
  droneSepSlider.mouseReleased(updateValue);

  // Create Sliders to change behavioural rules
  sepSizeSlider = createSlider(0, 5, 0.3, 0.1);
  sepSizeSlider.parent('sepSizeSli');
  sepSizeOut = createElement("h7", sepSizeSlider.value());
  sepSizeOut.parent('sepSizeSli');
  sepSizeSlider.mouseReleased(updateValue);

  // Create Sliders to change behavioural rules
  aliSizeSlider = createSlider(0, 5, 0.3, 0.1);
  aliSizeSlider.parent('aliSizeSli');
  aliSizeOut = createElement("h7", aliSizeSlider.value());
  aliSizeOut.parent('aliSizeSli');
  aliSizeSlider.mouseReleased(updateValue);

  // Create Sliders to change behavioural rules
  cohSizeSlider = createSlider(0, 5, 0.3, 0.1);
  cohSizeSlider.parent('cohSizeSli');
  cohSizeOut = createElement("h7", cohSizeSlider.value());
  cohSizeOut.parent('cohSizeSli');
  cohSizeSlider.mouseReleased(updateValue);

  // Create Sliders to change behavioural rules
  dSepSizeSlider = createSlider(0, 5, 0.3, 0.1);
  dSepSizeSlider.parent('dSepSizeSli');
  dSepSizeOut = createElement("h7", dSepSizeSlider.value());
  dSepSizeOut.parent('dSepSizeSli');
  dSepSizeSlider.mouseReleased(updateValue);

  // Create Dropdown to add agents/objects
  sel = createSelect();
  sel.parent('addDrop');
  sel.option('Add Animal');
  sel.option('Add Shepherd');
  sel.option('Add Novelty');
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
  nameCheck = createCheckbox("Display Animal Info");
  nameCheck.parent("zoneDiv");

  shepControl = createCheckbox("Control Shepherd");
  shepControl.parent("zoneDiv");

  // Initialize starting environment (with agents/objects)
  environment = new Environment();

  //Create starting animals in random positions
  for (var i = 0; i < 10; i++) {
    var a = new Animal(Math.floor(Math.random() * 200) + 1,Math.floor(Math.random() * 500) + 1);
    environment.addAnimal(a);
  }

  // Create starting shepherds in random positions
  for (var i = 0; i < 0; i++) {
    var s = new Shepherd(Math.floor(Math.random() * 1000) + 1,Math.floor(Math.random() * 500) + 1);
    environment.addShepherd(s);
  }

  // Create starting novelties in random positions
  for (var i = 0; i < 0; i++) {
    var n = new NovelObject(Math.floor(Math.random() * 1000) + 1,Math.floor(Math.random() * 500) + 1);
    environment.addNovelty(n);
  }

  // Create gate ('exit') at end of field
  for (var i = 0; i < 1; i++) {
    var g = new Gate(990, 230);
    environment.addGate(g);
  }

  animalDisplay = createP("Number of Animals: " + environment.herd.length);
  animalDisplay.parent("numAnimalsDiv");

  shepherdDisplay = createP("Number of Shepherds: " + environment.shepherds.length);
  shepherdDisplay.parent("numAnimalsDiv");

  var fixedStress = environment.accumulatedStress.toFixed(2);
  stressDisplay = createP("Accumulated Stress: " + fixedStress);
  stressDisplay.parent("numAnimalsDiv");

}

// Call run to begin simulation
function draw() {
  background(36, 188, 25);
  environment.run();

  display();
}

function display() {
  animalDisplay.remove();
  shepherdDisplay.remove();
  stressDisplay.remove();

  animalDisplay = createP("Number of Animals: " + environment.herd.length);
  animalDisplay.parent("numAnimalsDiv");

  shepherdDisplay = createP("Number of Shepherds: " + environment.shepherds.length);
  shepherdDisplay.parent("numAnimalsDiv");

  var fixedStress = environment.accumulatedStress.toFixed(2);
  stressDisplay = createP("Accumulated Stress: " + fixedStress);
  stressDisplay.parent("numAnimalsDiv");
}

// Method to update the behavioral rules of each boid
function updateValue() {
  speVal = speedSlider.value();
  speOut.html(speVal);

  sepVal = separationSlider.value();
  sepOut.html(sepVal);

  aliVal = alignSlider.value();
  aliOut.html(aliVal);

  cohVal = cohesionSlider.value();
  cohOut.html(cohVal);
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
    environment.addNovelty(new NovelObject(mouseX, mouseY));
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
function deleteAll() {
  environment.removeAll();
}
function displayInfo() {

}
