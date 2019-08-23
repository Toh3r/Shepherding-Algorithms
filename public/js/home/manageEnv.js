let animalNumber; // Declare variable


function ManageEnvironment () {
  // Class to manage environment -- add agents, reset env etc...
  // Once again is only a prototype because it makes it easier to
  // pass inforamtion out
}

// Function to create the different environments
ManageEnvironment.prototype.createNewEnv = function () {
  // Change number of starting animals
  if(anNumRadio.value() == 1) {
    animalNumber = 100;
    this.anNumberForChart = "10" // Used for chart title
  } else if(anNumRadio.value() == 2) {
    animalNumber = 20;
    this.anNumberForChart = "20"
  } else if(anNumRadio.value() == 3) {
    animalNumber = 50;
    this.anNumberForChart = "50"
  }

  // ------------ ENVIRONMENT 1 ------------
  // Create new environment depending on radio button
  if (envRadio.value() == 1) {

    environment.removeGate(); // Always destroy gate exit or they will render over eachother
    canvas.remove();          // Always destroy current canvas before creating new one
    canvas = createCanvas(1000,600);
    img = img1;                // Use image one loaded in manageControl.js
    canvas.parent('myCanvas');

    // Create starting parameters passed to shepherd
    shepStartPos = createVector(990, 255);
    goal1 = createVector(990, 255);
    shepGoals = [goal1];

    // Create starting paramters passed to animal agents
    animalGoals = [goal1];

    // Starting parameters passed to oracle
    oracleSearch = {
      dir: "start",
      startSwitcher: false
    }

    for (var i = 0; i < animalNumber; i++) { //Create starting animals in random positions
      x = random(0 ,201);
      y = random(0, 501);
      if (anTypeRadio.value() == 1) {
        var a = new TameAnimal(x, y, animalGoals);
      } else if (anTypeRadio.value() == 2) {
        var a = new FlightyAnimal(x, y, animalGoals);
      }
      environment.addAnimal(a); // Positions of goal and goalZone used for removalfunction and goal function in animal class
    }

    var g = new Gate(animalGoals); // Create exit
    environment.addGate(g);
  }

  // ------------ ENVIRONMENT 2 ------------
  if (envRadio.value() == 2) {

    environment.removeGate();
    canvas.remove(); // Canvas
    canvas = createCanvas(1000,600);
    img = img2;
    canvas.parent('myCanvas');

    shepStartPos = createVector(975, 580); // Create shepherd starting co-ords
    if (pathRadio.value() == 1) {
      goal1 = createVector(975, 580);
      shepGoals = [goal1];
    } else if (pathRadio.value() == 2) {
      goal1 = createVector(925, 380), goal2 = createVector(975, 580);
      shepGoals = [goal1, goal2];
    }

    aGoal1 = createVector(975, 580);
    animalGoals = [aGoal1];

    oracleSearch = {
      dir: "start",         // When oracle is starting at exit/last goal point
      startSwitcher: false  //
    }

    for (var i = 0; i < animalNumber; i++) { //Create starting animals in random positions
      x = random(201);
      y = random(501);
      if (anTypeRadio.value() == 1) {
        var a = new TameAnimal(x, y, animalGoals);
      } else if (anTypeRadio.value() == 2) {
        var a = new FlightyAnimal(x, y, animalGoals);
      }
      environment.addAnimal(a);
    }

    // Create Novelties passing through position and dimensions
    var n = new NovelObject(775,550,115,115);
    environment.addNovelty(n);

    // Create Obstacles passing through position and dimensions
    var ob = new Obstacle(240, 240, 50, 50);
    environment.addObstacle(ob);

    var g = new Gate(animalGoals); // Create gate
    environment.addGate(g);
  }

  // ------------ ENVIRONMENT 4 ------------
  if (envRadio.value() == 3) {

    environment.removeGate();
    canvas.remove(); // Create canvas
    canvas = createCanvas(2400,800);
    img = img4;
    canvas.parent('myCanvas');

    shepStartPos = createVector(450, 450); // Create shepherd starting co-ords
    if (pathRadio.value() == 1) {
      goal1 = createVector(470, 470), goal2 = createVector(470, 400);
      goal3 = createVector(1050, 70), goal4 = createVector(1150, 70);
      goal5 = createVector(1670, 750), goal6 = createVector(1800, 750);
      goal7 = createVector(2380, 35);
      shepGoals = [goal1, goal2, goal3, goal4, goal5, goal6, goal7];
    } else if (pathRadio.value() == 2) {
      goal1 = createVector(470, 425), goal2 = createVector(1100, 70);
      goal3 = createVector(1200, 200), goal4 = createVector(1200, 700);
      goal5 = createVector(1735, 750), goal6 = createVector(1900, 150);
      goal7 = createVector(2380, 35);
      shepGoals = [goal1, goal2, goal3, goal4, goal5, goal6, goal7];
    }

    aGoal1 = createVector(470, 470), aGoal2 = createVector(470, 400);
    aGoal3 = createVector(1050, 70), aGoal4 = createVector(1150, 70);
    aGoal5 = createVector(1670, 750), aGoal6 = createVector(1800, 750);
    aGoal7 = createVector(2380, 35);
    animalGoals = [aGoal1, aGoal2, aGoal3, aGoal4, aGoal5, aGoal6, aGoal7];

    oracleSearch = {
      dir: "tl",
      diffStart: true,
      startSec: createVector(1,3),
      endSec: createVector(5,4),
      startSwitcher: true
    }

    //Create starting animals in random positions
    for (var i = 0; i < animalNumber; i++) {
      x = random(801);
      y = random(551,751);
      var a = new TameAnimal(x, y, animalGoals);
      environment.addAnimal(a);
    }

    // Create novelties passing through positions and dimensions
    var n = new NovelObject(2350,180,110, 80);
    environment.addNovelty(n);
    var n = new NovelObject(2150,20,200, 30);
    environment.addNovelty(n);
    var n = new NovelObject(1400,400,100,180);
    environment.addNovelty(n);

    // Passing obstacles passing through positions and dimensions
    var ob = new Obstacle(0, 440, 430, 10);    // Left-Wall Between F1 and F2
    environment.addObstacle(ob);
    var ob = new Obstacle(500, 440, 600, 10);  // Right-Wall Between F1 and F2
    environment.addObstacle(ob);
    var ob = new Obstacle(1100, 100, 10, 700); // Wall between F1, F2 and F3
    environment.addObstacle(ob);
    var ob = new Obstacle(1730, 0, 10, 720);   // Wall Betweem F3 and F4
    environment.addObstacle(ob);
    var ob = new Obstacle(2010, 575, 50, 35);  // Massey
    environment.addObstacle(ob);

    var g = new Gate(animalGoals); // Create gate
    environment.addGate(g);
  }

  // ------------ ENVIRONMENT 5 -----------
  if (envRadio.value() == 4) {

    environment.removeGate();
    canvas.remove(); // Canvas
    canvas = createCanvas(1800,600);
    img = img3;
    canvas.parent('myCanvas');

    shepStartPos = createVector(1030, 165); // Create shepherd starting co-ords
    if (pathRadio.value() == 1) {
      goal1 = createVector(1070, 400), goal2 = createVector(1220, 400);
      goal3 = createVector(1480, 340), goal4 = createVector(1450, 150)
      goal5 = createVector(1180,160), goal6 = createVector(1100, 255);
      shepGoals = [goal1, goal2, goal3, goal4, goal5, goal6];
    } else if (pathRadio.value() == 2) {
      goal1 = createVector(650, 380), goal2 = createVector(1070, 400);
      goal3 = createVector(1220, 400), goal4 = createVector(1300, 400);
      goal5 = createVector(1480, 340), goal6 = createVector(1450, 150);
      goal7 = createVector(1320,130), goal8 = createVector(1180, 160);
      goal9 = createVector(1100, 255)
      shepGoals = [goal1, goal2, goal3, goal4, goal5, goal6, goal7, goal8, goal9];
    }

    aGoal1 = createVector(1070, 400), aGoal2 = createVector(1250,150);
    aGoal3 = createVector(1100, 240);
    animalGoals = [aGoal1, aGoal2, aGoal3];

    oracleSearch = {
      dir: "tr",
      diffStart: true,
      startSec: createVector(1,1),
      endSec: createVector(5,3),
      startSwitcher: true
    }

    for (var i = 0; i < animalNumber; i++) {   //Create starting animals in random positions
      x = random(100,251);
      y = random(50,351);
      var a = new TameAnimal(x, y, animalGoals);
      environment.addAnimal(a);
    }

    // Create novelties with starting positions and dimensions
    var n = new NovelObject(1050,50,280,70);
    environment.addNovelty(n);
    var n = new NovelObject(1400,265,45,80);
    environment.addNovelty(n);
    var n = new NovelObject(700,260,45,75);
    environment.addNovelty(n);

    // Create starting obstacles with starting positions and obstacles
    var ob = new Obstacle(1500, 0, 70, 150, 0);   // Shed Top-Right
    environment.addObstacle(ob);
    var ob = new Obstacle(1560, 150, 10, 130, 0); // Farm Exit
    environment.addObstacle(ob);
    var ob = new Obstacle(1615, 185, 160, 90, 0); // Sheds Far-Right
    environment.addObstacle(ob);
    var ob = new Obstacle(1525, 275, 100, 50, 0); // Oher Shed Right
    environment.addObstacle(ob);
    var ob = new Obstacle(1680, 270, 10, 550, 0); // Far-Right Wall
    environment.addObstacle(ob);
    var ob = new Obstacle(1050, 500, 640, 10, 0); // Bottom-Right Wall
    environment.addObstacle(ob);
    var ob = new Obstacle(1050, 430, 10, 70, 0);  // Bottom Vertical Wall
    environment.addObstacle(ob);
    var ob = new Obstacle(0, 430, 1055, 10, 0);   // Bottom-Left Wall
    environment.addObstacle(ob);
    var ob = new Obstacle(1030, 180, 60, 170, 0); // Left-Middle Shed
    environment.addObstacle(ob);
    var ob = new Obstacle(1220, 180, 75, 170, 0); // Right-Middle Shed
    environment.addObstacle(ob);
    var ob = new Obstacle(1030, 350, 265, 10, 0); // Shed Divide Wall
    environment.addObstacle(ob);
    var ob = new Obstacle(1080, 0, 10, 180, 0);   // Top-Middle Shed
    environment.addObstacle(ob);

    var g = new Gate(animalGoals); // Create gate
    environment.addGate(g);
  }

}

// ---------- FUNCTIONS TO CREATE SHEPHERDS ON BUTTON CLICKS ----------
// Needs to be called through normal function or throws a fit
function singleGPS() {
  manageEnv.singleGPSHerd()
}

ManageEnvironment.prototype.singleGPSHerd = function () {
  this.uavType = "SingleGPS"; // Used for charts and multiple tests
  this.uavForChart = "Single GPS UAV";
  manageFE.updateChartTitle();
  console.log("Single GPS lifting off...");
  // Pass starting parameters to environment to create UAV
  environment.addAutoShepherd(new SingleGPSUAV(shepStartPos,shepGoals));
}

function singleOracle() {
  manageEnv.oracleHerd()
}

ManageEnvironment.prototype.oracleHerd = function () {
  this.uavType = "oracleHerd";
  this.uavForChart = "Single Oracle UAV";
  manageFE.updateChartTitle();
  console.log("Oracle lifting off...");
  environment.addOracle(new Oracle(shepStartPos, oracleSearch, shepGoals));
  environment.addOracleShepherd(new OracleShepherd(shepStartPos, shepGoals));
}

function multiDrone() {
  manageEnv.multiGPSHerd()
}

ManageEnvironment.prototype.multiGPSHerd = function () {
  this.uavType = "multiGPS";
  this.uavForChart = "Multiple GPS UAV";
  manageFE.updateChartTitle();
  console.log("Multi GPS lifting off...");
  environment.addMultiGPS(new MultiGPSShepherd(shepStartPos, false, 1, shepGoals))
  environment.addMultiGPS(new MultiGPSShepherd(shepStartPos, true, 2, shepGoals))
}

function multiOracle() {
  manageEnv.multiOracleHerd()
}

ManageEnvironment.prototype.multiOracleHerd = function () {
  this.uavType = "multiOracle";
  this.uavForChart = "Multiple Oracle UAV";
  manageFE.updateChartTitle();
  console.log("Multi Oracle lifting off...");
  environment.addOracle(new Oracle(shepStartPos, oracleSearch, shepGoals));
  environment.addMultiOracleShepherd(new MultiOracleShepherd(shepStartPos, false, 1, shepGoals))
  environment.addMultiOracleShepherd(new MultiOracleShepherd(shepStartPos, true, 2, shepGoals))
}
