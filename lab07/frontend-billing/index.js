const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();

const pathPublicDirectory = path.join(__dirname, './public'); 
const pathViews = path.join(__dirname, '/views');
const pathPartials = path.join(__dirname, '/partials');


// Set hbs as the template engine
app.set('view engine', 'hbs');
app.set('views', pathViews);
hbs.registerPartials(pathPartials);

// Set the location of the html templates
app.use(express.static(pathPublicDirectory));

// Initialise the port
const port = process.env.PORT || 8080;

// show the default page
app.get('', (req, res) => {
  res.render('index');
})


// show the default page
app.get('/billing', async(req, res) => {
  try {
    const bills = dataSource.listBillings();
    res.status(200).json( {label: 'bills', records: bills} );

  } catch (error) {
    console.log(`Backend Error: ${error}`);
    res.status(500).json( {status: 'Server error'} );
  }
})



// Listen on a network port
app.listen(port, () => console.log(`Listening on:${port}`))
