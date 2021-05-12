const express = require('express');
const apiV1 = require('./api-v1.js');
const apiV2 = require('./api-v2.js');
const path = require('path');
const hbs = require('hbs');

const port = process.env.PORT || 8080;
const app = express();
const pathPublicDirectory = path.join(__dirname, './public'); 
const pathViews = path.join(__dirname, '/views');

app.use(express.json());
app.use('/v1', apiV1);
app.use('/v2', apiV2);

// Set hbs as the template engine
app.set('view engine', 'hbs');
app.set('views', pathViews);

app.use(express.static(pathPublicDirectory));     

app.listen(port, () => {
  console.log(`Microservice traffic splitting example: Listening on port ${port}`);
});

// Render the web page with parameters
app.get('', (req, res) => {
  res.render('index');
})

app.get('/', async (req, res) => {
  res.status(200).send('API Microservice example');
})
