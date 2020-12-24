const {promisify} = require('util');
const parse       = promisify(require('csv-parse'));
const {readFile}  = require('fs').promises;
const {Firestore} = require('@google-cloud/firestore');
if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}

function writeToDatabase(records) {
  records.forEach((record, i) => {
    console.log(`ID: ${record.id} Email: ${record.email} Name: ${record.name} Phone: ${record.phone}`);
  });
  return ;
}

async function importCsv(csvFileName) {
  const fileContents = await readFile(csvFileName, 'utf8');
  const records = await parse(fileContents, { columns: true });
  try {
    await writeToDatabase(records);
  }
  catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log(`Wrote ${records.length} records`);
}

importCsv(process.argv[2]).catch(e => console.error(e));
