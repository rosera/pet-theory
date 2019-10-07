const express = require('express');
const app = express();

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Pet Theory REST API listening on port', port);
});

app.get('/v1', async (req, res) => {
  res.json({status: 'running'});
});

