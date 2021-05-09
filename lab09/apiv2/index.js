const express = require('express');
const apiV1 = require('./api-v1.js');
const apiV2 = require('./api-v2.js');

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use('/v1', apiV1);
app.use('/v2', apiV2);

app.listen(port, () => {
  console.log(`Microservice traffic splitting example: Listening on port ${port}`);
});

app.get('/', async (req, res) => {
  res.status(200).send('API Microservice example');
})
