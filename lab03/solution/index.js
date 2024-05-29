const {promisify} = require('util');
const {Storage}   = require('@google-cloud/storage');
const exec        = promisify(require('child_process').exec);
const storage     = new Storage();
const express     = require('express');
const bodyParser  = require('body-parser');
const app         = express();

app.use(bodyParser.json());

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Listening on port', port);
});

app.post('/', async (req, res) => {
  try {
    const file = decodeBase64Json(req.body.message.data);
    await downloadFile(file.bucket, file.name);
    const pdfFileName = await convertFile(file.name);
    await uploadFile(process.env.PDF_BUCKET, pdfFileName);
    await deleteFile(file.bucket, file.name);
  }
  catch (ex) {
    console.log(`Error: ${ex}`);
  }
  res.set('Content-Type', 'text/plain');
  res.send('\n\nOK\n\n');
})

function decodeBase64Json(data) {
  return JSON.parse(Buffer.from(data, 'base64').toString());
}

// Helper function to check file existence (using fs.promises for async)
async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath); // Throws an error if the file doesn't exist
    return true;
  } catch (err) {
    return false;
  }
}
async function downloadFile(bucketName, fileName) {
  // 1. Check if the file exists
  const fileExistsLocally = await fileExists(`/tmp/${fileName}`);

  // 2. Delete if present
  if (fileExistsLocally) {
    console.log(`File exists locally. Deleting: ${fileName}`);
    await fs.promises.unlink(`/tmp/${fileName}`); // Use fs.promises for async file operations
    console.log(`File deleted.`);
  } else {
    console.log(`File does not exist locally: ${fileName}`);
  }

  // 3. Download from the storage bucket
  const options = { destination: `/tmp/${fileName}` };
  await storage.bucket(bucketName).file(fileName).download(options);
  console.log(`File downloaded: ${fileName}`);
}

async function convertFile(fileName) {
  const cmd = 'libreoffice --headless --convert-to pdf --outdir /tmp ' +
              `"/tmp/${fileName}"`;
  console.log(cmd);
  const { stdout, stderr } = await exec(cmd);
  if (stderr) {
    console.log(`Conversion Failed: ${stderr}`);
    throw stderr;
  }
  console.log(`Conversion Success: ${stdout}`);
  pdfFileName = fileName.replace(/\.\w+$/, '.pdf');
  return pdfFileName;
}

async function deleteFile(bucketName, fileName) {
  await storage.bucket(bucketName).file(fileName).delete();
}

async function uploadFile(bucketName, fileName) {
  await storage.bucket(bucketName).upload(`/tmp/${fileName}`);
}
