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
    console.log (SMS Service: Report ${labReport.id} trying...`);
    const status = await util.attemptFlakeyOperation();
    console.log(`SMS Service: Report $labReport.id} Success :-)`);
    res.status(204).send();
  }
  catch (ex) {
    console.log(`SMS Service: Report ${labReport.id} Failed :-(`);
    res.status(500).send();
  }
})
