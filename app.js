// Import frameworks/libraries
const express = require('express');
const hbs     = require('hbs');

// Configure app
var app = express();
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// Render landing page
app.get('/', (req, res) => {
  res.render('landing.hbs');
});

// Render home page
app.get('/index', (req, res) => {
  res.render('index.hbs');
});

// Render test page
app.get('/test', (req, res) => {
  res.render('test.hbs');
});

// Render TODO page
app.get('/todo', (req, res) => {
  res.render('todo.hbs');
});

// Render About page
app.get('/about', (req, res) => {
  res.render('about.hbs');
})

// Render About page
app.get('/collision', (req, res) => {
  res.render('collision.hbs');
})

// Listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is up on port 3000...');
});
