var environment, manageFE, manageEnv; // Declare
var isPlaying = false; // Create boolean for pause/running simulation
// Create page elements using p5.js, called on page load (p5.js)
function setup() {
  manageFE = new ManageControls();
  manageFE.createControls(); // Call function to set up sim test controls
}

// Call to run simulation -> (p5)
function draw() {
  background(9, 123, 18); // Create Green Background
  // background(img);        // Use image for background
  environment.run();         // Call run function in Environment class
  manageFE.updateSimInfo();  // Update
}

function createNewEnv () {
  environment = new Environment();
  manageEnv = new ManageEnvironment();
  manageEnv.createNewEnv();
}
