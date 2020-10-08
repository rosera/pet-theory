const express = require('express');
const Firestore = require('@google-cloud/firestore');

const port = process.env.PORT || 8080;
const db = new Firestore();
const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`Netflix Rest API listening on port ${port}`);
});

app.get('/', async (req, res) => {
  res.json({status: 'Netflix Dataset! Make a query.'});

})

//--------------------------------------------------------------
// Firestore Database Access
// Year query
app.get('/:year', async (req, res) => {
  const year = req.params.year;
  
  const query = db.collection('data').where('release_year', '==', year);
  const querySnapshot = await query.get();
  if (querySnapshot.size > 0) {
    let docs = querySnapshot.docs.map(doc => doc.data());

    // Enable Cors
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	  
    res.json({netflix: year, content: docs});
  }
  else {
    res.json({status: 'Not found'});
  }
})

