// Class to manage environment -- add agents, reset env etc...
function ManageEnvironment () {}

// Function to create the different environments
ManageEnvironment.prototype.createNewEnv = function () {

  // ------------ ENVIRONMENT 1 ------------
  // Create new environment depending on radio button
  if (envRadio.value() == 1) {

    canvas.remove(); // Always destroy current canvas before creating new one
    canvas = createCanvas(1000,600);
    img = img1;      // Use image one loaded in manageControl.js
    canvas.parent('myCanvas');

    shepX = 970, shepY = 250; // Create shepherd starting co-ords
    goalX = 990, goalY = 255; // Create goal co-ords for shepherd and animal agents
    gzX = createVector(850, 1000), gzY = createVector(180, 330); // Create goalzone co-ords

    goal1 = createVector(990, 255);
    shepGoals = [goal1];

    oracleSearch = {
      dir: "start"
    }

    for (var i = 0; i < numAnimalsSlider.value(); i++) { //Create starting animals in random positions
      x = random(201);
      y = random(501);
      var a = new Animal(x, y, goalX, goalY, gzX, gzY, shepGoals); // Pass through staring position, position of goal and position of goalZone
      environment.addAnimal(a); // Positions of goal and goalZone used for removalfunction and goal function in animal class
    }

    var g = new Gate(990, 230); // Create gate
    environment.addGate(g);
  }

  // ------------ ENVIRONMENT 2 ------------
  if (envRadio.value() == 2) {

    canvas.remove(); // Canvas
    canvas = createCanvas(1000,600);
    img = img2;
    canvas.parent('myCanvas');

    shepX = 970, shepY = 570; // Various Co-ords
    goalX = 970, goalY = 580;
    gzX = createVector(850, 1000), gzY = createVector(450, 600);

    goal1 = createVector(970, 580);
    shepGoals = [goal1];

    oracleSearch = {
      dir: "start"
    }

    for (var i = 0; i < numAnimalsSlider.value(); i++) { //Create starting animals in random positions
      x = random(201);
      y = random(501);
      var a = new Animal(x, y, goalX, goalY, gzX, gzY, shepGoals);
      environment.addAnimal(a);
    }

    // Create Novelties passing through position and dimensions
    var n = new NovelObject(775,550,115,115);
    environment.addNovelty(n);

    // Create Obstacles passing through position and dimensions
    var ob = new Obstacle(240, 240, 50, 50);
    environment.addObstacle(ob);

    var g = new Gate(990, 580); // Create gate
    environment.addGate(g);
  }

  // ------------ ENVIRONMENT 3 ------------
  if (envRadio.value() == 3) {

    canvas.remove(); // Canvas
    canvas = createCanvas(1800,600);
    img = img3;
    canvas.parent('myCanvas');

    shepX = 1030, shepY = 165; // Create various co-ordinates
    goalX = 1100, goalY = 255;
    gzX = createVector(1100, 1250), gzY = createVector(155, 305);

    //Create starting animals in random positions
    for (var i = 0; i < numAnimalsSlider.value(); i++) {
      x = random(100,251);
      y = random(50,351);
      var a = new Animal(x, y, goalX, goalY, gzX, gzY);
      environment.addAnimal(a);
    }

    // Create novelties passing througn position and dimensions
    var n = new NovelObject(1050,50,300,90);
    environment.addNovelty(n);
    var n = new NovelObject(1400,265,45,90);
    environment.addNovelty(n);

    // Create obstacles passing through positions and dimensions
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

    var g = new Gate(1090, 230); // Create gate
    environment.addGate(g);
  }

  // ------------ ENVIRONMENT 4 ------------
  if (envRadio.value() == 4) {

    canvas.remove(); // Create canvas
    canvas = createCanvas(2400,800);
    img = img4;
    canvas.parent('myCanvas');

    shepX = 450, shepY = 450; // Create various co-ords
    goalX = 2370, goalY = 35;
    gzX = createVector(2250, 2400), gzY = createVector(0, 85);

    goal1 = createVector(470, 500), goal2 = createVector(470, 400);
    goal3 = createVector(1000, 70), goal4 = createVector(1150, 70);
    goal5 = createVector(1650, 50), goal6 = createVector(1800, 50);
    goal7 = createVector(2370, 35);
    shepGoals = [goal1, goal2, goal3, goal4, goal5, goal6, goal7];

    oracleSearch = {
      dir: "tl",
      diffStart: true,
      startSec: createVector(1,3),
      endSec: createVector(5,4)
    }

    //Create starting animals in random positions
    for (var i = 0; i < numAnimalsSlider.value(); i++) {
      x = random(801);
      y = random(551,751);
      var a = new Animal(x, y, goalX, goalY, gzX, gzY, shepGoals);
      environment.addAnimal(a);
    }

    // Create novelties passing through positions and dimensions
    var n = new NovelObject(2350,180,110, 80);
    environment.addNovelty(n);
    var n = new NovelObject(2150,20,200, 30);
    environment.addNovelty(n);

    // Passing obstacles passing through positions and dimensions
    var ob = new Obstacle(0, 440, 430, 20);
    environment.addObstacle(ob);
    var ob = new Obstacle(500, 440, 600, 20);
    environment.addObstacle(ob);
    // var ob = new Obstacle(0, 50, 2400, 20, 0);
    // environment.addObstacle(ob);
    var ob = new Obstacle(1080, 120, 20, 680, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1730, 90, 20, 720);
    environment.addObstacle(ob);
    var ob = new Obstacle(2010, 575, 50, 35);
    environment.addObstacle(ob);

    var g = new Gate(2390, 10); // Create gate
    environment.addGate(g);
  }

  // ------------ ENVIRONMENT 5 -----------
  if (envRadio.value() == 5) {

    canvas.remove(); // Canvas
    canvas = createCanvas(1800,600);
    img = img3;
    canvas.parent('myCanvas');

    shepX = 1030, shepY = 165; // Create various co-ords
    goalX = 1100, goalY = 255;
    gzX = createVector(1100, 1250), gzY = createVector(155, 305);

    goal1 = createVector(1050, 170), goal2 = createVector(1140, 170), goal3 = createVector(1100, 255);
    shepGoals = [goal1, goal2, goal3];

    oracleSearch = {
      dir: "tr",
      diffStart: true,
      startSec: createVector(1,1),
      endSec: createVector(5,3)
    }

    for (var i = 0; i < numAnimalsSlider.value(); i++) {   //Create starting animals in random positions
      x = random(100,251);
      y = random(50,351);
      var a = new Animal(x, y, goalX, goalY, gzX, gzY, shepGoals);
      environment.addAnimal(a);
    }

    // Create novelties with starting positions and dimensions
    var n = new NovelObject(1050,50,300,90);
    environment.addNovelty(n);
    var n = new NovelObject(1400,265,45,90);
    environment.addNovelty(n);
    var n = new NovelObject(700,260,45,75);
    environment.addNovelty(n);

    // Create starting obstacles with starting positions and obstacles
    var ob = new Obstacle(0, 0, 1500, 20, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1500, 0, 70, 120, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1560, 120, 10, 160, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1615, 185, 160, 90, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1525, 275, 100, 50, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1680, 270, 20, 550, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(0, 450, 1700, 20, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1030, 180, 60, 170, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1220, 180, 75, 170, 0);
    environment.addObstacle(ob);
    var ob = new Obstacle(1030, 350, 255, 20, 0);
    environment.addObstacle(ob);

    var g = new Gate(1090, 230); // Create gate
    environment.addGate(g);
  }

}

// ---------- FUNCTION TO ADD AGENT/OBJECT ON MOUSE CO-ORDS ----------
function addStuff() {
  var dropSelect = sel.value();
  if (dropSelect == "Add Animal") {
    environment.addAnimal(new Animal(mouseX, mouseY, goalX, goalY, gzX, gzY));
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

// ---------- DELETE FUNCTIONS FOR AGENTS/OBJECTS ----------
// Calling functions directly from buttons is throwing errors
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

// ---------- FUNCTIONS TO CREATE SHEPHERDS ON BUTTON CLICKS ----------
function herd() {
  console.log("Goin' Herding");
  environment.addAutoShepherd(new AutoShepherd(shepX, shepY, goalX, goalY, shepGoals));
}

function oracle() {
  environment.addOracle(new Oracle(shepX, shepY, goalX, goalY, oracleSearch));
  environment.addOracleShepherd(new OracleShepherd(shepX, shepY, goalX, goalY));
}

function multiDrone() {
  console.log("Well");
  environment.addMultiGPS(new MultiGPSShepherd(shepX, shepY, goalX, goalY, false, 1))
  environment.addMultiGPS(new MultiGPSShepherd(shepX, shepY, goalX, goalY, true, 2))
}
