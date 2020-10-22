const {promisify} = require('util');
const parse       = promisify(require('csv-parse'));
const {readFile}  = require('fs').promises;
const {Firestore} = require('@google-cloud/firestore');
const {Logging} = require('@google-cloud/logging');


// Creates a Logging client
const project = process.env.GOOGLE_CLOUD_PROJECT || '';
const logQwiklabs = 'projects/'+ project + '/logs/qwiklabs-logging';

const logging = new Logging();
const log = logging.log(logQwiklabs);

const db = new Firestore();

function writeToFirestore(records) {
  const batchCommits = [];
  let batch = db.batch();
  records.forEach((record, i) => {
    var docRef = db.collection('data').doc(record.show_id);
    batch.set(docRef, record);
    if ((i + 1) % 500 === 0) {
      console.log(`Writing record ${i + 1}`);
      batchCommits.push(batch.commit());
      batch = db.batch();
    }
  });
  batchCommits.push(batch.commit());
  return Promise.all(batchCommits);
}

async function importCsv(csvFileName) {
  const fileContents = await readFile(csvFileName, 'utf8');
  const records = await parse(fileContents, { columns: true });
  try {
    await writeToFirestore(records);
    //await writeToDatabase(records);
  }
  catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log(`Wrote ${records.length} records`);

  // A text log entry
  success_message = `Success: importTestData - Wrote ${records.length} records`

  // Construct Log record	
  const text = "firestore_db";
  const metadata = {
    resource: {type: 'global'},
    logName: logQwiklabs, 
    severity: 'INFO',
  }
	
  const entry = log.entry(metadata, text);
  log.write([entry]);
}


if (process.argv.length < 3) {
  console.error('Please include a path to a csv file');
  process.exit(1);
}


if (project === ''){
  console.log('Set the GOOGLE_CLOUD_PROJECT environment variable');
} else {
  // Run the import process	
  importCsv(process.argv[2]).catch(e => console.error(e));
}
