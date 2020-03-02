const util = require('./common/util.js');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening on port', port);
});

app.post('/', async (req, res) => {
  const labReport = util.decodeBase64Json(req.body.message.data);
  try {
    const status = await util.attemptFlakeyOperation();
    res.status(204).send();
  }
  catch (ex) {
    res.status(500).send();
  }
})

