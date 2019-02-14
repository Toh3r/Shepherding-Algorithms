// Create variables for index page
var flock;
let speedSlider, separationSlider, alignSlider, cohesionSlider;
let speVal, sepVal, aliVal, cohVal;
let speOut, sepOut, aliOut, cohOut;
let novelObjects, sel, addText, zoneCheck;
let addB, delB, addS, delS, addN, delN, delA;

// Create page elements using p5.js
function setup() {

  // Create Canvas
  var canvas = createCanvas(1000,500);
  canvas.parent('myCanvas');

  // Create Sliders to change behavioural rules
  speedSlider = createSlider(0, 5, 0.1, 0.1);
  speedSlider.parent('speSli');
  speOut = createElement("h5", "0.5");
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
  sel.option('Add Boid');
  sel.option('Add Shepherd');
  sel.option('Add Novelty');
  canvas.mouseClicked(addStuff);

  // Create delete buttons to remove agents/objects
  delB = createButton('Delete Boid');
  delB.parent('boidButtons');
  delB.mouseClicked(delBoid);

  delS = createButton('Delete Shepherd');
  delS.parent('shepButtons');
  delS.mouseClicked(delShepherd);

  delN = createButton('Delete Novelty');
  delN.parent('novButtons');
  delN.mouseClicked(delNovelty);

  delA = createButton('Delete All');
  delA.parent('delAll');
  delA.mouseClicked(deleteAll);

  // Create checkbox to display flight/Pressure zones
  zoneCheck = createCheckbox("Display Each Zone");
  zoneCheck.parent("zoneDiv");

  // Initialize starting flock
  flock = new Flock();

  //Create starting boids in random positions
  for (var i = 0; i < 5; i++) {
    var b = new Boid(Math.floor(Math.random() * 1000) + 1,Math.floor(Math.random() * 500) + 1);
    flock.addBoid(b);
  }

  // Create starting shepherds in random positions
  for (var i = 0; i < 1; i++) {
    var s = new Shepherd(Math.floor(Math.random() * 1000) + 1,Math.floor(Math.random() * 500) + 1);
    flock.addShepherd(s);
  }

  // Create novelty in random positions
  for (var i = 0; i < 0; i++) {
    var n = new NovelObject(Math.floor(Math.random() * 1000) + 1,Math.floor(Math.random() * 500) + 1);
    flock.addNovelty(n);
  }

}

// Call run to begin simulation
function draw() {
  background(36, 188, 25);
  flock.run();
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

// Call flock functions to add objects
function addStuff() {
  var dropSelect = sel.value();
  if (dropSelect == "Add Boid") {
    flock.addBoid(new Boid(mouseX, mouseY));
  }
  if (dropSelect == "Add Shepherd") {
    flock.addShepherd(new Shepherd(mouseX, mouseY));
  }
  if (dropSelect == "Add Novelty") {
    flock.addNovelty(new NovelObject(mouseX, mouseY));
  }
}

// Call flock functions to delete agents/objects
function delBoid() {
  flock.deleteBoid();
}
function delShepherd() {
  flock.deleteShepherd();
}
function delNovelty() {
  flock.deleteNovelty();
}
function deleteAll() {
  flock.removeAll();
}
