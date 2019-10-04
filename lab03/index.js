const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Listening on port', port);
});

app.post('/', async (req, res) => {
  console.log('OK');
  try {
    const file = decodeBase64Json(req.body.message.data);
    console.log(`file: ${JSON.stringify(file)}`);
  }
  catch (ex) {
    console.log(ex);
  }
  res.set('Content-Type', 'text/plain');
  res.send('\n\nOK\n\n');
})

function decodeBase64Json(data) {
  return JSON.parse(Buffer.from(data, 'base64').toString());
}

