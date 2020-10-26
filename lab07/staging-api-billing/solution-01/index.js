const express = require('express');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());

app.listen(port, () => {
  console.log(`Billing Rest API listening on port ${port}`);
});

app.get('/', async (req, res) => {
  res.json({status: 'Billing Rest API: Online'});

})
