// Import dependencies
const express = require('express');
const hbs = require('hbs');

// Configure app
var app = express();
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

// Render home page
app.get('/', (req, res) => {
  res.render('index.hbs');
});

app.get('/about', (req, res) => {
  res.render('about.hbs');
})

// Listen on port 3000
app.listen(3000, () => {
  console.log('Server is up on port 3000...')
});
