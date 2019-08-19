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

// Function run at start up, creates canvas and all starting controls
ManageControls.prototype.createControls = function () {
  // ---------- CREATE CANVAS ----------
  var canvas = createCanvas(1000,600);          // Have to create canvas here for buttons to be able to manipulate it
  img1 = loadImage('./css/images/Field1B.jpg'); // Load background images
  img2 = loadImage('./css/images/Field_1.jpg'); // Image to be used is selected in draw function
  img3 = loadImage('./css/images/Field_2.jpg'); // in sketchTest Image by Gerd Altmann from Pixabay
  img4 = loadImage('./css/images/Field_3.jpg');
  canvas.parent('myCanvas'); // .parent allows item to manipulated on html page

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

  // -------- INITIATE UAV BUTTONS --------
  singleGPSBtn = createButton('GPS UAV'); // SINGLE GPS
  singleGPSBtn.parent('singleGPSBtn');
  singleGPSBtn.mouseClicked(singleGPS);

  singleOracleBtn = createButton('Oracle UAV'); // SINGLE ORACLE
  singleOracleBtn.parent('singleOracleBtn');
  singleOracleBtn.mouseClicked(singleOracle);

  multiGPSBtn = createButton('Multi-GPS'); // MULTI-GPS
  multiGPSBtn.parent('multiGPSBtn');
  multiGPSBtn.mouseClicked(multiDrone);

  multiOracleBtn = createButton('Multi-Oracle'); // MULT-ORACLE
  multiOracleBtn.parent('multiOracleBtn');
  multiOracleBtn.mouseClicked(multiOracle);

  // -------- RESET BUTTON --------
  resetBtn = createButton('Reset');
  resetBtn.parent('resetBtn');
  resetBtn.mouseClicked(createNewEnv);

  // -------- PAUSE BUTTON --------
  pauseBtn = createButton('Pause');
  pauseBtn.parent('pauseBtn');
  pauseBtn.mouseClicked(togglePlay);

  // -------- SELECT STARTING PARAMETER RADIO BUTTONS --------
  envRadio = createRadio();
  envRadio.parent("envRadio");
  envRadio.option('1', 1);
  envRadio.option('2', 2);
  envRadio.option('3', 3);
  envRadio.option('4', 4);

  pathRadio = createRadio();
  pathRadio.parent("pathRadio");
  pathRadio.option('Reactive', 1);
  pathRadio.option('Planned', 2);

  anNumRadio = createRadio();
  anNumRadio.parent("anNumRadio");
  anNumRadio.option('10', 1);
  anNumRadio.option('20', 2);
  anNumRadio.option('50', 3);

  anTypeRadio = createRadio();
  anTypeRadio.parent("anTypeRadio");
  anTypeRadio.option('Tame', 1);
  anTypeRadio.option('Flighty', 2);

  testNumRadio = createRadio();
  testNumRadio.parent("testNumRadio");
  testNumRadio.option('1', 1);
  testNumRadio.option('5', 5);
  testNumRadio.option('10', 10);
  testNumRadio.option('20', 20);

  //  SET STARTING PARAMETERS
  envRadio._getInputChildrenArray()[3].checked = true;
  pathRadio._getInputChildrenArray()[0].checked = true;
  anNumRadio._getInputChildrenArray()[1].checked = true;
  anTypeRadio._getInputChildrenArray()[0].checked = true;
  testNumRadio._getInputChildrenArray()[2].checked = true;

  // Initialize new environment
  environment = new Environment();
  // Function which initilises starting agents and obstecles
  // Needs to be called before information paragraphs or they will through errord from recieving null arguements
  createNewEnv();
  updateDisplayInfo();
}

// Function to update simulation info each frame
ManageControls.prototype.updateSimInfo = function () {

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
  updateDisplayInfo();
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

// Function to add/display written test results
ManageControls.prototype.addTestResult = function () {
  var results = environment.testResults; // Get test results from environment

  // Create paragraph to be displayed
  for(var i = results.length-1; i < results.length; i++) {
    test = createP("Test: " + results[results.length-1].num + " UAV Type: " + manageEnv.uavType + " Time: " + results[results.length-1].time + " Move: " + results[results.length-1].move +
                     " Adverse: " + results[i].adverse.toFixed(2));

    // Dislay result in different column depending on test number
    if(i < 4) {
      test.parent("test" + 0);
    } else if (i < 8) {
      test.parent("test" + 1);
    } else if (i < 12) {
      test.parent("test" + 2);
    } else if (i < 16) {
      test.parent("test" + 3);
    } else if (i < 50) {
      test.parent("test" + 4);
    }
  }
}

ManageControls.prototype.addAverageResults = function () {
  let numTests = createP("Tests Complete: " + environment.testNumStatic);
  let shepType = createP("UAV Type: " + manageEnv.uavType);
  let avgTime = createP("Average TimeSteps: " + environment.totalTime.toFixed(0));
  let avgMove = createP("Average Good Movement: " + environment.totalMoves.toFixed(0));
  let avgAdverse = createP("Average Adverse Conditions: " + environment.totalAccStress.toFixed(2));

  numTests.parent("avgTestsDiv");
  shepType.parent("avgTestsDiv");
  avgTime.parent("avgTestsDiv");
  avgMove.parent("avgTestsDiv");
  avgAdverse.parent("avgTestsDiv");
}

// --------------- CHARTS---------------
ManageControls.prototype.createChart = function () {
  // Create empty line chart at page load
  var ctx = document.getElementById('myChart').getContext('2d');
  this.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [],
      datasets: [{
          label: 'Time Steps',
          borderColor: 'rgb(36, 188, 25)',
          data: []
        },{
          label: 'Adverse Hanling',
          borderColor: 'rgb(188, 36, 25)',
          data: []
        },{
          label: 'Good Movement',
          borderColor: 'rgb(36, 25, 188)',
          data: []
        }]
    },
    options: { // Configure chart
      title: { // Starting title on page load
        display: true,
        fontColor: 'black',
        text: 'Wait For It...'
          },
        elements: {
          line: {
            tension: 0 // disables curved lines
          }
        },
        plugins: { // Display/Change labels
          datalabels: {
            color: 'rgb(0,0,0)',
            fontColor: 'black',
            align: 'top'
          }
        },
        scales: { // Mess with scales
          xAxes: [{
            ticks: {
              fontColor: 'black',
              callback: function(tick, index, array) {
                // Only print every 5 numbers on bottom scale
                if(index % 5 == 0 || index == 0) {
                  return tick;
                } else {
                  return "";
                }
              }
            }
          }],
          yAxes: [{
            ticks: {
              padding: 20,
              fontColor: 'black'
            }
          }]
        },
        legend: { // Legend Colours
          labels: {
            fontColor: 'black'
          }
        }
      }
  });
}

// Update Chart title when simulation begins
ManageControls.prototype.updateChartTitle = function () {
  this.chart.options.title.text = "UAV Type:- " + manageEnv.uavType + "Env:- " + envRadio.value() + ":- Animal Number: " + manageEnv.anNumberForChart;
  this.chart.update();
}

// Update chart each time simulation has been completed
ManageControls.prototype.updateMyChart = function () {
  var results = environment.testResults;  // Get all results from environment
  this.chart.data.labels.push(results[results.length-1].num);
  this.chart.data.datasets[0].data.push(results[results.length-1].time);
  this.chart.data.datasets[1].data.push(results[results.length-1].move);
  this.chart.data.datasets[2].data.push(results[results.length-1].adverse.toFixed(2));
  this.chart.update(); // Updates chart
}

function keyPressed() {
  if (keyCode == 70) {
    environment.runItBack();
  }
}
