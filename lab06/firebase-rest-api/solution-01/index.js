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
