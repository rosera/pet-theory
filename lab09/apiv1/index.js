const express = require('express');
const apiV1 = require('./api-v1.js');
const path = require('path');
const hbs = require('hbs');

const port = process.env.PORT || 8080;
const app = express();
const pathPublicDirectory = path.join(__dirname, './public'); 
const pathViews = path.join(__dirname, '/views');

app.use(express.json());
app.use('/v1', apiV1);

// Set hbs as the template engine
app.set('view engine', 'hbs');
app.set('views', pathViews);

// Set the location of the html templates
app.use(express.static(pathPublicDirectory));     

app.listen(port, () => {
  console.log(`Microservice traffic splitting example: Listening on port ${port}`);
});


// Render the web page with parameters
app.get('', (req, res) => {
  res.render('index');
})

app.get('/help', async (req, res) => {
  res.status(200).send('API Microservice example: v1');
})
