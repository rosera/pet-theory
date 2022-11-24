const express = require('express');
const dataSource = require('./tools.js');  // Local storage tools
//const request = require('request-promise');
//const renderRequest = require('./render.js');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`Billing Rest API listening on port ${port}`);
});

app.get('/', async (req, res) => {
  try {
    bills = await dataSource.listBilling();

    res.status(200).json({bills});
  } catch(error) {
    res.status(400).send(error);
  }

})


// show the Billing data
app.get('/billing', async (req, res) => {
  try {	
    bills = await dataSource.listBilling();
//      bills = await renderRequest();

    // Enable Cors
//    res.header("Access-Control-Allow-Origin", "*");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	
    res.status(200).json({bills});
  } catch(error) {
    console.log(`Billing: ${error}`);
  }

})

// show the Billing for a specified month
app.get('/billing/:ref', async (req, res) => {
  try {
    bill = await dataSource.findBill(req.params.ref);
  // Enable Cors
  //  res.header("Access-Control-Allow-Origin", "*");
  //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	
  res.status(200).json({ref: bill.ref, month: bill.month, provider: bill.provider});
  } catch(error){
    console.log(`Billing Ref: ${error}`);
  }
})


//app.get('/', async (req, res) => {
  // Enable Cors
//  res.header("Access-Control-Allow-Origin", "*");
//  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	
//  res.status(200).json({status: 'Billing Rest API: Online'});
//})
