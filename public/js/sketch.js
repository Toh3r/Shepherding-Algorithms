// Create a million variables for index page
var environment;
let speedSlider, separationSlider, alignSlider, cohesionSlider;
let speVal, sepVal, aliVal, cohVal;
let speOut, sepOut, aliOut, cohOut;
let novelObjects, sel, addText, zoneCheck, herdZoneCheck, nameCheck;
let delA, delS, delN, delAll;
let numAnimals, stressLevelOut;
let animalDisplay, shepherdDisplay, stressDisplay;

// Create page elements using p5.js
function setup() {

  // Create Canvas
  var canvas = createCanvas(1000,500);
  canvas.parent('myCanvas'); // .parent allows item to manipulated on html page

  // Create Sliders to change behavioural rules
  speedSlider = createSlider(0, 5, 0.3, 0.1);
  speedSlider.parent('speSli');
  speOut = createElement("h5", "0.3");
  speOut.parent('speSli');
  speedSlider.mouseReleased(updateValue);

  separationSlider = createSlider(0, 5, 1.5, 0.1);
  separationSlider.parent('sepSli');
  sepOut = createElement("h5", "1.5");
  sepOut.parent('sepSli');
  separationSlider.mouseReleased(updateValue);

  alignSlider = createSlider(0, 5, 1, 0.1);
  alignSlider.parent('aliSli');
  aliOut = createElement("h5", "1");
  aliOut.parent('aliSli');
  alignSlider.mouseReleased(updateValue);

  cohesionSlider = createSlider(0, 5, 1, 0.1);
  cohesionSlider.parent('cohSli');
  cohOut = createElement("h5", "1");
  cohOut.parent('cohSli');
  cohesionSlider.mouseReleased(updateValue);

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
  for (var i = 0; i < 1; i++) {
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

  animalDisplay = createElement("h6", "Number of Animals: " + environment.herd.length);
  animalDisplay.parent("numAnimalsDiv");

  shepherdDisplay = createElement("h6", "Number of Shepherds: " + environment.shepherds.length);
  shepherdDisplay.parent("numAnimalsDiv");

  var fixedStress = environment.accumulatedStress.toFixed(2);
  stressDisplay = createElement("h6", "Accumulated Stress: " + fixedStress);
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

  animalDisplay = createElement("h6", "Number of Animals: " + environment.herd.length);
  animalDisplay.parent("numAnimalsDiv");

  shepherdDisplay = createElement("h6", "Number of Shepherds: " + environment.shepherds.length);
  shepherdDisplay.parent("numAnimalsDiv");

  var fixedStress = environment.accumulatedStress.toFixed(2);
  stressDisplay = createElement("h6", "Accumulated Stress: " + fixedStress);
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
